import PopupManager from "managers/PopupManager";
import React, { Suspense } from "react";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';

export interface IPopupProps {
  onCloseClick?: React.MouseEventHandler;
}

const FileOpenPopupContainer = React.lazy(() => import('./popup/FileOpenPopupContainer'));
const HelpImagePopup = React.lazy(() => import("components/popup/HelpImagePopup"));
const AppInfoPopup = React.lazy(() => import("components/popup/AppInfoPopup"));
const NewProjectPopup = React.lazy(() => import("components/popup/NewProjectPopup"));
const SavePopup = React.lazy(() => import("components/popup/SavePopup"));
const ShortcutPopup = React.lazy(() => import("components/popup/ShortcutPopup"));
const CaptionsExportPopupContainer = React.lazy(() => import("./popup/CaptionsExportPopupContainer"));
const VideoExportSettingPopupContainer = React.lazy(() => import("./popup/VideoExportSettingPopupContainer"));
const VideoExportPendingPopupContainer = React.lazy(() => import("./popup/VideoExportPendingPopupContainer"));
const VideoExportFailPopupContainer = React.lazy(() => import("./popup/VideoExportFailedPopupContainer"));
const InquiryPopupContainer = React.lazy(() => import("./popup/InquiryPopupContainer"));
const ApplyAllStylesWarningPopupContainer = React.lazy(() => import("./popup/ApplyAllStylesWarningPopupContainer"));
const LetterCheckPopup = React.lazy(() => import("components/popup/LetterCheckPopup"));
const YoutubeVideoUploadPopupContainer = React.lazy(() => import("./popup/YoutubeVideoUploadPopupContainer"));
const YoutubeCaptionsUploadPopupContainer = React.lazy(() => import("./popup/YoutubeCaptionsUploadPopupContainer"));
const TranslationPopupContainer = React.lazy(() => import("./popup/TranslationPopupContainer"));
const RetranslatePopupContainer = React.lazy(() => import("./popup/RetranslatePopupContainer"));
const YouTubeVideoOpenPopupContainer = React.lazy(() => import("./popup/YouTubeVideoOpenPopupContainer"));
const YoutubeVideoUploadSuccessPopup = React.lazy(() => import("components/popup/youtube/YoutubeVideoUploadSuccessPopup"));
const YoutubeCaptionUploadSuccessPopup = React.lazy(() => import("components/popup/youtube/YoutubeCaptionUploadSuccessPopup"));
const InvalidFontCheckListContainer = React.lazy(() => import("./popup/InvalidFontCheckListContainer"));
const CaptionsExportSuccessPopup = React.lazy(() => import('components/popup/captionsExportPopups/CaptionsExportSuccessPopup'));
const InquiryFailedPopup = React.lazy(() => import('components/popup/inquiries/InquiryFailedPopup'));
const InquirySuccessPopup = React.lazy(() => import('components/popup/inquiries/InquirySuccessPopup'));

type popupType = typeof FileOpenPopupContainer | typeof HelpImagePopup | typeof AppInfoPopup | typeof NewProjectPopup | typeof SavePopup | typeof CaptionsExportPopupContainer | typeof VideoExportSettingPopupContainer | typeof VideoExportPendingPopupContainer | typeof VideoExportFailPopupContainer |
  typeof InquiryPopupContainer | typeof ApplyAllStylesWarningPopupContainer | typeof LetterCheckPopup | typeof YoutubeVideoUploadPopupContainer | typeof YoutubeCaptionsUploadPopupContainer | typeof InvalidFontCheckListContainer | typeof TranslationPopupContainer |
  typeof RetranslatePopupContainer | typeof YouTubeVideoOpenPopupContainer | typeof YoutubeVideoUploadSuccessPopup | typeof YoutubeCaptionUploadSuccessPopup | typeof CaptionsExportSuccessPopup | typeof InquiryFailedPopup | typeof InquirySuccessPopup;

const popupDictionary: {
  [name in store.PopupNameType]: popupType
} = {
  FileOpenPopup: FileOpenPopupContainer,
  SavePopup: SavePopup,
  NewProjectPopup: NewProjectPopup,
  CaptionsExportPopup: CaptionsExportPopupContainer,
  VideoExportFailedPopup: VideoExportFailPopupContainer,
  VideoExportPendingPopup: VideoExportPendingPopupContainer,
  VideoExportSettingPopup: VideoExportSettingPopupContainer,
  LetterCheckPopup: LetterCheckPopup,
  HelpImagePopup: HelpImagePopup,
  InquiryPopup: InquiryPopupContainer,
  AppInfoPopup: AppInfoPopup,
  ShortcutPopup: ShortcutPopup,
  ApplyAllStylesWarningPopup: ApplyAllStylesWarningPopupContainer,
  YoutubeVideoUploadPopup: YoutubeVideoUploadPopupContainer,
  YoutubeCaptionsUploadPopup: YoutubeCaptionsUploadPopupContainer,
  YoutubeVideoUploadSuccessPopup: YoutubeVideoUploadSuccessPopup,
  YoutubeCaptionUploadSuccessPopup: YoutubeCaptionUploadSuccessPopup,
  InvalidFontCheckPopup: InvalidFontCheckListContainer,
  TranslationPopup: TranslationPopupContainer,
  RetranslatePopup: RetranslatePopupContainer,
  YouTubeVideoOpenPopup: YouTubeVideoOpenPopupContainer,
  CaptionsExportSuccessPopup: CaptionsExportSuccessPopup,
  InquiryFailedPopup: InquiryFailedPopup,
  InquirySuccessPopup: InquirySuccessPopup,
}

function PopupContainer(): JSX.Element | null {
  const popupName = ReactRedux.useSelector<
    store.RootState, store.PopupNameType | undefined
  >(state => state.present.popup.name);

  const popupPayload = ReactRedux.useSelector<
    store.RootState, store.PopupPayloadValueType | undefined
  >(state => state.present.popup.payload);

  const dispath = ReactRedux.useDispatch();

  const Popup = (popupName && popupDictionary[popupName]) ?? null;
  if (!Popup) {
    return null;
  }

  //TODO: @ts-ignore should be removed when all popups are changed to hooks.
  //@ts-ignore
  return (<Suspense fallback={<div>Loading...</div>}><Popup {...popupPayload} onCloseClick={handleCloseClick} /></Suspense>);

  function handleCloseClick(evt: React.MouseEvent) {
    PopupManager.close(dispath);
  }
}

export default PopupContainer;