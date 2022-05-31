class UnsupportedException extends Error {
  constructor(msg) {
    super(msg)
    UnsupportedException.prototype.name = "UnsupportedException";
  }
}

export default UnsupportedException;