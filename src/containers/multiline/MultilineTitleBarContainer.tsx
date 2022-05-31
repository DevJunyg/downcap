import MultilineTitleBarDefaultType from 'components/multilines/MultilineTitleBarDefaultType';
import MultilineTitleBarDualType from 'components/multilines/MultilineTitleBarDualType';
import PlayerContext from 'contexts/PlayerContext';
import IpcSender from 'lib/IpcSender';
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as Redux from 'redux';
import * as multiLineActions from 'storeV2/modules/multiline';
import * as translatedMultilineActions from 'storeV2/modules/translatedMultiline';
import ClientAnalysisService from 'services/ClientAnalysisService';
import * as projectControlActions from 'storeV2/modules/projectControl';
import ProjectControlManager from 'managers/ProjectControlManager';
import BinarySearchHelper from 'lib/BinarySearchHelper';
import ComparerHelper from 'lib/ComparerHelper';

const CAPTION_DEFAULT_TEXT = "새로 생성한 줄입니다";
const CAPTION_DEFAULT_TRANSLATED_TEXT = "This is a newly created line";
interface IMultilineTitleBarContainerProps {
  selectedEditType?: store.EditType
}

function MultilineTitleBarContainer(props: IMultilineTitleBarContainerProps) {
  const rootStore = ReactRedux.useStore<store.RootState>();

  const multilineCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.multiline.captions)

  const { player } = React.useContext(PlayerContext);

  const MultilineTitleDict: { [editType in store.EditType]: () => JSX.Element } = {
    "dual": () => <MultilineTitleBarDualType />,
    "origin": () => <MultilineTitleBarDefaultType onCreateButtonClick={_handleMultiLineCreateButtonClick} />,
    "translated": () => <MultilineTitleBarDefaultType onCreateButtonClick={_handleTranlstaedMultiLineCreateButtonClick} />,
  }

  const MultilineTitlebar = MultilineTitleDict[props.selectedEditType ?? "origin"];
  const dispatch = ReactRedux.useDispatch();

  return (
    <MultilineTitlebar />
  )

  function _handleMultiLineCreateButtonClick() {
    ClientAnalysisService.createMultilineClick(props.selectedEditType ?? "origin");
    IpcSender.sendMultiLineWarning();

    const start = player?.isReady ? player.currentTime : 0;
    const end = Math.min(start + 30, player?.isReady ? player.duration : Infinity);

    const MultiLineActions = Redux.bindActionCreators(multiLineActions, dispatch);

    MultiLineActions.addParagraph({
      lines: [{
        words: [{
          end: end,
          start: start,
          text: CAPTION_DEFAULT_TEXT
        }]
      }]
    });

    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);;

    if (!multilineCaptions) {
      return;
    };

    const index = BinarySearchHelper.findInsertIndex(
      multilineCaptions,
      {
        lines: [{
          words: [{
            end: end,
            start: start,
            text: CAPTION_DEFAULT_TEXT
          }]
        }]
      },
      (left, right) => -ComparerHelper.multitlieCompare(left, right)
    );

    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        selection: {
          start: 0,
          end: 0
        },
        paragraphIndex: index
      },
      source: 'list',
      type: 'multiline'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'line');
  }

  function _handleTranlstaedMultiLineCreateButtonClick() {
    IpcSender.sendMultiLineWarning();

    const start = player?.isReady ? player.currentTime : 0;
    const duration = player?.isReady ? player.duration : Infinity;
    const end = Math.min(start + 30, duration);

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, dispatch);

    TranslatedMultilineActions.addCaption(({
      lines: [{
        words: [{
          end: end,
          start: start,
          text: CAPTION_DEFAULT_TRANSLATED_TEXT 
        }]
      }]
    }));
  }
}

export default MultilineTitleBarContainer;