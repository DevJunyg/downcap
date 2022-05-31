import DualSubtitles from "components/subtitle/DualSubtitles";
import PlayerContext from "contexts/PlayerContext";
import DualCaptionHelper from "helpers/DualCaptionHelper";
import "JsExtensions";
import BinarySearchHelper from "lib/BinarySearchHelper";
import ComparerHelper from "lib/ComparerHelper";
import { PlayerEvent } from "lib/player/Player";
import React from "react";
import * as ReactRedux from 'react-redux';
import { bindActionCreators } from "redux";
import * as store from 'storeV2';
import * as dualCaptionActions from 'storeV2/modules/dualCaption';

function DualCaptionListContainer() {
  const { player } = React.useContext(PlayerContext);

  const originCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.originCaption.captions);

  const translatedCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionTranslatedParagraphWithId[] | undefined
  >(state => state.present.translatedCaption.captions);

  const dualCaption = ReactRedux.useSelector<
    store.RootState,
    store.IEventParagraph[] | undefined
  >(state => state.present.dualCaption.captions);

  const sequence = ReactRedux.useSelector<
    store.RootState,
    store.SequenceType[]
  >(state => state.present.project.sequence);

  const rootStore = ReactRedux.useStore();
  const dispatch = rootStore.dispatch;

  React.useEffect(_craeteDualCaptionEffect, [rootStore, originCaptions, translatedCaptions, sequence, dispatch])
  React.useEffect(_timeUpdateEffect, [player]);
  const [currentTime, setCurrnetTime] = React.useState<number>(player?.isReady ? player.currentTime : 0);

  const captionIndex = dualCaption && BinarySearchHelper.findIndex(
    dualCaption,
    currentTime,
    (left, right) => ComparerHelper.compareTimeAndCurrentTime({ start: left.start, end: left.end }, right)
  );

  return (
    <div>
      {dualCaption?.map((paragraph, index) => (
        <DualSubtitles key={index} autoScroll={index === captionIndex}
          className={index === captionIndex ? 'double-subtitles-highlight' : undefined}
          paragraph={paragraph}
          onClick={evt => _handleClick(evt, index)}
        />))}
    </div>
  )

  function _handleClick(evt: React.MouseEvent, index: number) {
    if (!dualCaption) {
      return;
    }

    const start = dualCaption[index].start;
    if (player?.isReady) {
      player.currentTime = start;
    }
  }

  function _craeteDualCaptionEffect() {
    const state = rootStore.getState();

    const originStyle = state.present.originCaption.defaultStyle ?? state.present.project.projectDefaultStyle;
    let origin = originCaptions?.map(p => {
      let line = {
        ...p.lines.first(),
        style: {
          ...originStyle,
          ...p.lines.first().style
        }
      };
      return {
        ...p,
        lines: [line]
      }
    }) ?? [];

    const translateStyle = state.present.translatedCaption.defaultStyle ?? state.present.project.projectDefaultStyle;
    let trans = translatedCaptions?.map(item => item.paragraphs)
      .flat()
      .map(p => {
        let line = {
          ...p.lines.first(),
          style: {
            ...translateStyle,
            ...p.lines.first().style
          }
        };
        return {
          ...p,
          lines: [line]
        }
      }) ?? [];

    const captions = {
      'origin': origin,
      'translated': trans
    };

    const newDualCaption = DualCaptionHelper.createDualCaptions(
      captions[sequence[0]] ?? [],
      captions[sequence[1]] ?? []
    );

    const DualCaptionActions = bindActionCreators(dualCaptionActions, dispatch);
    DualCaptionActions.setCaptions(newDualCaption);
  }

  function _timeUpdateEffect() {
    if (!player) {
      return;
    }

    player.addTimeUpdateEventListener(_handleTimeUpdate);

    return () => {
      player.removeTimeUpdateEventListener(_handleTimeUpdate);
    }
  }

  function _handleTimeUpdate(evt: PlayerEvent) {
    setCurrnetTime(evt.target.currentTime);
  }
}
export default React.memo(DualCaptionListContainer);