require('dotenv').config()

exports.GoogleLogin = googleLogin;

const { app, BrowserWindow, Menu, ipcMain, dialog, shell, clipboard } = require('electron');
const { autoUpdater } = require("electron-updater");
const IpcChannels = require('../IpcChannels').default;

const url = require('url');
const path = require('path');
const fs = require('fs');
const util = require('util');
const os = require('os');
const FFmpeg = require('./FFmpegHelper');
const FontHelper = require('./FontHelper');
const OsType = require('./OsType');

const PathManager = require('./PathManager');
const AppSettingHelper = require('../helpers/AppSettingHelper');
const HttpRequestError = require('../HttpRequestError').default;
const createMenu = require('./electronMenu').default;

const StcBackgroundTask = require('./StcBackgroundTask').default;

const fsReadFileAsync = util.promisify(fs.readFile);
const fsWriteFileAsync = util.promisify(fs.writeFile);
const fsUnlinkAsync = util.promisify(fs.unlink);

const saveAppSetting = AppSettingHelper.SaveAppSetting;
const getAppSetting = AppSettingHelper.GetAppSetting;

const IsDevelopment = () => process.env.ELECTRON_APP_ENVIRONMENT === "Development";

const downcapErrorHandler = require('./downcapErrorHandler').default;
const _downcapService = require('./DowncapService').default;
const _signinManager = require('./SignInManager').default;

const LoggerFactoryHelper = require('./logging/LoggerFactoryHelper').default;
const logger = LoggerFactoryHelper.Build("Starter");

const i18next = require('i18next');
const backend = require('i18next-fs-backend');
const { initReactI18next } = require('react-i18next');

i18next
  .use(backend)
  .use(initReactI18next)
  .init({
    lng: 'ko',
    fallbackLng: 'en',
    backend: {
      loadPath: PathManager.I18nDirectory
    }
  })

logger.logInformation("My root: " + PathManager.rootDirPath);

let _setting = {
  version: app.getVersion(),
  multiLineFirstWarning: false
};


if (fs.existsSync(PathManager.Setting)) {
  fsReadFileAsync(PathManager.Setting)
    .then(row => {
      //@ts-ignore
      return JSON.parse(row)
    }).then(setting => {
      const version = app.getVersion();
      _setting = setting;
      _setting.multiLineFirstWarning = false;
      if (setting.version !== version) {
        _setting.multiLineFirstWarning = false;
        _setting.version = version;
      }

      logger.logInformation('Reading the configuration file was successful.');
    });
}

/**
 * @type {{openFilePath : string | null}}
 */
let _appOpenOptions = {
  openFilePath: null
};

/**
 * @type {{projectPath? : string, videoPath?: string}}
 */
let _projectState = {};

const customPresetsPath = PathManager.CustomPresets;

try {
  if (!fs.existsSync(customPresetsPath)) {
    fsWriteFileAsync(customPresetsPath, JSON.stringify([]));
  }
} catch (err) {
  /** @type { Electron.MessageBoxOptions } */
  const dialogOpts = {
    type: 'warning',
    title: i18next.t("dialogOpts_Warning_Title"),
    message: i18next.t("dialogOpts_Warning_Message")
  };

  dialog.showMessageBox(dialogOpts);
}


const Extension = {
  Videos: ['mkv', 'mp4'],
  Music: ['wav', 'flac', 'mp3', 'mov', 'm4a'],
  Project: 'docp',
  Srt: 'srt'
};

/** @type {Array<'all' | 'movies' | 'music' | 'project' | 'srt' | 'bgmfiles'>} */
const loadfilterNames = ['all', 'movies', 'music', 'project', 'srt', 'bgmfiles'];

const filter = {
  'all': { name: 'All', extensions: [Extension.Project, ...Extension.Videos, ...Extension.Music, Extension.Srt] },
  'bgmfiles': { name: 'BGM Files', extensions: [...Extension.Videos, ...Extension.Music] },
  'voices': { name: 'voices', extensions: [...Extension.Videos, ...Extension.Music] },
  'movies': { name: 'Movies', extensions: [...Extension.Videos] },
  'music': { name: 'Music', extensions: [...Extension.Music] },
  'project': { name: 'Projcet', extensions: [Extension.Project] },
  'srt': { name: 'Srt', extensions: [Extension.Srt] }
};


/**
 * @param {string} fname 
 * @returns 
 */
const getExtension = fname => fname.slice((fname.lastIndexOf(".") - 1 >>> 0) + 2);

app.allowRendererProcessReuse = true;

/**
 * @param {string} path 
 * @param {string} text 
 */
async function textFileSaveAsync(path, text) {
  try {
    await fsWriteFileAsync(path, text);
  } catch (err) {
    let message = i18next.t("textFileSaveAsync_Error_Message_Inquiry");
    try {
      clipboard.writeText(text);
    } catch (err) {
      message = i18next.t("textFileSaveAsync_Error_Message_Default");
    }

    /** @type { Electron.MessageBoxOptions } */
    const dialogOpts = {
      type: 'warning',
      title: i18next.t("textFileSaveAsync_Warning_Title"),
      message: message
    };

    dialog.showMessageBox(dialogOpts);
    throw err;
  }
}

function autoUpdate() {
  autoUpdater.checkForUpdates();
  autoUpdater.on('update-downloaded', (_event, releaseNotes, releaseName) => {
    const dialogOpts = {
      type: 'info',
      buttons: [
        i18next.t("autoUpdate_DialogOpts_Info_Button_ReStart"),
        i18next.t("autoUpdate_DialogOpts_Info_Button_Exit")
      ],
      title: i18next.t("autoUpdate_DialogOpts_Info_Title"),
      message: process.platform === 'win32' ? releaseNotes : releaseName,
      detail: i18next.t("autoUpdate_DialogOpts_Info_Detail")
    };

    dialog.showMessageBox(dialogOpts).then((returnValue) => {
      if (returnValue.response === 0) {
        autoUpdater.quitAndInstall();
      } else if (returnValue.response === 1) {
        app.quit();
      }
    });
  })

  autoUpdater.on('error', message => {
    logger.logError('An error occurred while updating the application.');
    logger.logError(message);
  });
}

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
/** @type {BrowserWindow | null} */
let win;
function createWindow() {
  if (IsDevelopment()) {
    const addDevTools = require('./devToolHelpers').default;
    addDevTools(logger);
  }
  // Create the browser window.
  win = new BrowserWindow({
    titleBarStyle: 'hiddenInset',
    frame: false,
    show: false,
    width: 1920 - 192,
    height: 1080 - 108,
    minWidth: 1070,
    minHeight: 350,
    webPreferences: {
      nodeIntegration: false, // is default value after Electron v5
      contextIsolation: true, // protect against prototype pollution
      enableRemoteModule: false, // turn off remote,
      webSecurity: false,
      spellcheck: false,
      preload: `${__dirname}/preload.js`,
      devTools: IsDevelopment()
    }
  });
  // and load the index.html of the app.
  const startUrl = process.env.ELECTRON_START_URL ?? url.format({
    pathname: path.join(__dirname, '/../../build/index.html'),
    protocol: 'file:',
    slashes: true
  });

  win.loadURL(startUrl);

  // Emitted when the window is closed.
  win.on('closed', () =>
    // Dereference the window object, usually you would store windows
    // in an array if your app supports multi windows, this is the time
    // when you should delete the corresponding element.
    win = null
  );

  win.on('ready-to-show', () => win?.show());
  win.on('maximize', () => win?.webContents.send('isMaximized', true));
  win.on('unmaximize', () => win?.webContents.send('isMaximized', false));

  win.webContents.on('new-window', (event, url, frameName, disposition, options, additionalFeatures) => {
    event.preventDefault();
    try {
      new URL(url);
      openExternalBrowserAsync(url).catch(logger.logWarning);
    } catch (err) {
      logger.logWarning(err);
    }
  });
}

function setMainMenu() {
  const menu = Menu.buildFromTemplate(createMenu(app, i18next));
  Menu.setApplicationMenu(menu);
}
// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', () => {
  logger.logInformation(`Downcap(v${app.getVersion()}) Start`);
  if (!IsDevelopment()) {
    autoUpdate();
  }

  createWindow();
});

// Quit when all windows are closed.
app.on('window-all-closed', () => {
  // On macOS it is common for applications and their menu bar
  // to stay active until the user quits explicitly with Cmd + Q
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  // On macOS it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (win === null) {
    createWindow();
  }
});

app.on('will-finish-launching', () => {
  app.on('open-file', (event, openFilePath) => {
    event.preventDefault();
    _appOpenOptions.openFilePath = openFilePath;
  })
  if (process.platform === 'win32' && process.argv.length >= 2) {
    _appOpenOptions.openFilePath = process.argv[1];
  }
})

i18next.on('languageChanged', (lng) => {
  setMainMenu()
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
const apiUri = IsDevelopment() ? process.env.API_URL : "https://downcap.net";

const WebUrls = {
  GooglePolicy: 'https://policies.google.com/privacy?hl=ko-kr',
  DowncapLoginOnlyGoogle: `${apiUri}/Identity/Account/LoginOnlyGoogle`,
  DowncapForgotPassword: `${apiUri}/Identity/Account/ForgotPassword`,
  DowncapChangeUserInfo: `${apiUri}/Identity/Account/Manage`,
  DowncapPolicy: `${apiUri}/Policy`,
  DowncapLetterPayment: `${apiUri}/Policy/Price`,
  DowncapRegister: `${apiUri}/identity/account/register`,
  DowncapNotice: `${apiUri}/Support`,
  YoutubeTermsOfService: 'https://www.youtube.com/t/terms'
};

// @TODO: err에 정확한 형을 넣어야 합니다.
/**
 * @param {Electron.IpcMainEvent} event 
 * @param {*} err 
 * @param {string} domain 
 */
function DefaultErrorMessage(event, err, domain) {
  const defaultMessage = i18next.t("Default_Warning_Message");
  const detailMessage = err.response?.data?.description ?? err.response?.data?.message ?? err.code;
  /** @type {Electron.MessageBoxOptions} */
  let dialogOpts = {
    type: "warning",
    title: 'Downcap',
    message: defaultMessage
  };

  if (detailMessage) {
    dialogOpts.detail = detailMessage;
  }

  switch (domain) {
    case 'stc':
      dialogOpts.message = i18next.t("Default_Warning_Message_STC")`${defaultMessage}`;
      break;
    case IpcChannels.invokeYouTubeSearch:
      dialogOpts.message = i18next.t("Default_Warning_Message_InvokeYouTubeSearch")`${defaultMessage}`;
      break;
    case IpcChannels.sendGoogleLogin:
      dialogOpts.message = i18next.t("Default_Warning_Message_GoogleLogin")`${defaultMessage}`;
      break;
    case 'captionUpload':
      dialogOpts.message = i18next.t("Default_Warning_Message_CaptionUpload")`${defaultMessage}`;
      break;
    case 'videoUpload':
      dialogOpts.message = i18next.t("Default_Warning_Message_VideoUpload")`${defaultMessage}`;
      break;
    case 'inquiry':
      dialogOpts.message = i18next.t("Default_Warning_Message_Inquiry")`${defaultMessage}`;
      break;
    case IpcChannels.getSelectedCaption:
      dialogOpts.message = i18next.t("Default_Warning_Message_GetSelectedCaption")`${defaultMessage}`;
      break;
    case IpcChannels.invokeGetCaptionList:
      dialogOpts.message = i18next.t("Default_Warning_Message_GetCaptionList")`${defaultMessage}`;
      break;
    case 'translate':
      dialogOpts.message = i18next.t("Default_Warning_Message_Translate")`${defaultMessage}`;
      break;
    case 'reverseTranslate':
      dialogOpts.message = i18next.t("Default_Warning_Message_ReverseTranslate")`${defaultMessage}`;
      break;
    case 'sentence':
      dialogOpts.message = i18next.t("Default_Warning_Message_Sentence")`${defaultMessage}`;
      break;
    default:
      break;
  }

  win?.webContents.send(IpcChannels.listenErrorMessage, domain);
  win && dialog.showMessageBox(win, dialogOpts);
  logger.logError(err);
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} projectJson 
 * @param {string} deufaltProjectName 
 * @returns {Promise<string | null>}
 */
async function handleProjectSave(event, projectJson, deufaltProjectName) {
  if (!_projectState.projectPath) {
    return await handleProjectSaveAs(event, deufaltProjectName, projectJson);
  }

  try {
    await textFileSaveAsync(_projectState.projectPath, projectJson);
    return _projectState.projectPath;
  } catch (err) {
    logger.logWarning(err);
    return null;
  }
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} title 
 * @param {string} projectJson 
 * @returns {Promise<string | null>}
 */
async function handleProjectSaveAs(event, title, projectJson) {
  if (!win) {
    return null;
  }

  const PathHelper = require('./PathHelper').default;
  const defaultPath = PathHelper.removeInvalidFileCharacters(_projectState.projectPath ?? title);

  try {
    const result = await dialog.showSaveDialog(win, { defaultPath: defaultPath, filters: [filter.project, filter.all] });
    if (result.canceled || !result.filePath) {
      return null;
    }

    await textFileSaveAsync(result.filePath, projectJson);
    _projectState.projectPath = result.filePath;

    return result.filePath;
  } catch (err) {
    logger.logWarning(err);
    return null;
  }
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} query 
 * @returns {Promise<string | null>}
 */
async function youtubeSearch(event, query) {
  try {
    return JSON.stringify(await _downcapService.youtubeSearch(query));
  }
  catch (err) {
    globalErrorHandle(event, err, IpcChannels.invokeYouTubeSearch);
    return null;
  }
}


function captionExport(event, options, output) {
  const saveFilePath = dialog.showSaveDialogSync(win, options);
  if (!saveFilePath) {
    event.returnValue = false;
    return;
  }
  textFileSaveAsync(saveFilePath, output);
  event.returnValue = true;
}

/**
 * @param {string} webUrl 
 * @returns {Promise<void>}
 */
async function openExternalBrowserAsync(webUrl) {
  try {
    return await shell.openExternal(webUrl);
  } catch (messag) {
    return logger.logError(messag);
  }
}

function getVersionAsync() {
  return Promise.resolve(app.getVersion());
}

/**
 * @param {Electron.IpcMainEvent} event 
 * @param {string} email 
 * @param {string} password 
 * @param {boolean} rememberMe 
 * @returns 
 */
function login(event, email, password, rememberMe) {
  return _signinManager.PasswordSignInAsync(email, password, rememberMe);
}

function logout() {
  return _signinManager.Logout();
}

/**
 * @param {Electron.IpcMainInvokeEvent} evt 
 * @param {import('IIdPreset')[]} customPresetsArray 
 */
function customPresetsSaveAsync(evt, customPresetsArray) {
  if (!customPresetsArray) {
    logger.logError(`The save data is ${customPresetsArray}`);
  }
  return fsWriteFileAsync(customPresetsPath, JSON.stringify(customPresetsArray));
}

/**
 * @param {string} projectPath 
 * @returns 
 */
async function projectLoadAsync(projectPath) {
  const row = await fsReadFileAsync(projectPath);
  //@ts-ignore
  const projectData = JSON.parse(row);

  const paths = (os.type() === OsType.MacOS) ? projectPath.split("/") : projectPath.split("\\");
  const projectTitle = paths[paths.length - 1].replace('.docp', '');
  projectData.project.projectName = projectTitle;

  // remove "file://"
  let videoPath = projectData.project.videoPath;
  if (typeof videoPath === "string" && videoPath.indexOf('file://') === 0) {
    videoPath = videoPath.slice(7);
  }

  _projectState.videoPath = videoPath;
  _projectState.projectPath = projectPath;
  _setting.multiLineFirstWarning = false;
  return projectData;
}

/**
 * @param {Electron.IpcMainEvent} event 
 */
function maximize(event) {
  win?.maximize();
  win?.webContents.send(IpcChannels.sendIsMaximized, true);
}

/**
 * @param {Electron.IpcMainEvent} event 
 */
function unmaximize(event) {
  win?.unmaximize();
  win?.webContents.send(IpcChannels.sendIsMaximized, false);
}

/**
 * @param {Electron.IpcMainEvent} event 
 */
function minimize(event) {
  win?.minimize();
}

/**
 * @param {Electron.IpcMainEvent} event 
 */
function multiLineWarning(_event) {
  if (_setting.multiLineFirstWarning) {
    return;
  }

  win && dialog.showMessageBoxSync(win, {
    type: "warning",
    title: 'Downcap',
    message: i18next.t("multiLine_Warning_Message")
  });

  _setting.multiLineFirstWarning = true;
  fsWriteFileAsync(PathManager.Setting, JSON.stringify(_setting))
    .catch(err => logger.logWarning('Failed to write config file in win closed', err));
}

/**
 * @param {Electron.IpcMainEvent} event 
 * @param {string} filePath 
 * @returns {boolean}
 */
async function fileExistkAsync(_event, filePath) {
  return fs.existsSync(filePath);
}

/**
 * @param {Electron.IpcMainEvent} event 
 * @param {string} filePath 
 */
async function fileOpenAsync(_event, filePath) {
  if (!fs.existsSync(filePath)) {
    return;
  }

  const ext = getExtension(filePath).toLowerCase();
  if (ext === Extension.Project) {
    win?.webContents.send(IpcChannels.listenProjectLoad, await projectLoadAsync(filePath));
    _projectState.projectPath = filePath;
  }
  else if ([...Extension.Music, ...Extension.Videos].includes(ext)) {
    _projectState.videoPath = filePath;
    win?.webContents.send(IpcChannels.listenFileOpen, `file://${filePath}`);
  }
  else if (ext === Extension.Srt) {
    win?.webContents.send(IpcChannels.listenSrtLoad, filePath);
  }
  else {
    win && dialog.showMessageBoxSync(win, {
      type: "question",
      message: i18next.t("fileOpenAsync_Question_Message")
    });
    throw new Error(`The File ${filePath} is unknown`);
  }
}

/**
 * @param {Electron.IpcMainEvent} event
 */
async function showFileDialogAsync(event) {
  if (!win) return;

  /** @type {Electron.OpenDialogOptions} */
  const option = {
    filters: loadfilterNames.map(item => filter[item]),
    properties: ['openFile']
  };

  const selected = await dialog.showOpenDialog(win, option);
  if (selected.canceled) return;

  const filePath = selected.filePaths[0];
  await fileOpenAsync(event, filePath);
}


/**
 * @param {Electron.IpcMainEvent} event 
 * @param {string} message 
 * @param {string} [detail] 
 */
async function googleLogin(event, message, detail) {
  try {
    const statusMessage = message ?? i18next.t("googleLogin_StatusMessage");
    const statusDetail = detail ?? i18next.t("googleLogin_StatusDetail");
    const otp = await _signinManager.GetOtp();
    openExternalBrowserAsync(`${WebUrls.DowncapLoginOnlyGoogle}?statusMessage=${statusMessage}&otp=${otp}`);
    const dialogOpts = {
      type: "warning",
      title: 'Downcap',
      message: statusMessage,
      detail: statusDetail
    };
    win && dialog.showMessageBox(win, dialogOpts);
  }
  catch (err) {
    globalErrorHandle(event, err, 'googleLogin');
  }
}


let captionUploadDone = true;

function captionUpload(event, captionsJSON, meta) {
  const languageDictionary = {
    ko: i18next.t("languageDictionary_ko"),
    en: i18next.t("languageDictionary_en")
  };

  const captions = JSON.parse(captionsJSON);
  if (!captions.snippet.videoId) {
    dialog.showMessageBox(win, {
      type: 'error',
      message: i18next.t("captionUpload_Error_Message")
    });
    return;
  }

  if (!captionUploadDone) {
    dialog.showMessageBox(win, {
      type: 'info',
      message: i18next.t("captionUpload_Info_Message")
    });
    return;
  }

  dialog.showMessageBox(win, {
    type: "question",
    message: `${languageDictionary[captions.snippet.language] ?? i18next.t("languageDictionary_dual")} ${i18next.t("showMessageBox_Question_Message")}`,
    buttons: [i18next.t("languageDictionary_yes"), i18next.t("languageDictionary_no")],
    cancelId: 1
  }).then(async confirm => {
    if (confirm.response === 0) {
      captionUploadDone = false;
      win?.webContents.send(IpcChannels.listenYoutubeCaptionUpload, 'proceeding');

      try {
        const response = await _downcapService.UploadCaption(captions, meta);
        const videoId = response.data.snippet?.videoId ?? captions.snippet.videoId ?? '';
        setTimeout(() => {
          shell.openExternal(`https://youtu.be/${videoId}`).catch(logger.logError)
        }, 1000);
        win?.webContents.send(IpcChannels.listenYoutubeCaptionUpload, 'success');
      }
      catch (err) {
        win?.webContents.send(IpcChannels.listenYoutubeCaptionUpload, 'error');
        globalErrorHandle(event, err, IpcChannels.sendYoutubeCaptionUpload);
      }
      finally {
        captionUploadDone = true;

      }
    }
  });
}

async function getCaptionListAsync(event, videoId) {
  if (_downcapService) {
    try {
      return await _downcapService.GetCaptionListAsync(videoId);
    }
    catch (err) {
      const output = globalErrorHandle(event, err, IpcChannels.invokeGetCaptionList);
      return output;
    }
  }
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} text 
 */
async function koToEnTranslateAsync(event, text) {
  try {
    return await _downcapService.KoToEnTranslateAsync(text);
  }
  catch (err) {
    globalErrorHandle(event, err, 'reversTrlaslate');
    return null;
  }
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} text 
 */
async function enToKoTranslateAsync(event, text) {
  try {
    return await _downcapService.EnToKoTranslateAsync(text);
  }
  catch (err) {
    globalErrorHandle(event, err, 'reverseTranslate');
    return null;
  }
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {import('models/TranslateCaptionModel').TranslateCaptionModel} captions 
 */
async function TranslateCaptionAsync(event, captions) {
  try {
    return await _downcapService.TranslateCaptionAsync(captions);
  }
  catch (err) {
    globalErrorHandle(event, err, 'translate');
  }
}

async function getSelectedCaptionAsync(event, cationId) {
  try {
    return await _downcapService.GetSelectedCaptionAsync(cationId);
  }
  catch (err) {
    globalErrorHandle(event, err, IpcChannels.getSelectedCaption);
  }
  return null;
}

/** @type {StcBackgroundTask?} */
let stcTask = null;

function stcAsyncBreak(_event) {
  stcTask?.Stop();
  stcTask = null;
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} videoId 
 */
async function youtubeVideoStcAsync(event, videoId) {
  try {
    stcTask?.Stop();
    stcTask = new StcBackgroundTask(event);
    stcTask.Start(await _downcapService.YoutubeVideoStcAsync(videoId));
  }
  catch (err) {
    globalErrorHandle(event, err, 'stc');
  }
}

/**
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} localVideoPath 
 */
async function localVideoStcAsync(event, localVideoPath) {
  try {
    stcTask?.Stop();
    stcTask = new StcBackgroundTask(event);
    stcTask.Start(await _downcapService.LocalVideoStcAsync(localVideoPath));
  }
  catch (err) {
    globalErrorHandle(event, err, 'stc');
  }
}

function duplicateRenderingWarningDialog() {
  dialog.showMessageBox(win, {
    type: 'info',
    message: i18next.t("duplicateRenderingWarningDialog_Info_Message")
  });
}

let ffmpegId = 0;
const getFFmpegId = () => ffmpegId++;
const ffmpegPackageDictionary = {};

/**
 * @param {*} event 
 * @param {import('models/IRenderRequestModel').default} renderRequsetModel
 */
async function renderVideoAsync(event, renderRequsetModel) {
  const defaultPath = path.basename(renderRequsetModel.origin.path, '.mp4');
  const savePaths = await dialog.showSaveDialog(win, {
    title: i18next.t("renderVideoAsync_title"),
    defaultPath: `${defaultPath}-downcap`,
    filters: [
      { name: 'Video', extensions: ['mp4'] },
      { name: 'All Files', extensions: ['*'] }
    ]
  });

  if (savePaths.canceled) return;

  const saveFilePath = savePaths.filePath;

  let originFileCheck = false;

  if (fs.existsSync(saveFilePath)) {
    originFileCheck = true;
  }

  try {
    win?.webContents.send(IpcChannels.listenRenderingStart, true);

    const assFilePath = renderRequsetModel.script.events?.length !== 0
      ? await _downcapService.RenderVideoAsync(renderRequsetModel.script)
      : undefined;

    let tempPath = undefined;

    if (originFileCheck) {
      tempPath = path.resolve(`${path.dirname(saveFilePath)}/${path.basename(saveFilePath)}.back${path.extname(saveFilePath)}`);
    }

    const renderModel = {
      origin: renderRequsetModel.origin,
      assPath: assFilePath,
      outputPath: saveFilePath,
      tempPath: tempPath
    };

    const ffmpeg = FFmpeg.RenderCaption(event, renderModel);
    const currentFFmpegId = getFFmpegId();

    ffmpegPackageDictionary[currentFFmpegId] = {
      ffmpeg: ffmpeg,
      path: saveFilePath,
      tempPath: renderModel.tempPath,
      assPath: assFilePath
    };

    return currentFFmpegId;
  }
  catch (err) {
    if (err?.code === "ERR_INVALID_FILE_URL_PATH") {
      const dialogOpts = {
        type: "warning",
        title: 'Downcap',
        message: i18next.t("renderVideoAsync_DialogOpts_Warning_Message")
      };
      dialog.showMessageBox(win, dialogOpts);
      win?.webContents.send(IpcChannels.listenVideoExportError, "INVALID_URL_PATH");
      logger.logWarning(err);
    }
    else {
      win?.webContents.send(IpcChannels.listenVideoExportError, "RENDER_DEFAULT_ERROR");
      logger.logWarning(err);
    }
  }
}

async function renderingCancel() {
  try {
    await ffmpegPackageDictionary[ffmpegId - 1].ffmpeg.kill();
  } catch (err) {
    logger.logError(err);
  }
}

/**
 * 
 * @param {string} path 
 */
async function removeFileAsync(path) {
  return fsUnlinkAsync(path);
}

/**
 * 
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} inquiryJson 
 * @returns 
 */
async function inquiryAsync(event, inquiryJson) {
  try {
    return await _downcapService.inquiry(JSON.parse(inquiryJson));
  }
  catch (err) {
    globalErrorHandle(event, err, 'inquiry');
    return false;
  }
}

async function analyzeSentenceAsync(event, words) {
  try {
    return await _downcapService.Sentence(words);
  } catch (err) {
    globalErrorHandle(event, err, 'sentence');
  }
}

async function youtubeUploadVideoSelect(event) {
  const option = {
    filters: [filter.movies, filter.all],
    properties: ['openFile']
  };

  const selected = await dialog.showOpenDialog(win, option);
  if (selected.canceled) return;

  const filePath = selected.filePaths[0];
  const ext = getExtension(filePath).toLowerCase();

  if (Extension.Videos.includes(ext)) {
    win?.webContents.send(IpcChannels.listenVideoSelect, filePath);
  }
  else {
    const dialogOpts = {
      type: "warning",
      title: 'Downcap',
      message: i18next.t("youtubeUploadVideoSelect_Warning_Message")
    };

    dialog.showMessageBox(win, dialogOpts);
  }
}

let videoUploadDone = true;
async function youtubeVideoUpload(event, model, uploadCaptionData) {
  if (!videoUploadDone) {
    dialog.showMessageBox(win, {
      type: 'info',
      message: i18next.t("youtubeVideoUpload_Info_Message")
    });
    return;
  }

  dialog.showMessageBox(win, {
    type: "question",
    message: i18next.t("youtubeVideoUpload_showMessageBox_Question_Message"),
    buttons: [i18next.t("languageDictionary_yes"), i18next.t("languageDictionary_no")],
    cancelId: 1,
  }).then(async confirm => {
    if (confirm.response === 0) {
      videoUploadDone = false;
      win?.webContents.send(IpcChannels.listenVideoUpload, 'proceeding');

      try {
        const videoMeta = await _downcapService.VideoUploadAsync(model);
        setTimeout(() => {
          shell.openExternal(`https://studio.youtube.com/video/${videoMeta.id}/edit`).catch(logger.error)
        }, 1000);
        videoUploadDone = true;
        win?.webContents.send(IpcChannels.listenVideoUpload, 'success');
        if (uploadCaptionData.origin !== undefined) {
          ccUpload(event, videoMeta.id, uploadCaptionData.origin);
        }
        if (uploadCaptionData.translated !== undefined) {
          ccUpload(event, videoMeta.id, uploadCaptionData.translated);
        }
      }
      catch (err) {
        videoUploadDone = true;
        win?.webContents.send(IpcChannels.listenVideoUpload, 'error');
        globalErrorHandle(event, err, 'videoUpload');
      }
    }
  });
}

function ccUpload(event, videoId, uploadCaption) {
  const meta = {
    overwrite: true,
    cc: true
  };

  uploadCaption.snippet.videoId = videoId;
  captionUpload(event, JSON.stringify(uploadCaption), meta);
}

/**
 * 
 * @param {*} _event 
 * @param {string} [filterNamesJson] 
 * @returns 
 */
async function getFilePath(_event, filterNamesJson) {
  let filterNames = loadfilterNames;
  if (filterNamesJson !== undefined) {
    filterNames = JSON.parse(filterNamesJson);
  }

  /** @type { Electron.OpenDialogOptions } */
  const option = {
    filters: filterNames.map(name => filter[name]),
    properties: ['openFile'],
  }

  const selected = await dialog.showOpenDialog(win, option);
  if (selected.canceled) return null;

  return !selected.canceled ? selected.filePaths[0] : null;
}


/**
 * 
 * @param {Electron.IpcMainInvokeEvent} evt 
 */
async function handleUserInfoAsync(evt) {
  const userInfo = await _signinManager.GetUserInfo();
  if (!userInfo.Successed) {
    logger.logWarning(JSON.stringify(userInfo.Errors));
    return null;
  }

  /** @type {import('./UserInfo').default} */
  const data = userInfo.data;
  return JSON.stringify({
    createTime: data.CreateTime,
    email: data.email,
    nickname: data.nickname,
    letter: data.letter,
    expriseAt: data.expiresAt
  })
}

/**
 * 
 * @param {Electron.IpcMainInvokeEvent} evt 
 * @param {string} path
 * @returns {Promise<string | Buffer>}
 */
function fileReadAsync(evt, path) {
  return fsReadFileAsync(path);
}

async function presetLoadAsync() {
  const presets = JSON.parse(await fsReadFileAsync(customPresetsPath))

  return presets.map(preset => {
    const { lineBackGround, ...rest } = preset;
    return ({
      background: lineBackGround,
      ...rest
    });
  })
}

/**
 * @param {Electron.IpcMainInvokeEvent} evt 
 * @param {string} language
 */

async function updateLanguageAsync(evt, language) {
  await i18next.changeLanguage(language);
}

ipcMain.handle(IpcChannels.invokeReadFileAsync, fileReadAsync)
ipcMain.handle(IpcChannels.invokeGetFilePath, getFilePath);
ipcMain.handle(IpcChannels.listenSrtLoad, fileReadAsync);
ipcMain.handle(IpcChannels.invokeCustomPresetsLoad, presetLoadAsync);
ipcMain.handle(IpcChannels.invokeGetCaptionList, getCaptionListAsync);
ipcMain.handle(IpcChannels.getSelectedCaption, getSelectedCaptionAsync);
ipcMain.handle(IpcChannels.invokeGetUserInfoAsync, handleUserInfoAsync);
ipcMain.handle(IpcChannels.invokeLogin, login)
ipcMain.handle(IpcChannels.invokeAnalyzeSentence, analyzeSentenceAsync)
ipcMain.handle(IpcChannels.invokeTokenLogin, _event => _signinManager.LocalTokenLogin());
ipcMain.handle(IpcChannels.invokeYouTubeSearch, youtubeSearch);
ipcMain.handle(IpcChannels.invokeKoToEnTranslate, koToEnTranslateAsync);
ipcMain.handle(IpcChannels.invokeEnToKoTranslate, enToKoTranslateAsync);
ipcMain.handle(IpcChannels.invokeTranslateCaption, TranslateCaptionAsync);
ipcMain.handle(IpcChannels.invokeLogout, logout);
ipcMain.handle(IpcChannels.invokeInquiry, inquiryAsync);
ipcMain.handle(IpcChannels.invokeGetVersion, getVersionAsync);
ipcMain.handle(IpcChannels.invokeFileExistkAsync, fileExistkAsync);
ipcMain.once('getFileData', event => {
  if (_appOpenOptions.openFilePath) {
    fileOpenAsync(event, _appOpenOptions.openFilePath);
  }
  _appOpenOptions.openFilePath = null;
});
ipcMain.on(IpcChannels.sendDragDrop, fileOpenAsync);
ipcMain.on(IpcChannels.sendYoutubeVideoUpload, youtubeVideoUpload);
ipcMain.on(IpcChannels.sendYoutubeUploadVideoSelect, youtubeUploadVideoSelect);
ipcMain.on(IpcChannels.sendYoutubeVideoStc, youtubeVideoStcAsync);
ipcMain.on(IpcChannels.sendStcRequest, localVideoStcAsync);
ipcMain.on(IpcChannels.sendYoutubeCaptionUpload, captionUpload);
ipcMain.on(IpcChannels.sendCustomPresetsSave, customPresetsSaveAsync);
ipcMain.on(IpcChannels.sendDowncapPrivacyPolicyPopup, () => openExternalBrowserAsync(WebUrls.DowncapPolicy));
ipcMain.on(IpcChannels.sendExit, app.exit);
ipcMain.on(IpcChannels.sendGooglePrivacyPolicyPopup, () => openExternalBrowserAsync(WebUrls.GooglePolicy));
ipcMain.on(IpcChannels.sendGoogleLogin, (event, message) => googleLogin(event, message));
ipcMain.on(IpcChannels.sendIsMaximized, _event => win?.webContents.send(IpcChannels.sendIsMaximized, win?.isMaximized()));
ipcMain.on(IpcChannels.sendMaximize, maximize);
ipcMain.on(IpcChannels.sendMinimize, minimize);
ipcMain.on(IpcChannels.sendUnmaximize, unmaximize);
ipcMain.on(IpcChannels.sendRenderingCancel, renderingCancel);
ipcMain.on(IpcChannels.sendRegister, () => openExternalBrowserAsync(WebUrls.DowncapRegister));
ipcMain.on(IpcChannels.sendForgotPassword, () => openExternalBrowserAsync(WebUrls.DowncapForgotPassword));
ipcMain.on(IpcChannels.sendChangeUserInfo, () => openExternalBrowserAsync(WebUrls.DowncapChangeUserInfo));
ipcMain.on(IpcChannels.sendNotice, () => openExternalBrowserAsync(WebUrls.DowncapNotice));
ipcMain.on(IpcChannels.sendLetterPurchase, () => openExternalBrowserAsync(WebUrls.DowncapLetterPayment));
ipcMain.on(IpcChannels.sendYoutubeTermsOfServicePopup, () => openExternalBrowserAsync(WebUrls.YoutubeTermsOfService));
ipcMain.on(IpcChannels.sendCaptionExport, captionExport);
ipcMain.on(IpcChannels.sendStcRequestBreak, stcAsyncBreak);
ipcMain.on(IpcChannels.sendMultiLineWarning, multiLineWarning);
ipcMain.on(IpcChannels.sendDuplicateRenderingWarningDialogOpen, () => duplicateRenderingWarningDialog());
ipcMain.on(IpcChannels.sendChangeLanguage, updateLanguageAsync);

ipcMain.on(IpcChannels.sendAssFileRemove, async () => {
  try {
    const assPath = ffmpegPackageDictionary[ffmpegId - 1].assPath;
    await removeFileAsync(assPath);
  } catch (err) {
    logger.logError(err);
  }
});

ipcMain.on(IpcChannels.sendVideoRender, async (event, renderRequsetModelJson) => {
  try {
    const renderRequsetModel = JSON.parse(renderRequsetModelJson);
    await renderVideoAsync(event, renderRequsetModel);
  } catch (err) {
    win?.webContents.send('RenderCaptionStatus', false);
    logger.logError(err);
  }
});


ipcMain.on(IpcChannels.sendCancelVideoRemove, async () => {
  const ffmpegPackage = ffmpegPackageDictionary[ffmpegId - 1];
  const filePath = ffmpegPackage.tempPath ?? ffmpegPackage.path;

  try {
    await fsUnlinkAsync(filePath);
    const assPath = ffmpegPackage.assPath;
    if (assPath !== undefined) {
      await removeFileAsync(assPath);
    }
  } catch (err) {
    logger.logError(err);
  }
});

ipcMain.on(IpcChannels.sendProjectFileOpen, showFileDialogAsync);

ipcMain.handle(IpcChannels.invokeProjectFileSave, handleProjectSave);

ipcMain.handle(IpcChannels.invokeProjectFileSaveAs, handleProjectSaveAs);

ipcMain.handle(IpcChannels.invokeGetFonts, async e => {
  const fonts = await FontHelper.GetFontsAsync();
  return JSON.stringify(fonts);
});

ipcMain.handle(IpcChannels.getProjectPath, evt => _projectState.projectPath);

ipcMain.on(IpcChannels.sendFileRemove, (_evt, filePath) => fsUnlinkAsync(filePath));

ipcMain.on(IpcChannels.sendProjectPathInit, () => {
  _projectState.projectPath = undefined;
  _setting.multiLineFirstWarning = false;
});

ipcMain.on(IpcChannels.sendLog, (e, logModel) => {
  const { catalogName, logLevel, payload } = JSON.parse(logModel);
  if (payload.error) {
    payload.error.__proto__ = Error.prototype;
    payload.error.__proto__.prototype = {
      message: payload.error.message,
      name: payload.error.name,
      stack: payload.error.stack
    };
  }

  const reactLogger = LoggerFactoryHelper.Build(catalogName);
  if (payload.message) reactLogger.log(logLevel, payload.message);
  else reactLogger.log(logLevel, payload.error);
});

function globalErrorHandle(evt, err, kind) {
  try {
    if (err instanceof HttpRequestError) {
      const domain = err.response.data?.domain;
      if (kind === IpcChannels.invokeGetCaptionList) {
        return domain === 'Youtube.Caption.NotFound' ? [] : null;
      }

      const handle = downcapErrorHandler[domain];
      if (handle) {
        return handle(evt, err, kind, win);
      }
    }
  } catch (internalError) {
    logger.logWarning('GlobalErrorHandle internal error', internalError);
  }

  DefaultErrorMessage(evt, err, kind);
  logger.logError(err);
}

async function invokeTranslateAsync(evt, json) {
  try {
    const model = JSON.parse(json);
    return await _downcapService.TranslateAsync(model);
  }
  catch (err) {
    globalErrorHandle(evt, err, IpcChannels.invokeTranslate);
  }
}

ipcMain.handle(IpcChannels.invokeTranslate, invokeTranslateAsync);

/**
 * @param {Electron.IpcMainEvent} evt 
 */
function _handleClearProejct(evt) {
  _projectState.projectPath = undefined;
  _projectState.videoPath = undefined;
}

ipcMain.on(IpcChannels.sendClearProject, _handleClearProejct);

/**
 * 
 * @param {Electron.IpcMainEvent} evt 
 * @param {string} logJson 
 */
ipcMain.on(IpcChannels.sandClientAnalysisLog, async (evt, logJson) => {
  try {
    return await _downcapService.postClientLogAsync(logJson);
  } catch { }
});

ipcMain.on(IpcChannels.sendAppSettingState, saveAppSettingStateAsync);

/**
 * 
 * @param {{appSettingState: import('storeV2/modules/appSetting').IAppSettingState, userEmail: string}} appSettingPackage 
 */
async function saveAppSettingStateAsync(_event, appSettingPackage) {
  try {
    await saveAppSetting(appSettingPackage);
  } catch (error) {
    logger.logError(error);
  }
}

ipcMain.handle(IpcChannels.invokeAppSettingState, getAppSettingStateAsync);

/**
 * 
 * @param {Electron.IpcMainInvokeEvent} event 
 * @param {string} userEmail
 */
async function getAppSettingStateAsync(_event, userEmail) {
  try {
    return await getAppSetting(userEmail);
  } catch (error) {
    logger.logError(error);
  }
}