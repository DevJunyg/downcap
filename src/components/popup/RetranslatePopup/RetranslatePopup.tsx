import React from 'react';
import './RetranslatePopup.scss';
import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import ImgUrls from 'ImgUrls';
import { IPopupProps } from 'containers/PopupContainer';
import { useTranslation } from 'react-i18next';

interface IRetranslationPopupProps extends IPopupProps {
  onAcceptClick?: React.MouseEventHandler;
  paymentLetter?: number;
}

function RetranslatePopup(props: IRetranslationPopupProps) {
  const { t } = useTranslation('RetranslatePopup');
  return (
    <AcceptCancelPopup
      acceptContent={t('acceptContent')}
      title={t('title')}
      closeContent={t('closeContent')}
      onCancelClick={props.onCloseClick}
      onCloseClick={props.onCloseClick}
      onAcceptClick={props.onAcceptClick}
    >
      <div className="retranslate-contents center">
        <div className="retranslate-popup-title-box">
          <img src={ImgUrls.letter} className="retranslate-popup-title-img" alt='letter' />
          <div className="retranslate-popup-title">
            <label>{t('retranslation_About')}</label>
            <label style={{ color: '#29abe2' }}>{props.paymentLetter} </label>
            <label>{t('aboutLetter')}</label>
          </div>
          <div className="retranslate-popup-title">
            <label>{t('usingLetter')}</label>
          </div>
        </div>
        <div className="retranslate-popup-message-box">
          <div className="retranslate-popup-message">
            <label>{t('translation_Notice')}</label>
          </div>
          <div className="retranslate-popup-message">
            <label>{t('translation_Edit_Notice')}</label>
          </div>
        </div>
      </div>
    </AcceptCancelPopup>
  );
}

export default RetranslatePopup;