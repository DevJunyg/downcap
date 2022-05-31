import PlayerContext from "contexts/PlayerContext";
import IArea from "IArea";
import { PlayerEvent } from "lib/player/Player";
import ComparerHelper from "lib/ComparerHelper";
import React from "react";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import DualMultilineOverlayContainer from "./DualMultilineOverlayContainer";

interface IDualMultilineOverlayProviderContainerProps {
  area?: IArea;
  fontUnitSize?: number;
}

function DualMultilineOverlayProviderContainer(props: IDualMultilineOverlayProviderContainerProps) {
  const { player } = React.useContext(PlayerContext);


  const dualMultilines = ReactRedux.useSelector<
    store.RootState,
    store.IEventParagraph[] | undefined
  >(state => state.present.dualMultiline.captions);

  const [currentTime, setCurrentTime] = React.useState<number>(
    player?.isReady ? player.currentTime : -Infinity
  );
 
  React.useEffect(_timeUpdateEffect, [player, player?.isReady]);
  
  const displayIndices = [];

  if (dualMultilines?.any()) {
    for (let index = 0; index < dualMultilines.length; index++) {
      const caption = dualMultilines[index];
      const captionTime = {
        start: caption.start,
        end: caption.end
      };

      if (ComparerHelper.compareTimeAndCurrentTime(captionTime, currentTime) === 0) {
        displayIndices.push(index);
      }
      else if (currentTime < caption.start) {
        break;
      }
    }
  }

  return (
    <>
      {
        displayIndices?.map(index => (
          <DualMultilineOverlayContainer
            key={dualMultilines![index].id ?? index}
            area={props.area}
            fontUnitSize={props.fontUnitSize}
            paragraphIndex={index}
            caption={dualMultilines![index]}
          />
        )) ?? null
      }
    </>
  );

  function _handleTimeUpdate(evt: PlayerEvent) {
    setCurrentTime(evt.target.currentTime);
  }

  function _timeUpdateEffect() {
    if (!player) {
      return;
    }

    if (!player.isReady) {
      const playerReadyEvent = () => {
        setCurrentTime(player.currentTime);
        player.removeReadyEventListener(playerReadyEvent);
      }

      player.addReadyEventListener(playerReadyEvent);
      return;
    }

    player.addTimeUpdateEventListener(_handleTimeUpdate);

    return () => {
      player.removeTimeUpdateEventListener(_handleTimeUpdate);
    }
  }
}

export default DualMultilineOverlayProviderContainer;