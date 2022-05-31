export default class PathHelper {
  static getFileName = (path: string) => {
    return path.split('\\').pop()?.split('/').pop();
  }

  static getFileNameWithoutExtension = (path: string) => {
    return PathHelper.getFileName(path)?.split('.').slice(0, -1).join();
  }
}