import React from "react";
import storeV2, * as store from "storeV2";
import { connect } from "react-redux";
import IpcChannels from "IpcChannels";
import { bindActionCreators } from "redux";
import FontCheckHelper from "FontCheckHelper";
import PopupManager, { IFontCheckPayload, VideoExportErrorCodeType } from "managers/PopupManager";
import PlayerContext from "contexts/PlayerContext";
import { IPopupProps } from "containers/PopupContainer";
import * as projectControlActions from 'storeV2/modules/projectControl';
import ProjectIOManager from "managers/ProjectIOManagerV2";
import VideoExportSettingPopup, { IVideoExportSettingPopupProperties } from "components/popup/videoExportPopups/VideoExportSettingPopup/VideoExportSettingPopup";
import IpcSender from "lib/IpcSender";
import { withTranslation, WithTranslation } from "react-i18next";

interface IVideoExportSettingPopupContainerConnectState {
  originDisabled: boolean;
  translatedDisabled: boolean;
}

interface IVideoExportSettingPopupContainerState {
  videoExportLanguage: store.EditType;
}

const popupActions = (dispatch: typeof store.default.dispatch) => ({
  close: () => PopupManager.close(dispatch),
  openVideoExportPendingPopup: () => PopupManager.openVideoExportPendingPopup(dispatch),
  openFontCheckPopup: (payload: IFontCheckPayload) => PopupManager.openFontCheckPopup(payload, dispatch)
})
interface IVideoExportSettingPopupContainerDispatch {
  ProjectControlActions: typeof projectControlActions;
  PopupActions: ReturnType<typeof popupActions>;
}

interface IVideoExportSettingPopupProps extends IVideoExportSettingPopupContainerConnectState, IVideoExportSettingPopupContainerDispatch, IPopupProps, WithTranslation { }

class VideoExportSettingPopupContainer extends React.Component<IVideoExportSettingPopupProps, IVideoExportSettingPopupContainerState> {
  static contextType = PlayerContext;
  ipcSender = new IpcSender();

  state: IVideoExportSettingPopupContainerState = {
    videoExportLanguage: 'origin'
  };

  localInvalidFontCheck = (font: string | number) => FontCheckHelper.isValidYouTubeFont(font);

  handleRenderingOkClickAsync = async (_evt: React.MouseEvent<HTMLDivElement>, videoExportLanguage: store.EditType) => {
    let invalidCaptions: store.IFocusLineMeta[] = [];
    switch (videoExportLanguage) {
      case 'origin':
        invalidCaptions = FontCheckHelper.originCaptionsFontCheckActions(this.localInvalidFontCheck, storeV2);
        break;
      case 'translated':
        invalidCaptions = FontCheckHelper.translatedCaptionsFontCheckActions(this.localInvalidFontCheck, storeV2);
        break;
      case 'dual':
        invalidCaptions = [
          ...FontCheckHelper.originCaptionsFontCheckActions(this.localInvalidFontCheck, storeV2),
          ...FontCheckHelper.translatedCaptionsFontCheckActions(this.localInvalidFontCheck, storeV2)
        ];
        break;
      default:
        break;
    }

    if (invalidCaptions && invalidCaptions.length > 0) {
      this.props.PopupActions.openFontCheckPopup({ invalidFont: this.props.t('invalidFontType_LocalFont'), invalidCaptions: invalidCaptions });
      return;
    }

    ProjectIOManager.exportRenderVideo(videoExportLanguage, this.context.player);
  }

  handleSelectLangugeChange = (
    _evt: React.ChangeEvent<HTMLInputElement>,
    value: store.EditType
  ) => this.setState(state => ({
    ...state,
    videoExportLanguage: value
  }));

  videoExportPendingListener = (_evt: any, start: boolean) => {
    if (start) {
      this.props.PopupActions.close();
      this.props.PopupActions.openVideoExportPendingPopup();
    }
  }

  renderingStartListener = (_evt: any, rendering: boolean) => {
    this.props.ProjectControlActions.setVideoRendering(rendering);
  }

  VideoExportErrorListener = (_evt: any, errorCode: VideoExportErrorCodeType) => {
    this.props.PopupActions.close();
    this.props.ProjectControlActions.setVideoRendering(false);
    PopupManager.openVideoExportFailPopup({ errorCode: errorCode });
  }

  listeners = [
    { channel: IpcChannels.listenVideoExportStart, action: this.videoExportPendingListener },
    { channel: IpcChannels.listenRenderingStart, action: this.renderingStartListener },
    { channel: IpcChannels.listenVideoExportError, action: this.VideoExportErrorListener }
  ];

  componentDidMount() {
    this.listeners.forEach(listener => {
      this.ipcSender.on(listener.channel, listener.action);
    });

    if (!this.props.originDisabled) {
      this.setState(state => ({
        ...state,
        videoExportLanguage: 'origin'
      }));
      return;
    }

    if (!this.props.translatedDisabled) {
      this.setState(state => ({
        ...state,
        videoExportLanguage: 'translated'
      }));
      return;
    }
  }

  componentWillUnmount() {
    this.listeners.forEach(listener => {
      this.ipcSender.removeAllListeners(listener.channel);
    });
  }

  createVideoExportSettingProperties = (): IVideoExportSettingPopupProperties => {
    const { originDisabled, translatedDisabled } = this.props;

    return ({
      originDisabled: originDisabled,
      translatedDisabled: translatedDisabled,
      dualDisabled: originDisabled || translatedDisabled,
      VideoExportLanguage: this.state.videoExportLanguage,
      onAcceptClick: evt => this.handleRenderingOkClickAsync(
        evt,
        this.state.videoExportLanguage
      ),
      onCloseClick: this.props.onCloseClick,
      onSelectLangugeChange: this.handleSelectLangugeChange
    });
  }

  render() {
    return <VideoExportSettingPopup {...this.createVideoExportSettingProperties()} />;
  }
}

export default withTranslation('VideoExportSettingPopupContainer')(connect<IVideoExportSettingPopupContainerConnectState, IVideoExportSettingPopupContainerDispatch, IPopupProps, store.RootState>(
  (state: store.RootState): IVideoExportSettingPopupContainerConnectState => ({
    originDisabled: !state.present.originCaption.captions?.any() && !state.present.multiline.captions?.any(),
    translatedDisabled: !state.present.translatedCaption.captions?.any() && !state.present.translatedMultiline.captions?.any()
  }),
  dispatch => ({
    ProjectControlActions: bindActionCreators(projectControlActions, dispatch),
    PopupActions: popupActions(dispatch)
  })
)(VideoExportSettingPopupContainer));