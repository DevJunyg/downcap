import PlayerContext from "contexts/PlayerContext";
import ParagraphCaptionsHelper from "helpers/ParagraphCaptionsHelper";
import IArea from "IArea";
import ComparerHelper from "lib/ComparerHelper";
import { PlayerEvent } from "lib/player/Player";
import OverlayHelper from "OverlayHelper";
import React from "react";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import MultilineOverlayContainer from "./MultilineOverlayContainer";

interface IMultilineOverlayProviderContainerProps {
  area?: IArea;
  fontUnitSize?: number;
}

function MultilineOverlayProviderContainer(props: IMultilineOverlayProviderContainerProps) {
  const { player } = React.useContext(PlayerContext);

  const multilineCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.multiline.captions);

  const multilineDefaultStyle = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsStyle | undefined
  >(state => state.present.multiline.defaultStyle);

  const projectDefaultStyle = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsStyle | undefined
  >(state => state.present.project.projectDefaultStyle);

  const originCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.originCaption.captions);

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const defaultStyle = multilineDefaultStyle ?? projectDefaultStyle;

  const [currentTime, setCurrentTime] = React.useState<number>(
    player?.isReady ? player.currentTime : -Infinity
  );

  React.useEffect(_timeUpdateEffect, [player, player?.isReady]);

  const displayIndexs = [];

  const focusType = focusParagraphMetas?.first().type;
  const focusPath = focusParagraphMetas?.first().path;

  const overlayTime = OverlayHelper.getStartTimeByfocusedParagraph({ originCaption: originCaptions, multiline: multilineCaptions }, focusType, focusPath) ?? currentTime;

  if (multilineCaptions?.any()) {
    for (let index = 0; index < multilineCaptions.length; index++) {
      const caption = multilineCaptions[index];
      const startTime = ParagraphCaptionsHelper.getParagraphStartTime(caption);
      if (ComparerHelper.compareParagraphAndTime(caption, overlayTime) === 0) {
        displayIndexs.push(index);
      } else if (overlayTime < startTime) {
        break;
      }
    }
  }

  return (
    <>
      {
        displayIndexs?.map(index => (
          <MultilineOverlayContainer key={multilineCaptions![index].id}
            area={props.area}
            caption={multilineCaptions![index]}
            paragraphIndex={index}
            defaultStyle={defaultStyle}
            fontUnitSize={props.fontUnitSize}
          />
        )) ?? null
      }
    </>
  );

  function _handleTimeUpdate(evt: PlayerEvent) {
    setCurrentTime(evt.target.currentTime);
  }

  function _timeUpdateEffect() {
    if (player && !player.isReady) {
      const playerReadyEvent = () => {
        setCurrentTime(player.currentTime);
        player?.removeReadyEventListener(playerReadyEvent);
      }

      player.addReadyEventListener(playerReadyEvent);
      return;
    }

    player?.addTimeUpdateEventListener(_handleTimeUpdate);

    return () => {
      player?.removeTimeUpdateEventListener(_handleTimeUpdate);
    }
  }
}

export default MultilineOverlayProviderContainer;