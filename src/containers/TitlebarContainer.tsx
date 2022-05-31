import { Component } from 'react';
import { connect } from 'react-redux';

import Titlebar from 'components/Titlebar';
import * as windows from 'lib/windows';
import * as store from 'storeV2';
import { RouteComponentProps, withRouter } from 'react-router-dom';
import IpcSender from 'lib/IpcSender';

interface ITitlebarContainerStateProps {
  projectName?: string;
}

interface ITitlebarContainerState {
  version?: string;
  maximized: boolean;
}

interface ITitlebarContainerProps extends ITitlebarContainerStateProps, RouteComponentProps { }

const { ipcRenderer } = window;

class TitlebarContainer extends Component<ITitlebarContainerProps, ITitlebarContainerState> {
  state: ITitlebarContainerState = {
    maximized: false
  }

  setVersion = (version: string) => {
    this.setState(state => ({
      ...state,
      version
    }));
  }

  setMaximized = (maximized: boolean) => {
    this.setState(state => ({
      ...state,
      maximized
    }));
  }

  handleExitClick = (evt: React.MouseEvent) => windows.exit();

  handleMaximizeClick = (evt: React.MouseEvent) => windows.maximize();

  handleMinimizeClick = (evt: React.MouseEvent) => windows.minimize();

  handleUnMaximizeClick = (evt: React.MouseEvent) => windows.unMaximize();

  componentDidMount() {
    ipcRenderer.on(
      'isMaximized', (evt: Electron.IpcRendererEvent, maximized: boolean) => this.setMaximized(maximized)
    );

    IpcSender.invokeGetVersion()
      .then(version => this.setVersion(version));
  }

  shouldComponentUpdate(nextProps: ITitlebarContainerProps, nextState: ITitlebarContainerState) {
    return this.props.projectName !== nextProps.projectName
      || this.props.location.pathname !== nextProps.location.pathname
      || this.state.maximized !== nextState.maximized
      || this.state.version !== nextState.version;
  }

  render() {
    const isMac = navigator.appVersion.indexOf("Mac") !== -1;
    const downcapVersion = `Downcap v ${this.state.version}`;
    const displayTitle = this.props.projectName
      ? `${this.props.projectName} - ${downcapVersion}`
      : downcapVersion;

    const backgroundColor = this.props.location.pathname.indexOf('/editor') === 0
      ? '#5f00aa'
      : '#ffffffff';

    return (
      <Titlebar
        title={displayTitle}
        background={backgroundColor}
        pathname={this.props.location.pathname.replace('/', 'path')}
        maximized={this.state.maximized}
        isMac={isMac}
        onExitClick={this.handleExitClick}
        onMaximizeClick={this.handleMaximizeClick}
        onMinimizeClick={this.handleMinimizeClick}
        onUnMaximizeClick={this.handleUnMaximizeClick}
      />
    );
  }
}

export default connect<ITitlebarContainerStateProps, void, {}, store.RootState>(
  state => ({
    projectName: state.present.project.projectName
  })
)(withRouter(TitlebarContainer));