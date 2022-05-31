import React from "react";
import "./InvalidFontCheckPopup.scss";
import Popup from 'components/common/PopUp';
import { useTranslation } from "react-i18next";

interface IInvalidFontCheckPopup {
  font: string;
  fontCheckList: Array<JSX.Element>;
  onCloseClick?: React.MouseEventHandler;
}

export default function InvalidFontCheckPopup(props: IInvalidFontCheckPopup) {
  const { t } = useTranslation('InvalidFontCheckPopup');
  return (
    <Popup
      title={t('title')}
      CloseStopper={true}
    >
      <div className="font-invalid-popup">
        <div className="font-invalid-img">
          <img src='https://downcap.net/client/img/fontInvalid.png' className="font-check-icon" alt='warning' />
        </div>
        <div className="font-invalid-text">
          <p>{t('invaildFont_Message')}</p>
        </div>
        <div className="font-invalid-text" >
          {t('fontMenu')}
          <span className='font-invalid-highlight'>{props.font}</span>
        </div>
        <div className="font-invalid-text">
          {t('invaildFont_ChangeTo')}
        </div>
        <div className="font-invalid-text-guide">
          {t('invaildFont_Change')}
        </div>
        <div className="font-invalid-list-menu">
          <span className="font-invalid-list-menu-time">{t('invaildFont_time')}</span>
          <span className="font-invalid-list-menu-sub">{t('invaildFont_sub')}</span>
          <span className="font-invalid-list-menu-type">{t('invaildFont_type')}</span>
          <span className="font-invalid-list-menu-move">{t('invaildFont_move')}</span>
        </div>
        <div className="font-invalid-list violet-scroll">
          {props.fontCheckList}
        </div>
        <button
          className="btn font-invalid-list-close-btn"
          onClick={props.onCloseClick}
        >
          {t('closeButton_Text')}
        </button>
      </div>
    </Popup>
  );
}