import { faQuestionCircle } from '@fortawesome/pro-light-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import RemoveButton from 'components/common/RemoveButton';
import React from 'react';
import { useTranslation } from 'react-i18next';
import './TranslatedInformationBoard.scss';


interface ITranslatedInformationBoardProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

const removeButtonStyle: React.CSSProperties = {
  position: "absolute",
  right: "0.5rem",
  top: "0.25rem",
  display: "inline",
  cursor: "pointer"
}

function TranslatedInformationBoard(props: ITranslatedInformationBoardProps) {
  const { t, i18n } = useTranslation("TranslatedInformationBoard");
  const HelpImageSrc = i18n.language === 'ko' ? "https://downcap.net/client/svg/translated_info.svg" : "https://downcap.net/client/svg/translated_info_en.svg";
  return (
    <div className="translated-info-board" >
      <div className="left no-drag">
        <FontAwesomeIcon size="lg" className='help-image-icon-en center' icon={faQuestionCircle} />
        <div className='center'>{t('Help')}</div>
      </div>
      <div className="center">
        <img className="no-drag" alt="translation help" src={HelpImageSrc} />
      </div>
      <RemoveButton style={removeButtonStyle} onClick={props.onClick} />
    </div>
  )
}


export default React.memo(TranslatedInformationBoard, (prevProps, nextProps) => {
  return prevProps.onClick === nextProps.onClick;
});