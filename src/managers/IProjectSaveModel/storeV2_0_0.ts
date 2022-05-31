import { ITimeText, IRGBA } from 'models';
import * as popup from 'components/popup';
import IYouTubeSerachResultSnippet from 'models/youtube/IYouTubeSearchResultSnippet';
import IYouTubeStoreSearchResult from 'models/youtube/store/IYouTubeStoreSearchResult';
import { List } from 'immutable';
import { ISelection } from 'models/ISelection';
import { Action } from 'redux-actions';

type BasicValueType = string | number | boolean | null | undefined;

type VideoExportErrorCodeType = 'INVALID_URL_PATH' | 'RENDER_DEFAULT_ERROR' | 'FFMPEG_ERROR';

interface IApplyAllStylesWarningPopupPayload {
  style?: ICaptionsStyle | null;
  path?: IIndexPath;
  type: 'originCaption' | 'translatedCaption' | 'multiline' | 'translatedMultiline';
}

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
  domain: EditType;
  imageState: boolean;
}

export interface IFontCheckPayload {
  invalidFont: string;
  invalidCaptions: IFocusLineMeta[];
}


export type MapValueType = List<Map<any, any> | BasicValueType> | Map<any, any> | BasicValueType;

export type MapType<T extends { [name in keyof T]?: MapValueType }> = Map<keyof T, T[keyof T]>;

export type MapConvertType<T, U extends T[keyof T], K extends MapValueType> = Map<keyof T, Exclude<T[keyof T], U> | K>;
export type CaptionsLocationType = 'center';

export interface ICaptionsStyle {
  background?: IRGBA;
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  color?: IRGBA;
  outlineColor?: IRGBA;
  captionsLocation?: CaptionsLocationType;
  outline?: number;
  fontSize?: number;
  font?: number | string;
}

export interface ICaptionsWord extends ITimeText {
  id?: number;
  style?: ICaptionsStyle;
}

export interface ICaptionsLine {
  id?: number;
  words: ICaptionsWord[];
  style?: ICaptionsStyle;
}

export interface ICaptionsParagraph {
  id?: number;
  lines: ICaptionsLine[];
  vertical?: number;
  horizontal?: number;
}

export type TranlsateStatusType = 'Successed' | 'Failed' | 'Pending' | 'Unstarted' | 'Cancel';
export type TranlsateEditableStatus = TranlsateStatusType | 'Edited';

export interface IEventWord {
  id?: number;
  text: string;
  style?: ICaptionsStyle;
}

export interface IEventLine {
  id?: number;
  words: IEventWord[];
  style?: ICaptionsStyle;
}

export interface IEventParagraph {
  lines: IEventLine[];
  start: number;
  end: number;

  id?: number;
  vertical?: number;
  horizontal?: number;
}


export interface ICaptionTranslatedParagraph {
  origin: string;
  revers?: string;
  paragraphs: ICaptionsParagraph[];
  meta: {
    translatStatus: TranlsateEditableStatus;
    reversTranslateStatus: TranlsateStatusType;
  }
  id?: number;
}

export interface ICaptionTranslatedParagraphWithId extends ICaptionTranslatedParagraph {
  id: number;
}

export interface IIndexPath {
  captionIndex?: number;
  paragraphIndex?: number;
  lineIndex?: number;
  wordIndex?: number;
  cursorIndex?: number;
}

export interface ISetValueWidthIndexPath<T> extends IIndexPath {
  value: T
}

export interface ISetTextPayload {
  path: Required<Omit<IIndexPath, 'captionIndex' | 'cursorIndex'>>,
  text: string
}

export type PopupNameType = keyof typeof popup;

type ArgumentTypes<F extends Function> = F extends (...args: infer A) => any ? A : never;

export type PopupType = typeof popup[PopupNameType];
export type PopupArgumentTypes = ArgumentTypes<typeof popup[PopupNameType]>;

export type PopupPayloadValueType = IFileOpenPopupPayload
  | ILackOfLetterPayload | IVideoExportFailPopupPayload
  | IHelpImagePopupPayLoad | IYoutubeVideoUploadPopupPayload
  | IFontCheckPayload | IYouTubeSerachResultSnippet | PopupArgumentTypes
  | IYouTubeStoreSearchResult | IApplyAllStylesWarningPopupPayload | string | number;

export interface IPopupState {
  name?: PopupNameType;
  payload?: PopupPayloadValueType;
}

export type SequenceType = 'origin' | 'translated';

export type EditType = 'origin' | 'translated' | 'dual';

export type PreviewType = 'web' | 'android' | 'ios';

export type StyleEditType = 'line' | 'word';

export type KineCaptionType =  'originCaption' | 'translatedCaption' | 'multiline' | 'translatedMultiline';
type FocusSourceType = 'overlay' | 'list';

export interface IFocusLineMeta {
  kind: KineCaptionType,
  captionIndex?: number
  paragraphIndex?: number
  lineIndex?: number,
  wordIndex?: number,
  paragraph?: ICaptionsParagraph
}

export interface IFocusParagraphMeta {
  path: Omit<IIndexPath, "cursorIndex"> & { selection?: ISelection };
  type: KineCaptionType;
  source: FocusSourceType;
}

export interface ISetStylePayload {
  path: Omit<IIndexPath, "cursorIndex">;
  style: ICaptionsStyle | null;
}

export interface IStyleActions {
  setWordStyle(payload: ISetStylePayload): Action<ISetStylePayload>;
}

export interface ITranslatedMultilineCaptionMeta {
  status?: TranlsateStatusType;
  reason?: string;
  sourceId?: number;
  sourceText?: string;
  translatedText?: string;
  /** This is the Id of the translation job received from the server. With this ID, you can request the results of your work.  */
  transltatedTaskId?: number;
}

export interface ITranslatedMultilineCaption extends ICaptionsParagraph {
  meta?: ITranslatedMultilineCaptionMeta;
}

export type UpdateTimeActionType<T extends ICaptionsParagraph> = (caption: T, time: number) => T;

export interface IUpdateTimePayload {
  time: number,
  caption: ICaptionsParagraph
}

export interface IUpdateTimeInternalPayload<T extends ICaptionsParagraph> extends IUpdateTimePayload {
  timeUpdateAction: UpdateTimeActionType<T>
}

export interface IUpdateParagraphPayload<T extends ICaptionsParagraph = ICaptionsParagraph> {
  path: Omit<IIndexPath, 'cursorIndex' | 'wordIndex' | 'lineIndex'>;
  paragraph: T;
}