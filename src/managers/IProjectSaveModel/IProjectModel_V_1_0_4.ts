interface RGBA {
  r: number,
  g: number,
  b: number,
  a?: number
}

interface IHighlight {
  captionIndex?: number,
  lineIndex?: number,
  wordIndex?: number
}

interface ITimeText {
  start: number,
  end: number,
  text: string,
  confidence?: number
}

interface IWordStyle {
  background?: RGBA,
  bold?: boolean,
  italic?: boolean,
  underline?: boolean,
  color?: RGBA,
  outlineColor?: RGBA,
  captionsLocation?: 'center',
  outline?: number,
  fontSize?: number,
  font?: number | string,
}

interface IWord extends ITimeText {
  id?: number,
  style?: IWordStyle
  highlight?: boolean
}

interface ILineStyle {
  left?: number,
  bottom?: number,
  background?: RGBA
}

interface ILine {
  id?: number,
  words?: IWord[],
  highlight?: boolean,
  lineStyle?: ILineStyle,
  style?: IWordStyle,
  styleChangeable?: boolean
}

interface IKoState {
  highlight?: IHighlight;
  captions?: ILine[];
  language?: string;
  requestFinal?: boolean;
  split?: number;
  lineStyle?: ILineStyle;
  style?: IWordStyle;
}

interface ITranslatedLine {
  id?: number;
  ko?: string;
  revers?: string;
  en?: ILine[];
  highlight?: boolean;
}

interface IEnState {
  originKoSentence?: IWord[][];
  captions?: ITranslatedLine[];
  highlight?: IHighlight;
  isTranslating?: boolean;
  split?: number;
  lineStyle?: ILineStyle;
  style?: IWordStyle;
  editKoPending?: number[];
  realTimeTranslationFlag?: boolean;
}

interface IMultiLine {
  id?: number,
  words?: Array<IWord>,
  style?: IWordStyle,
  vertical?: number,
  horizontal?: number
}


interface IProject {
  selected: 'ko' | 'en' | 'dual';
  projectName?: string;
  sequence: ('ko' | 'en')[];
  youtubeVideoId?: string;
}

type PenderStatusType = 'pending' | 'success' | 'error' | 'failure' | 'cancel';
interface ITranslatedMultilineMeta {
  status?: PenderStatusType;
  reason?: string;
  sourceId?: number;
  sourceText?: string;
  translatedText?: string;
  /** This is the Id of the translation job received from the server. With this ID, you can request the results of your work.  */
  transltatedTaskId?: number;
}
interface ITranslatedMultiLine extends IMultiLine {
  meta: ITranslatedMultilineMeta
}

export interface IReduxIdFieldDictionary {
  'oring-line': number,
  'oring-word': number,
  'oringMultiline-word': number,
  'oringMultiline-line': number,
  'translated-caption': number,
  'translated-line': number,
  'translated-word': number,
  'translatedMultiline-line': number,
  'translatedMultiline-word': number
}

export interface IVideoMeta {
  duration: number;
  height: number;
  width: number;
}

export default interface IProjectModel_V_1_0_4 {
  version: '1.0.4';
  project?: IProject;
  ko?: IKoState;
  en?: IEnState;
  path?: string;
  title?: string;
  meta?: IVideoMeta;
  equalizer?: any;
  multiLine?: IMultiLine[];
  translatedMultiLine?: ITranslatedMultiLine[];
  translatedMultiLineCheckpoint?: number;
  reduxStoreIds?: IReduxIdFieldDictionary;
}