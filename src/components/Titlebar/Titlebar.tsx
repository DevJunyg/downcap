import React, { Component } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWindowMinimize, faTimes } from '@fortawesome/pro-solid-svg-icons'
import { faWindowMaximize, faWindowRestore } from '@fortawesome/pro-regular-svg-icons';
import './Titlebar.scss';
import ClassNameHelper from 'ClassNameHelper';

interface ITitlebarProps {
  key?: number;
  isMac?: boolean;
  title?: string;
  maximized?: boolean;
  pathname?: string;
  background?: string;
  onExitClick?: React.MouseEventHandler;
  onMaximizeClick?: React.MouseEventHandler;
  onMinimizeClick?: React.MouseEventHandler;
  onUnMaximizeClick?: React.MouseEventHandler;
}

const UnMaximizeButton = (props: ITitlebarProps) => {
  return (
    <button
      key={props.key}
      onClick={props.onUnMaximizeClick}
      data-testid="test-id-titlebar-unmaximize-button">
      <FontAwesomeIcon icon={faWindowRestore} size="lg" />
    </button>
  );
}

const MaximizeButton = (props: ITitlebarProps) => {
  return (
    <button
      key={props.key}
      onClick={props.onMaximizeClick}
      data-testid="test-id-titlebar-maximize-button">
      <FontAwesomeIcon icon={faWindowMaximize} size="lg" />
    </button>
  );
}

const MinimizeButton = (props: ITitlebarProps) => {
  return (
    <button
      key={props.key}
      onClick={props.onMinimizeClick}
      data-testid="test-id-titlebar-minimize-button">
      <FontAwesomeIcon icon={faWindowMinimize} size="lg" />
    </button>
  );
}

const ExitButton = (props: ITitlebarProps) => {
  return (
    <button
      key={props.key}
      className="exit"
      onClick={props.onExitClick}
      data-testid="test-id-titlebar-exit-button">
      <FontAwesomeIcon icon={faTimes} size="lg" />
    </button>
  );
}

class Titlebar extends Component<ITitlebarProps> {
  renderTitleMenu = () => {
    const Maximize = this.props.maximized ? UnMaximizeButton : MaximizeButton;
    const titleMenuButtons = [MinimizeButton, Maximize, ExitButton];

    return (
      <div className="control-box">
        {titleMenuButtons.map((titleMenuButton, index) => titleMenuButton({ ...this.props, key: index }))}
      </div>
    );
  }

  shouldComponentUpdate(nextProps: ITitlebarProps) {
    return this.props.maximized !== nextProps.maximized
      || this.props.title !== nextProps.title
      || this.props.pathname !== nextProps.pathname;
  }

  render() {
    return (
      <div className='titlebar' style={{ background: this.props.background }}>
        <div className={`titlebar-content ${this.props.pathname}`}>
          <div className={ClassNameHelper.concat("project-name-box", this.props.isMac ? " project-name-box-mac" : undefined)}>
            <img src="https://downcap.net/client/img/downcap_icon.png" alt="open" className="titlebar-logo" />
            <label className="project-name">{this.props.title}</label>
          </div>
          {!this.props.isMac && this.renderTitleMenu()}
        </div>
      </div>
    );
  }
}

export default Titlebar;