import React from 'react';
import './VideoExportFailedPopup.scss'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimesCircle } from '@fortawesome/pro-solid-svg-icons'

import Popup from 'components/common/PopUp';
import { useTranslation } from 'react-i18next';

export interface IVideoExportFailedPopupProperties {
  videoExportErrorMessage: React.ReactNode;
  onCloseClick?: React.MouseEventHandler;
}

class VideoExportFailedPopup extends React.Component<IVideoExportFailedPopupProperties> {
  render() {
    const { onCloseClick, videoExportErrorMessage } = this.props;
    const { t } = useTranslation('VideoExportFailedPopup');
    return (
      <Popup
        title={t('title')}
        CloseStopper={true}
      >
        <div className="rendering-fail-popup">
          <div className="rendering-fail-box">
            <FontAwesomeIcon icon={faTimesCircle} className="rendering-fail-icon" />
            <div className="rendering-fail-text">
              <br />
              {videoExportErrorMessage}
            </div>
          </div>
          <div className="rendering-fail-btn">
            <button className="btn popup-close-btn" onClick={onCloseClick}>{t('closeButton_Text')}</button>
          </div>
        </div>
      </Popup>
    );
  }
}
export default VideoExportFailedPopup;