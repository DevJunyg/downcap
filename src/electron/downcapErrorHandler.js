Object.defineProperty(exports, "__esModule", {
  value: true
});

const { dialog } = require('electron');
const IpcChannels = require('../IpcChannels').default;
const _signinManager = require('./SignInManager').default;
const downcapErrorDomain = require('./downcapErrorDomain').default;
const GoogleLogin = require('./electron-starter').GoogleLogin;
const i18next = require('i18next');

const globalHttpRequestErrorHandlerDict = {
  [downcapErrorDomain.Downcap_Auth]: downcapAuthErrorDefaultHandle,
  [downcapErrorDomain.Downcap_Auth_AccessTokenNotFound]: downcapAuthErrorDefaultHandle,
  [downcapErrorDomain.Downcap_Auth_ExpiredSecurityStamp]: downcapAuthErrorDefaultHandle,
  [downcapErrorDomain.Downcap_Auth_ExpiredTokenTime]: downcapAuthExpiredTokenTimeHandle,
  [downcapErrorDomain.Downcap_Auth_UserNotFound]: downcapAuthErrorDefaultHandle,
  [downcapErrorDomain.Downcap_Letter_LowLetter]: downcapLowLetterErrorDefaultHandle,
  [downcapErrorDomain.Downcap_Login_GoogleLoginNotProvided]: unauthorizedErrorDefaultHandle,
  [downcapErrorDomain.Google_OAuth_InvalidGrant]: unauthorizedErrorDefaultHandle,
  [downcapErrorDomain.Goolge_OAuth_InvalodAuthenticationCredentials]: unauthorizedErrorDefaultHandle,
  [downcapErrorDomain.Youtube_UnauthorizedForceSSL]: unauthorizedErrorDefaultHandle,
  [downcapErrorDomain.Youtube_Caption_Exists]: captionUploadErrorDefaultHandle,
  [downcapErrorDomain.Youtube_Caption_InvalidMetadata]: captionUploadErrorDefaultHandle,
  [downcapErrorDomain.Youtube_Video_NotFound]: captionUploadErrorDefaultHandle,
  [downcapErrorDomain.Youtube_Forbidden]: youtubeForbiddenErrorHandle
};

function downcapAuthErrorDefaultHandle(event, _err, kind, win) {
  event.reply(IpcChannels.listenLoginExpired, kind);
  _signinManager.Logout();
  const dialogOpts = {
    type: "warning",
    title: 'Downcap',
    message: i18next.t("downcapAuthErrorDefaultHandle_Warning_Message")
  };
  dialog.showMessageBox(win, dialogOpts);
}

function downcapAuthExpiredTokenTimeHandle(event, _err, kind, win) {
  event.reply(IpcChannels.listenLoginExpired, kind);
  _signinManager.Logout();
  const dialogOpts = {
    type: "warning",
    title: 'Downcap',
    message: i18next.t("downcapAuthExpiredTokenTimeHandle_Warning_Message")
  };
  dialog.showMessageBox(win, dialogOpts);
}

function downcapLowLetterErrorDefaultHandle(event, err, kind, win) {
  const letter = Math.abs(err.response.data.description);
  const lackLetter = Math.ceil(letter);
  event.reply(IpcChannels.listenLowLetter, { domain: kind, letter: lackLetter });
  const dialogOpts = {
    type: "warning",
    title: 'Downcap',
    message: i18next.t("downcapLowLetterErrorDefaultHandle_Warning_Message")
  };
  dialog.showMessageBox(win, dialogOpts);
}

function youtubeForbiddenErrorHandle(event, err, kind, win) {
  if (kind === 'getSelectedCaption') {
    const dialogOptsForbidden = {
      type: "warning",
      title: 'Downcap',
      message: i18next.t("youtubeForbiddenErrorHandle_Warning_Message")
    };
    dialog.showMessageBox(win, dialogOptsForbidden);
    return;
  }
  captionUploadErrorDefaultHandle(event, err, kind);
}

function unauthorizedErrorDefaultHandle(_event, err, kind, _win) {
  const errorMessage = err.response.data?.description ?? err.response.data?.message;
  const content = kind === 'captionUpload' ?
    i18next.t("unauthorizedErrorDefaultHandle_Content_Caption_StatusMessage")
    : i18next.t("unauthorizedErrorDefaultHandle_Content_Video_StatusMessage");
  const statusMessage = content
  GoogleLogin(statusMessage, errorMessage);
}

function captionUploadErrorDefaultHandle(_event, err, _kind, win) {
  const dialogOpts = {
    type: "warning",
    title: 'Downcap',
    message: i18next.t("captionUploadErrorDefaultHandle_Warning_Message"),
    detail: err.response.data?.description ?? err.response.data?.message
  };
  dialog.showMessageBox(win, dialogOpts);
}

Object.freeze(globalHttpRequestErrorHandlerDict);
exports.default = globalHttpRequestErrorHandlerDict;
