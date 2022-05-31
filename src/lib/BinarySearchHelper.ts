import downcapOptions, { SameTimeSubtitleCreationRuleType } from "downcapOptions";

type compareActionType<T, V = T> = (left: T, right: V) => number;

export default class BinarySearchHelper {
  static findIndex<T, V = T>(ary: Array<T>, target: V, compare: (left: T, right: V) => number): number {
    let index = 0;
    let length = ary.length;

    while (length > 0) {
      const pivot = index + Math.floor(length / 2);
      const comValue = compare(ary[pivot], target);
      if (comValue === 0) {
        return pivot;
      }
      else if (comValue > 0) {
        index = pivot + 1;
      }
      else {
        length += 1;
      }

      length -= 1;
      length = Math.floor(length / 2);
    }

    return -1;
  }

  static findIndexToBeAddedAtSameTimesInIncreases<T, V = T>(ary: T[], target: V, startIndex: number, compare: compareActionType<T, V>) {
    let index = startIndex;
    const length = ary.length;
    while (index < length) {
      let comValue = compare(ary[index], target);
      if (comValue !== 0) break;
      index += 1;
    }

    return index;
  }

  static findIndexToBeAddedAtSameTimesInDecreases<T, V = T>(ary: T[], target: V, startIndex: number, compare: compareActionType<T, V>) {
    let index = startIndex;
    while (index > 0) {
      let comValue = compare(ary[index], target);
      if (comValue !== 0) break;
      index -= 1;
    }

    return index;
  }

  static dictOfFindIndexToBeAddedAtSameTimesActions = {
    'increases': BinarySearchHelper.findIndexToBeAddedAtSameTimesInIncreases,
    'decreases': BinarySearchHelper.findIndexToBeAddedAtSameTimesInDecreases
  }

  static findIndexToBeAddedAtSameTime<T, V = T>(list: T[], target: V, startIndex: number, compare: compareActionType<T, V>, rule: SameTimeSubtitleCreationRuleType) {
    const action = BinarySearchHelper.dictOfFindIndexToBeAddedAtSameTimesActions[rule];
    return action(list, target, startIndex, compare);
  }

  static findInsertIndex<T, V = T>(ary: T[], target: V, compare: (left: T, right: V) => number) {
    let index = 0;
    let length = ary.length;

    let comValue = 0;
    while (length > 0) {
      const pivot = index + Math.floor(length / 2);
      comValue = compare(ary[pivot], target);
      if (comValue === 0) {
        index = pivot;
        break;
      }
      else if (comValue > 0) {
        index = pivot + 1;
      }
      else {
        length += 1;
      }

      length -= 1;
      length = Math.floor(length / 2);
    }

    if (comValue === 0 && index < ary.length) {
      index = BinarySearchHelper.findIndexToBeAddedAtSameTime(
        ary,
        target,
        index,
        compare,
        downcapOptions.sameTimeSubtitleCreationRule
      );
    }

    return index;
  }
}