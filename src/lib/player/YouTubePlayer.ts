import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import MathExtensions from "MathExtensions";
import Player, { IPlayerProps } from "./Player";
import ProjectManager from 'managers/ProjectManager';

var tag = document.createElement('script');

tag.src = "https://www.youtube.com/iframe_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
if (!firstScriptTag) {
  document.body.appendChild(document.createElement('script'));
  firstScriptTag = document.getElementsByTagName('script')[0];
}

firstScriptTag.parentNode!.insertBefore(tag, firstScriptTag);

export default class YouTubePlayer extends Player {
  constructor(elementId: string, url: URL, props: IPlayerProps) {
    super(elementId, url, props, ReactLoggerFactoryHelper.build('YouTubePlayer'));

    const root = document.getElementById(elementId);
    if (!root) {
      throw new Error(`Id ${elementId} not found`);
    }


    const paths = url.pathname.split('/');
    const videoId = paths[paths.length - 1];

    //@ts-ignore
    this._embedded_player = new YT.Player(elementId, {
      videoId: videoId,
      playerVars: {
        'modestbranding': 1,
        'origin': window.location.origin,
        'rel': 0,
        'fs': 0,
        'disablekb': 1,
      },
      events: {
        'onReady': (event: any) => {
          this._handleReady();
        },
        'onError': () => console.error,
        'onStateChange': (evt: any) => this._handleStateChange(evt)
      }
    });
  }

  private _embedded_player: any;

  private _handleReady = () => {
    this.emitReady();
    if (this._playerClosed) {
      this._embedded_player.destroy();
    }
  }

  private _handleStateChange = (evt: any) => {
    let code = evt?.data;
    if (code === 1) {
      this.emitPlay();
    }
    else if (code === 2) {
      this.emitPause();
    }

    if (document.activeElement instanceof HTMLIFrameElement) {
      const element = document.activeElement;
      element.blur();
    }
  }

  get isPlay(): boolean {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    return this._embedded_player.getPlayerState() === 1;
  }

  get width(): number {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    const h = this._embedded_player.h;
    if (h === undefined) {
      this.logger.logError("h not found", new Error());
    }

    return h?.offsetWidth ?? h?.h?.offsetWidth ?? 0;
  }

  get height(): number {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    const h = this._embedded_player.h;
    if (h === undefined) {
      this.logger.logError("h not found", new Error());
    }

    return h?.offsetHeight ?? h?.h?.offsetHeight ?? 0;
  }

  get currentTime(): number {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    return MathExtensions.round(this._embedded_player.getCurrentTime(), 3);
  }
  set currentTime(currentTime: number) {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    this.runActionWithTimeUpdateDelay(() => this._embedded_player.seekTo(currentTime, true));
  }

  get duration(): number {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    return this._embedded_player.getDuration();
  }

  get videoWidth(): number {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    const h = this._embedded_player.h;
    if (h === undefined) {
      this.logger.logError("h not found", new Error());
    }

    return h?.width ?? h?.h?.width ?? 0;
  }

  get videoHeight(): number {
    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    const h = this._embedded_player.h;
    if (h === undefined) {
      this.logger.logError("h not found", new Error());
    }

    return h?.height ?? h?.h?.height ?? 0;
  }

  play(): void {
    if (!this.isReady) {
      return;
    }
    this._embedded_player.playVideo()
    document.body.focus();
  }

  pause(): void {
    if (!this.isReady) {
      return;
    }

    this._embedded_player.pauseVideo();
  }

  close(): void {
    if (this._playerClosed) {
      return;
    }


    super.close();
    try {
      this._embedded_player.destroy();
    } catch (err) {
      console.log(err);
    }
  }
}