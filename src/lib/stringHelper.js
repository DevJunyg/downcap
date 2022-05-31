//@ts-check

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.IsNullOrWhiteSpace = IsNullOrWhiteSpace;

/**
 * @param {string} str 
 */
function IsNullOrWhiteSpace(str) {
  if (str === null) return true;

  if (typeof str !== 'string') {
    throw new TypeError('The str is not String.');
  }
  
  return str === "" || str.match(/^ *$/) !== null;
}
