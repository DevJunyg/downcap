"use strict";

require('https').globalAgent.options.ca = require('./rootCas').default;

const PathManager = require('./PathManager');
const HttpStatusCode = require('../lib/HttpStatusCode').default;
const IsDevelopment = () => process.env.ELECTRON_APP_ENVIRONMENT === "Development";

Object.defineProperty(exports, "__esModule", {
  value: true
});

const axios = require('axios').default;
const fs = require('fs');
const util = require('util');
const { app } = require('electron');
const os = require('os');
const HttpRequestError = require('../HttpRequestError').default;
const UserInfoResult = require("./UserInfoResult").default;
const UserInfo = require("./UserInfo").default;
const LoggerFactoryHelper = require('./logging/LoggerFactoryHelper').default;

const fsReadFile = util.promisify(fs.readFile);
const fsWriteFile = util.promisify(fs.writeFile);
const fsUnlink = util.promisify(fs.unlink);
const TokenPath = PathManager.Token

/**
 * 
 * @param {string} linkFilePath 
 */
async function fileUnlinkAsync(linkFilePath) {
  if (fs.existsSync(linkFilePath)) {
    await fsUnlink(linkFilePath);
  }
}

/**
 * 
 * @param {number} ms 
 */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * `
 * @param {number} status 
 */
function CheckUnauthorized(status) {
  return status === HttpStatusCode.BadRequest
    || status === HttpStatusCode.Unauthorized
    || status === HttpStatusCode.Forbidden
    || status === HttpStatusCode.NotFound
    || status === HttpStatusCode.OK
    || status === HttpStatusCode.InternalServerError
    || status === HttpStatusCode.BadGateway;
}

const downcapConfig = require("./DowncapConfig").default;
class SignInManager {
  constructor() {
    /** @type {NodeJS.Timeout | null} */
    this._tokenRefreshReservation = null;
    /** @type {string | undefined} */
    this._accessToken = undefined;
    this._config = downcapConfig;
    this._defualtHeader = {
      ClientId: this._config.ClientId
    }

    const url = process.env.API_URL ?? 'https://downcap.net';
    this._client = axios.create({
      baseURL: url,
      headers: {
        'User-Agent': `downcap/${app.getVersion()}(${os.platform} ${os.arch})`,
        common: this._defualtHeader
      },
      timeout: 3000
    });
    this._logger = LoggerFactoryHelper.Build(SignInManager.name);

    this._logger.logInformation("Connect url: " + url)

    if (IsDevelopment()) {
      this._client.interceptors.request.use(config => {
        //@ts-ignore
        config.metadata = { startTime: new Date() }
        return config;
      }, function (error) {
        return Promise.reject(error);
      });
    }

    if (IsDevelopment()) {
      this._client.interceptors.response.use(response => {
        //@ts-ignore
        const dt = (new Date().getTime() - response.config.metadata.startTime.getTime());
        this._logger.logInformation(`${(response.config.method).toUpperCase()}\t${response.status}(${dt}ms): ${response.config.url}`)
        return response;
      });
    }

    /**
    * 
    * @param {import('axios').AxiosResponse<any>} response 
    */
    this._UnauthorizedCheck = response => {
      if (response.status === HttpStatusCode.Unauthorized) {
        if (this._onAuthExpiration) {
          this._onAuthExpiration();
        }
      }
    }
  }

  /**
   *
   * @param {function} action 
   */
  set onAuthExpiration(action) {
    if (typeof (action) !== "function") {
      console.debug('The action of onReady is not function');
      return;
    }

    this._onAuthExpiration = action;
  }

  LocalTokenExist() {
    return fs.existsSync(TokenPath);
  }

  async LocalTokenLogin() {
    if (this.LocalTokenExist() === false) {
      return false;
    }

    const token = (await fsReadFile(TokenPath)).toString();
    const result = (await this.GetUserInfo(token)).Successed;

    if (result === true) {
      this._accessToken = token;
    }
    else {
      this.RemoveLocalTokenAsync();
    }

    return result;
  }

  /**
   * 
   * @param {UserInfo} [info]
   */
  async TokenRefreshReservation(info) {
    if (!info) {
      const result = await this.GetUserInfo();
      if (result.Successed && result.Data) {
        info = result.Data;
      }
    }

    if (info === undefined) {
      return;
    }

    if (info.ExpiresAt) {
      const expiresTime = new Date(info.ExpiresAt).getTime();
      const timezoneOffset = new Date().getTimezoneOffset() * 60 * 1000;
      const refreshTime = expiresTime - timezoneOffset - Date.now() - (60 * 1000);
      this._tokenRefreshReservation = setTimeout(this.TokenRefreshAction, refreshTime)
    }
  }

  TokenRefreshAction = async () => {
    let retry = 3;
    const prevAccessToken = this.GetAccessToken();
    while ((--retry) !== 0) {
      if (await this.AccessTokenRefreshAsync(prevAccessToken)) {
        if (prevAccessToken) {
          await this.RemoveTokenAsync(prevAccessToken);
        }
        break;
      }
      await sleep(3000);
    }
  }

  /**
   * 
   * @param {string} [token]
   */
  async AccessTokenRefreshAsync(token) {
    const response = await this._client.get('/api/refresh', {
      headers: {
        ...this._defualtHeader,
        'Authorization': `Bearer ${token}`
      },
      validateStatus: CheckUnauthorized
    });

    const successed = response.status === HttpStatusCode.OK;
    if (successed) {
      this._accessToken = response.data;
      this.TokenRefreshReservation();
    }
    else {
      this._UnauthorizedCheck(response);
    }
    return successed;
  }

  /**
   * 
   * @param {string} email 
   * @param {string} password 
   * @param {boolean} rememberMe 
   */
  async PasswordSignInAsync(email, password, rememberMe) {
    if (!this._config) {
      return false;
    }
    try {
      const response = await this._client.post('/api/token', {
        Email: email,
        Password: password,
        RememberMe: rememberMe,
        ClientId: this._config.ClientId
      }, {
        validateStatus: CheckUnauthorized
      });

      if (response.status >= 500) {
        return 'ServerError';
      }

      const successed = response.status === HttpStatusCode.OK;
      if (successed) {
        const accessToken = response.data;
        this._accessToken = accessToken;
        const result = await this.GetUserInfo();
        if (result.Successed && result.Data) {
          const info = result.Data;
          if (info.ExpiresAt) {
            this.TokenRefreshReservation(info);
          }
          else {
            fsWriteFile(TokenPath, accessToken);
          }
        }
      } else {
        this._UnauthorizedCheck(response);
      }

      return successed;

    } catch (e) {
      return 'ServerError'
    }
  }

  /**
   * 
   * @param  {string | null | undefined } [token] 
   */
  async GetUserInfo(token) {
    const accessToken = token ? token : this.GetAccessToken();

    if (accessToken === null) {
      return new UserInfoResult({
        successed: false,
      });
    }
    const response = await this._client.get('/api/token', {
      headers: {
        ...this._defualtHeader,
        'Authorization': `Bearer ${accessToken}`
      },
      validateStatus: CheckUnauthorized
    });
    const successed = response.status === HttpStatusCode.OK;
    const result = new UserInfoResult({
      successed: successed
    })

    if (successed) {
      result.Data = new UserInfo(response.data);
    }
    else {
      result.Errors = response.data;
    }
    return result;
  }

  /**
   * @return {Promise<boolean>}
   */
  Logout() {
    let result;
    if (fs.existsSync(TokenPath)) {
      result = this.RemoveLocalTokenAsync();
    }
    else {
      result = this.RemoveTokenAsync(this.GetAccessToken());
    }
    return result;
  }

  /**
   * 
   * @param {string} [token]
   */
  async RemoveTokenAsync(token) {
    if (!token) {
      return true;
    }
    const response = await this._client.get(`/api/revoke?token=${token}`)
    this._UnauthorizedCheck(response);
    if (this._accessToken === token) {
      this._accessToken = undefined;
    }
    if (this._tokenRefreshReservation) {
      clearTimeout(this._tokenRefreshReservation);
    }
    return response.status === 200;
  }

  async RemoveLocalTokenAsync() {
    const result = await this.RemoveTokenAsync(this.GetAccessToken());
    if (result) {
      try {
        await fileUnlinkAsync(TokenPath);
      } catch (e) {
        this._logger.logWarning(JSON.stringify(e));
      }
    }

    return result;
  }

  GetAccessToken() {
    return this._accessToken;
  }

  async GetOtp() {
    const response = await this._client.get('/api/auth/otp', {
      headers: {
        ClientId: this._config.ClientId,
        Authorization: `Bearer ${this.GetAccessToken()}`
      },
      validateStatus: CheckUnauthorized
    });

    if (response.status !== HttpStatusCode.OK) {
      throw new HttpRequestError(response);
    }

    return response.data;
  }
}

const _signInManager = new SignInManager();
exports.default = _signInManager;
