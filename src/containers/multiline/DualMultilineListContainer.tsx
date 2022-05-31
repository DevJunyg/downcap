import DualSubtitles from "components/subtitle/DualSubtitles";
import PlayerContext from "contexts/PlayerContext";
import DualCaptionHelper from "helpers/DualCaptionHelper";
import React from "react";
import * as ReactRedux from 'react-redux';
import { bindActionCreators } from "redux";
import * as store from 'storeV2';
import * as dualMultilineActions from 'storeV2/modules/dualMultiline';

function DualMultilineListContainer() {
  const { player } = React.useContext(PlayerContext);

  const multilines = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.multiline.captions);

  const translatedMultilines = ReactRedux.useSelector<
    store.RootState,
    store.ITranslatedMultilineCaption[] | undefined
  >(state => state.present.translatedMultiline.captions);

  const dualMultilines = ReactRedux.useSelector<
    store.RootState,
    store.IEventParagraph[] | undefined
  >(state => state.present.dualMultiline.captions);

  const sequence = ReactRedux.useSelector<
    store.RootState,
    store.SequenceType[]
  >(state => state.present.project.sequence);

  const dispatch = store.default.dispatch;

  React.useEffect(_createDualMultilineEffect, [multilines, translatedMultilines, sequence, dispatch]);

  return (
    <div>
      {dualMultilines?.map((paragraph, index) => (
        <DualSubtitles key={index}
          paragraph={paragraph}
          onClick={evt => _handleClick(evt, index)}
        />))}
    </div>
  );

  function _handleClick(evt: React.MouseEvent, index: number) {
    if (!dualMultilines) {
      return;
    }

    const start = dualMultilines[index].start;
    if (player?.isReady) {
      player.currentTime = start;
    }
  }

  function _createDualMultilineEffect() {
    const state = store.default.getState();

    const multiStyle = state.present.multiline.defaultStyle ?? state.present.project.projectDefaultStyle;
    let multi = multilines?.map(p => {
      let line = p.lines.first();
      let nextLine = { ...p.lines.first(), style: { ...multiStyle, ...line.style } };
      return {
        ...p,
        lines: [nextLine]
      }
    }) ?? [];

    const translatedStyle = state.present.translatedMultiline.defaultStyle ?? state.present.project.projectDefaultStyle;
    let trans = translatedMultilines?.map(p => {
      let line = p.lines.first();
      let nextLine = { ...p.lines.first(), style: { ...translatedStyle, ...line.style } };
      return {
        ...p,
        lines: [nextLine]
      }
    }) ?? [];

    const dualMultiline = DualCaptionHelper.createDualMultiline(multi, trans, sequence);
    const DualMultilineActions = bindActionCreators(dualMultilineActions, dispatch);
    DualMultilineActions.setCaptions(dualMultiline);
  }
}

export default React.memo(DualMultilineListContainer);