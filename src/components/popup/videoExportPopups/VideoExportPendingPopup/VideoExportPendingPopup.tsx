import React from 'react';
import './VideoExportPendingPopup.scss'

import Popup from 'components/common/PopUp';
import { WithTranslation, withTranslation } from 'react-i18next';

export interface IVideoExportPendingPopupProperties {
  percent: number;
  onVideoExportCancelClick?: React.MouseEventHandler<HTMLButtonElement>;
}

class VideoExportPendingPopup extends React.Component<IVideoExportPendingPopupProperties & WithTranslation> {
  render() {
    return (
      <Popup title={this.props.t('title')}
        CloseStopper={true}
      >
        <div className="rendering-popup-progress-bar">
          <div className="progress-bar-box">
            <div className="progress-bar stripes animated reverse slower">
              <div className="progress-bar-text">
                {this.props.t('progressBar_Text')}
              </div>
              <span
                className="progress-bar-inner"
                style={{
                  width: `${this.props.percent}%`,
                  transition: "width 0.1s linear",
                }}
              ></span>
            </div>
          </div>
          <div className="progress-text">
            <div className="progress-render-text">{this.props.t('progress')}</div>
            <div className="progress-render-text-percent">{this.props.percent}%</div>
          </div>
          <div className="rendering-popup-btn">
            <button
              className="btn rendering-cancel-btn"
              onClick={this.props.onVideoExportCancelClick}
            >
              {this.props.t('cancelButton_Text')}
            </button>
          </div>
        </div>
      </Popup>
    );
  }
}
export default withTranslation('VideoExportPendingPopup')(VideoExportPendingPopup);