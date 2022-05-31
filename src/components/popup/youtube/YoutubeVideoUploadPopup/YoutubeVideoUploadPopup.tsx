import React from 'react';
import './YoutubeVideoUploadPopup.scss';
import CycleSpin from 'components/common/CycleSpin';
import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import { ICaptionsUploadDisabledOption, ICaptionsUploadOption, IErrors } from 'containers/popup/YoutubeVideoUploadPopupContainer';
import YoutubeVideoUploadPopupCaptionsContents from './YoutubeVideoUploadPopupCaptionsContents';
import YoutubeVideoUploadPopupVideoPathContents from './YoutubeVideoUploadPopupVideoPathContents';
import YoutubeVideoUploadPopupVideoTitleContents from './YoutubeVideoUploadPopupVideoTitleContents';
import YoutubeVideoUploadPopupDescriptionContents from './YoutubeVideoUploadPopupDescriptionContents';
import YoutubeVideoUploadPopupTagsContents from './YoutubeVideoUploadPopupTagsContents';
import YoutubeVideoUploadPopupKidLanguageContents from './YoutubeVideoUploadPopupKidLanguageContents';
import YoutubeVideoUploadPopupLicenseContents from './YoutubeVideoUploadPopupLicenseContents';
import YoutubeVideoUploadPopupCategoryContents from './YoutubeVideoUploadPopupCategoryContents';
import YoutubeVideoUploadPopupEmbeddableContents from './YoutubeVideoUploadPopupEmbeddableContents';
import YoutubeVideoUploadPopupPrivacyContents from './YoutubeVideoUploadPopupPrivacyContents';
import { useTranslation } from 'react-i18next';

interface IYoutubeVideoUploadPopupProps {
  videoFileName: string;
  videoTitle: string;
  videoDescription?: string;
  videoTags?: string;
  videoPrivacyStatus: string;
  videoEmbeddable: string;
  embeddableMessage?: string | JSX.Element;
  errors: IErrors;
  captionsUpload: ICaptionsUploadOption;
  isUploading: boolean;
  captionsUploadDisabledOption: ICaptionsUploadDisabledOption;
  onVideoTitle: (value: string) => void;
  onVideoDescription: (value: string) => void;
  onVideoTags: (value: string) => void;
  onVideoDefaultLanguage: (value: string) => void;
  onVideoLicense: (value: string) => void;
  onVideoCategoryId: (value: string) => void;
  onVideoPrivacyStatus: (value: string) => void;
  onVideoEmbeddable: (value: string) => void;
  onSelfDeclaredMadeForKid: (value: string) => void;
  onCaptionsUploadOptionChange: (value: string, checked: boolean) => void;
  onOkClick: () => void;
  onCloseClick?: React.MouseEventHandler<Element>;
}

export default function YoutubeVideoUploadPopup(props: IYoutubeVideoUploadPopupProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopup');
  return (
    <AcceptCancelPopup
      title={t('title')}
      closeContent={t('closeContent')}
      acceptContent={props.isUploading ? <CycleSpin fontSize={"1.5rem"} /> : t('acceptContent')}
      onCancelClick={props.onCloseClick}
      onAcceptClick={props.onOkClick}
    >
      <div className="youtube-video-upload-contents">
        <YoutubeVideoUploadPopupVideoPathContents
          videoFileName={props.videoFileName}
        />
        <YoutubeVideoUploadPopupVideoTitleContents
          errors={props.errors}
          videoTitle={props.videoTitle}
          onVideoTitle={props.onVideoTitle}
        />
        <YoutubeVideoUploadPopupDescriptionContents
          errors={props.errors}
          videoDescription={props.videoDescription}
          onVideoDescription={props.onVideoDescription}
        />
        <YoutubeVideoUploadPopupTagsContents
          errors={props.errors}
          videoTags={props.videoTags}
          onVideoTags={props.onVideoTags}
        />
        <YoutubeVideoUploadPopupKidLanguageContents
          onSelfDeclaredMadeForKid={props.onSelfDeclaredMadeForKid}
          onVideoDefaultLanguage={props.onVideoDefaultLanguage}
        />
        <YoutubeVideoUploadPopupLicenseContents
          onVideoLicense={props.onVideoLicense}
        />
        <YoutubeVideoUploadPopupCategoryContents
          onVideoCategoryId={props.onVideoCategoryId}
        />
        <YoutubeVideoUploadPopupCaptionsContents
          captionsUpload={props.captionsUpload}
          captionsUploadDisabledOption={props.captionsUploadDisabledOption}
          onCaptionsUploadOptionChange={props.onCaptionsUploadOptionChange}
        />
        <YoutubeVideoUploadPopupEmbeddableContents
          videoEmbeddable={props.videoEmbeddable}
          embeddableMessage={props.embeddableMessage}
          onVideoEmbeddable={props.onVideoEmbeddable}
        />
        <YoutubeVideoUploadPopupPrivacyContents
          videoPrivacyStatus={props.videoPrivacyStatus}
          onVideoPrivacyStatus={props.onVideoPrivacyStatus}
        />
      </div>
    </AcceptCancelPopup>
  );
}