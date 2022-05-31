import React, { useState } from 'react';
import * as ReactRedux from 'react-redux';
import storeV2, * as downcapStore from 'storeV2';
import PathHelper from 'PathHelper';
import * as utils from 'lib/utils';
import IpcSender from 'lib/IpcSender';
import IpcChannels from 'IpcChannels';
import FontCheckHelper from 'FontCheckHelper';
import { IPopupProps } from "containers/PopupContainer";
import ClientAnalysisService from 'services/ClientAnalysisService';
import PopupManager, { IYoutubeVideoUploadPopupPayload } from 'managers/PopupManager';
import YoutubeVideoUploadPopup from 'components/popup/youtube/YoutubeVideoUploadPopup';
import ComparerHelper from 'lib/ComparerHelper';
import TranslatedCaptionHelper from 'helpers/TranslatedCaptionHelper';
import DowncapScript from 'models/Format/Downcap/DowncapScript';
import { useTranslation } from 'react-i18next';

export interface IErrors {
  titleNull: boolean;
  titleExceed: boolean;
  titleAngleBrackets: boolean;
  tagIsTooLong: boolean;
  tagsExceed: boolean;
  tagAngleBrackets: boolean;
  descriptionExceed: boolean;
  descriptionAngleBrackets: boolean;
}

export interface ICaptionsUploadOption {
  none: boolean;
  origin: boolean;
  translated: boolean;
}

export interface ICaptionsUploadDisabledOption {
  originDisabled: boolean;
  translatedDisabled: boolean;
}

export interface IYoutubeVideoUploadModel {
  meta: {
    snippet: {
      title: string;
      description: string;
      tags: string[];
      categoryId: string;
      defaultLanguage: string;
    };
    status: {
      license: string;
      privacyStatus: string;
      selfDeclaredMadeForKids: string;
      embeddable: string;
    };
  };
  path: string;
}

export interface IUploadCaptions {
  origin?: {
    snippet: {
      videoId?: string | null;
      language: string;
      name: string;
    };
    data: DowncapScript;
  };
  translated?: {
    snippet: {
      videoId: null;
      language: string;
      name: string;
    };
    data: DowncapScript;
  };
}

function YoutubeVideoUploadPopupContainer(props: IPopupProps) {
  const dispatch = ReactRedux.useDispatch();

  const filePath = ReactRedux.useSelector<
    downcapStore.RootState, IYoutubeVideoUploadPopupPayload
  >(state => state.present.popup.payload as IYoutubeVideoUploadPopupPayload)?.filePath;

  const originCaptionExist = ReactRedux.useSelector<
    downcapStore.RootState, boolean
  >(state => !state.present.originCaption.captions?.any());

  const multilineExist = ReactRedux.useSelector<
    downcapStore.RootState, boolean
  >(state => !state.present.multiline.captions?.any());

  const originDisabled = originCaptionExist && multilineExist;

  const translatedCaptionExist = ReactRedux.useSelector<
    downcapStore.RootState, boolean
  >(state => !state.present.translatedCaption.captions?.any());

  const translatedMultilineExist = ReactRedux.useSelector<
    downcapStore.RootState, boolean
  >(state => !state.present.translatedMultiline.captions?.any());

  const translatedDisabled = translatedCaptionExist && translatedMultilineExist;

  const captionsUploadDisabledOption: ICaptionsUploadDisabledOption = {
    originDisabled,
    translatedDisabled
  };

  const [videoDefaultLanguage, setVideoDefaultLanguage] = useState<string>('ko');
  const [videoLicense, setVideoLicense] = useState<string>('youtube');
  const [videoCategoryId, setVideoCategoryId] = useState<string>('0');
  const [videoPrivacyStatus, setVideoPrivacyStatus] = useState<string>('unlisted');
  const [videoEmbeddable, setVideoEmbeddable] = useState<string>('true');
  const [embeddableMessage, setEmbeddableMessage] = useState<string | JSX.Element>();
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [videoFileName, setVideoFileName] = useState<string>('');
  const [videoDescription, setVideoDescription] = useState<string>('');
  const [videoTags, setVideoTags] = useState<string>('');
  const [videoTitle, setVideoTitle] = useState<string>('');
  const [selfDeclaredMadeForKid, setSelfDeclaredMadeForKid] = useState<string>('false');
  const [errors, setErrors] = useState<IErrors>({
    titleNull: false,
    titleExceed: false,
    titleAngleBrackets: false,
    tagIsTooLong: false,
    tagsExceed: false,
    tagAngleBrackets: false,
    descriptionExceed: false,
    descriptionAngleBrackets: false
  });
  const [captionsUpload, setCaptionsUpload] = useState<ICaptionsUploadOption>({
    none: true,
    origin: false,
    translated: false
  });
  const { t } = useTranslation('YoutubeVideoUploadPopupContainer');

  const handlevideoTitle = (value: string) => {
    setErrors({
      ...errors,
      titleNull: false,
      titleExceed: (value.length > 100),
      titleAngleBrackets: (/[<>]/g.test(value))
    });
    setVideoTitle(value);
  };
  const handlevideoDescription = (value: string) => {
    setErrors({
      ...errors,
      descriptionExceed: (value.length > 5000),
      descriptionAngleBrackets: (/[<>]/g.test(value))
    });
    setVideoDescription(value);
  };
  const handlevideoTags = (value: string) => {
    let tagsLength = 0;
    let tagMaxLength = 0;

    value.split(',').forEach(tag => {
      const tagLength = tag.replace(/(^\s+|\s+$)/gm, '').length;
      if (tagMaxLength < tagLength) { tagMaxLength = tagLength }
      tagsLength += tagLength;
    });
    setErrors({
      ...errors,
      tagIsTooLong: (tagMaxLength > 100),
      tagsExceed: (tagsLength > 500),
      tagAngleBrackets: (/[<>]/g.test(value))
    });
    setVideoTags(value);
  };

  const handlevideoEmbeddable = (value: string) => {
    const embeddableMessageElement = value === 'true' ? '' : (
      <>
        {t('embeddableMessage')}
      </>
    );
    setEmbeddableMessage(embeddableMessageElement);
    setVideoEmbeddable(value);
  };
  const handlevideoLicense = (value: string) => setVideoLicense(value);
  const handlevideoCategoryId = (value: string) => setVideoCategoryId(value);
  const handlevideoPrivacyStatus = (value: string) => setVideoPrivacyStatus(value);
  const handlevideoDefaultLanguage = (value: string) => setVideoDefaultLanguage(value);
  const handleselfDeclaredMadeForKid = (value: string) => setSelfDeclaredMadeForKid(value);
  const handleCaptionsUploadOptionChange = (value: string, checked: boolean) => {
    switch (value) {
      case 'none':
        setCaptionsUpload({
          ...captionsUpload,
          none: checked,
          origin: false,
          translated: false
        });
        break;
      case 'origin':
        setCaptionsUpload({
          ...captionsUpload,
          none: false,
          origin: checked
        });
        break;
      case 'translated':
        setCaptionsUpload({
          ...captionsUpload,
          none: false,
          translated: checked
        });
        break;
      default:
        break;
    }
  }

  const handleOk = () => {
    ClientAnalysisService.videoUploadAcceptClick();

    if (videoTitle === '' || !videoTitle) {
      setErrors({
        ...errors,
        titleNull: true
      });
      return;
    }

    const invalidCaptions = invalidFontCheck(captionsUpload);

    if (invalidCaptions.any()) {
      PopupManager.openFontCheckPopup({ invalidFont: t('handleOk_invaildFont'), invalidCaptions: [...invalidCaptions] }, dispatch);
      return;
    }

    let uploadCaptionData: IUploadCaptions = {
      origin: undefined,
      translated: undefined
    };

    if (captionsUpload.origin || captionsUpload.translated) {
      uploadCaptionData = getUploadCaptionData(captionsUpload, storeV2);
    }

    const tags = videoTags?.split(',');
    const model: IYoutubeVideoUploadModel = {
      'meta': {
        'snippet': {
          'title': videoTitle,
          'description': videoDescription,
          'tags': tags,
          'categoryId': videoCategoryId,
          'defaultLanguage': videoDefaultLanguage
        },
        'status': {
          'license': videoLicense,
          'privacyStatus': videoPrivacyStatus,
          'selfDeclaredMadeForKids': selfDeclaredMadeForKid,
          'embeddable': videoEmbeddable
        }
      },
      'path': filePath
    };

    IpcSender.sendYoutubeVideoUpload(model, uploadCaptionData);
  };

  const VideoUploadListener = (_event: any, domain: string) => {
    switch (domain) {
      case 'success':
        setIsUploading(false);
        PopupManager.close(dispatch);
        PopupManager.openYoutubVideoUploadSuccessPopup(dispatch);
        break;
      case 'proceeding':
        setIsUploading(true);
        break;
      case 'error':
      default:
        setIsUploading(false);
        break;
    }
  };

  const listeners = [
    { channel: IpcChannels.listenVideoUpload, action: VideoUploadListener }
  ];

  React.useEffect(() => {
    const ipcSender = new IpcSender();
    listeners.forEach(item => {
      ipcSender.on(item.channel, item.action);
    });

    const fileName = filePath === undefined ? '' : (PathHelper.getFileName(filePath) ?? '');
    setVideoFileName(fileName);

    return () => {
      listeners.forEach(item => {
        ipcSender.removeAllListeners(item.channel);
      })
    };
  });

  return (
    <YoutubeVideoUploadPopup
      videoFileName={videoFileName}
      videoTitle={videoTitle}
      videoDescription={videoDescription}
      videoTags={videoTags}
      videoEmbeddable={videoEmbeddable}
      embeddableMessage={embeddableMessage}
      videoPrivacyStatus={videoPrivacyStatus}
      errors={errors}
      isUploading={isUploading}
      captionsUpload={captionsUpload}
      captionsUploadDisabledOption={captionsUploadDisabledOption}
      onCloseClick={props.onCloseClick}
      onOkClick={handleOk}
      onVideoTitle={handlevideoTitle}
      onVideoDescription={handlevideoDescription}
      onVideoTags={handlevideoTags}
      onVideoDefaultLanguage={handlevideoDefaultLanguage}
      onVideoLicense={handlevideoLicense}
      onVideoCategoryId={handlevideoCategoryId}
      onVideoPrivacyStatus={handlevideoPrivacyStatus}
      onVideoEmbeddable={handlevideoEmbeddable}
      onSelfDeclaredMadeForKid={handleselfDeclaredMadeForKid}
      onCaptionsUploadOptionChange={handleCaptionsUploadOptionChange}
    />
  );
}

function invalidFontCheck(captionsUpload: ICaptionsUploadOption) {
  let invalidCaptions: downcapStore.IFocusLineMeta[] = [];

  const youtubeInvalidFontCheck = (font: string | number) => !FontCheckHelper.isValidYouTubeFont(font);

  if (captionsUpload.origin && captionsUpload.translated) {
    invalidCaptions = [
      ...FontCheckHelper.originCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2),
      ...FontCheckHelper.translatedCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2)
    ];
  } else if (captionsUpload.origin) {
    invalidCaptions = FontCheckHelper.originCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2);
  } else if (captionsUpload.translated) {
    invalidCaptions = FontCheckHelper.translatedCaptionsFontCheckActions(youtubeInvalidFontCheck, storeV2);
  }

  return invalidCaptions;
}

function getUploadCaptionData(captionsUpload: ICaptionsUploadOption, store: typeof storeV2) {
  return {
    origin: captionsUpload.origin ? getOriginCaptions(store) : undefined,
    translated: captionsUpload.translated ? getTranslatedCaptions(store) : undefined
  };
}

function getOriginCaptions(store: typeof storeV2) {
  const state = store.getState().present;
  const projectDefaultStyle = state.project.projectDefaultStyle;

  const originCaption = state.originCaption.captions?.map(caption => {
    let line = { ...caption.lines.first() };
    line.style = ({
      ...state.originCaption.defaultStyle ?? projectDefaultStyle,
      ...line.style
    });

    return {
      ...caption,
      lines: [line]
    };
  }) ?? [];

  const multiline = state.multiline.captions?.map(caption => {
    let line = { ...caption.lines.first() };
    line.style = ({
      ...state.multiline.defaultStyle ?? projectDefaultStyle,
      ...line.style
    });

    return {
      ...caption,
      lines: [line]
    };
  }) ?? [];

  const uploadCaption = ([
    ...originCaption,
    ...multiline
  ].sort(ComparerHelper.compareParagraph));

  return createUploadCaption('origin', uploadCaption);
}

function getTranslatedCaptions(store: typeof storeV2) {
  const state = store.getState().present;
  const projectDefaultStyle = state.project.projectDefaultStyle;

  const translatedCaption = TranslatedCaptionHelper.translatedParagraphToParagraph(state.translatedCaption.captions)?.map(caption => {
    let line = { ...caption.lines.first() };
    line.style = ({
      ...state.translatedCaption.defaultStyle ?? projectDefaultStyle,
      ...line.style
    });

    return {
      ...caption,
      lines: [line]
    };
  }) ?? [];

  const translatedMultiline = state.translatedMultiline.captions?.map(caption => {
    let line = { ...caption.lines.first() };
    line.style = ({
      ...state.translatedMultiline.defaultStyle ?? projectDefaultStyle,
      ...line.style
    });

    return {
      ...caption,
      lines: [line]
    };
  }) ?? [];

  const uploadCaption = ([
    ...translatedCaption,
    ...translatedMultiline
  ].sort(ComparerHelper.compareParagraph));

  return createUploadCaption('translated', uploadCaption);
}

function createUploadCaption(uploadLanguage: 'origin' | 'translated', uploadCaption: downcapStore.ICaptionsParagraph[]) {
  const snippet = {
    "videoId": null,
    "language": uploadLanguage === 'origin' ? 'ko' : 'en',
    "name": ""
  };

  return {
    snippet,
    data: utils.createDowncapScript({
      captions: uploadCaption,
      exportLanguage: uploadLanguage,
      video: null
    })
  };
}

export default YoutubeVideoUploadPopupContainer;