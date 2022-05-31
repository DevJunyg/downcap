export default class ArrayHelper {
  static isFastEquals<T>(left: T[] | null | undefined, right: T[] | null | undefined) {
    if (left === right) {
      return true;
    }

    if (!(left instanceof Array && right instanceof Array)) {
      return false;
    }

    if (left.length !== right.length) {
      return false;
    }

    const length = left.length;
    for (let index = 0; index < length; index++) {
      if (left[index] !== right[index]) {
        return false;
      }
    }

    return true;
  }
}