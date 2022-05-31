import React from "react";
import storeV2, * as store from "storeV2";
import * as utils from 'lib/utils';
import IpcSender from "lib/IpcSender";
import PopupManager, { VideoExportErrorCodeType } from "managers/PopupManager";
import * as projectControlActions from 'storeV2/modules/projectControl';
import VideoExportPendingPopup from 'components/popup/videoExportPopups/VideoExportPendingPopup';
import { IPopupProps } from "containers/PopupContainer";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import IpcChannels from "IpcChannels";

const CreateAction = (dispatch: typeof storeV2.dispatch) => ({
  ProjectControlActions: bindActionCreators(projectControlActions, dispatch),
  PopupActions: {
    close: () => PopupManager.close(dispatch)
  }
})

interface IVideoExportPendingPopupContainerDispatch extends ReturnType<typeof CreateAction> { }

interface IVideoExportPendingPopupState {
  percent: number;
}

interface IVideoExportPendingPopupProps extends IVideoExportPendingPopupContainerDispatch, IPopupProps { }

class VideoExportPendingPopupContainer extends React.Component<IVideoExportPendingPopupProps, IVideoExportPendingPopupState>{
  ipcSender = new IpcSender();

  state: IVideoExportPendingPopupState = {
    percent: 0
  };

  VideoExportTimeListener = (_evt: any, percent: number) => {
    this.setState(state => ({
      ...state,
      percent: percent,
    }));
  }

  VideoExportEndListener = (_evt: any) => {
    this.props.PopupActions.close();
    this.props.ProjectControlActions.setVideoRendering(false);
  }

  VideoExportErrorListener = (_evt: any, errorCode: VideoExportErrorCodeType) => {
    this.props.PopupActions.close();
    this.props.ProjectControlActions.setVideoRendering(false);
    PopupManager.openVideoExportFailPopup({ errorCode: errorCode });
  }

  handleVideoExportCancelClickAsync: React.MouseEventHandler<HTMLButtonElement> = async (_evt: React.MouseEvent<HTMLButtonElement>) => {
    this.props.PopupActions.close();
    IpcSender.sendRenderingCancel();
    IpcSender.sendCancelVideoRemove();
    this.props.ProjectControlActions.setVideoRendering(false);
  }

  listeners = [
    { channel: IpcChannels.listenVideoExportPercentage, action: this.VideoExportTimeListener },
    { channel: IpcChannels.listenVideoExportError, action: this.VideoExportErrorListener },
    { channel: IpcChannels.listenVideoExportEnd, action: this.VideoExportEndListener }
  ];

  componentDidMount() {
    this.listeners.forEach(item => {
      this.ipcSender.on(item.channel, item.action);
    });
  }

  componentWillUnmount() {
    this.listeners.forEach(item => {
      this.ipcSender.removeAllListeners(item.channel);
    });
  }

  render() {
    return <VideoExportPendingPopup
      onVideoExportCancelClick={this.handleVideoExportCancelClickAsync}
      percent={this.state.percent}
    />;
  }
}

export default connect<{}, IVideoExportPendingPopupContainerDispatch, IPopupProps, store.RootState>(
  state => ({}),
  CreateAction
)(VideoExportPendingPopupContainer);