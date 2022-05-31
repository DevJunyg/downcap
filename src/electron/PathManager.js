Object.defineProperty(exports, "__esModule", {
  value: true
});

const os = require('os');
const fs = require('fs');
const path = require('path');

const OsType = require('./OsType');
const { app } = require('electron');

const IsDevelopment = () => process.env.ELECTRON_APP_ENVIRONMENT === "Development";

function getRoot() {
  function getReleaseAppPath() {
    let rootPath = undefined;
    switch (os.type()) {
      case OsType.MacOS:
        rootPath = path.dirname(path.resolve(`${process.execPath}/../`));
        break;
      case OsType.Windows:
        rootPath = path.resolve(`${process.execPath}/`);
        break;
      case OsType.Linux:
        rootPath = path.resolve(`./`);
        break;
      default:
        throw new Error("Unsupported os");
    }

    return rootPath;
  }

  let appPath = IsDevelopment() ? `${require.main.filename}/../../` : getReleaseAppPath();
  appPath = path.resolve(appPath);
  const rootDirPath = path.dirname(appPath);
  return rootDirPath;
}

const root = getRoot();
const userData = os.type() === OsType.Linux ? `./` : app.getPath('userData');

function getTemp() {
  return os.tmpdir();
}

function getLoacalTemp() {
  return `${root}/temp`;
}

function getFFmpeg() {
  let ffmpegPath = undefined;
  switch (os.type()) {
    case OsType.MacOS:
      ffmpegPath = IsDevelopment() ? 'mac/ffmpeg' : 'Contents/mac/ffmpeg'
      break;
    case OsType.Windows:
      ffmpegPath = 'win/ffmpeg.exe'
      break;
    case OsType.Linux:
      ffmpegPath = path.resolve(`./`);
      break;
    default:
      throw new Error("Unsupported os");
  }

  return path.resolve(`${root}/${ffmpegPath}`)
}

function getLogs() {
  return path.resolve(`${root}/logs`);
}

function getSetting() {
  return path.resolve(`${userData}/.setting`)
}

function getCustomPresets() {
  return path.resolve(`${userData}/customPresets.json`)
}

function getToken() {
  return path.resolve(`${userData}/.token`)
}

function getFontList() {
  return path.resolve(`${root}/win/fonts.vbs`)
}

function getProjectData() {
  let projectDicPath = undefined;
  switch (os.type()) {
    case OsType.MacOS:
    case OsType.Windows:
      projectDicPath = path.resolve(`${userData}/project`);
      break;
    case OsType.Linux:
      projectDicPath = path.resolve(`./project`);
      break;
    default:
      throw new Error("Unsupported os");
  }

  if (!fs.existsSync(projectDicPath)) {
    fs.mkdirSync(projectDicPath);
  }

  return projectDicPath;
}

function getLogDirectory() {
  return path.resolve(`${root}/logs`);
}

function getI18nDirectory() {
  let i18nPath = undefined;
  switch (os.type()) {
    case OsType.MacOS:
      i18nPath = IsDevelopment() ? '/' : '/Contents/';
      break;
    case OsType.Windows:
      i18nPath = '/';
      break;
    default:
      throw new Error("Unsupported os");
  }

  return path.resolve(`${root}${i18nPath}i18n/translation_{{lng}}.json`);
}

exports.Temp = getTemp();
exports.FFmpeg = getFFmpeg();
exports.Logs = getLogs();
exports.Setting = getSetting();
exports.CustomPresets = getCustomPresets();
exports.Token = getToken();
exports.FontList = getFontList();
exports.UserData = userData;
exports.ProjectData = getProjectData();
exports.LogDirectory = getLogDirectory();
exports.LocalTemp = getLoacalTemp();
exports.I18nDirectory = getI18nDirectory();

exports.rootDirPath = root;