import React, { Component } from 'react';

import './VideoPlayer.scss'

class VideoPlayer extends Component<React.HTMLAttributes<HTMLDivElement>> {
  render() {
    return (
      <div className="player-area" onClick={this.props.onClick}>
        <div id="player" className="w-100 h-100" />
      </div>
    )
  }
}

export default VideoPlayer;
