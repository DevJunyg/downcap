import React from 'react';
import './SavePopup.scss'
import PopUp from '../../common/PopUp';
import { IPopupProps } from 'containers/PopupContainer';
import { useTranslation } from 'react-i18next';

function SavePopup(props: IPopupProps) {
  const { t } = useTranslation('SavePopup');

  return (
    <PopUp
      title={t('SavePopup_Title')}
      onCloseClick={props.onCloseClick}
    >
      <div className="save-contents center">
        <label>{t('SavePopup_Cotent')}</label>
      </div>
    </PopUp>
  )
}

export default React.memo(SavePopup);
