//@ts-check

const os = require('os');
const OsType = require('./OsType');
//@ts-ignore
const fontList = require('font-list');
const pathManager = require('./PathManager');
const path = require('path');

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.GetFontsAsync = GetFontsAsync;

const execFile = require('child_process').execFile

/**
 * 
 * @param {string} vbsFontsPath 
 */
function tryToGetFonts(vbsFontsPath) {
  let localFonts = vbsFontsPath.split('\n');
  if (localFonts[0].includes('Microsoft')) {
    localFonts.splice(0, 3);
  }

  localFonts = localFonts.map(item => {
    let fontsPath = item.split(path.sep);
    let fontsname = fontsPath[fontsPath.length - 1];
    if (!fontsname.match(/^[\w\s]+$/)) {
      return '';
    }

    fontsname = fontsname.replace(/^\s+|\s+$/g, '')
      .replace(/(Regular)$/i, '')
      .replace(/(B)$/, '')
      .replace(/(M)$/, '')
      .replace(/(Italic)$/i, '')
      .replace(/(Bold)$/i, '')
      .replace(/(Medium)$/i, '')
      .replace(/(Normal)$/i, '')
      .replace(/(Extended)$/, '')
      .replace(/(Extra Condensed)$/, '')
      .replace(/(Compressed Light)$/, '')
      .replace(/\s+$/g, '');

    return fontsname;
  })

  return localFonts.filter((element, index) => {
    if (element === '') return false;

    return localFonts.indexOf(element) === index;
  });
}

/**
 * @returns { Promise<string[]> }
 */
function GetWindowFontsAsync() {
  let fn = path.resolve(pathManager.FontList)

  return new Promise((resolve, reject) => {
    let cmd = `cscript`

    execFile(cmd, [fn], { maxBuffer: 1024 * 1024 * 10 }, (err, stdout, stderr) => {
      /** @type {string[]} */
      let fonts = [];

      if (err) {
        reject(err);
        return;
      }

      if (stdout) {
        fonts = fonts.concat(tryToGetFonts(stdout));
      }

      if (stderr) {
        fonts = fonts.concat(tryToGetFonts(stderr));
      }

      resolve(fonts);
    })
  })
}

/**
 * @returns { Promise<string[]> }
 */
function GetMacOsFontsAsync() {
  return fontList.getFonts();
}

/**
 * @returns {function() : Promise<string[]>}
 */
function GetFontsByOS() {
  switch (os.type()) {
    case OsType.MacOS:
      return GetMacOsFontsAsync;
    case OsType.Windows:
      return GetWindowFontsAsync;
    default:
      throw new Error("This OS is not supported.");
  }
}

const GetFontsInternalAsync = GetFontsByOS();

/**
 * 
 * @param {string} fontName 
 */
function FontNameNormalization(fontName) {
  return fontName.replace(/"/g, "");
}

async function GetFontsAsync() {
  return (await GetFontsInternalAsync()).map(FontNameNormalization);
}