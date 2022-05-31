import * as Redux from 'redux';
import * as popupActions from 'storeV2/modules/popup';
import * as store from 'storeV2';
import * as projectActions from 'storeV2/modules/project';
import { default as rootStore } from 'storeV2';
import IYouTubeStoreSearchResult from 'models/youtube/store/IYouTubeStoreSearchResult';
import { IApplyAllStylesWarningPopupPayload } from 'containers/popup/ApplyAllStylesWarningPopupContainer';

export type VideoExportErrorCodeType = 'INVALID_URL_PATH' | 'RENDER_DEFAULT_ERROR' | 'FFMPEG_ERROR';

export interface ILackOfLetterPayload {
  letter: number;
}

export interface IFileOpenPopupPayload {
  path: string;
}

export interface IYoutubeVideoUploadPopupPayload {
  filePath: string;
}


export interface IVideoExportFailPopupPayload {
  errorCode: VideoExportErrorCodeType;
}

export interface IHelpImagePopupPayLoad {
  domain: store.EditType;
  imageState: boolean;
}

export interface IFontCheckPayload {
  invalidFont: string;
  invalidCaptions: store.IFocusLineMeta[];
}


const rootStoreDispatch = rootStore.dispatch;
export default class PopupManager {
  static close(dispatch: typeof rootStore.dispatch) {
    const PopupActions = Redux.bindActionCreators(popupActions, dispatch);
    PopupActions.close();
  }

  static open(name: store.PopupNameType, payload: undefined, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'YouTubeVideoOpenPopup', payload: IYouTubeStoreSearchResult, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'LetterCheckPopup', payload: ILackOfLetterPayload, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'FileOpenPopup', payload: IFileOpenPopupPayload, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'YoutubeVideoUploadPopup', payload: IYoutubeVideoUploadPopupPayload, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'VideoExportFailedPopup', payload: IVideoExportFailPopupPayload, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'HelpImagePopup', payload: IHelpImagePopupPayLoad, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'InvalidFontCheckPopup', payload: IFontCheckPayload, dispatch?: typeof rootStore.dispatch): void;
  static open(name: 'ApplyAllStylesWarningPopup', payload: IApplyAllStylesWarningPopupPayload, dispatch: typeof rootStore.dispatch): void;
  static open(name: store.PopupNameType, payload: store.PopupPayloadValueType | undefined, dispatch: typeof rootStore.dispatch) {
    PopupManager.close(dispatch);

    const PopupActions = Redux.bindActionCreators(popupActions, dispatch);
    if (payload === undefined) {
      PopupActions.open(name);
    }
    else {
      PopupActions.open(name, payload);
    }
  }

  static openLackOfLetterPopup(payload: ILackOfLetterPayload, dispatch: typeof rootStore.dispatch) {
    PopupManager.open('LetterCheckPopup', payload, dispatch);
  }

  static openFileOpenPopup(payload: IFileOpenPopupPayload, dispatch: typeof rootStore.dispatch) {
    PopupManager.open('FileOpenPopup', payload, dispatch);
  }

  static openFontCheckPopup(payload: IFontCheckPayload, dispatch: typeof rootStore.dispatch) {
    PopupManager.open('InvalidFontCheckPopup', payload, dispatch);
  }

  static openNewProjectPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('NewProjectPopup', undefined, dispatch);
  }

  static openCaptionsExportPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('CaptionsExportPopup', undefined, dispatch);
  }

  static openYoutubeVideoUploadPopup(payload: IYoutubeVideoUploadPopupPayload, dispatch: typeof rootStore.dispatch) {
    PopupManager.open('YoutubeVideoUploadPopup', payload, dispatch);
  }

  static openYoutubeCaptionUploadPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('YoutubeCaptionsUploadPopup', undefined, dispatch);
  }

  static openYoutubeCaptionUploadSuccessPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('YoutubeCaptionUploadSuccessPopup', undefined, dispatch);
  }

  static openYoutubVideoUploadSuccessPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('YoutubeVideoUploadSuccessPopup', undefined, dispatch);
  }

  static openVideoExportSettingPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('VideoExportSettingPopup', undefined, dispatch);
  }
  static openVideoExportPendingPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('VideoExportPendingPopup', undefined, dispatch);
  }

  static openVideoExportFailPopup(payload: IVideoExportFailPopupPayload) {
    PopupManager.open('VideoExportFailedPopup', payload);
  }

  static openSaveSuccessPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('SavePopup', undefined, dispatch);
  }

  static openHelpImagePopup(payload: IHelpImagePopupPayLoad, dispatch: typeof rootStore.dispatch) {
    PopupManager.open('HelpImagePopup', payload, dispatch);
  }

  static openInquiryPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('InquiryPopup', undefined, dispatch);
  }

  static openInfoPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('AppInfoPopup', undefined, dispatch);
  }

  static openShortcutPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('ShortcutPopup', undefined, dispatch);
  }

  static openApplyAllStylesWarningPopup(payload: IApplyAllStylesWarningPopupPayload, dispatch: typeof rootStore.dispatch) {
    PopupManager.open('ApplyAllStylesWarningPopup', payload, dispatch);
  }

  static openTranslationPopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('TranslationPopup', undefined, dispatch);
  }

  static openRetranslatePopup(dispatch: typeof rootStore.dispatch) {
    PopupManager.open('RetranslatePopup', undefined, dispatch);
  }

  static openYouTubeVideoOpenPopup(payload: IYouTubeStoreSearchResult, dispatch: typeof rootStore.dispatch) {
    PopupManager.open('YouTubeVideoOpenPopup', { ...payload }, dispatch);
  }

  _dispatch: typeof rootStore.dispatch;
  constructor(dispatch: typeof rootStore.dispatch) {
    this._dispatch = dispatch;
  }

  close() {
    PopupManager.close(this._dispatch)
  }

  openYouTubeVideoOpenPopup(payload: IYouTubeStoreSearchResult) {
    PopupManager.openYouTubeVideoOpenPopup(payload, this._dispatch)
  }
}
