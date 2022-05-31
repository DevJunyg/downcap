import { ILogger } from "@mnutube/logging";
import downcapOptions from "downcapOptions";
import EventEmitter from "events";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import MathExtensions from "MathExtensions";

export interface PlayerEvent {
  target: Readonly<Player>
}

export type PlayerEventHandler = (evt: PlayerEvent) => void;

export interface IPlayerProps {
  onTimeUpdate?: PlayerEventHandler;
  onReady?: PlayerEventHandler;
  onPlay?: PlayerEventHandler;
  onPause?: PlayerEventHandler;
  onResize?: PlayerEventHandler;
  onShortcut?: PlayerEventHandler;
}


export const playerEventName = Object.freeze({
  ready: 'ready',
  timeUpdate: 'timeUpdate',
  pause: 'pause',
  play: 'play',
  resize: 'resize',
  shortcut: 'shortcut'
});

export type PlayerEventName = typeof playerEventName[keyof typeof playerEventName];

export default abstract class Player {
  protected constructor(elementId: string, url: URL, props: IPlayerProps, logger: ILogger | null = null) {
    this._elementId = elementId;
    this._url = url;
    this._eventEmitter = new EventEmitter();
    this._eventEmitter.setMaxListeners(30);
    this._isReady = false;
    this._preTime = -Infinity;
    this._eventLoopLock = false;
    this._playerClosed = false;
    this._logger = logger ?? ReactLoggerFactoryHelper.build('Player');
    this._prevWidth = -Infinity;
    this._prevHeigth = -Infinity;
    this._eventLoopInterval = null;

    this._eventEmitter.addListener(playerEventName.ready, this._handlePlayerReady);

    props.onPause && this._eventEmitter.addListener(playerEventName.pause, props.onPause);
    props.onPlay && this._eventEmitter.addListener(playerEventName.play, props.onPlay);
    props.onReady && this._eventEmitter.addListener(playerEventName.ready, props.onReady);
    props.onResize && this._eventEmitter.addListener(playerEventName.resize, props.onResize);
    props.onTimeUpdate && this._eventEmitter.addListener(playerEventName.timeUpdate, props.onTimeUpdate);
  }

  private _preTime: number;
  private _eventLoopLock: boolean;
  private _eventLoopInterval: NodeJS.Timeout | null;
  private _logger: ILogger;
  private _prevWidth: number;
  private _prevHeigth: number;

  protected _playerClosed: boolean;
  protected _elementId: string;
  protected _url: URL;
  protected _eventEmitter: EventEmitter;
  protected _isReady: boolean;

  get isReady() {
    return this._isReady && !this._playerClosed;
  }

  get url() {
    return this._url;
  }

  protected get eventEmitter() {
    return this._eventEmitter;
  }

  protected get logger() {
    return this._logger;
  }

  abstract get isPlay(): boolean;

  abstract get width(): number;

  abstract get height(): number;

  abstract get currentTime(): number;
  abstract set currentTime(currentTime: number);

  abstract get duration(): number;

  abstract get videoWidth(): number;

  abstract get videoHeight(): number;

  private _handleTimeChange = () => {
    let currentTime = MathExtensions.round(this.currentTime, 3);
    if (currentTime === this._preTime) {
      return;
    }

    this._preTime = currentTime;

    try {
      this.emitTimeUpate();
    }
    catch (e) {
      e instanceof Error && this.logger.logWarning(e);
      if (this._eventLoopInterval !== null) {
        clearInterval(this._eventLoopInterval)
        this._eventLoopInterval = null
      }
    }
  }

  private _handlePlayerSizeChange = () => {
    try {
      const { _prevWidth, _prevHeigth, width, height } = this;
      if (_prevWidth !== width || _prevHeigth !== height) {
        this._prevWidth = width;
        this._prevHeigth = height;

        const event: PlayerEvent = {
          target: this
        };

        this._eventEmitter.emit(playerEventName.resize, event);
      }
    } catch (err) {
      err instanceof Error && this.logger.logWarning(err);
    }
  }

  private _eventLoop = () => {
    if (this._eventLoopLock && !this.isReady) {
      return;
    }

    if (this._playerClosed) {
      this._logger.logWarning('Approaching a closed player.')
      return;
    }

    this._eventLoopLock = true;

    try {
      this._handleTimeChange();
      this._handlePlayerSizeChange();
      if (document.activeElement instanceof HTMLIFrameElement) {
        document.activeElement.blur();
      }
    }
    finally {
      this._eventLoopLock = false;
    }
  }

  private _handlePlayerReady = () => {
    this._eventLoopInterval = setInterval(this._eventLoop, downcapOptions.playerEventLoopTime);
    this._isReady = true;
  }

  protected emit(eventName: PlayerEventName) {
    this._eventEmitter.emit(eventName, {
      target: this
    });
  }

  protected emitPlay() {
    this.emit(playerEventName.play);
  }

  protected emitReady() {
    this.emit(playerEventName.ready);
  }

  protected emitPause() {
    this.emit(playerEventName.pause);
  }

  protected emitTimeUpate() {
    this.emit(playerEventName.timeUpdate);
  }

  protected emitShortcut() {
    this.emit(playerEventName.shortcut);
  }

  protected runActionWithTimeUpdateDelay = (action: () => void) => {
    if (this._playerClosed) {
      return;
    }

    this._eventLoopInterval && clearInterval(this._eventLoopInterval);
    action();
    this._eventLoopInterval = setInterval(this._eventLoop, downcapOptions.playerEventLoopTime);
  }

  close() {
    if (this._playerClosed) {
      return;
    }

    this._eventLoopInterval && clearInterval(this._eventLoopInterval);
    this._eventEmitter.removeAllListeners();

    this._playerClosed = true;
  }

  abstract play(): void;
  abstract pause(): void;


  addEventListener(eventName: PlayerEventName, handle: PlayerEventHandler) {
    this._eventEmitter.addListener(eventName, handle);
  }

  removeEventListener(eventName: PlayerEventName, handle: PlayerEventHandler) {
    this._eventEmitter.removeListener(eventName, handle);
  }

  removeAllListeners() {
    this._eventEmitter.removeAllListeners();
  }

  addTimeUpdateEventListener(handle: PlayerEventHandler) {
    this.addEventListener(playerEventName.timeUpdate, handle);
  }

  removeTimeUpdateEventListener(handle: PlayerEventHandler) {
    this.removeEventListener(playerEventName.timeUpdate, handle);
  }

  addPauseEventListener(handle: PlayerEventHandler) {
    this.addEventListener(playerEventName.pause, handle);
  }

  removePauseEventListener(handle: PlayerEventHandler) {
    this.removeEventListener(playerEventName.pause, handle);
  }

  addReadyEventListener(handle: PlayerEventHandler) {
    this.addEventListener(playerEventName.ready, handle);
  }

  removeReadyEventListener(handle: PlayerEventHandler) {
    this.removeEventListener(playerEventName.ready, handle);
  }
}