import React from 'react';
import './YoutubeCaptionsUploadPopup.scss'
import CycleSpin from 'components/common/CycleSpin';
import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import YoutubeCaptionsUploadPopupSelectBox from './YoutubeCaptionsUploadPopupSelectBox';
import YoutubeCaptionsUploadPopupSelectUploadOptionFile from './YoutubeCaptionsUploadPopupSelectUploadOptionFile';
import YoutubeCaptionsUploadPopupSelectUploadOptionContentTitle from './YoutubeCaptionsUploadPopupSelectUploadOptionContentTitle';
import YoutubeCaptionsUploadPopupVideoId from './YoutubeCaptionsUploadPopupVideoId';
import { useTranslation } from 'react-i18next';

interface IYoutubeCaptionsUploadPopupProps {
  exportLanguage: string;
  overwrited: boolean;
  videoId?: string;
  captionLanguage: string;
  koDisabled: boolean;
  enDisabled: boolean;
  closedCaption: boolean;
  isUploading: boolean;
  onCloseClick?: React.MouseEventHandler;
  onVideoIdChange: React.ChangeEventHandler<HTMLInputElement>;
  onExportLanguageChange: (value: string) => void;
  onOverwriteChange: (value: boolean) => void;
  onClosedCaption: (value: boolean) => void;
  onOkClick: React.MouseEventHandler;
}

export default function YoutubeCaptionsUploadPopup(props: IYoutubeCaptionsUploadPopupProps) {
  const {t} = useTranslation('YoutubeCaptionsUploadPopup');

  return (
    <AcceptCancelPopup
      title={t('title')}
      onCancelClick={props.onCloseClick}
      onAcceptClick={props.onOkClick}
      closeContent={t('closeContent')}
      acceptContent={props.isUploading ? <CycleSpin fontSize={"1.5rem"} /> : t('acceptContent')}
      closePressedOutside={true}
    >
      <div className="youtube-captions-upload-contents">
        <YoutubeCaptionsUploadPopupSelectBox
          exportLanguage={props.exportLanguage}
          koDisabled={props.koDisabled}
          enDisabled={props.enDisabled}
          captionLanguage={props.captionLanguage}
          onExportLanguageChange={props.onExportLanguageChange}
        />
        <YoutubeCaptionsUploadPopupSelectUploadOptionFile
          overwrited={props.overwrited}
          onOverwriteChange={props.onOverwriteChange}
        />
        <YoutubeCaptionsUploadPopupSelectUploadOptionContentTitle
          closedCaption={props.closedCaption}
          onClosedCaption={props.onClosedCaption}
        />
        <YoutubeCaptionsUploadPopupVideoId
          videoId={props.videoId}
          onVideoIdChange={props.onVideoIdChange}
        />
      </div>
    </AcceptCancelPopup>
  );
}
