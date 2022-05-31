//@ts-check
"use strict";

class AuthErrorModel {
  /**
   * 
   * @param {object} model
   * @param {string} model.code
   * @param {string} model.description
   */
  constructor(model) {
    const { code, description } = model;
    this.code = code;
    this.description = description;
  }
}

exports.AuthErrorModel = AuthErrorModel;
exports.default = AuthErrorModel;
