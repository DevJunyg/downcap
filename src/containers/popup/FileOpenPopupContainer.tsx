import React from 'react';
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import FileOpenPopup, { FileOpenOptionValueType } from "components/popup/FileOpenPopup";
import PathHelper from 'PathHelper';
import { IPopupProps } from 'containers/PopupContainer';
import { DowncapHelper } from 'DowncapHelper';
import IpcSender from 'lib/IpcSender';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import PopupManager, { IFileOpenPopupPayload } from 'managers/PopupManager';
import ProjectManager from 'managers/ProjectManager';
import PlayerGenerator from 'lib/player/PlayerGenerator';
import ProjectIOManagerV2 from 'managers/ProjectIOManagerV2';
import ClientAnalysisService from 'services/ClientAnalysisService';
import projectHistoryActions from 'storeV2/projectHistoryActions';
import { useTranslation } from 'react-i18next';

const logger = ReactLoggerFactoryHelper.build('FileOpenPopupContainer');
const playerId = "popup-player";

function FileOpenPopupContainer(props: IPopupProps) {
  const rootState = ReactRedux.useStore<store.RootState>();
  const fileOpenPayload = ReactRedux.useSelector<store.RootState, IFileOpenPopupPayload | undefined>(
    state => state.present.popup.payload as IFileOpenPopupPayload | undefined
  );

  const prevPath = ReactRedux.useSelector<store.RootState, string | undefined>(
    state => state.present.project.videoPath
  );

  const path = fileOpenPayload?.path;

  const dispatch = ReactRedux.useDispatch();

  const [duration, setDuration] = React.useState<number>();
  const [srtPath, setSrtPath] = React.useState<string>();
  const [selectedOption, setSelectOption] = React.useState<FileOpenOptionValueType>('STC');
  const [validationSummary, setValidationSummary] = React.useState<{ [key: string]: string }>({});

  React.useEffect(effectMetaLoad, [path]);

  return (
    <>
      <FileOpenPopup
        validationSummary={validationSummary}
        videoTitle={path && PathHelper.getFileNameWithoutExtension(path)}
        stcEstimatedTime={duration && DowncapHelper.guessTimeTakeOnSTC(duration)}
        stcEstimatedPaymentLetter={duration && DowncapHelper.guessPaidLetterOnSTC(duration)}
        srtFileName={srtPath && PathHelper.getFileName(srtPath)}
        selectedOption={selectedOption}
        onCloseClick={props.onCloseClick}
        onSelectOptionChange={handleSelectOption}
        onSrtOpenClick={handleSrtFileOpenAsync}
        onAcceptClick={handleAcceptAsync}
      />
      {/* div to collect video meta information  */}
      <div className={playerId} id={playerId} hidden />
    </>
  )

  function handleSelectOption(evt: React.ChangeEvent<HTMLInputElement>) {
    setSelectOption(evt.target.value as FileOpenOptionValueType);
  }

  async function handleSrtFileOpenAsync(evt: React.MouseEvent): Promise<void> {
    const srtPath = await IpcSender.invokeGetFilePathAsync(['srt']);
    if (srtPath === null) return;
    setSrtPath(srtPath);
    const { srtPathNotExist, ...nextsetValidationSummary } = validationSummary
    setValidationSummary(nextsetValidationSummary);
  }

  async function handleAcceptAsync(evt: React.MouseEvent): Promise<void> {
    if (prevPath !== path) {
      IpcSender.sendStcRequestBreak();
    }

    const openHandleAsyncDictinary: { [key in FileOpenOptionValueType]: () => Promise<boolean> } = {
      STC: _openSTCAsync,
      srt: _openSrtAsync,
      video: _openVideoAsync
    }

    const openHandlerAsync = openHandleAsyncDictinary[selectedOption];
    if (await openHandlerAsync()) {
      if (props.onCloseClick) props.onCloseClick(evt);
      else PopupManager.close(dispatch);

      const ProjectHistoryActions = projectHistoryActions(dispatch);
      ProjectHistoryActions.open();
    }

    return;

    async function _openSTCAsync() {
      ClientAnalysisService.localSpeechAnalysisClick();
      const userInfo = await IpcSender.invokeGetUserInfoAsync();
      if (userInfo === null) {
        logger.logWarning('User information not found.');
        return true;
      }

      const userLetter = userInfo.letter;
      if (userLetter === undefined) {
        logger.logWarning('userLetter is undefined');
        return true;
      }

      if (duration === undefined) {
        logger.logWarning('The duration of the video is undefined.');
        return true;
      }

      const predictLetter = DowncapHelper.guessPaidLetterOnSTC(duration) - userLetter;
      if (predictLetter > 0) {
        PopupManager.openLackOfLetterPopup({ letter: Math.floor(predictLetter) }, dispatch);
        evt.stopPropagation();
        return false;
      }

      await ProjectManager.clearAsync();
      _openVideo();
      ProjectManager.runLocalFileStc(path!);

      return true;
    }

    function _openVideo(): boolean {
      ProjectManager.openLocalVideo(path!);
      return true;
    }

    function _openVideoAsync(): Promise<boolean> {
      ClientAnalysisService.videoOpenClick();
      return Promise.resolve(_openVideo());
    }

    async function _openSrtAsync(): Promise<boolean> {
      const { t } = useTranslation('FileOpenPopupContainer_openSrtAsync');
      ClientAnalysisService.srtLoadClick();
      if (srtPath === undefined) {
        setValidationSummary({
          "srtPathNotExist": t('srtPath_NotExist')
        })
        return false;
      }

      await ProjectManager.clearAsync();

      _openVideo();
      await ProjectIOManagerV2.srtLoadAsync(srtPath, rootState);

      return true;
    }
  }

  function effectMetaLoad() {
    if (!path) {
      return;
    }

    const player = PlayerGenerator.open('popup-player', path, {
      onReady: _handlePlayerReady
    });

    return;

    function _handlePlayerReady() {
      setDuration(player.duration);
      player.close();
    }
  }
}

export default FileOpenPopupContainer;