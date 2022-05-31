export default class ClassNameHelper {
  static concat(...names: Array<string | boolean | undefined>) {
    return names.filter(name => typeof name === "string").join(' ')
  }

  /**
   * 
   * @deprecated rename to concat   
   */
  static combine(...names: Array<string | boolean | undefined>) {
    return ClassNameHelper.concat(...names);
  }
}