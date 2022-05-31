function NullableStringValidate(variable) {
  return variable === undefined || variable === null || typeof (variable) === 'string';
}

class UserInfo {
  /**
   * @param {*} args
   */
  constructor(args) {
    let email, nickname, letter, expriseAt, createTime;
    if (arguments.length === 1) {
      email = args.email;
      nickname = args.nickname;
      letter = args.letter;
      expriseAt = args.expiresAt;
      createTime = args.createTime;
    }
    else if (arguments.length === 5) {
      email = args[0];
      nickname = args[1];
      letter = args[2];
      expriseAt = args[3];
      createTime = args[4];
    }
    else {
      throw new TypeError();
    }

    if (typeof (email) !== 'string') {
      throw new TypeError();
    }
    this.Email = email;

    if (!NullableStringValidate(nickname)) {
      throw new TypeError();
    }
    this.nickname = nickname;

    if (typeof (letter) !== 'number') {
      throw new TypeError();
    }
    this.letter = letter;

    if (!NullableStringValidate(expriseAt)) {
      throw new TypeError();
    }
    this.ExpiresAt = expriseAt;

    if (typeof (createTime) !== 'string') {
      throw new TypeError();
    }
    this.CreateTime = createTime;
  }

  /**
   * @param {string} value
   */
  set Email(value) {
    if (typeof (value) !== 'string') {
      throw new TypeError();
    }
    this.email = value;
  }
  get Email() {
    const email = this.email;
    if (typeof (email) !== 'string') {
      throw new TypeError();
    }
    return email;
  }

  /**
   * @param {string} value
   */
  set Nickname(value) {
    if (typeof (value) !== 'string') {
      throw new TypeError();
    }
    this.nickname = value;
  }
  get Nickname() {
    const nickname = this.email;
    if (typeof (nickname) !== 'string') {
      throw new TypeError();
    }
    return nickname;
  }

  /**
   * @param {number} value
   */
  set Letter(value) {
    if (typeof (value) !== 'number') {
      throw new TypeError();
    }
    this.letter = value;
  }
  get Letter() {
    const letter = this.letter;
    if (typeof (letter) !== 'number') {
      throw new TypeError();
    }
    return letter;
  }

  /**
   * @param {string} [value]
   */
  set ExpiresAt(value) {
    if (!NullableStringValidate(this.expiresAt)) {
      throw new TypeError();
    }
    this.expiresAt = value;
  }
  get ExpiresAt() {
    const value = this.expiresAt;
    if (!NullableStringValidate(this.expiresAt)) {
      throw new TypeError();
    }
    return value;
  }

  /**
   * @param {string} value
   */
  set CreateTime(value) {
    if (typeof (value) !== 'string') {
      throw new TypeError();
    }
    this.createTime = value;
  }
  get CreateTime() {
    const value = this.createTime;
    if (typeof (value) !== 'string') {
      throw new TypeError();
    }
    return value;
  }
}
exports.UserInfo = UserInfo;
exports.default = UserInfo;
