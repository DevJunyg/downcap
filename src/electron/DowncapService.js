"use strict";

/**
 * @typedef { import("./models/Video/VideoUploadModel").VideoUploadModel } VideoUploadModel
 * 
 */

Object.defineProperty(exports, "__esModule", {
  value: true
});

require('https').globalAgent.options.ca = require('./rootCas').default;

const url = require('url');
const fs = require('fs');
const path = require('path');
const FormData = require('form-data');
const PathManager = require('./PathManager');
const FFmpeg = require('./FFmpegHelper');
const HttpRequestError = require('../HttpRequestError').default;
const { app } = require('electron');
const os = require('os');
const _signinManager = require('./SignInManager').default;
const LoggerFactoryHelper = require('./logging/LoggerFactoryHelper').default;
const IsNullOrWhiteSpace = require("../lib/stringHelper").IsNullOrWhiteSpace;
const HttpStatusCode = require('../lib/HttpStatusCode').default;

const clientLogUrl = '/api/analysis/client/';

/**
 * @param { NodeJS.ErrnoException | null } err 
 */
function ErrorCheck(err) {
  if (err) console.error(err)
}

/**
 * @param { import('fs').PathLike } pathLike 
 */
function fileUnlink(pathLike) {
  if (fs.existsSync(pathLike)) {
    fs.unlink(pathLike, ErrorCheck)
  }
}

/**
 * @param {number} status 
 */
function IsSuccessStatusCode(status) {
  return status >= 200 && status <= 299;
}

/**
 * @param {import('axios').AxiosResponse} response 
 */
function EnsureSuccessStatusCode(response) {
  const status = response.status;
  if (!IsSuccessStatusCode(status)) {
    console.warn(response?.data && JSON.stringify(response?.data));
    throw new HttpRequestError(response)
  }
}

/**
 * @param {number} status 
 */
function CheckUnauthorized(status) {
  return IsSuccessStatusCode(status)
    || status === HttpStatusCode.Unauthorized
    || status === HttpStatusCode.Forbidden
    || status === HttpStatusCode.NotFound
    || status === HttpStatusCode.InternalServerError
    || status === HttpStatusCode.BadGatewa
    || status === HttpStatusCode.BadRequest;
}

const axios = require('axios').default;
const downcapConfig = require("./DowncapConfig").default;

const requestUrls = {
  audioFade: "/api/audio/fade"
}

class DowncapService {
  constructor() {
    this._logger = LoggerFactoryHelper.Build(DowncapService.name);
    this._signinManager = _signinManager;
    this._defualtHeader = {
      ClientId: downcapConfig.ClientId
    }
    this._client = axios.create({
      baseURL: process.env.API_URL ?? 'https://downcap.net',
      headers: {
        'User-Agent': `downcap/${app.getVersion()}(${os.platform} ${os.arch})`,
        common: this._defualtHeader
      },
      validateStatus: CheckUnauthorized
    })

    const interceptors = this._client.interceptors;
    interceptors.request.use(config => {
      config.metadata = { startTime: new Date() }
      return config;
    }, error => Promise.reject(error)
    );

    interceptors.response.use(response => {
      let dt = (new Date().getTime() - response.config.metadata.startTime.getTime());
      this._logger.logInformation(`${(response.config.method).toUpperCase()}\t${response.status}(${dt}ms): ${response.config.url}`)
      return response;
    });
  }

  /**
  * @private
  * 
  * @return { import('axios').AxiosRequestConfig  }
  */
  CreateDefaultConfig() {
    return {
      headers: {
        ...this._defualtHeader,
        'Content-Type': 'application/json',
      }
    }
  }

  /**
   * @private
   * 
   * @return { import('axios').AxiosRequestConfig }
   */
  CreateDefaultAuthConfig() {
    return {
      headers: {
        ...this._defualtHeader,
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${this._signinManager.GetAccessToken()}`
      }
    }
  }

  async Sentence(words) {
    const response = await this._client.post('/api/captions/sentence', words);
    EnsureSuccessStatusCode(response);
    return response.data;
  }

  async youtubeSearch(query) {
    query = encodeURI(query);
    const response = await this._client.get(
      `/api/youtube/search?query=${query}`,
      this.CreateDefaultAuthConfig()
    );

    EnsureSuccessStatusCode(response);

    const { data } = response;
    return data.items.map(item => {
      item.snippet.title = item.snippet.title.replace(/&amp;/g, '&')
        .replace(/&#39;/g, "'")
        .replace(/&quot;/g, '"')

      return item;
    })
  }

  /**
   * @param { import("models/TranslateCaptionModel").TranslateCaptionModel } captions 
   * 
   * @return { Promise<Array<import("models/TranslateCaptionOutputModel").TranslateCaptionOutputModel>> }
   */
  async TranslateCaptionAsync(captions) {
    const response = await this._client.post(
      `/api/captions/translate`,
      captions,
      this.CreateDefaultAuthConfig()
    );

    EnsureSuccessStatusCode(response);
    return response.data;
  }

  /**
   * 
   * @param {object} inquiry 
   * @param {string} inquiry.title
   * @param {string} inquiry.content
   * @returns 
   */
  async inquiry(inquiry) {
    const response = await this._client.post(
      `/api/Inquiry`,
      inquiry,
      this.CreateDefaultAuthConfig()
    );

    EnsureSuccessStatusCode(response);
    return response.status === HttpStatusCode.NoContent;
  }

  async UploadCaption(captions, meta) {
    let uploadCaptionUrl = '/api/youtube/captions/v3';
    if (meta) {
      const force = meta.overwrite ? 'true' : 'false';
      const cc = meta.cc ? 'true' : 'false';
      uploadCaptionUrl = `${uploadCaptionUrl}?force=${force}&cc=${cc}`;
    }
    
    const response = await this._client.post(
      uploadCaptionUrl,
      captions,
      this.CreateDefaultAuthConfig()
    );

    EnsureSuccessStatusCode(response);
    return response
  }

  /**
   *  @param {string} videoId
   */
  async GetCaptionListAsync(videoId) {
    const getCaptionListUrl = `/api/youtube/captions?videoId=${videoId}`;
    const response = await this._client.get(
      getCaptionListUrl,
      this.CreateDefaultAuthConfig()
    );

    EnsureSuccessStatusCode(response);
    return response.data;
  }

  /**
   * @param {import("models/TranslateModel").TranslateModel} model 
   */
  async TranslateAsync(model) {
    if (IsNullOrWhiteSpace(model.text)) {
      return "";
    }

    const response = await this._client.post(
      `/api/translate`,
      model,
      this.CreateDefaultAuthConfig()
    );

    EnsureSuccessStatusCode(response);
    return String(response.data);
  }

  /**
   * @param {string} text 
   */

  KoToEnTranslateAsync(text) {
    if (IsNullOrWhiteSpace(text)) {
      return Promise.resolve(String.empty);
    }

    return this.TranslateAsync({
      source: 'ko',
      target: 'en',
      text: text
    })
  }

  /**
   * @param {string} text 
   */
  EnToKoTranslateAsync(text) {
    if (IsNullOrWhiteSpace(text)) {
      return Promise.resolve(String.empty);
    }

    return this.TranslateAsync({
      source: 'en',
      target: 'ko',
      text: text
    })
  }

  async GetSelectedCaptionAsync(captionId) {
    const getSelectedCaptionUrl = `/api/youtube/captions/${captionId}`;
    const response = await this._client.get(getSelectedCaptionUrl, this.CreateDefaultAuthConfig());
    EnsureSuccessStatusCode(response);
    return response.data;
  }

  /**
   * @param {string} id 
   * 
   * @returns {Promise<import('models/SttAnalsisResponseModel').SttAnalsisResponseModel>}   
   */
  async YoutubeVideoStcAsync(id) {
    const response = await this._client.get(`/api/analysis/stt/${id}`, this.CreateDefaultAuthConfig());
    EnsureSuccessStatusCode(response);
    return response.data;
  }

  /**
   * @param {import('fs').PathLike} originPath 
   * 
   * @returns {Promise<import('models/SttAnalsisResponseModel').SttAnalsisResponseModel>}
   */
  async LocalVideoStcAsync(originPath) {
    let paths = originPath.split('#');
    let urlPaths = paths[0].split('%');
    urlPaths[0] = url.fileURLToPath(urlPaths[0]);
    paths[0] = urlPaths.join('%')
    const filePath = paths.join('#');
    const tempPath = PathManager.Temp;
    const name = path.basename(filePath, path.extname(filePath));
    const wavePath = path.resolve(`${tempPath}/${name}.wav`);
    const flacPath = path.resolve(`${tempPath}/${name}.flac`);
    let response;
    try {
      fs.accessSync(filePath)

      if (!fs.existsSync(tempPath)) {
        fs.mkdirSync(tempPath);
      }

      await FFmpeg.ToWave(filePath, wavePath);
      this._logger.logDebug(`Changed ${filePath} to ${wavePath}`);

      await FFmpeg.ToFlac(wavePath, flacPath);
      this._logger.logDebug(`Changed ${wavePath} to ${flacPath}`);

      const form = new FormData();
      form.append('file', fs.createReadStream(flacPath), {
        filename: name
      });

      const config = this.CreateDefaultAuthConfig();
      config.headers = ({
        ...config.headers,
        ...form.getHeaders()
      });

      response = await this._client.post(`/api/analysis/stt`, form, {
        ...config,
        timeout: 0,
        maxContentLength: 1024 * 1024 * 1024,
        maxBodyLength: 1024 * 1024 * 1024,
      });
    } catch (e) {
      this._logger.logWarning(JSON.stringify(e))
    }
    finally {
      fileUnlink(wavePath);
      this._logger.logDebug(`fileUnlink: ${wavePath}`);

      fileUnlink(flacPath);
      this._logger.logDebug(`fileUnlink: ${flacPath}`);
    }

    EnsureSuccessStatusCode(response);
    return response.data;
  }

  async RenderVideoAsync(renderJson) {
    const response = await this._client.post(`/api/captions/ass/v2`,
      renderJson,
      this.CreateDefaultAuthConfig()
    );
    EnsureSuccessStatusCode(response);

    const tempPath = PathManager.LocalTemp;
    if (!fs.existsSync(tempPath)) {
      fs.mkdirSync(tempPath);
    }

    const assfilePath = path.resolve(`${tempPath}/subtitle.ass`);
    try {
      fs.writeFileSync(assfilePath, response.data);
    } catch (err) {
      if (err) this._logger.logWarning(err);
      else this._logger.logDebug(`Create Ass file: ${assfilePath}`)
    }

    return assfilePath;
  }

  /**
   * @param {string} taskId 
   * 
   * @returns {Promise<import('models/SttAnalsisResultModel').SttAnalsisResultModel>}
   */
  async GetSttTaskAsync(taskId) {
    const response = await this._client.get(
      `/api/analysis/sttresult/${taskId}`,
      this.CreateDefaultAuthConfig()
    );
    EnsureSuccessStatusCode(response);
    return response.data;
  }

  /**
   * @param {VideoUploadModel} model 
   */
  async VideoUploadAsync(model) {
    var form = new FormData({ maxDataSize: 1024 * 1024 * 1024 * 25 });

    form.append('Meta.Snippet.Title', model.meta.snippet.title);
    form.append('Meta.Snippet.Description', model.meta.snippet.description);
    model.meta.snippet.tags.forEach(item => {
      form.append('Meta.Snippet.Tags', item);
    });
    form.append('Meta.Snippet.CategoryId', model.meta.snippet.categoryId);
    form.append('Meta.Snippet.DefaultLanguage', model.meta.snippet.defaultLanguage);

    form.append('Meta.Status.License', model.meta.status.license);
    form.append('Meta.Status.PrivacyStatus', model.meta.status.privacyStatus);
    form.append('Meta.Status.SelfDeclaredMadeForKids', model.meta.status.selfDeclaredMadeForKids);
    form.append('Meta.Status.Embeddable', model.meta.status.embeddable);

    form.append('Video', fs.createReadStream(model.path), {
      filename: path.basename(model.path)
    });

    const config = this.CreateDefaultAuthConfig();
    config.headers = ({
      ...config.headers,
      ...form.getHeaders()
    });

    const response = await this._client.post(`/api/youtube/video`, form, {
      ...config,
      timeout: 0,
      maxContentLength: 1024 * 1024 * 1024 * 129,
      maxBodyLength: 1024 * 1024 * 1024 * 129,
    });

    EnsureSuccessStatusCode(response);
    return response.data;
  }

  /**
   * 
   * @param {string} logJson 
   * @returns { Promise<AxiosResponse<void>> } 
   */
  async postClientLogAsync(logJson) {
    try {
      let log = JSON.parse(logJson);
      return await this._client.post(clientLogUrl, {
        ...log,
        userId: downcapConfig.anonymousId
      });
    } catch { }
  }

  /**
   * 
   * @param {import("models/Audio/FadePostModel").default} model 
   * 
   * @returns {Promise<string>}
   */
  async GetFadeFilterAsync(model) {
    const response = await this._client.post(requestUrls.audioFade, model, this.CreateDefaultAuthConfig());
    EnsureSuccessStatusCode(response);
    return response.data;
  }
}

const downcapService = new DowncapService();
exports.default = downcapService;
