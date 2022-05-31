import './YoutubeCaptionUploadSuccessPopup.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle } from '@fortawesome/pro-regular-svg-icons';
import { IPopupProps } from 'containers/PopupContainer';
import InfoPopup from 'components/common/PopUp/InfoPopup';
import { useTranslation } from 'react-i18next';

export default function YoutubeCaptionUploadSuccessPopup(props: IPopupProps) {
  const { t } = useTranslation('YoutubeCaptionUploadSuccessPopup');
  return (
    <InfoPopup
      title={t('title')}
      onConfirmClick={props.onCloseClick}
      onCloseClick={props.onCloseClick}
      confirmContent={t('confirmContent')}
    >
      <div className='upload-success-contents center'>
        <div className='upload-success-message'>
          <FontAwesomeIcon icon={faCheckCircle} size={'lg'} color={'#7d1ed8'} />
          <label>{t('uploadSuccessMessage')}</label>
        </div>
        <div className='added-info-message caption-info'>
          <label>{t('uploadSuccessMessage_Info')}</label>
        </div>
      </div>
    </InfoPopup>
  );
}