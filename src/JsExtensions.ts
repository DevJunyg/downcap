declare global {
  interface StringConstructor {
    readonly empty: "";
  }

  interface Array<T> {
    last: () => T;
    first: () => T;
    any: () => boolean;
  }

  interface ReadonlyArray<T> {
    last: () => T;
    first: () => T;
    any: () => boolean;
  }
}

if (String.empty === undefined) {
  Object.defineProperty(String, 'empty', {
    get: () => "",
  });
}

if (!Array.prototype.last) {
  // eslint-disable-next-line
  Object.defineProperty(Array.prototype, 'last', {
    value: function () {
      return this[this.length - 1];
    },
    writable: false,
  });
}

if (!Array.prototype.first) {
  // eslint-disable-next-line
  Object.defineProperty(Array.prototype, 'first', {
    value: function () {
      return this[0];
    },
    writable: false,
  });
}

if (!Array.prototype.any) {
  // eslint-disable-next-line
  Object.defineProperty(Array.prototype, 'any', {
    value: function () {
      return (this as Array<any>).length !== 0;
    },
    writable: false,
  });
}

export default global;