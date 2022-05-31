import React from 'react';
import './ApplyAllStylesWarningPopup.scss'
import AcceptCancelPopup from "../../common/PopUp/AcceptCancelPopup";
import { useTranslation } from 'react-i18next';

interface ICaptionStyleApplyPopupProperties {
  onCloseClick?: React.MouseEventHandler;
  onAcceptClick: React.MouseEventHandler;
}

function ApplyAllStylesWarningPopup(props: ICaptionStyleApplyPopupProperties) {
  const { t } = useTranslation('ApplyAllStylesWarningPopup');
  return (
    <AcceptCancelPopup
      title={t('title')}
      closeContent={t('closeContent')}
      acceptContent={t('acceptContent')}
      onCancelClick={props.onCloseClick}
      onCloseClick={props.onCloseClick}
      onAcceptClick={props.onAcceptClick}
    >
      <div className="caption-style-apply-contents center">
        <div className="caption-style-apply-popup-message">
          <label>{t('apply_All_Styles_Questions_Message')}</label>
        </div>
      </div>
    </AcceptCancelPopup>
  )
}

function areEquls(prevProps: ICaptionStyleApplyPopupProperties, nextProps: ICaptionStyleApplyPopupProperties) {
  return prevProps.onAcceptClick === nextProps.onAcceptClick || prevProps.onCloseClick === nextProps.onCloseClick;
}

export default React.memo(ApplyAllStylesWarningPopup, areEquls);
