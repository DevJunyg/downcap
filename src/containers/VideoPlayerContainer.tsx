import React, { Component } from 'react';

import Player, { PlayerEvent } from 'lib/player/Player';

import VideoPlayerTemplate from 'components/VideoPlayerTemplate';
import IpcSender from 'lib/IpcSender';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';

import OverlayProviderContainer from './overlay/OverlayProviderContainer';
import downcapOptions from 'downcapOptions';
import PlayerContext from 'contexts/PlayerContext';
import { VideoSetTimeHelper } from 'helpers/VideoSetTimeHelper';
import ProjectManager, { StcStatusChangeEvent } from 'managers/ProjectManager';
import { IFocusLineMeta, RootState } from 'storeV2';
import PlayerGenerator from 'lib/player/PlayerGenerator';
import UnsupportedException from 'UnsupportedException';
import { Event } from 'electron';
import IArea from 'IArea';
import * as Redux from 'redux'
import * as projectActions from 'storeV2/modules/project';
import * as projectControlActions from 'storeV2/modules/projectControl';
import lodash from 'lodash';
import { connect } from 'react-redux';

const multiLineTypeSet = new Set(['multiLine', 'translated-multiLine']);

interface IVideoPlayerContainerStateProps {
  focusParagraphMetas: RootState['present']['projectCotrol']['focusParagraphMetas'];
}

interface IVideoPlayerContainerDispatchProps {
  ProjectActions: typeof projectActions;
  ProjectControlActions: typeof projectControlActions;
}

interface IVideoPlayerContainerProps {
  path?: string;
  pending?: boolean;
  videoAreaHeight: number | string;
}

interface IVideoPlayerContainerState {
  requestFinal: boolean;
  successed: boolean;
  renderedProgressBox: boolean;
  currentTime?: number;
  area?: IArea;
}

class VideoPlayerContainer extends Component<
  IVideoPlayerContainerProps & IVideoPlayerContainerStateProps & IVideoPlayerContainerDispatchProps,
  IVideoPlayerContainerState
> {
  static contextType = PlayerContext;

  videoTemplateRef = React.createRef<HTMLDivElement>();
  ipcSender = new IpcSender();
  logger = ReactLoggerFactoryHelper.build(VideoPlayerContainer.name);

  timeoutId: NodeJS.Timeout | null = null;

  state: IVideoPlayerContainerState = {
    successed: false,
    renderedProgressBox: false,
    requestFinal: ProjectManager.stcStatus !== "Pending"
  }

  setSuccessed = (successed: boolean) => this.setState(state => ({
    ...state,
    successed: successed
  }));

  setRenderedProgressBox = (renderedProgressBox: boolean) => this.setState(state => ({
    ...state,
    renderedProgressBox: renderedProgressBox
  }));

  setCurrentTime = (time: number) => this.setState(state => ({
    ...state,
    currentTime: Math.round(time * 1000) / 1000
  }));

  setRequestFinal = (requestFinal: boolean) => this.setState(state => ({
    ...state,
    requestFinal: requestFinal
  }));

  setArea = (area: IArea) => this.setState(state => ({
    ...state,
    area: area
  }));

  handleLoadedMetadata = (evt: PlayerEvent) => {
    const player = this.context.player as Player | null;
    if (player === undefined || player === null) {
      return;
    }

    this.props.ProjectActions.setVideoMeta({
      width: player.videoWidth,
      height: player.videoHeight
    });
  }

  handleOverlayCaptionClick = (start: number) => {
    const player = this.context.player;
    if (!player) {
      return;
    }

    player.currentTime = start;
    player.pause();
  }

  handleDocumentKeyDown = (evt: KeyboardEvent) => {
    const player = this.context.player as Player | null;
    if (!player?.isReady || !(evt.shiftKey && evt.key === " ")) {
      return;
    }

    if (player.isPlay) {
      player.pause();
    }
    else {
      const activeElement = (document.activeElement as HTMLElement | null);
      const tagName = activeElement?.tagName;
      if (tagName === "INPUT" || tagName === "TEXTAREA") {
        activeElement!.blur();
      }

      player.play();
    }

    evt.preventDefault();
  }

  volumeChangeActionId: NodeJS.Timeout | null = null;
  handleTimeUpdate = (evt: PlayerEvent) => {
    this.setCurrentTime(evt.target.currentTime);
  }

  handlePlay = () => {
    if (this.props.focusParagraphMetas !== null) {
      this.props.ProjectControlActions.setFocusParagraphMetas(null);
    }
  }


  createPlayer(path: string) {
    return PlayerGenerator.open("player", path, {
      onReady: this.handleLoadedMetadata,
      onTimeUpdate: this.handleTimeUpdate,
      onResize: this.handleVideoResize,
      onPlay: this.handlePlay
    });
  }

  handleVideoClickEvent = () => {
    const player = this.context.player;
    if (!player) {
      return;
    }

    if (player.isPlay) {
      player.pause();
    } else {
      player.play();
    }
  }

  handleVideoResize = (evt: PlayerEvent) => this.setState(state => ({
    ...state,
    playerHeight: evt.target.height,
    playerWidth: evt.target.width
  }));

  handleOverlayFocus = (evt: React.FocusEvent<Element>, meta: IFocusLineMeta | undefined) => {
    if (!this.context.player) {
      return;
    }

    const player = this.context.player;

    const lineIndex = meta?.lineIndex ?? 0;
    const wordIndex = meta?.wordIndex ?? 0;
    const word = meta?.paragraph?.lines[lineIndex].words[wordIndex];
    const start = word?.start
    const end = word?.end;

    player.pause();
    if (meta?.kind && !multiLineTypeSet.has(meta.kind)) {
      if (start !== undefined && end !== undefined) {
        const setTime = VideoSetTimeHelper.dictionaryOfSetVideoTime[downcapOptions.setvideoTime];
        setTime && setTime(player, start, end);
      }
    }
  }

  clearAnimation = () => {
    this.setSuccessed(false);
    this.setRenderedProgressBox(false);
    this.timeoutId = null;
  }

  hanldeStcStatusChange = (evt: StcStatusChangeEvent) => {
    this.setRequestFinal(evt.status !== "Pending");
  }

  getPlayerWidth = () => {
    const areaMergin = 48;
    return this.videoTemplateRef.current?.offsetWidth ?? document.body.clientWidth / 2 - areaMergin;
  }

  getArea = (): IArea => {
    const playerWidth = this.getPlayerWidth();

    return {
      x: 16,
      y: 99,
      width: playerWidth,
      height: playerWidth * 0.5625
    }
  }

  handleResize = (evt: Event) => {
    this.setArea(this.getArea());
  }

  subscribe = () => {
    document.body.addEventListener("keydown", this.handleDocumentKeyDown, { capture: true });
    window.addEventListener("resize", this.handleResize);
    ProjectManager.onStcStatusChange(this.hanldeStcStatusChange);
  }

  unsubscribe = () => {
    document.body.removeEventListener("keydown", this.handleDocumentKeyDown, { capture: true });
    window.removeEventListener("resize", this.handleResize);
    ProjectManager.removeStcStatusChange(this.hanldeStcStatusChange);
  }

  componentDidMount() {
    this.subscribe();

    if (this.props.path) {
      try {
        this.context.player?.close();
        const player = this.createPlayer(this.props.path);
        this.context.setPlayer(player);
      } catch (err) {
        if (err instanceof TypeError) {
          alert(`올바르지 않은 경로: ${this.props.path}`)
        } else if (err instanceof UnsupportedException) {
          alert(`지원하지 않는 경로: ${this.props.path}`)
        }
      }
    }

    this.setRenderedProgressBox(!this.state.requestFinal);
    this.setArea(this.getArea());
  }

  componentDidUpdate(prevProps: IVideoPlayerContainerProps, prevState: IVideoPlayerContainerState) {
    const { path } = this.props;
    const nextArea = this.getArea();
    if (!lodash.isEqual(this.state.area, nextArea)) {
      this.setArea(nextArea);
    }

    const requestFinal = this.state.requestFinal;
    if (prevProps.path !== path) {
      try {
        this.context.player?.close();
        const player = path ? this.createPlayer(path) : null;
        this.context.setPlayer(player);
      } catch (err) {
        if (err instanceof TypeError) {
          alert(`올바르지 않은 경로: ` + this.props.path)
        } else if (err instanceof UnsupportedException) {
          alert(`지원하지 않는 경로: ` + this.props.path)
        }
      }
      this.setSuccessed(false);
      this.setRenderedProgressBox(!requestFinal);
    }

    if (path && requestFinal !== prevState.requestFinal) {
      this.setSuccessed(requestFinal);

      if (requestFinal) {
        this.timeoutId = setTimeout(this.clearAnimation, 300);
      } else {
        if (this.timeoutId) {
          clearTimeout(this.timeoutId);
        }

        this.setRenderedProgressBox(true);
      }
    }
  }

  componentWillUnmount() {
    this.unsubscribe();
    const player = this.context.player as Player | null;
    player?.close();
    this.context.setPlayer(null);

    if (this.timeoutId) {
      clearTimeout(this.timeoutId);
    }
  }

  render() {
    const player = this.context.player;
    const duration = player?.isReady ? player.duration : Infinity;
    return (
      <VideoPlayerTemplate
        ref={this.videoTemplateRef}
        duration={duration}
        videoPath={this.props.path}
        successed={this.state.successed}
        renderedProgressBox={this.state.renderedProgressBox}
        onClick={this.handleVideoClickEvent}
        height={this.props.videoAreaHeight}
      >
        <OverlayProviderContainer
          area={this.state.area ?? this.getArea()}
        />
      </VideoPlayerTemplate>
    );
  }
}

export default connect<
  IVideoPlayerContainerStateProps,
  IVideoPlayerContainerDispatchProps,
  IVideoPlayerContainerProps,
  RootState
>(
  state => ({
    focusParagraphMetas: state.present.projectCotrol.focusParagraphMetas
  }),
  dispath => ({
    ProjectActions: Redux.bindActionCreators(projectActions, dispath),
    ProjectControlActions: Redux.bindActionCreators(projectControlActions, dispath),
  })
)(VideoPlayerContainer);