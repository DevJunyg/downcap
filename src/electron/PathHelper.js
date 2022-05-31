Object.defineProperty(exports, "__esModule", {
  value: true
});

class PathHelper {
  /**
   * @private
   */
  static invalidFileNameCharaterRegExp = /(\\|\/|\:|\*|\?|\"|\<|\>|\|)/g;

  /**
    * 
    * @public 
    * @param {string} filePath 
    * @returns {string}
    */
  static removeInvalidFileCharacters(filePath) {
    const path = require('path');
    let pathInfo = path.parse(filePath);
    let name =  pathInfo.name.replace(PathHelper.invalidFileNameCharaterRegExp, '');
    let dirPath = '';
    if (pathInfo.dir !== '') {
      dirPath = `${pathInfo.dir}${path.sep}`;
    }

    return `${dirPath}${name}${pathInfo.ext}`;
  }
}

exports.default = PathHelper;