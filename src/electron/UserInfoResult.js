const UserInfo = require("./UserInfo").default;
const AuthErrorModel = require("./AuthErrorModel").default;

class UserInfoResult {
  /**
   *
   * @param {Object} args
   * @param {boolean} args.successed
   * @param {UserInfo} [args.data]
   * @param {Array<AuthErrorModel>} [args.errors]
   */
  constructor(args) {
    /** @private */
    this.successed = args.successed;
    /** @private */
    this.data = args.data;
    /** @private */
    this.errors = args.errors;
  }

  /**
   *
   *  @param {boolean} value
   */
  set Successed(value) {
    this.successed = value;
  }
  get Successed() {
    return this.successed;
  }

  /**
   *
   *  @param {UserInfo?} value
   */
  set Data(value) {
    this.data = value;
  }
  get Data() {
    return this.data;
  }


  /**
   *
   *  @param {Array<AuthErrorModel>?} value
   */
  set Errors(value) {
    this.errors = value;
  }
  get Errors() {
    return this.errors;
  }
}

exports.UserInfoResult = UserInfoResult;
exports.default = UserInfoResult;
