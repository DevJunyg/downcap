import IpcSender from "lib/IpcSender";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import MathExtensions from "MathExtensions";
import Player, { IPlayerProps, PlayerEvent, playerEventName } from "./Player";

export default class FilePlayer extends Player {
  constructor(elementId: string, path: URL, props: IPlayerProps) {
    super(elementId, path, props, ReactLoggerFactoryHelper.build('FilePlayer'));
    const root = document.getElementById(elementId);
    if (!root) {
      throw new Error(`Id ${elementId} not found`);
    }
    const filePath = path.toString().includes('file:///') ?
      decodeURI(path.toString().replace('file:///', '')) :
      decodeURI(path.toString().replace('file://', ''))

    if (filePath) {
      IpcSender.invokeFileExistkAsync(filePath).then((result) => {
        if (result === false) {
          alert(`올바르지 않은 경로: ${filePath}`)
        }
      }, () => {
        alert(`지원하지 않는 경로: ${filePath}`)
      });
    }

    var player = document.createElement('video');
    player.src = path.toString();
    player.controls = true;
    //@ts-ignore Chrome 58+ Only
    player.controlsList = 'nofullscreen';
    //@ts-ignore Chrome 69+, Edge 79+, Prera 56+, Safari 13.1+
    player.disablePictureInPicture = true;
    player.onloadedmetadata = this._handleLoadedmetadata;
    player.onkeydown = e => { e.preventDefault(); }
    player.onplay = this._handlePlay;
    player.onpause = this._handlePause;
    player.onclick = evt => (evt.currentTarget as HTMLVideoElement).blur();
    player.onerror = () => console.error;
    root.appendChild(player);

    this._embedded_player = player;
  }

  private _embedded_player: HTMLVideoElement | null

  private _handleLoadedmetadata = (evt: Event) => {
    this.emitReady();
  }

  private _handlePlay = (evt: Event) => {
    const event: PlayerEvent = {
      target: this
    };

    (evt.currentTarget as HTMLVideoElement).blur();
    this.eventEmitter.emit(playerEventName.play, event);
  }

  private _handlePause = (evt: Event) => {
    const event: PlayerEvent = {
      target: this
    };

    (evt.currentTarget as HTMLVideoElement).blur();
    this.eventEmitter.emit(playerEventName.pause, event);
  }

  get isPlay(): boolean {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }

    return !this._embedded_player!.paused;
  }

  get width(): number {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }


    return this._embedded_player!.clientWidth;
  }

  get height(): number {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }


    return this._embedded_player!.clientHeight;
  }

  get currentTime(): number {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }

    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    return MathExtensions.round(this._embedded_player!.currentTime, 3);
  }
  set currentTime(currentTime: number) {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }


    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    this._embedded_player!.currentTime = currentTime;
  }

  get duration(): number {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }


    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    return this._embedded_player!.duration;
  }

  get videoWidth(): number {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }

    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    return this._embedded_player!.videoWidth;
  }

  get videoHeight(): number {
    if (this._playerClosed) {
      throw new Error("Player is closed");
    }


    if (!this.isReady) {
      throw new Error("Player is not ready");
    }

    return this._embedded_player!.videoHeight;
  }

  play(): void {
    this._embedded_player?.play()
  }

  pause(): void {
    this._embedded_player?.pause()
  }

  close(): void {
    if (this._playerClosed) {
      return;
    }

    const root = document.getElementById(this._elementId);
    if (root && this._embedded_player) {
      try {
        root.removeChild(this._embedded_player);
      } catch (err) {
        this.logger.logWarning(err as Error);
      }
      this._embedded_player = null;
    }

    super.close();
  }

}