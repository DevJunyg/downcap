import './YoutubeVideoUploadSuccessPopup.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-regular-svg-icons';
import { IPopupProps } from 'containers/PopupContainer';
import InfoPopup from 'components/common/PopUp/InfoPopup';
import { useTranslation } from 'react-i18next';

export default function YoutubeVideoUploadSuccessPopup(props: IPopupProps) {
  const { t } = useTranslation('YoutubeVideoUploadSuccessPopup');
  return (
    <InfoPopup
      title={t('title')}
      onCloseClick={props.onCloseClick}
      onConfirmClick={props.onCloseClick}
      confirmContent={t('confirmContent')}
    >
      <div className='upload-success-contents center'>
        <div className='upload-success-message'>
          <FontAwesomeIcon icon={faCheckCircle} size={'lg'} color={'#7d1ed8'} />
          <label>{t('uploadSuccessMessage')}</label>
        </div>
        <div className='video-upload-added-info'>
          <img
            src="https://downcap.net/client/img/youtube_studio_error_img.png"
            alt="youtubeStudioErrorImg"
          />
          <div className='added-info-message'>
            <label>{t('uploadSuccessMessage_Info')}</label>
          </div>
        </div>
      </div>
    </InfoPopup>
  );
}