import { History } from 'history';
import RibbonMenuContainer from 'containers/RibbonMenuContainer';
import EditorTemplateContainer from 'containers/EditorTemplateContainer';
import React from 'react';
import Player from 'lib/player/Player';
import PlayerContext from 'contexts/PlayerContext';
import PopupContainer from 'containers/PopupContainer';
import shortcutEffect from 'effects/shortcutEffect';
import dargDropEffect from 'effects/dargDropEffect';
import CanvasContext, { ICanvasContext } from 'contexts/CanvasContext';
import IpcSender from 'lib/IpcSender';
import PopupManager from 'managers/PopupManager';
import ProjectIOManagerV2 from 'managers/ProjectIOManagerV2';
import ProjectManager from 'managers/ProjectManager';
import { ProjectModelManager } from 'managers/ProjectModelManager';
import { projectShortCutFileLoad } from 'lib/windows';
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import reduUndoCreatorActions from 'storeV2/reduUndoCreatorActions';
import AppSettingManager from 'managers/AppSettingManager';

interface IEditorPageProps {
  history?: History
}

function EditorPage(props: IEditorPageProps) {
  const ipcSender = React.useMemo(() => new IpcSender(), []);
  const [player, setPlayer] = React.useState<Player | null>(null);
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const onFileOpenCallback = React.useCallback(_onFileOpen, []);
  const onErrorMessageCallback = React.useCallback(_onErrorMessage, [props?.history]);
  const onLoginExpiredCallback = React.useCallback(_onLoginExpired, [player, props?.history]);
  const onLowLetterCallback = React.useCallback(_onLowLetter, [props?.history]);
  const onSrtLoadAsyncCallback = React.useCallback(_onSrtLoadAsync, []);
  const onVideoExportStatusChangeCallback = React.useCallback(_onVideoExportStatusChange, []);
  const onProjectLoadAsyncCallback = React.useCallback(_onProjectLoadAsync, []);
  const onYoutubeVideoUploadCallback = React.useCallback(_onYoutubeVideoUpload, []);
  const ipcListenerIncreaseCallback = React.useCallback(_ipcListenerIncrease, [
    onErrorMessageCallback,
    onLoginExpiredCallback,
    onLowLetterCallback,
    onFileOpenCallback,
    onSrtLoadAsyncCallback,
    onVideoExportStatusChangeCallback,
    onProjectLoadAsyncCallback,
    onYoutubeVideoUploadCallback,
    ipcSender
  ]);

  const ipcListenerDecreaseCallback = React.useCallback(_ipcListenerDecrease, [
    onErrorMessageCallback,
    onLoginExpiredCallback,
    onLowLetterCallback,
    onFileOpenCallback,
    onSrtLoadAsyncCallback,
    onVideoExportStatusChangeCallback,
    onProjectLoadAsyncCallback,
    onYoutubeVideoUploadCallback,
    ipcSender
  ]);

  const rootState = ReactRedux.useStore<store.RootState>();
  const dispatch = ReactRedux.useDispatch();
  const RedoUndoActions = React.useMemo(() => reduUndoCreatorActions(dispatch), [dispatch]);
  const handleRedoUndoKeyDownCallback = React.useCallback(handleRedoUndoKeyDown, [RedoUndoActions, rootState]);

  React.useEffect(projectShortCutFileLoadEffect)
  React.useEffect(ipcListenerEffect, [props.history, ipcListenerDecreaseCallback, ipcListenerIncreaseCallback]);
  React.useEffect(() => shortcutEffect(rootState), [rootState]);
  React.useEffect(dargDropEffect);
  React.useEffect(redoUndoEffect, [handleRedoUndoKeyDownCallback]);

  AppSettingManager.setAppSettingStateAsync(dispatch);

  const playerContext = {
    player: player,
    setPlayer: (nextPlayer: Player | null) => {
      player?.close();
      setPlayer(nextPlayer);
    }
  }

  const canvasContext: ICanvasContext = {
    canvas: canvasRef
  };

  return (
    <div className="page">
      <CanvasContext.Provider value={canvasContext}>
        <PlayerContext.Provider value={playerContext}>
          <RibbonMenuContainer history={props.history} />
          <EditorTemplateContainer />
          <PopupContainer />
        </PlayerContext.Provider>
      </CanvasContext.Provider>
      <canvas ref={canvasRef} hidden />
    </div >
  )

  function projectShortCutFileLoadEffect() {
    projectShortCutFileLoad();
  }

  function _onFileOpen(_evt: Electron.IpcRendererEvent, path: string) {
    PopupManager.openFileOpenPopup({ path: path }, dispatch);
  }

  function _onSrtLoadAsync(_evt: Electron.IpcRendererEvent, path: string) {
    return ProjectIOManagerV2.srtLoadAsync(path, rootState);
  }

  function _onLoginExpired(_evt: Electron.IpcRendererEvent, domain: string) {
    if (ProjectManager.stcStatus === "Pending") {
      ProjectManager.cancelStc();
    }

    switch (domain) {
      case "stc":
      case "getSelectedCaption":
        player?.close();
        break;
      case "translate":
        ProjectManager.changeEditTab('origin');
        break;
      default:
        break;
    }

    props?.history?.replace("/login");
  }

  function _onLowLetter(_evt: Electron.IpcRendererEvent, param: { domain: string, letter: number }) {
    const context = React.useContext(PlayerContext);

    switch (param.domain) {
      case "trlaslate":
        ProjectManager.changeEditTab('origin');
        PopupManager.openLackOfLetterPopup({ 'letter': param.letter }, dispatch);
        break;
      case "reversTrlaslate":
        PopupManager.openLackOfLetterPopup({ 'letter': param.letter }, dispatch);
        break;
      case "stc":
        if (ProjectManager.stcStatus === "Pending") {
          IpcSender.sendStcRequestBreak();
          ProjectManager.cancelStc();
        }

        const player = context.player;
        ProjectManager.clearVideo(player);
        break;
      default:
        break;
    }

    props?.history?.replace("/login");
  }

  function _onErrorMessage(_evt: Electron.IpcRendererEvent, domain: string) {
    switch (domain) {
      case "stc":
        if (ProjectManager.stcStatus === "Pending") {
          ProjectManager.cancelStc();
        }
        break;
      case "googleLogin":
        props?.history?.replace("/login");
        break;
      case "captionUpload":
      case "videoUpload":
        PopupManager.close(dispatch);
        break;
      case "translate":
        ProjectManager.changeEditTab('origin');
        break;
      case "sentence":
      case "getSelectedCaption":
      case "getCaptionList":
      case "inquiry":
      case "youtubeSearch":
      default:
        break;
    }
  }

  function _onVideoExportStatusChange(_evt: Electron.IpcRendererEvent, _status: string) {
    throw new Error("_onVideoExportStatusChange is not yet implemented");
  }

  function _onProjectLoadAsync(_evt: Electron.IpcRendererEvent, row: any) {
    return ProjectIOManagerV2.projectLoadAsync(ProjectModelManager.Up(row));
  }


  function _onYoutubeVideoUpload(_evt: Electron.IpcRendererEvent, filePath: string) {
    PopupManager.openYoutubeVideoUploadPopup({ filePath: filePath }, dispatch);
  }

  function _ipcListenerIncrease() {
    ipcSender.onFileOpen(onFileOpenCallback);
    ipcSender.onSrtLoad(onSrtLoadAsyncCallback);
    ipcSender.onLoginExpired(onLoginExpiredCallback);
    ipcSender.onErrorMessage(onErrorMessageCallback);
    ipcSender.onVideoExportStatusChange(onVideoExportStatusChangeCallback);
    ipcSender.onProjectLoad(onProjectLoadAsyncCallback);
    ipcSender.onYoutubeVideoUpload(onYoutubeVideoUploadCallback);
    ipcSender.onLowLetter(onLowLetterCallback);
  }

  function _ipcListenerDecrease() {
    ipcSender.removeFileOpen(onFileOpenCallback);
    ipcSender.removeSrtOpen(onSrtLoadAsyncCallback);
    ipcSender.removeLoginExpired(onLoginExpiredCallback);
    ipcSender.removeErrorMessage(onErrorMessageCallback);
    ipcSender.removeVideoExportStatusChange(onVideoExportStatusChangeCallback);
    ipcSender.removeProjectLoad(onProjectLoadAsyncCallback);
    ipcSender.removeYoutubeVideoUpload(onYoutubeVideoUploadCallback);
    ipcSender.removeLowLetter(onLowLetterCallback);
  }

  function ipcListenerEffect() {
    ipcListenerIncreaseCallback();
    return ipcListenerDecreaseCallback;
  }

  function handleRedoUndoKeyDown(evt: KeyboardEvent) {
    if (rootState.getState().present.popup.name) {
      return;
    }

    if (evt.ctrlKey) {
      if (evt.shiftKey) {
        if (evt.code === "KeyZ") {
          RedoUndoActions.redo();
          evt.stopPropagation();
          evt.preventDefault();
          return;
        }
      }

      if (evt.code === "KeyZ") {
        RedoUndoActions.undo();
        evt.stopPropagation();
        evt.preventDefault();
        return;
      }
    }
  }

  function redoUndoEffect() {
    document.addEventListener('keydown', handleRedoUndoKeyDownCallback, true)

    return () => {
      document.removeEventListener('keydown', handleRedoUndoKeyDownCallback, true);
    }
  }
}

export default EditorPage;
