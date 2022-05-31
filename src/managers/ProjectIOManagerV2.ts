import * as store from "storeV2";
import * as ReactRedux from 'react-redux';
import IpcSender from "lib/IpcSender";
import IProjectSaveMoldel from "./IProjectSaveModel";
import downcapOptions from "downcapOptions";
import { bindActionCreators } from "redux";
import * as originCaptionActions from "storeV2/modules/originCaption";
import * as translatedCaptionActions from "storeV2/modules/translatedCaption";
import * as multilineActions from "storeV2/modules/multiline";
import * as translatedMultilineActions from "storeV2/modules/translatedMultiline";
import * as projectActions from "storeV2/modules/project";
import * as translateTaskActions from 'storeV2/modules/translateTask';
import IdGenerator, { IdFieldDictionary } from "storeV2/IdGenerator";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import ProjectManager from "./ProjectManager";
import Player from "lib/player/Player";
import * as utils from 'lib/utils';
import ComparerHelper from "lib/ComparerHelper";
import DualCaptionHelper from "helpers/DualCaptionHelper";
import TranslatedCaptionHelper from "helpers/TranslatedCaptionHelper";
import SrtParser from "SrtParser";
import { useDispatch } from "react-redux";
import PathHelper from "PathHelper";
import * as sagasActions from 'storeV2/sagaActions';

const logger = ReactLoggerFactoryHelper.build('ProjectIOManagerV2');

type IdKeyType = 'origin' | 'multiline' | 'translated' | 'translatedMultiline';

const projectIOActions = (dispatch: ReturnType<typeof useDispatch>) => ({
  load: () => dispatch({
    type: "@@project-load"
  }),
})

export default class ProjectIOManagerV2 {
  private static getCaptionIds(): IdFieldDictionary {
    const rootPType: IdKeyType[] = ['origin', 'multiline', 'translated', 'translatedMultiline'];
    return rootPType.reduce((acc, current) => {
      acc[current] = {
        caption: IdGenerator.getNextId(current, 'caption'),
        line: IdGenerator.getNextId(current, 'line'),
        paragraph: IdGenerator.getNextId(current, 'paragraph'),
        word: IdGenerator.getNextId(current, 'word')
      }

      return acc;
    }, {} as { [name in IdKeyType]?: {
      caption: number,
      paragraph: number,
      line: number,
      word: number
    } }) as IdFieldDictionary;
  }

  private static _projectSaveModelBuild(rootState: store.RootState): Readonly<IProjectSaveMoldel> {
    let model: IProjectSaveMoldel = {
      projectModelVersion: downcapOptions.projectSaveVersion,
      project: rootState.present.project,
      captionIds: ProjectIOManagerV2.getCaptionIds()
    }

    if (rootState.present.originCaption.captions) {
      model.originCaption = [...rootState.present.originCaption.captions];
    }

    if (rootState.present.originCaption.defaultStyle) {
      model.originStyle = { ...rootState.present.originCaption.defaultStyle };
    }

    if (rootState.present.originCaption.defaultLocation) {
      model.originLocation = { ...rootState.present.originCaption.defaultLocation };
    }

    if (rootState.present.translatedCaption.captions) {
      model.translatedCaption = [...rootState.present.translatedCaption.captions];
    }

    if (rootState.present.translatedCaption.defaultStyle) {
      model.translatedStyle = { ...rootState.present.translatedCaption.defaultStyle };
    }

    if (rootState.present.translatedCaption.defaultLocation) {
      model.translatedLocation = { ...rootState.present.translatedCaption.defaultLocation };
    }

    if (rootState.present.multiline.captions) {
      model.multiline = [...rootState.present.multiline.captions];
    }

    if (rootState.present.multiline.defaultStyle) {
      model.multilineStyle = { ...rootState.present.multiline.defaultStyle };
    }

    if (rootState.present.multiline.defaultLocation) {
      model.multilineLocation = { ...rootState.present.multiline.defaultLocation };
    }

    if (rootState.present.translatedMultiline.captions) {
      model.translatedMultiline = [...rootState.present.translatedMultiline.captions];
    }

    if (rootState.present.translatedMultiline.checkpoint !== undefined) {
      model.translatedMultilineCheckPoint = rootState.present.translatedMultiline.checkpoint;
    }

    if (rootState.present.translatedMultiline.defaultStyle) {
      model.translatedMultilineStyle = { ...rootState.present.translatedMultiline.defaultStyle };
    }

    if (rootState.present.translatedMultiline.defaultLocation) {
      model.translatedMultilineLocation = { ...rootState.present.translatedMultiline.defaultLocation };
    }

    if (rootState.present.project.translateGuideOpen) {
      model.translateGuideOpen = true;
    }

    if (rootState.present.translateTask?.translateTaskList?.any()) {
      model.translateTaskList = [...rootState.present.translateTask.translateTaskList];
    }

    return model;
  }

  static saveAsync(rootState: store.RootState) {
    const saveModel = ProjectIOManagerV2._projectSaveModelBuild(rootState);
    const json = JSON.stringify(saveModel);
    return IpcSender.invokeProjectSaveAsync(json, saveModel.project.projectName);
  }

  static saveAsAsync(rootState: store.RootState, fileName?: string) {
    const saveModel = ProjectIOManagerV2._projectSaveModelBuild(rootState);
    const json = JSON.stringify(saveModel);
    const title = fileName ?? saveModel.project.projectName ?? "다운캡";
    return IpcSender.invokeProjectSaveAsAsync(title, json);
  }

  static async projectLoadAsync(projectModel: IProjectSaveMoldel) {
    await ProjectManager.clearAsync();

    const dispatch = store.default.dispatch;
    const ProjectActions = bindActionCreators(projectActions, dispatch);
    IdGenerator.reset(projectModel.captionIds);

    const project = projectModel.project;

    logger.logDebug('originCaption Initializing...');
    const OriginCaptionActions = bindActionCreators(originCaptionActions, dispatch);
    const originCaption = projectModel.originCaption;
    if (originCaption) {
      OriginCaptionActions.setCaptions(originCaption)
    }

    const originStyle = projectModel.originStyle;
    if (originStyle) {
      OriginCaptionActions.setDefaultStyle({ style: originStyle });
    }

    const originLocation = projectModel.originLocation;
    if (originLocation) {
      OriginCaptionActions.setDefaultLocation({ location: originLocation });
    }

    logger.logDebug('translatedCaption Initializing...');
    const TranslatedCaptionActions = bindActionCreators(translatedCaptionActions, dispatch);
    const translatedCaptions = projectModel.translatedCaption;
    if (translatedCaptions) {
      const translateSuccessedCaptions = translatedCaptions.filter(translatedCaption =>
        translatedCaption.meta.translatStatus === 'Successed' &&
        translatedCaption.meta.reversTranslateStatus === 'Successed');
      TranslatedCaptionActions.addCaptions(translateSuccessedCaptions);
    }

    const translatedStyle = projectModel.translatedStyle;
    if (translatedStyle) {
      TranslatedCaptionActions.setDefaultStyle({ style: translatedStyle });
    }

    const translatedLocation = projectModel.translatedLocation;
    if (translatedLocation) {
      TranslatedCaptionActions.setDefaultLocation({ location: translatedLocation });
    }

    logger.logDebug('multiline Initializing...');
    const MultilineActions = bindActionCreators(multilineActions, dispatch);
    const multilineCaptions = projectModel.multiline;
    if (multilineCaptions) {
      MultilineActions.setCaptions(multilineCaptions);
    }

    const multilineStyle = projectModel.multilineStyle;
    if (multilineStyle) {
      MultilineActions.setDefaultStyle({ style: multilineStyle });
    }

    const multilineLocation = projectModel.multilineLocation;
    if (multilineLocation) {
      MultilineActions.setDefaultLocation({ location: multilineLocation });
    }

    logger.logDebug('transalted multiline Initializing...');
    const TranslatedMultilineActions = bindActionCreators(translatedMultilineActions, dispatch);
    const translatedMultiline = projectModel.translatedMultiline;
    if (translatedMultiline) {
      const unTranslatedMultiline = translatedMultiline.filter(caption => caption.meta?.status !== 'Successed');
      getUntranslatedCaptions(unTranslatedMultiline);

      TranslatedMultilineActions.setCaptions(translatedMultiline.filter(caption => caption.meta?.status === 'Successed'));
    }

    const translatedMultilineStyle = projectModel.translatedMultilineStyle;
    if (translatedMultilineStyle) {
      TranslatedMultilineActions.setDefaultStyle({ style: translatedMultilineStyle });
    }

    const translatedMultilineLocation = projectModel.translatedMultilineLocation;
    if (translatedMultilineLocation) {
      TranslatedMultilineActions.setDefaultLocation({ location: translatedMultilineLocation });
    }

    logger.logDebug('Project Initializing...');
    ProjectActions.setSelectedEditType(project.selectedEditType);
    project.projectName && ProjectActions.setProjectName(project.projectName);
    project.videoPath && ProjectActions.setVideoPath(project.videoPath);
    project.videoMeta && ProjectActions.setVideoMeta(project.videoMeta);
    project.projectDefaultStyle && ProjectActions.setProjectDefaultStlye(project.projectDefaultStyle);

    if (project.totalTranslateTaskLength !== undefined) {
      ProjectActions.setTotalTranlsateTaskLength(project.totalTranslateTaskLength);
    }

    if (project.nowTranslateTaskLength !== undefined) {
      ProjectActions.setNowTranslateTaskLength(project.nowTranslateTaskLength);
    }

    if (project.translateGuideOpen) {
      ProjectActions.openTranslatedGuide();
    }

    if (projectModel.translateTaskList?.any()) {
      const nextTranslationStart = projectModel.translateTaskList.findIndex(translateTask => translateTask.translated === false);
      if (projectModel.originCaption?.any() && nextTranslationStart !== -1) {
        ProjectManager.translateCaptionsAsync(projectModel.originCaption, undefined, projectModel.translateTaskList);
      } else {
        const translateTaskAction = bindActionCreators(translateTaskActions, dispatch);
        translateTaskAction.setTranslateTaskList(projectModel.translateTaskList);
      }
    }

    projectIOActions(dispatch).load();

    function getUntranslatedCaptions(unTranslatedMultiline: store.ITranslatedMultilineCaption[]) {
      const unTranslatedMultilineOriginCaptions = unTranslatedMultiline.reduce((acc, translatedMultilineCaption) => {
        const unTranslatedMultilineOriginCaption = multilineCaptions?.find(multilineCaption => multilineCaption.id === translatedMultilineCaption.meta?.sourceId);
        if (unTranslatedMultilineOriginCaption) {
          acc.push(unTranslatedMultilineOriginCaption);
        }
        return acc;
      }, [] as store.ICaptionsParagraph[]);

      const SagaActions = bindActionCreators(sagasActions, dispatch);
      unTranslatedMultilineOriginCaptions.forEach(caption => {
        SagaActions.createTranslatedMultilineByOriginMultiline(caption);
      });
    }
  }

  static exportRenderVideo(renderingLanguage: store.EditType, player: Player | null) {
    const rootState = store.default.getState();
    const rendering = rootState.present.projectCotrol.rendering;

    if (rendering) {
      IpcSender.sendDuplicateRendering();
      return;
    }

    const videoPath = rootState.present.project.videoPath;
    if (videoPath === undefined || videoPath === null) {
      logger.logDebug('video path is missing...');
      return;
    }

    let videoMeta = rootState.present.project.videoMeta;
    if (videoMeta === undefined && player?.isReady) {
      videoMeta = {
        width: player.width,
        height: player.height
      }
    }

    if (videoMeta === undefined) {
      videoMeta = {
        width: 1920,
        height: 1080
      }
    }

    const renderCpations = createRenderCaptions(renderingLanguage);

    const downcaptScript = utils.createDowncapScript({
      video: { meta: videoMeta },
      exportLanguage: renderingLanguage,
      captions: renderCpations
    });

    IpcSender.sendVideoRender({
      script: downcaptScript,
      origin: {
        path: videoPath
      }
    });

    function getVideoCaptions() {
      const projectDefaultStyle = rootState.present.project.projectDefaultStyle;

      const originStyle = rootState.present.originCaption.defaultStyle ?? projectDefaultStyle;
      const originCaption = rootState.present.originCaption.captions?.map(caption => {
        let line = { ...caption.lines.first() };
        line.style = ({
          ...originStyle,
          ...line.style
        });

        if (!line.style.background) {
          line.style.background = {
            b: 0,
            g: 0,
            r: 0,
            a: 1
          }
        }

        return {
          ...caption,
          lines: [line]
        };
      }) ?? [];

      const translatedStyle = rootState.present.translatedCaption.defaultStyle ?? projectDefaultStyle;
      const translatedCaption = TranslatedCaptionHelper.translatedParagraphToParagraph(rootState.present.translatedCaption.captions)?.map(caption => {
        let line = { ...caption.lines.first() };
        line.style = ({
          ...translatedStyle,
          ...line.style
        });

        if (!line.style.background) {
          line.style.background = {
            b: 0,
            g: 0,
            r: 0,
            a: 1
          }
        }

        return {
          ...caption,
          lines: [line]
        };
      }) ?? [];

      return {
        origin: originCaption,
        translated: translatedCaption
      };
    }

    function getMultilineCaptions() {
      const projectDefaultStyle = rootState.present.project.projectDefaultStyle;

      const multilineStyle = rootState.present.multiline.defaultStyle ?? projectDefaultStyle;
      const multiline = rootState.present.multiline.captions?.map(caption => {
        let line = { ...caption.lines.first() };
        line.style = ({
          ...multilineStyle,
          ...line.style
        });

        if (!line.style.background) {
          line.style.background = {
            b: 0,
            g: 0,
            r: 0,
            a: 1
          }
        }

        return {
          ...caption,
          lines: [line]
        };
      }) ?? [];

      const translatedMultilineStyle = rootState.present.translatedMultiline.defaultStyle ?? projectDefaultStyle;
      const translatedMultiline = rootState.present.translatedMultiline.captions?.map(caption => {
        let line = { ...caption.lines.first() };
        line.style = ({
          ...translatedMultilineStyle,
          ...line.style
        });

        if (!line.style.background) {
          line.style.background = {
            b: 0,
            g: 0,
            r: 0,
            a: 1
          }
        }

        return {
          ...caption,
          lines: [line]
        };
      }) ?? [];

      return {
        origin: multiline,
        translated: translatedMultiline
      };
    }

    function setDefaultLocation(captions: store.ICaptionsParagraph[], captionType: store.KineCaptionType) {
      return captions.map((caption) => {
        return {
          ...caption,
          vertical: (caption.vertical ?? rootState.present[captionType].defaultLocation?.vertical) ?? downcapOptions.defaultLocation.vertical,
          horizontal: (caption.horizontal ?? rootState.present[captionType].defaultLocation?.horizontal) ?? downcapOptions.defaultLocation.horizontal
        }
      })
    }

    function createRenderCaptions(renderingLanguage: store.EditType) {
      const videoCaptions = getVideoCaptions();
      const multilines = getMultilineCaptions();

      let captions: store.ICaptionsParagraph[] | store.IEventParagraph[] = [];
      switch (renderingLanguage) {
        case "origin":
          captions = [
            ...setDefaultLocation(videoCaptions.origin, "originCaption"),
            ...setDefaultLocation(multilines.origin, "multiline"),
          ].sort(ComparerHelper.compareParagraph);
          break;
        case "translated":
          captions = [
            ...setDefaultLocation(videoCaptions.translated, "translatedCaption"),
            ...setDefaultLocation(multilines.translated, "translatedMultiline")
          ].sort(ComparerHelper.compareParagraph);
          break;
        case "dual":
          const sequence = rootState.present.project.sequence;
          captions = [
            ...DualCaptionHelper.createDualCaptions(
              setDefaultLocation(videoCaptions[sequence[0]], `${sequence[0]}Caption`),
              setDefaultLocation(videoCaptions[sequence[1]], `${sequence[1]}Caption`)
            ),
            ...DualCaptionHelper.createDualMultiline(multilines.origin, multilines.translated, sequence)
          ].sort(ComparerHelper.compareEventParagraph);
          break;
        default:
          throw new Error('Rendering Language selection option not supported');
      }

      return captions;
    }
  }

  static async srtLoadAsync(path: string, store = ReactRedux.useStore<store.RootState>()) {
    try {
      const srtBin = await IpcSender.invokeReadFileAsync(path);
      const srt = SrtParser.parser(srtBin);
      ProjectManager.cancelStc();

      if (store.getState().present.project.videoPath === undefined) {
        const title = PathHelper.getFileNameWithoutExtension(path);
        await ProjectManager.clearAsync();
        title && ProjectManager.setProjectName(title);
      }

      const dispatch = store.dispatch;
      const OriginCaptionActions = bindActionCreators(originCaptionActions, dispatch);
      OriginCaptionActions.setCaptions(srt);
    } catch (err) {
      err instanceof Error && logger.logWarning(err);
      alert("자막 파일을 읽어오는데 실패 했습니다.")
      return;
    }
  }
}