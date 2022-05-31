import IpcChannels from "IpcChannels";
import { IpcRenderer } from 'electron';
import { ILogModel } from "logging/ILogModel";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import IRenderRequestModel from "models/IRenderRequestModel";
import IUserInfo from "models/IUserInfo";
import IYouTubeSearchResult from "models/youtube/IYouTubeSearchResult";
import IYouTubeSearchResultSnippet from "models/youtube/IYouTubeSearchResultSnippet";
import { ITimeText } from "models";
import IProjectSaveMoldel from "managers/IProjectSaveModel";
import { ClientAnalysisEvent } from "services/ClientAnalysisService";
import { IAppSettingState } from "storeV2/modules/appSetting";
import { IYoutubeVideoUploadModel, IUploadCaptions } from "containers/popup/YoutubeVideoUploadPopupContainer";
import DowncapScript from "models/Format/Downcap/DowncapScript";
import { IYoutubeCaptionUploadModel } from "containers/popup/YoutubeCaptionsUploadPopupContainer";

declare global {
  interface Window {
    ipcRenderer: IpcRenderer;
  }
}

type SupportedLanguagesType = 'ko' | 'en';
interface ITranslateModel {
  source: SupportedLanguagesType;
  target: SupportedLanguagesType;
  text: string;
}

interface IInquiryModel {
  title: string;
  content?: string;
}

type FileOpenFilterNames = 'all' | 'movies' | 'music' | 'project' | 'srt' | 'bgmfiles';

export interface ISttResultReceiveModel {
  isLast: boolean;
  data: ITimeText[][];
}

const ipcRenderer = window.ipcRenderer;

interface IYouTubeSearchResultSnippetPayload extends Omit<IYouTubeSearchResultSnippet, 'publishedAt'> {
  publishedAt: string;
}

export interface IYouTubeSearchResultPayload extends Omit<IYouTubeSearchResult, 'snippet'> {
  snippet?: IYouTubeSearchResultSnippetPayload;
}

export interface IYoutubeUploadModel {
  snippet: {
    videoId?: string | null;
    language: string;
    name: string;
  };
  data: DowncapScript;
}

export default class IpcSender {
  private logger = ReactLoggerFactoryHelper.build(IpcSender.name);

  static sendFileRemove(backGroundPath: string) {
    ipcRenderer.send(IpcChannels.sendFileRemove, backGroundPath)
  }

  static sendRenderingCancel() {
    ipcRenderer.send(IpcChannels.sendRenderingCancel);
  }

  static sendCancelVideoRemove() {
    ipcRenderer.send(IpcChannels.sendCancelVideoRemove);
  }

  static sendAssFileRemove() {
    ipcRenderer.send(IpcChannels.sendAssFileRemove);
  }

  static sendProjectPathInit() {
    ipcRenderer.send(IpcChannels.sendProjectPathInit);
  }

  static sendLetterPurchase() {
    ipcRenderer.send(IpcChannels.sendLetterPurchase);
  }

  static sendLog(log: ILogModel) {
    ipcRenderer.send(IpcChannels.sendLog, JSON.stringify(log));
  }

  static sendDragDrop(path: string) {
    ipcRenderer.send(IpcChannels.sendDragDrop, path);
  }

  static sendVideoRender(renderModel: IRenderRequestModel) {
    ipcRenderer.send(IpcChannels.sendVideoRender, JSON.stringify(renderModel));
  }

  static sendProjectFileOpen() {
    ipcRenderer.send(IpcChannels.sendProjectFileOpen);
  }

  static sendMultiLineWarning() {
    ipcRenderer.send(IpcChannels.sendMultiLineWarning);
  }

  static sendStcRequestBreak() {
    ipcRenderer.send(IpcChannels.sendStcRequestBreak);
  }

  static sendStcRequest(path: string) {
    ipcRenderer.send(IpcChannels.sendStcRequest, path);
  }

  static sendDuplicateRendering() {
    ipcRenderer.send(IpcChannels.sendDuplicateRenderingWarningDialogOpen);
  }

  static invokeProjectSaveAsync(projectJson: string, defaultName: string = "다운캡"): Promise<string | null> {
    return ipcRenderer.invoke(IpcChannels.invokeProjectFileSave, projectJson, defaultName);
  }

  static sendDowncapPrivacyPolicyPopup() {
    ipcRenderer.send(IpcChannels.sendDowncapPrivacyPolicyPopup);
  }

  static sendGooglePrivacyPolicyPopup() {
    ipcRenderer.send(IpcChannels.sendGooglePrivacyPolicyPopup);
  }

  static sendYoutubeTermsOfServicePopup() {
    ipcRenderer.send(IpcChannels.sendYoutubeTermsOfServicePopup);
  }

  static sendClientAnalysisLog(log: ClientAnalysisEvent) {
    try {
      ipcRenderer.send(IpcChannels.sandClientAnalysisLog, JSON.stringify(log));
    } catch { }
  }

  static sendAppSettingState(appSettingPackage: { appSettingState: IAppSettingState, userEmail: string }) {
    ipcRenderer.send(IpcChannels.sendAppSettingState, appSettingPackage);
  }

  static sendYoutubeCaptionUpload(captions: IYoutubeCaptionUploadModel, meta: { overwrite: boolean, cc: boolean }) {
    ipcRenderer.send(IpcChannels.sendYoutubeCaptionUpload, JSON.stringify(captions), meta);
  }

  static sendYoutubeVideoUpload(model: IYoutubeVideoUploadModel, uploadCaptionData: IUploadCaptions) {
    ipcRenderer.send(IpcChannels.sendYoutubeVideoUpload, model, uploadCaptionData);
  }

  static sendChangeLanguage(recentlyLan: 'ko' | 'en') {
    ipcRenderer.send(IpcChannels.sendChangeLanguage, recentlyLan);
  }

  static sendGoogleLogin(message: string) {
    ipcRenderer.send(IpcChannels.sendGoogleLogin, message);
  }

  static invokeProjectSaveAsAsync(title: string, projectJson: string): Promise<string | null> {
    return ipcRenderer.invoke(IpcChannels.invokeProjectFileSaveAs, title, projectJson);
  }

  static invokeSentenceAnalysisAsync(words: ITimeText[]) {
    return ipcRenderer.invoke(IpcChannels.invokeAnalyzeSentence, words) as Promise<ITimeText[][]>;
  }

  static invokeGetFonts() {
    return ipcRenderer?.invoke(IpcChannels.invokeGetFonts) as Promise<string> ?? Promise.reject();
  }

  static invokeGetVersion() {
    return ipcRenderer.invoke(IpcChannels.invokeGetVersion);
  }

  static invokeFileExistkAsync(path: string): Promise<boolean> {
    return ipcRenderer.invoke(IpcChannels.invokeFileExistkAsync, path)
  }

  static invokeTranslate(translateModel: ITranslateModel) {
    return ipcRenderer.invoke(IpcChannels.invokeTranslate, JSON.stringify(translateModel)) as Promise<string>;
  }

  static invokeTranslateKoToEn(text: string) {
    return IpcSender.invokeTranslate({ source: 'ko', target: 'en', text: text }) as Promise<string>;
  }

  static invokeTranslateEnToKo(text: string) {
    return IpcSender.invokeTranslate({ source: 'en', target: 'ko', text: text });
  }

  static invokeGetFilePathAsync(filterNames?: FileOpenFilterNames[]): Promise<string | null> {
    return ipcRenderer.invoke(IpcChannels.invokeGetFilePath, JSON.stringify(filterNames));
  }

  static async invokeGetUserInfoAsync(): Promise<IUserInfo | null> {
    const userInfoJson = await (ipcRenderer.invoke(IpcChannels.invokeGetUserInfoAsync) as Promise<string>);
    if (userInfoJson === null) {
      return null;
    }

    return JSON.parse(userInfoJson) as IUserInfo;
  }

  static invokeReadFileAsync(path: string): Promise<string | Uint8Array> {
    return ipcRenderer.invoke(IpcChannels.invokeReadFileAsync, path);
  }

  static invokeInquiry(inqury: IInquiryModel): Promise<boolean> {
    return ipcRenderer.invoke(IpcChannels.invokeInquiry, JSON.stringify(inqury));
  }

  static async invokeYouTubeVideoSearch(query: string) {
    const resultJson = await ipcRenderer.invoke(IpcChannels.invokeYouTubeSearch, query);
    const result = JSON.parse(resultJson) as IYouTubeSearchResultPayload[];
    return result?.map(item => {
      const { snippet, ...rest } = item;

      let searchResult: IYouTubeSearchResult = {
        ...rest
      };

      if (item.snippet) {
        searchResult = {
          ...searchResult,
          snippet: {
            ...item.snippet,
            publishedAt: new Date(item.snippet.publishedAt)
          }
        }
      }

      return searchResult;
    }) ?? [];
  }

  static analyzeSentenceAsync(timeText: ITimeText[]) {
    return ipcRenderer.invoke(IpcChannels.invokeAnalyzeSentence, timeText) as Promise<ITimeText[][]>;
  }

  static invokeGetAppSettingStateAsync(userEmail: string): Promise<IAppSettingState | undefined> {
    return ipcRenderer.invoke(IpcChannels.invokeAppSettingState, userEmail);
  }

  listenerCountDict: { [name: string]: number } = {}

  private increaseListenerCount(name: string) {
    let count = this.getListenerCount(name) ?? 0;
    this.setListenerCounter(name, count + 1);
  }

  private isRegisteredListener(name: string) {
    return this.getListenerCount(name) > 0;
  }

  public on(name: string, action: (...args: any) => void) {
    this.listenerAdd(name, action);
  }

  private listenerAdd(name: string, action: (...args: any) => void) {
    ipcRenderer.on(name, action);
    this.increaseListenerCount(name);
  }

  public removeAllListeners(name: string) {
    if (!this.isRegisteredListener(name)) {
      this.registeredListenerCouldNotBeFound(name);
      return;
    }

    ipcRenderer.removeAllListeners(name);
    this.setListenerCounter(name, 0);

  }

  /** @deprecated Address matching is not available because if you pass an action to Electron, it will be converted to native code. */
  private listenerRemove(name: string, action: (...args: any) => void) {
    return this.removeAllListeners(name)
  }

  private registeredListenerCouldNotBeFound(name: string) {
    this.logger.logWarning(`There is no ${name} listener registered.`)
  }

  private getListenerCount(name: string) {
    return this.listenerCountDict[name];
  }

  private setListenerCounter(name: string, count: number) {
    this.listenerCountDict[name] = count;
  }

  onLoginExpired(action: (e: Electron.IpcRendererEvent, domain: string) => void) {
    this.listenerAdd(IpcChannels.listenLoginExpired, action);
  }

  onLowLetter(action: (e: Electron.IpcRendererEvent, param: { domain: string, letter: number }) => void) {
    this.listenerAdd(IpcChannels.listenLowLetter, action);
  }

  onFileOpen(action: (e: Electron.IpcRendererEvent, path: string) => void) {
    this.listenerAdd(IpcChannels.listenFileOpen, action);
  }

  onSrtLoad(action: (e: Electron.IpcRendererEvent, path: string) => void) {
    this.listenerAdd(IpcChannels.listenSrtLoad, action);
  }

  onSttResultReceive(action: (e: Electron.IpcRendererEvent, result: ISttResultReceiveModel) => void) {
    this.listenerAdd(IpcChannels.listenSttResultReceive, action);
  }

  onErrorMessage(action: (e: Electron.IpcRendererEvent, domain: string) => void) {
    this.listenerAdd(IpcChannels.listenErrorMessage, action);
  }

  onProjectLoad(action: (e: Electron.IpcRendererEvent, project: IProjectSaveMoldel) => void) {
    this.listenerAdd(IpcChannels.listenProjectLoad, action);
  }

  onVideoExportStatusChange(action: (e: Electron.IpcRendererEvent, status: string) => void) {
    this.listenerAdd(IpcChannels.listenVideoExportStartChange, action);
  }

  onYoutubeVideoUpload(action: (e: Electron.IpcRendererEvent, filePath: string) => void) {
    this.listenerAdd(IpcChannels.listenVideoSelect, action);
  }

  removeFileOpen(action: (e: Electron.IpcRendererEvent, path: string) => void) {
    this.listenerRemove(IpcChannels.listenFileOpen, action);
  }

  removeLoginExpired(action: (e: Electron.IpcRendererEvent, domain: string) => void) {
    this.listenerRemove(IpcChannels.listenLoginExpired, action);
  }

  removeLowLetter(action: (e: Electron.IpcRendererEvent, param: { domain: string, letter: number }) => void) {
    this.listenerRemove(IpcChannels.listenLowLetter, action);
  }

  removeSrtOpen(action: (e: Electron.IpcRendererEvent, path: string) => void) {
    this.listenerRemove(IpcChannels.listenSrtLoad, action);
  }

  removeSttResultReceive(action: (e: Electron.IpcRendererEvent, result: ISttResultReceiveModel) => void) {
    this.listenerRemove(IpcChannels.listenSttResultReceive, action);
  }

  removeErrorMessage(action: (e: Electron.IpcRendererEvent, domain: string) => void) {
    this.listenerRemove(IpcChannels.listenErrorMessage, action);
  }

  removeVideoExportStatusChange(action: (e: Electron.IpcRendererEvent, status: string) => void) {
    this.listenerRemove(IpcChannels.listenVideoExportStartChange, action);
  }


  removeProjectLoad(action: (e: Electron.IpcRendererEvent, project: IProjectSaveMoldel) => void) {
    this.listenerRemove(IpcChannels.listenProjectLoad, action);
  }

  removeYoutubeVideoUpload(action: (e: Electron.IpcRendererEvent, filePath: string) => void) {
    this.listenerRemove(IpcChannels.listenVideoSelect, action);
  }
}
