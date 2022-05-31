import React from "react";
import * as ReactRedux from 'react-redux';
import { useState } from "react";
import { bindActionCreators } from "redux";

import storeV2, * as store from 'storeV2';
import * as projectActions from "storeV2/modules/project";

import * as windows from 'lib/windows'
import * as utils from 'lib/utils';
import ComparerHelper from 'lib/ComparerHelper';

import { IPopupProps } from "containers/PopupContainer";
import { YoutubeCaptionsUploadPopup } from "components/popup";

import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import PopupManager from 'managers/PopupManager';

import IpcChannels from 'IpcChannels';
import FontCheckHelper from "FontCheckHelper";
import DualCaptionHelper from "helpers/DualCaptionHelper";
import TranslatedCaptionHelper from "helpers/TranslatedCaptionHelper";
import ClientAnalysisService from "services/ClientAnalysisService";
import IpcSender from "lib/IpcSender";
import DowncapScript from "models/Format/Downcap/DowncapScript";
import { useTranslation } from "react-i18next";

const logger = ReactLoggerFactoryHelper.build('YoutubeCaptionsUploadPopupContainer');

export interface IYoutubeCaptionUploadModel {
  snippet: {
    videoId?: string | null;
    language: string;
    name: string;
  };
  data: DowncapScript;
}
export interface ICaptionUploadMeta {
  overwrite: boolean;
  cc: boolean;
}

function YoutubeCaptionsUploadPopupContainer(props: IPopupProps) {
  const path = ReactRedux.useSelector<
    store.RootState, string | undefined
  >(state => state.present.project.videoPath);

  const youTubeVideoId = ReactRedux.useSelector<
    store.RootState, string | undefined
  >(state => state.present.project.youtubeVideoId) ?? getVideoId(path);

  const { t } = useTranslation('YoutubeCaptionsUploadPopupContainer');
  const dispatch = ReactRedux.useDispatch();

  const [exportLanguage, setExportLanguage] = useState<string>('ko');
  const [overwrited, setOverwrite] = useState<boolean>(true);
  const [closedCaption, setClosedCaption] = useState<boolean>(true);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadVideoId, setUploadVideoId] = useState<string | undefined>(youTubeVideoId ?? '');
  //TODO: 유튜브 자막값을 이용해서 가져와야 합니다. // 나중에 써야돼요 지우면 안돼요 
  const [captionLanguage] = useState<string>('ko');

  const videoIdParser = (value: string) => {
    const videoUrlArr = value.match("(.*)watch(.*)") ? value.split('v=') : value.split('/');
    return videoUrlArr[videoUrlArr.length - 1];
  }

  const setYoutubeVideoId = (value: string) => {
    const videoId = videoIdParser(value);
    const ProjectActions = bindActionCreators(projectActions, dispatch);
    ProjectActions.setYoutubeVideoId(videoId);
  }

  const handleExportLanguage = (value: string) => setExportLanguage(value);
  const handleOverwrite = (value: boolean) => setOverwrite(value);
  const handleClosedCaption = (value: boolean) => setClosedCaption(value);
  const youtubeInvalidFontCheck = (font: string | number) => !FontCheckHelper.isValidYouTubeFont(font);

  const handleOk = async () => {
    const options = exportLanguage.split('-');

    let invalidCaptions: store.IFocusLineMeta[] = [];
    switch (exportLanguage) {
      case 'ko':
        invalidCaptions = FontCheckHelper.originCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2);
        break;
      case 'en':
        invalidCaptions = FontCheckHelper.translatedCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2);
        break;
      default:
        invalidCaptions = [
          ...FontCheckHelper.originCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2),
          ...FontCheckHelper.translatedCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2)
        ];
        break;
    }

    if (invalidCaptions.any()) {
      PopupManager.openFontCheckPopup({ invalidFont: t('handleOk_invaildFont'), invalidCaptions: [...invalidCaptions] }, dispatch);
      return;
    }

    youtubeCaptionUpload(
      options,
      getYoutubeCaptionsByLanguage(options)
    );
  }

  const getVideoCaptions = () => {
    const state = store.default.getState();
    const projectDefaultStyle = state.present.project.projectDefaultStyle;

    const originStyle = state.present.originCaption.defaultStyle ?? projectDefaultStyle;
    const defaultLocation = state.present.originCaption.defaultLocation;
    const originCaption = state.present.originCaption.captions?.map(caption => {
      let line = { ...caption.lines.first() };
      line.style = ({
        ...originStyle,
        ...line.style
      });
      
      return {        
        ...defaultLocation,
        ...caption,
        lines: [line]
      };
    }) ?? [];

    const translatedStyle = state.present.translatedCaption.defaultStyle ?? projectDefaultStyle;
    const translatedCaption = TranslatedCaptionHelper.translatedParagraphToParagraph(state.present.translatedCaption.captions)?.map(caption => {
      let line = { ...caption.lines.first() };
      line.style = ({
        ...translatedStyle,
        ...line.style
      });

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

  const getMultilineCaptions = () => {
    const state = store.default.getState();
    const projectDefaultStyle = state.present.project.projectDefaultStyle;

    const multilineStyle = state.present.multiline.defaultStyle ?? projectDefaultStyle;
    const multiline = state.present.multiline.captions?.map(caption => {
      let line = { ...caption.lines.first() };
      line.style = ({
        ...multilineStyle,
        ...line.style
      });

      return {
        ...caption,
        lines: [line]
      };
    }) ?? [];

    const translatedMultilineStyle = state.present.translatedMultiline.defaultStyle ?? projectDefaultStyle;
    const translatedMultiline = state.present.translatedMultiline.captions?.map(caption => {
      let line = { ...caption.lines.first() };
      line.style = ({
        ...translatedMultilineStyle,
        ...line.style
      });

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

  const getYoutubeCaptionsByLanguage = (options: string[]) => {
    const videoCaptions = getVideoCaptions();
    const multilines = getMultilineCaptions();

    let captions: store.ICaptionsParagraph[] | store.IEventParagraph[] = [];
    switch (options.length) {
      case 1:
        if (options[0] === 'ko') {
          captions = [
            ...videoCaptions.origin,
            ...multilines.origin
          ].sort(ComparerHelper.compareParagraph);
        } else {
          captions = [
            ...videoCaptions.translated,
            ...multilines.translated
          ].sort(ComparerHelper.compareParagraph);
        }
        break;
      case 3:
        if (options[1] === 'ko') {
          captions = [
            ...DualCaptionHelper.createDualCaptions(videoCaptions.origin, videoCaptions.translated),
            ...DualCaptionHelper.createDualMultiline(multilines.origin, multilines.translated, ['origin', 'translated'])
          ].sort(ComparerHelper.compareEventParagraph);
        } else {
          captions = [
            ...DualCaptionHelper.createDualCaptions(videoCaptions.translated, videoCaptions.origin),
            ...DualCaptionHelper.createDualMultiline(multilines.origin, multilines.translated, ['translated', 'origin'])
          ].sort(ComparerHelper.compareEventParagraph);
        }
        break;
      default:
        break;
    }

    return captions;
  }

  const youtubeCaptionUpload = (
    options: string[],
    captions: store.ICaptionsParagraph[] | store.IEventParagraph[]
  ) => {
    if (!uploadVideoId) {
      logger.variableIsUndefined('uploadVideoId', 'youtubeCaptionUpload')
      return;
    }

    let videoId: string;
    if (uploadVideoId.match('(.*)youtu.be(.*)')) {
      const paths = uploadVideoId.split('/');
      videoId = paths[paths.length - 1].split("?")[0];
    }
    else if (uploadVideoId.match("(.*)watch(.*)")) {
      videoId = uploadVideoId.split("?")[1].split('&').reduce<{ [key: string]: string }>(
        (acc, current) => {
          let query = current.split('=', 2);
          acc[query[0]] = query[1];
          return acc;
        }, {}
      )['v']
    }
    else if (uploadVideoId.match("(.*)studio.youtube.com(.*)")) {
      let url: URL;
      try {
        url = new URL(uploadVideoId);
      } catch {
        try {
          url = new URL(`https://${uploadVideoId}`);
        } catch {
          //TODO: 유저 피드백 필요
          logger.logWarning('invaild url ' + uploadVideoId);
          return;
        }
      }

      videoId = url.pathname.split('/')[2];
    }
    else {
      videoId = uploadVideoId
    }

    if (videoId === undefined) {
      //TODO: 유저 피드백 필요
      logger.logWarning('invaild videoId');
      return;
    }

    setYoutubeVideoId(videoId);

    let snippet = {
      "videoId": videoId,
      "language": exportLanguage,
      "name": ""
    };

    if (captions.length === 0) {
      logger.logError('The caption does not exist.');
      return;
    }

    const changeLanguageName = (options: string[]) => {
      switch (options.length) {
        case 1:
          return options[0] === 'ko' ? 'origin' : 'translated';
        default:
          return 'dual';
      }
    }

    const exportLanguageCaptionLn = changeLanguageName(options);

    ClientAnalysisService.captionUploadAcceptClick({
      captionType: exportLanguageCaptionLn,
      language: (exportLanguage.split('-', 2)[0]) as 'ko' | 'en',
      overwrite: overwrited
    });


    IpcSender.sendYoutubeCaptionUpload(
      {
        snippet,
        data: utils.createDowncapScript({
          captions,
          exportLanguage: exportLanguageCaptionLn,
          video: null,          
        },)
      },
      {
        overwrite: overwrited,
        cc: closedCaption
      }
    );
  }

  const CaptionUploadListener = (_event: any, domain: string) => {
    switch (domain) {
      case 'success':
        setIsUploading(false);
        PopupManager.close(dispatch);
        PopupManager.openYoutubeCaptionUploadSuccessPopup(dispatch);
        break;
      case 'proceeding':
        setIsUploading(true);
        break;
      case 'error':
      default:
        setIsUploading(false);
        break;
    }
  }

  function onCloseClick() {
    PopupManager.close(dispatch)
  };

  const listeners = [
    { channel: IpcChannels.listenYoutubeCaptionUpload, action: CaptionUploadListener }
  ];

  React.useEffect(() => {
    const ipcSender = new IpcSender();
    listeners.forEach(item => {
      ipcSender.on(item.channel, item.action);
    })

    return () => {
      listeners.forEach(item => {
        ipcSender.removeAllListeners(item.channel);
      })
    };
  })

  const originCaption = ReactRedux.useSelector<
    store.RootState, store.ICaptionsParagraph[] | undefined
  >(state => state.present.originCaption.captions);

  const translatedCaption = ReactRedux.useSelector<
    store.RootState, store.ICaptionTranslatedParagraphWithId[] | undefined
  >(state => state.present.translatedCaption.captions);

  const multiLine = ReactRedux.useSelector<
    store.RootState, store.ICaptionsParagraph[] | undefined
  >(state => state.present.multiline.captions);

  const translatedMultiline = ReactRedux.useSelector<
    store.RootState, store.ITranslatedMultilineCaption[] | undefined
  >(state => state.present.translatedMultiline.captions);

  const anyOrigin = originCaption?.any() || multiLine?.any();
  const anyTranslated = translatedCaption?.any() || translatedMultiline?.any();

  return (
    <YoutubeCaptionsUploadPopup
      exportLanguage={exportLanguage}
      koDisabled={!anyOrigin}
      enDisabled={!anyTranslated}
      captionLanguage={captionLanguage}
      overwrited={overwrited}
      closedCaption={closedCaption}
      videoId={uploadVideoId}
      isUploading={isUploading}
      onCloseClick={onCloseClick}
      onExportLanguageChange={handleExportLanguage}
      onOkClick={handleOk}
      onOverwriteChange={handleOverwrite}
      onVideoIdChange={evt => setUploadVideoId(evt.target.value)}
      onClosedCaption={handleClosedCaption}
    />
  );
}

function getVideoId(path: string | undefined) {
  if (!path) {
    return;
  }

  try {
    const url = new URL(path);
    if (url.protocol !== 'https:') {
      return;
    }
    const paths = url.pathname.split('/');
    return paths[paths.length - 1];
  } catch (err) {
    return;
  }
}

export default YoutubeCaptionsUploadPopupContainer;