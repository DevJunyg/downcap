import VideoExportFailedPopup from 'components/popup/videoExportPopups/VideoExportFailedPopup';
import React from "react";
import { RootState } from "storeV2";
import { connect } from "react-redux";
import { IVideoExportFailPopupPayload, VideoExportErrorCodeType } from "managers/PopupManager";
import { IPopupProps } from "containers/PopupContainer";
import { WithTranslation, withTranslation } from 'react-i18next';

interface IVideoExportFailedPopupConnectState {
  errorCode: VideoExportErrorCodeType;
}

interface IVideoExportFailedPopupProps extends IVideoExportFailedPopupConnectState, IPopupProps, WithTranslation { }

class VideoExportFailedPopupContainer extends React.Component<IVideoExportFailedPopupProps>{
  ErrorGuidance = {
    invalidUrlPathContent: (
      <>
        {this.props.t('ErrorGuidance_invalid_Url_PathContent')}<br />
        <br />
        {this.props.t('unavailable_FileName_Message')}<br />
        <br />
        {this.props.t('ErrorGuidance_invalid_Url_PathContent_Confirm')}
      </>
    ),
    defaultErrorContent: (
      <>
        {this.props.t('defaultErrorContent')}<br />
        <br />
        {this.props.t('defaultErrorContent_Inquiry')}
      </>
    )
  };

  errorContentDictionary = {
    "INVALID_URL_PATH": this.ErrorGuidance.invalidUrlPathContent,
    "RENDER_DEFAULT_ERROR": this.ErrorGuidance.defaultErrorContent,
    "FFMPEG_ERROR": this.ErrorGuidance.defaultErrorContent
  };

  render() {
    return (
      <VideoExportFailedPopup
        videoExportErrorMessage={this.errorContentDictionary[this.props.errorCode] ?? this.props.t('defaultError_Unknown')}
        onCloseClick={this.props.onCloseClick}
      />
    );
  }
}

export default withTranslation('VideoExportFailedPopupContainer')(connect<IVideoExportFailedPopupConnectState, {}, IPopupProps, RootState>(
  state => ({
    errorCode: (state.present.popup.payload as IVideoExportFailPopupPayload)?.errorCode
  }) as IVideoExportFailedPopupConnectState
)(VideoExportFailedPopupContainer));