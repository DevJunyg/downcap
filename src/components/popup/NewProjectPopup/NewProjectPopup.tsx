import React from 'react';
import './NewProjectPopup.scss'

import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import { IPopupProps } from 'containers/PopupContainer';
import ProjectManager from 'managers/ProjectManager';
import PlayerContext from 'contexts/PlayerContext';
import { useTranslation } from 'react-i18next';

function NewProjectPopup(props: IPopupProps) {
  const { t } = useTranslation('NewProjectPopup');
  const { player } = React.useContext(PlayerContext);
  return (
    <AcceptCancelPopup closePressedOutside
      title={t('title')}
      closeContent={t('closeContent')}
      acceptContent={t('acceptContent')}
      onCloseClick={props.onCloseClick}
      onAcceptClick={handleAcceptClick}
      onCancelClick={props.onCloseClick}
    >
      <div className="new-project-contents center">
        <div className="new-project-popup-message">
          <label>{t('popupMessage')}</label>
        </div>
      </div>
    </AcceptCancelPopup>
  )

  function handleAcceptClick(evt: React.MouseEvent) {
    props.onCloseClick && props.onCloseClick(evt);
    ProjectManager.clearAsync(player);
  }
}

export default NewProjectPopup;
