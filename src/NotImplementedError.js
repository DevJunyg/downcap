class NotImplementedError extends Error {
  constructor(functionName = undefined) {
    let msg;
    if (functionName) msg = `The ${functionName} function not implemente.`;
    else msg = "The function not implemente.";

    super(msg)
    NotImplementedError.prototype.name = "NotImplementedError";
  }
}

export default NotImplementedError;