import React from 'react';
import './TranslationPopup.scss'
import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import { useTranslation } from 'react-i18next';

interface ITranslationPopupProps {
  paymentLetter?: number;
  onCloseClick?: React.MouseEventHandler;
  onAcceptClick?: React.MouseEventHandler;
}

function TranslationPopup(props: ITranslationPopupProps) {
  const { t } = useTranslation('TranslationPopup');
  return (
    <AcceptCancelPopup closePressedOutside
      acceptContent={t('acceptContent')}
      title={t('title')}
      closeContent={t('closeContent')}
      data-testid-cancel="test-id-translation-popup-cancel"
      data-testid-accept="test-id-translation-popup-accept"
      onCancelClick={props.onCloseClick}
      onCloseClick={props.onCloseClick}
      onAcceptClick={props.onAcceptClick}
    >
      <div className="translation-contents center">
        <div className="translation-popup-title-box">
          <img src='https://downcap.net/client/img/letter.png' className="translation-popup-title-img" alt='letter' />
          <div className="translation-popup-title">
            <label>{t('full_Translate_About')} </label>
            <label style={{ color: '#29abe2' }}>{props.paymentLetter} </label>
            <label> {t('aboutLetter')}</label>
          </div>
          <div className="translation-popup-title">
            <label>{t('usingLetter')}</label>
          </div>
        </div>
        <div className="translation-popup-message-box">
          <div className="translation-popup-message">
            <label>{t('translation_Notice')}</label>
          </div>
          <div className="translation-popup-message">
            <label>{t('translation_Edit_Notice')}</label>
          </div>
        </div>
      </div>
    </AcceptCancelPopup>
  );
}

export default TranslationPopup;