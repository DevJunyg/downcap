import PlayerContext from "contexts/PlayerContext";
import ParagraphCaptionsHelper from "helpers/ParagraphCaptionsHelper";
import IArea from "IArea";
import ComparerHelper from "lib/ComparerHelper";
import { PlayerEvent } from "lib/player/Player";
import OverlayHelper from "OverlayHelper";
import React from "react";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import TranslatedMultilineOverlayContainer from "./TranslatedMultilineOverlayContainer";

interface IMultilineOverlayProviderContainerProps {
  area?: IArea;
  fontUnitSize?: number;
}

function TranslatedMultilineOverlayProviderContainer(props: IMultilineOverlayProviderContainerProps) {
  const { player } = React.useContext(PlayerContext);


  const multilineCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ITranslatedMultilineCaption[] | undefined
  >(state => state.present.translatedMultiline.captions);

  const defaultStyle = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsStyle | undefined
  >(state => state.present.translatedMultiline.defaultStyle ?? state.present.project.projectDefaultStyle);

  const translatedCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionTranslatedParagraphWithId[] | undefined
  >(state => state.present.translatedCaption.captions);

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const [currentTime, setCurrentTime] = React.useState<number>(
    player?.isReady ? player.currentTime : 0
  );

  React.useEffect(_timeUpdateEffect, [player, player?.isReady]);
  
  const displayIndexs = [];
  
  const focusType = focusParagraphMetas?.first().type;
  const focusPath = focusParagraphMetas?.first().path;

  const overlayTime = OverlayHelper.getStartTimeByfocusedParagraph({ translatedCaption: translatedCaptions, translatedMultiline: multilineCaptions }, focusType, focusPath) ?? currentTime;

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
          <TranslatedMultilineOverlayContainer key={multilineCaptions![index].id}
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
        player.removeReadyEventListener(playerReadyEvent);
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

export default TranslatedMultilineOverlayProviderContainer;