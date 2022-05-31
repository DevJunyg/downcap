import React from "react";

import Player from 'lib/player/Player';
import PlayerGenerator from 'lib/player/PlayerGenerator';

import { IPopupProps } from "containers/PopupContainer";
import * as store from 'storeV2';
import * as originCaptionActions from 'storeV2/modules/originCaption';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import { DowncapHelper } from "DowncapHelper";
import { getCaptionListAsync, getSelectedCaptionAsync } from "lib/windows";
import IpcSender from "lib/IpcSender";
import PathHelper from "PathHelper";
import PopupManager from "managers/PopupManager";
import YoutubeCaption from "models/YoutubeCaption";
import "JsExtensions";
import YouTubePlayListSelectPopup from "components/popup/youtube/YouTubeVideoOpenPopup";
import IYouTubeSearchResult from "models/youtube/IYouTubeSearchResult";
import ProjectManager from "managers/ProjectManager";
import SrtParser from "SrtParser";
import ClientAnalysisService from "services/ClientAnalysisService";
import { useTranslation } from "react-i18next";

export type SelectOptionType = "stt" | "localCaptionLoad" | "youTubeCaption" | "video";

interface IYoutubePlayListSelectPopupContainerProps extends IPopupProps { }

const logger = ReactLoggerFactoryHelper.build('YoutubePlayListSelectPopupContainer');

const DEFAULT_PROJECT_NAME = "downcap";

export default function YouTubeVideoOpenPopupContainer(props: IYoutubePlayListSelectPopupContainerProps) {
  let player = React.useRef<Player | null>(null);
  const [selectYouTubeCaptionId, setSelectYouTubeCaptionId] = React.useState<string | null>();
  const [youTubeCaptions, setYouTubeCaptions] = React.useState<YoutubeCaption[]>();
  const [selectedOption, setSelectedOption] = React.useState<SelectOptionType>('stt');
  const [captionDoesNotExist, setCaptionDoesNotExist] = React.useState<boolean>();
  const [stcEstimatedTime, setStcEstimatedTime] = React.useState<number>();
  const [paymentLetter, setPaymentLetter] = React.useState<number>();
  const [srtPath, setSrtPath] = React.useState<string>();

  const dispatch = ReactRedux.useDispatch();

  const youTubeSearchResultMap = ReactRedux.useSelector(_getPopupPayload);
  const videoId = youTubeSearchResultMap?.id.videoId;
  const videoTitle = youTubeSearchResultMap?.snippet?.title;
  React.useEffect(_metadataLoadEffect, [videoId]);
  React.useEffect(_captionLoadEffect, [videoId]);

  return (
    <YouTubePlayListSelectPopup
      captions={youTubeCaptions}
      selectedOption={selectedOption}
      captionDoesNotExist={captionDoesNotExist}
      stcEstimatedTime={stcEstimatedTime}
      paymentLetter={paymentLetter}
      videoTitle={videoTitle}
      srtFileName={srtPath && PathHelper.getFileName(srtPath)}
      onCancelClick={props.onCloseClick}
      onCloseClick={props.onCloseClick}
      onAcceptClick={_handleAcceptClickAsync}
      onYouTubeCaptionLoadHelpMessageClick={_hadnleYouTubeCaptionLoadHelpMessageClick}
      onSrtFileOpenClick={_handlSrtFileOpenClickAsync}
      onOptionChange={_handleOptionChange}
      onYouTubeCaptionSelectChange={_handleYouTubeCaptionSelectChange}
    />
  )

  function _getPopupPayload(state: store.RootState) {
    return state.present.popup.payload as IYouTubeSearchResult | undefined;
  }

  function _metadataLoadEffect() {
    if (!videoId) {
      return;
    }

    player.current = PlayerGenerator.open('playlist-popup-player', `https://youtu.be/${videoId}`, {
      onReady: _handleReady
    })


    return;
    function _handleReady() {
      let _player = player.current;
      if (_player === null) {
        logger.variableIsUndefined('_player', "_handleReady");
        return;
      }

      const duration = _player.duration;
      setStcEstimatedTime(DowncapHelper.guessTimeTakeOnSTC(duration));
      setPaymentLetter(DowncapHelper.guessPaidLetterOnSTC(duration));
      _player.close();
    }
  }

  function _captionLoadEffect() {
    if (!videoId) {
      return;
    }

    getCaptionListAsync(videoId)
      .then(captions => {
        if (captions?.items?.length === 0) {
          setCaptionDoesNotExist(true);
          return;
        }

        setYouTubeCaptions(captions?.items);
        setSelectYouTubeCaptionId(captions?.items?.first()?.id);
      });
  }

  async function _handleAcceptClickAsync(evt: React.MouseEvent<HTMLDivElement>) {
    try {
      if (!videoId) {
        logger.variableIsUndefined('videoId', '_handleAcceptClickAsync', new Error());
        return;
      }

      await ProjectManager.clearAsync();
      ProjectManager.openYouTubeVideo(videoId, videoTitle ?? DEFAULT_PROJECT_NAME)


      switch (selectedOption) {
        case "stt":
          ClientAnalysisService.youTubeSpeechAnalysisClick();
          ProjectManager.runYouTubeStc(videoId);
          break;
        case "localCaptionLoad":
          ClientAnalysisService.localCaptionLoadInYouTubeClick();
          if (srtPath === undefined) {
            logger.variableIsUndefined('srtPath', '_handleAcceptClickAsync', new Error())
            return;
          }

          const srt = await IpcSender.invokeReadFileAsync(srtPath);
          const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);
          OriginCaptionActions.setCaptions(SrtParser.parser(srt));

          break;
        case "youTubeCaption":
          ClientAnalysisService.youTubeCaptionLoadClick();
          try {
            const selectedCaption = await getSelectedCaptionAsync(selectYouTubeCaptionId);
            if (selectedCaption === null) {
              logger.variableIsUndefined('selectedCaption', '_handleAcceptClickAsync', new Error())
              break;
            }

            const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);
            OriginCaptionActions.setCaptions(SrtParser.parser(selectedCaption));
          } catch (err) {
            err instanceof Error && logger.logWarning(err);
          }

          break;
        case "video":
          ClientAnalysisService.youTubeVideoLoadClick();
          break;
        default:
          break;
      }
    }
    finally {
      PopupManager.close(dispatch);
    }

  }

  function _hadnleYouTubeCaptionLoadHelpMessageClick(evt: React.MouseEvent<HTMLDivElement>) {
    const { t } = useTranslation('YouTubeVideoOpenPopupContainer');
    IpcSender.sendGoogleLogin(t('youtube_CaptionLoad_HelpMessage'));
  }

  async function _handlSrtFileOpenClickAsync(evt: React.MouseEvent<HTMLDivElement>) {
    const srtPath = await IpcSender.invokeGetFilePathAsync(['srt']);
    if (srtPath === null) return;
    setSrtPath(srtPath);
  }

  function _handleOptionChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setSelectedOption(evt.target.value as SelectOptionType);
  }

  function _handleYouTubeCaptionSelectChange(evt: React.ChangeEvent<HTMLSelectElement>) {
    setSelectYouTubeCaptionId(evt.target.value ?? null);
  }
}