//@ts-check
import React, { Component } from 'react';

import './Item.scss';
/**
 * @typedef {object} Props
 * @property {import("models/youtube/IYouTubeSearchResult").default} meta
 * @property {(evt : React.MouseEvent<HTMLDivElement>, meta: import("models/youtube/IYouTubeSearchResult").default) => void} onClick
 * 
 * @extends {Component<Props>}
 */
class YouTubeSearchItem extends Component {
  /**
   * @param {object} nextProps
   * @param {import("models/youtube/IYouTubeSearchResult").default} nextProps.meta
   */
  shouldComponentUpdate(nextProps) {
    return this.props.meta.etag !== nextProps.meta.etag;
  }

  /**
   * 
   * @param {React.MouseEvent<HTMLDivElement>} evt 
   */
  handleClick = evt => {
    this.props.onClick && this.props.onClick(evt, this.props.meta);
  }

  render() {
    if (!this.props.meta.snippet) {
      return null;
    }

    const { title, publishedAt, channelTitle, thumbnails } = this.props.meta.snippet;

    return (
      <div className="playlist-item" onClick={this.handleClick}>
        <div className="thumbnail">
          <img width="168px" height="94px" src={thumbnails.medium.url} alt="thumbnail"></img>
        </div>
        <div className="item-info">
          <div className="item-title">
            {title}
          </div>
          <div className="item-channel">
            {channelTitle}
          </div>
          <div className="item-upload-date">
            {publishedAt.toLocaleDateString()}
          </div>
        </div>
      </div>
    )
  }
}

export default YouTubeSearchItem;
