import EventEmitter from "events";
import * as translateTaskActions from 'storeV2/modules/translateTask';
import * as projectActions from 'storeV2/modules/project';
import * as projectControlActions from 'storeV2/modules/projectControl';
import * as youtubeSearchActions from 'storeV2/modules/youtubeSearch';
import * as originCaptionActions from 'storeV2/modules/originCaption';
import * as translatedCaptionActions from 'storeV2/modules/translatedCaption';
import * as multilineActions from 'storeV2/modules/multiline';
import * as translatedMultilineActions from 'storeV2/modules/translatedMultiline';
import storeV2, * as store from 'storeV2';
import * as Redux from 'redux'
import PathHelper from "PathHelper";
import IpcSender, { ISttResultReceiveModel } from 'lib/IpcSender';
import Player from 'lib/player/Player';
import { youtubeVideoStcAsync } from "lib/windows";
import Presets from "Presets";
import IPreset from "IPreset";
import ParagraphCaptionsHelper from "helpers/ParagraphCaptionsHelper";
import TranslatedCaptionHelper from "helpers/TranslatedCaptionHelper";
import IdGenerator from "storeV2/IdGenerator";
import { IsNullOrWhiteSpace } from "lib/stringHelper";
import projectHistoryActions from 'storeV2/projectHistoryActions';
import { ITranslateTask } from "storeV2/modules/translateTask";
import { ITimeText } from "models";

export type StcStatusType = 'Successed' | 'Failed' | 'Pending' | 'Unstarted' | 'Cancel';
export interface StcStatusChangeEvent {
  status: StcStatusType
}

export type StcStatusChangeEventHandler = ((evt: StcStatusChangeEvent) => void) | (() => void);

const DEFAULT_PROJECT_NAME = "downcap project";
function getRandomPresetStyle(): IPreset {
  let { id, ...preset } = { ...Presets[Math.floor(Math.random() * Presets.length)] };
  return preset;
}
class ProjectManagerSingleTone {

  private static _this: ProjectManagerSingleTone | null = null;

  static create(): ProjectManagerSingleTone {
    if (ProjectManagerSingleTone._this === null) {
      ProjectManagerSingleTone._this = new ProjectManagerSingleTone();
    }

    return ProjectManagerSingleTone._this;
  }

  private constructor() {
    this._stcStatusField = 'Unstarted';
    this._eventEmitter = new EventEmitter();
    this._ipcSender = new IpcSender();
    this._translateTask = null;
    this._translateCancel = false;
    const dispatch = store.default.dispatch;
    this._dispatch = dispatch;

    const preset = getRandomPresetStyle();

    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);
    ProjectActions.setProjectDefaultStlye({ ...preset })
  }

  private _translateTask: Promise<void> | null;
  private _translateCancel: boolean;
  private _stcStatusField: StcStatusType;
  private _eventEmitter: EventEmitter;

  private _ipcSender: IpcSender;
  private _dispatch: typeof store.default.dispatch;

  private get _stcStatus(): StcStatusType {
    return this._stcStatusField;
  }

  private set _stcStatus(status: StcStatusType) {
    if (this._stcStatusField === status) {
      return;
    }
    this._stcStatusField = status;
    this._eventEmitter.emit("stcStatusChange", {
      status: status
    });

    this._ipcSender.removeSttResultReceive(this._handleStcResultReceive);

    this._stcStatusField = status;
  }

  public get stcStatus(): StcStatusType {
    return this._stcStatusField;
  }

  private _handleStcResultReceive = (evt: Electron.IpcRendererEvent, receive: ISttResultReceiveModel) => {
    if (receive.isLast) {
      this._stcStatus = "Successed";
    }

    const dispatch = store.default.dispatch;
    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);

    receive.data.forEach(timeTexts => {
      OriginCaptionActions.addCaptions(ParagraphCaptionsHelper.textToParagrahsCaption(timeTexts));
    });

    const ProjectHistoryActions = projectHistoryActions(dispatch);
    ProjectHistoryActions.commit();
  }

  private _runStc(myStore: typeof store.default, strRunAction: () => void) {
    if (this._stcStatus === "Pending") {
      this.cancelStc();
    }

    this._stcStatus = "Pending";
    this._ipcSender.onSttResultReceive(this._handleStcResultReceive);
    strRunAction();

    const ProjectHistoryActions = projectHistoryActions(myStore.dispatch);
    ProjectHistoryActions.runStc();
  }

  runLocalFileStc(path: string, rootStore = store.default) {
    this._runStc(rootStore, () => IpcSender.sendStcRequest(path));
  }

  runYouTubeStc(videoId: string, rootStore = store.default) {
    this._runStc(rootStore, () => youtubeVideoStcAsync(videoId));
  }

  cancelStc() {
    if (this._stcStatus !== "Pending") {
      return;
    }

    IpcSender.sendStcRequestBreak();
    this._stcStatus = "Cancel";
  }

  onStcStatusChange(handle: StcStatusChangeEventHandler) {
    this._eventEmitter.addListener('stcStatusChange', handle);
  }

  removeStcStatusChange(handle: StcStatusChangeEventHandler) {
    this._eventEmitter.removeListener('stcStatusChange', handle);
  }

  changeEditTab(tabName: store.EditType, rootStore = store.default) {
    const dispatch = rootStore.dispatch;
    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    const ProjectHistoryActions = projectHistoryActions(dispatch);

    const state = rootStore.getState();
    if (state.present.project.selectedEditType === tabName) {
      return;
    }

    ProjectActions.setSelectedEditType(tabName);
    ProjectControlActions.setFocusParagraphMetas(null);
    ProjectControlActions.setSelectedStyleEditType(null);
    ProjectHistoryActions.changeTab();
  }

  openTranslatedGuide(rootStore = store.default) {
    const dispatch = rootStore.dispatch;
    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);

    ProjectActions.openTranslatedGuide();
  }

  closeTranslatedGuide(rootStore = store.default) {
    const dispatch = rootStore.dispatch;
    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);

    ProjectActions.closeTranslatedGuide();
  }

  setProjectName(name: string, ProjectActions?: typeof projectActions) {
    if (!ProjectActions) {
      const dispatch = store.default.dispatch;
      ProjectActions = Redux.bindActionCreators(projectActions, dispatch);
    }

    ProjectActions.setProjectName(name);
  }

  openLocalVideo(path: string) {
    const dispatch = store.default.dispatch;
    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);
    ProjectActions.setVideoPath(path);

    const projectName = PathHelper.getFileNameWithoutExtension(path) ?? DEFAULT_PROJECT_NAME;
    ProjectManager.setProjectName(projectName);
  }

  openYouTubeVideo(videoId: string, title: string) {
    const dispatch = store.default.dispatch;
    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);

    ProjectActions.setVideoPath(`https://youtu.be/${videoId}`);
    ProjectManager.setProjectName(title);
  }

  clearVideo(player: Player | null = null) {
    player?.close();

    const ProjectActions = Redux.bindActionCreators(projectActions, this._dispatch);
    ProjectActions.removeVideoPath();
  }

  async clearAsync(player: Player | null = null) {
    this.clearVideo(player);
    this.cancelStc();
    this._eventEmitter.removeAllListeners();
    this._stcStatus = "Unstarted";

    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, this._dispatch);
    ProjectControlActions.reset();

    const ProjectActions = Redux.bindActionCreators(projectActions, this._dispatch);
    ProjectActions.reset();

    const preset = { ...getRandomPresetStyle() }
    ProjectActions.setProjectDefaultStlye(preset);

    const YoutubeSearchActions = Redux.bindActionCreators(youtubeSearchActions, this._dispatch);
    YoutubeSearchActions.clear();

    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, this._dispatch);
    OriginCaptionActions.clearCaptions();
    OriginCaptionActions.clearDefaultStyle();
    OriginCaptionActions.clearDefaultLocation();

    await this.clearTranslatedCaptionAsync();

    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, this._dispatch);
    TranslatedCaptionActions.clearCaptions();
    TranslatedCaptionActions.clearDefaultStyle();
    TranslatedCaptionActions.clearDefaultLocation();

    const MultilineActions = Redux.bindActionCreators(multilineActions, this._dispatch);
    MultilineActions.clearCaptions();
    MultilineActions.clearDefaultStyle();
    MultilineActions.clearDefaultLocation();

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, this._dispatch);
    TranslatedMultilineActions.reset();

    const TranslateTaskActions = Redux.bindActionCreators(translateTaskActions, this._dispatch);
    TranslateTaskActions.reset();

    IpcSender.sendProjectPathInit();

    const ProjectHistoryActions = projectHistoryActions(this._dispatch);
    ProjectHistoryActions.commit();
  }

  async reversTranslationAsync(caption: store.ICaptionTranslatedParagraphWithId) {
    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, this._dispatch);
    let { revers, ...exceptReversCaption } = caption;

    const translatedText = ParagraphCaptionsHelper.toText(caption.paragraphs);
    if (IsNullOrWhiteSpace(translatedText)) {
      TranslatedCaptionActions.updateCaptionById({
        ...exceptReversCaption,
        revers: translatedText,
        paragraphs: caption.paragraphs,
        meta: {
          ...caption.meta,
          reversTranslateStatus: 'Successed'
        }
      })

      return;
    }

    TranslatedCaptionActions.updateCaptionById({
      ...exceptReversCaption,
      paragraphs: caption.paragraphs,
      meta: {
        ...caption.meta,
        reversTranslateStatus: 'Pending'
      }
    });

    IpcSender.invokeTranslateEnToKo(translatedText)
      .then((reversText: string): store.ICaptionTranslatedParagraphWithId => ({
        ...caption,
        revers: reversText,
        meta: {
          ...caption.meta,
          reversTranslateStatus: 'Successed',
        }
      })
      ).catch((err: any): store.ICaptionTranslatedParagraphWithId => ({
        ...caption,
        meta: {
          ...caption.meta,
          reversTranslateStatus: 'Failed',
        }
      })
      ).then(caption => {
        //@TODO: Project UID 유효성 검사 방식으로 수정
        if (store.default.getState().present.translatedCaption.captions?.any()) {
          TranslatedCaptionActions.updateCaptionById(caption);
        }
      });
  }

  async originTranslationAsync(caption: store.ICaptionTranslatedParagraphWithId, dispatch = this._dispatch) {
    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, dispatch);
    let { revers, ...exceptReversCaption } = caption;

    if (IsNullOrWhiteSpace(caption.origin)) {
      TranslatedCaptionActions.updateCaptionById({
        ...exceptReversCaption,
        revers: caption.origin,
        paragraphs: [{
          lines: [{
            words: [{
              start: exceptReversCaption.paragraphs.first().lines.first().words.first().start,
              end: exceptReversCaption.paragraphs.last().lines.last().words.last().end,
              text: caption.origin
            }]
          }]
        }],
        meta: {
          reversTranslateStatus: 'Successed',
          translatStatus: 'Successed'
        }
      });
      return;
    }

    TranslatedCaptionActions.updateCaptionById({
      ...exceptReversCaption,
      paragraphs: [],
      meta: {
        reversTranslateStatus: 'Unstarted',
        translatStatus: 'Pending'
      }
    });

    const setenceTimeTexts = await IpcSender.analyzeSentenceAsync([{
      start: exceptReversCaption.paragraphs.first().lines.first().words.first().start,
      end: exceptReversCaption.paragraphs.last().lines.last().words.last().end,
      text: caption.origin
    }]);

    const paragraphsTasks = setenceTimeTexts.map(async setence => {
      const text = setence.map(item => item.text).join(' ');
      const translated = await IpcSender.invokeTranslateKoToEn(text);
      return TranslatedCaptionHelper.textToParagrahsCaption(
        translated,
        setence.first().start,
        setence.last().end
      );
    });

    Promise.all(paragraphsTasks);

    let paragraphs = [];
    for (const task of paragraphsTasks) {
      paragraphs.push(await task);
    }

    let translatedParagraphs = paragraphs.flat();

    let updateCaption: store.ICaptionTranslatedParagraphWithId = {
      ...exceptReversCaption,
      paragraphs: translatedParagraphs.flat(),
      meta: {
        reversTranslateStatus: 'Pending',
        translatStatus: 'Successed'
      }
    };

    TranslatedCaptionActions.updateCaptionById(updateCaption);

    const translatedText = ParagraphCaptionsHelper.toText(translatedParagraphs)
    IpcSender.invokeTranslateEnToKo(translatedText)
      .then((reversText: string): store.ICaptionTranslatedParagraphWithId => ({
        ...updateCaption,
        revers: reversText,
        meta: {
          ...updateCaption.meta,
          reversTranslateStatus: 'Successed',
        }
      })
      ).catch((err: any): store.ICaptionTranslatedParagraphWithId => ({
        ...updateCaption,
        meta: {
          ...updateCaption.meta,
          reversTranslateStatus: 'Failed',
        }
      })
      ).then(caption => {
        TranslatedCaptionActions.updateCaptionById(caption);
      })

  }

  translateCaptionsAsync(captions: store.ICaptionsParagraph[], rootStore?: typeof storeV2, translateTaskList?: ITranslateTask[]) {
    try {
      this.openTranslatedGuide();
      this._translateTask = this.translateCaptionsInternalAsync(captions, rootStore, translateTaskList);
      return this._translateTask;
    } catch (error) {
      throw new Error();
    }
  }

  private async translateCaptionsInternalAsync(captions: store.ICaptionsParagraph[], rootStore?: typeof storeV2, translateTaskList?: ITranslateTask[]) {
    const originCaptions = translateTaskList?.any() ? captions.slice(translateTaskList?.findIndex(translateTask => translateTask.translated === false), captions.length) : captions;
    const translateTaskListForSetting = translateTaskList?.any() ? translateTaskList :
      captions.map(paragraph => {
        return ({
          originCaption: paragraph,
          translated: false
        });
      });

    let dispatch = rootStore?.dispatch ?? this._dispatch;
    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, dispatch);
    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);
    const ProjectHistoryActions = projectHistoryActions(dispatch);
    const TranslateTaskActions = Redux.bindActionCreators(translateTaskActions, dispatch);

    TranslateTaskActions.setTranslateTaskList(translateTaskListForSetting);

    const timeTexts = ParagraphCaptionsHelper.toTimeTexts(originCaptions);
    const setenceTimeTexts = await IpcSender.analyzeSentenceAsync(timeTexts);

    const setenceTimeTextsLength = setenceTimeTexts.length;
    ProjectActions.setTotalTranlsateTaskLength(setenceTimeTextsLength);
    ProjectActions.setNowTranslateTaskLength(0);

    const reversTasks = [];
    for (let index = 0; index < setenceTimeTexts.length && !this._translateCancel; index++) {
      // Promise index reference defense 
      const targetIndex = index;
      const setenceTimeText = setenceTimeTexts[targetIndex];
      const text = setenceTimeText.map(item => item.text).join(' ');
      const captionId = IdGenerator.getNextId('translated', 'caption');
      let caption: store.ICaptionTranslatedParagraphWithId = {
        id: captionId,
        origin: text,
        paragraphs: [],
        meta: {
          reversTranslateStatus: 'Unstarted',
          translatStatus: 'Pending'
        }
      };
      TranslatedCaptionActions.addCaptions([{ ...caption }]);
      ProjectHistoryActions.commit();

      const translated = await IpcSender.invokeTranslateKoToEn(text)
      caption = {
        ...caption,
        paragraphs: TranslatedCaptionHelper.textToParagrahsCaption(
          translated,
          setenceTimeText.first().start,
          setenceTimeText.last().end
        ),
        meta: {
          reversTranslateStatus: 'Pending',
          translatStatus: 'Successed'
        }
      }

      if (this._translateCancel) {
        break;
      }

      TranslatedCaptionActions.updateCaptionById(caption);
      ProjectHistoryActions.commit();

      // Reason for use: Because we need to count the number of times a task has been completed, 
      // we used a mutable value rather than a unique value for each thread.
      //
      // eslint-disable-next-line
      const reversTask = IpcSender.invokeTranslateEnToKo(translated)
        .then(reversText => {
          caption = {
            ...caption,
            revers: reversText,
            meta: {
              ...caption.meta,
              reversTranslateStatus: 'Successed',
            }
          }

          if (this._translateCancel) {
            return;
          }

          ProjectActions.increaseNowTranslateTaskLength();
          TranslatedCaptionActions.updateCaptionById(caption);
          ProjectHistoryActions.commit();
        });

      reversTasks.push(reversTask);
      this.updateTranslatedTask(originCaptions, setenceTimeText, rootStore);
    }

    Promise.all(reversTasks);
    this._translateTask = null;
  }

  updateTranslatedTask(originCaptions: store.ICaptionsParagraph[], setenceTimeText: ITimeText[], rootStore?: typeof storeV2) {
    let dispatch = rootStore?.dispatch ?? this._dispatch;
    const TranslateTaskActions = Redux.bindActionCreators(translateTaskActions, dispatch);

    const translatedOriginCaptions = originCaptions.reduce((acc, paragraph) => {
      const start = paragraph.lines.first().words.first().start;
      const end = paragraph.lines.last().words.last().end;

      if (start === setenceTimeText.first().start || (start > setenceTimeText.first().start && end < setenceTimeText.last().end) || end === setenceTimeText.last().end) {
        acc.push(paragraph);
      }

      return acc;
    }, [] as store.ICaptionsParagraph[]);

    if (translatedOriginCaptions.any()) {
      translatedOriginCaptions.forEach(translatedOriginCaption => {
        const TranslateTask = {
          originCaption: translatedOriginCaption,
          translated: true
        };
        
        TranslateTaskActions.updateTranslatedTask(TranslateTask);
      });
    }
  }

  async clearTranslatedCaptionAsync() {
    this._translateCancel = true;

    const translateTaks = this._translateTask;

    if (translateTaks !== null) {
      await translateTaks;
    }

    this._translateTask = null;
    this._translateCancel = false;

    const ProjectActions = Redux.bindActionCreators(projectActions, this._dispatch);
    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, this._dispatch);

    ProjectActions.setTotalTranlsateTaskLength(null);
    ProjectActions.setNowTranslateTaskLength(null);
    TranslatedCaptionActions.clearCaptions();
    TranslatedCaptionActions.clearDefaultStyle();
  }
}

const ProjectManager = ProjectManagerSingleTone.create();
export default ProjectManager;