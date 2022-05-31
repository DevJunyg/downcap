import IpcChannels from "IpcChannels";

const { ipcRenderer } = window;

export const minimize = () => ipcRenderer.send(IpcChannels.sendMinimize);
export const maximize = () => ipcRenderer.send(IpcChannels.sendMaximize);
export const unMaximize = () => ipcRenderer.send(IpcChannels.sendUnmaximize);
export const exit = () => ipcRenderer.send(IpcChannels.sendExit);

export async function register() {
  return ipcRenderer.send(IpcChannels.sendRegister);
}

export async function forgotPassword() {
  return ipcRenderer.send(IpcChannels.sendForgotPassword);
}

export function login(email, password, rememberMe) {
  return ipcRenderer.invoke(IpcChannels.invokeLogin, email, password, rememberMe);
}

/**
 * @returns {boolean} 
 */
export function handleCaptionExport(options, output) {
  return ipcRenderer.sendSync(IpcChannels.sendCaptionExport, options, output);
}

/**
 * @deprecated
 */
export function changeUserInfo() {
  return ipcRenderer.send(IpcChannels.sendChangeUserInfo);
}

export function notice() {
  return ipcRenderer.send(IpcChannels.sendNotice);
}

/**
 * @deprecated 
 * 
 * @returns {Promise<boolean>}
 */
export function logout() {
  return ipcRenderer.invoke(IpcChannels.invokeLogout);
}

export function autoLogin() {
  return ipcRenderer.invoke(IpcChannels.invokeTokenLogin);
}

export async function customPresetsLoadAsync() {
  const presets = await ipcRenderer.invoke(IpcChannels.invokeCustomPresetsLoad);
  return presets.map(preset => ({
    ...preset,
    background: preset.background ?? { a: 0, r: 0, g: 0, b: 0 }
  }));
}

export function customPresetsSave(array) {
  ipcRenderer.send(IpcChannels.sendCustomPresetsSave, array);
}


/**
 * @deprecated
 * @typedef {import("models/YoutubeCaptionListResponse").YoutubeCaptionListResponse} YoutubeCaptionListResponse
 * 
 * 
 * @param {string} videoId 
 * 
 * @return {Promise<YoutubeCaptionListResponse>}
 */
export function getCaptionListAsync(videoId) {
  return ipcRenderer.invoke(IpcChannels.invokeGetCaptionList, videoId);
}

/**
 * @param {string} text 
 * 
 * @return {Promise<string>}
 */
export function koToEnTranslateAsync(text) {
  return ipcRenderer.invoke(IpcChannels.invokeKoToEnTranslate, text);
}

/**
 * @param {string} text 
 * 
 * @return {Promise<string>}
 */
export function enToKoTranslateAsync(text) {
  return ipcRenderer.invoke(IpcChannels.invokeEnToKoTranslate, text);
}

/**
 * @param {import('models/TranslateCaptionModel').TranslateCaptionModel} captions 
 * 
 * @return {Promise<Array<import("models/TranslateCaptionOutputModel").TranslateCaptionOutputModel>>}
 */
export function translateCaptionAsync(captions) {
  return ipcRenderer.invoke(IpcChannels.invokeTranslateCaption, captions);
}

/**
 * @deprecated 
 */
export function getSelectedCaptionAsync(captionId) {
  return ipcRenderer.invoke(IpcChannels.getSelectedCaption, captionId);
}

/**
 * @deprecated
 * @param {string} videoId 
 */
export function youtubeVideoStcAsync(videoId) {
  ipcRenderer.send(IpcChannels.sendYoutubeVideoStc, videoId);
}

/**
 * @deprecated
 */
export function youtubeUploadVideoSelect() {
  ipcRenderer.send(IpcChannels.sendYoutubeUploadVideoSelect);
}

export function projectShortCutFileLoad() {
  return ipcRenderer.send('getFileData');
}
