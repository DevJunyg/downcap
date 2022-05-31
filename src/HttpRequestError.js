class HttpRequestError extends Error {
  constructor(response, msg) {
    super(msg)
    this.response = response;
    HttpRequestError.prototype.name = "HttpRequestError";
  }
}

exports.HttpRequestError = HttpRequestError;
exports.default = HttpRequestError;