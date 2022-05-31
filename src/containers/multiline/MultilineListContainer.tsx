import React from 'react';
import MultiLineList from "../../components/multilines/MultilineList";
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as multilineCaptionActions from 'storeV2/modules/multiline'
import { ISelection } from "models/ISelection";
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import CaptionLine, { ICaptionTimeFocusEventMeta } from 'components/caption/CaptionLine';
import { ICaptionEventMeta } from 'components/caption/CaptionInput';
import PlayerContext from 'contexts/PlayerContext';
import * as projectControlActions from 'storeV2/modules/projectControl';
import ProjectControlManager from 'managers/ProjectControlManager';

const logger = ReactLoggerFactoryHelper.build('MultilineContainer');

interface IMultiLineListContainerProps {
  onCreateButtonClick?: React.MouseEventHandler<HTMLButtonElement>
}

export interface IFocusMeta extends store.IIndexPath {
  selection?: ISelection;
}

export interface IHighlightMeta extends store.IIndexPath { }

function MultilineListContainer(props: IMultiLineListContainerProps) {
  const { player } = React.useContext(PlayerContext);

  const multilineCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.multiline.captions);

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const rootStore = ReactRedux.useStore<store.RootState>();

  const dispatch = ReactRedux.useDispatch();
  const handleChangeCallback = React.useCallback(_handleChange, [dispatch]);
  const handleWordClickCallback = React.useCallback(_handleWordClick, [dispatch, rootStore]);
  const hadnleFocusCallback = React.useCallback(_handleWordFocus, [player, rootStore]);


  let focusMeta = focusParagraphMetas
    ?.filter(meta => meta.type === "multiline")
    .first();

  let focusMetaPath = focusMeta?.path;

  const lineComponents = multilineCaptions?.map((caption, index) => {
    try {
      return _renderLineComponent(caption, index);
    } catch (err) {
      err instanceof Error && logger.logWarning(`Rendering failed on line ${index}.`, err);
      return null;
    }
  });

  return (
    <MultiLineList>
      {lineComponents}
    </MultiLineList>
  );

  function _renderLineComponent(caption: store.ICaptionsParagraph, captionIndex: number) {
    const line = caption.lines && caption.lines[0];
    if (line === undefined) {
      throw new TypeError('line reference not set to an instance of a caption.');
    }

    let meta = focusMetaPath?.paragraphIndex === captionIndex
      ? focusMetaPath
      : undefined;

    return (
      <CaptionLine
        key={caption.id} autoScroll
        line={line}
        highlightMeta={meta}
        focusMeta={focusMeta?.source === "list" ? meta : undefined}
        meta={{ paragraphIndex: captionIndex }}
        onChange={handleChangeCallback}
        onEndTimeTextBlur={_handleEndTimeTextBlur}
        onKeyDown={_handleKeyDown}
        onLineClick={_handleLineClick}
        onRemoveClick={_handleRemoveClick}
        onStartTimeTextBlur={_handleStartTimeTextBlur}
        onWordClick={handleWordClickCallback}
        onWordFocus={hadnleFocusCallback}
      />
    )
  }

  function _handleChange(evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (!meta) {
      logger.variableIsUndefined('meta', '_handleChange');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleChange');
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleChange');
      return;
    }

    if (meta.wordIndex === undefined) {
      logger.variableIsUndefined('meta.wordIndex', '_handleChange');
      return;
    }

    const { paragraphIndex, lineIndex, wordIndex } = meta;
    const MultilineCaptionActions = Redux.bindActionCreators(multilineCaptionActions, dispatch);
    MultilineCaptionActions.setText({
      path: {
        paragraphIndex: paragraphIndex,
        lineIndex: lineIndex,
        wordIndex: wordIndex
      },
      text: evt.target.value
    });
  }

  function _handleEndTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) {
    if (meta?.time === undefined) {
      logger.variableIsUndefined('meta?.time', '_handleStartTimeTextBulr');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleStartTimeTextBulr');
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleStartTimeTextBulr');
      return;
    }

    if (multilineCaptions === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleStartTimeTextBulr');
      return;
    }

    const MultilineCaptionActions = Redux.bindActionCreators(multilineCaptionActions, dispatch);
    MultilineCaptionActions.setEndTime({
      paragraphIndex: meta.paragraphIndex,
      lineIndex: meta.lineIndex,
      value: meta.time
    });
  }

  function _handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (evt.nativeEvent.isComposing) {
      return;
    }

    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleKeyDown', new Error("meta is undefined."));
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleKeyDown', new Error("meta.paragraphIndex is undefined."));
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleKeyDown', new Error("meta.lineIndex is undefined."));
      return;
    }

    if (meta.wordIndex === undefined) {
      logger.variableIsUndefined('meta.wordIndex', '_handleKeyDown', new Error("meta.wordIndex is undefined."));
      return;
    }

    const multilineCaptions = rootStore.getState().present.multiline.captions;
    if (multilineCaptions === undefined) {
      logger.variableIsUndefined('multilineCaptions', '_handleKeyDown', new Error('multilineCaptions are undefined.'));
      return;
    }


    return _handleKeyDownInternal(evt, multilineCaptions, meta as Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>);

    function _handleKeyDownInternal(
      evt: React.KeyboardEvent<HTMLInputElement>,
      captions: store.ICaptionsParagraph[],
      meta: Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>
    ) {
      const keyDownEventHandlDict: {
        [code: string]: () => void
      } = {
        "ArrowDown": _handleArrowDownKeyDown,
        "ArrowUp": _handleArrowUpKeyDown,
      };

      try {
        const handle = keyDownEventHandlDict[evt.code];
        handle && handle();
      } catch (err) {
        err instanceof Error && logger.logWarning(err);
      }

      function _handleArrowDownKeyDown() {
        if (meta.paragraphIndex! >= captions.length - 1) {
          const lastWordIndex = captions.last().lines!.last().words!.length - 1;
          _setFocusMetaByKeybordEvent({
            ...meta,
            wordIndex: lastWordIndex
          });

          return;
        }

        const nextParagraphIndex = meta.paragraphIndex + 1;
        const words = captions[nextParagraphIndex]!.lines![meta.lineIndex!].words!;
        const nextwordIndex = Math.min(meta.wordIndex!, words.length - 1);

        _setFocusMetaByKeybordEvent({
          ...meta,
          paragraphIndex: nextParagraphIndex,
          wordIndex: nextwordIndex
        });
      }

      function _handleArrowUpKeyDown() {
        if (meta.paragraphIndex! <= 0) {
          _setFocusMetaByKeybordEvent({
            ...meta,
            wordIndex: 0
          });

          return;
        }

        const nextParagraphIndex = meta.paragraphIndex - 1;
        const words = captions[nextParagraphIndex]!.lines![meta.lineIndex!].words!;
        const nextWordIndex = Math.min(meta.wordIndex!, words.length - 1);

        _setFocusMetaByKeybordEvent({
          ...meta,
          paragraphIndex: nextParagraphIndex,
          wordIndex: nextWordIndex
        });
      }
    }
  }

  function _setFocusMetaByKeybordEvent(meta: ICaptionEventMeta & { selection?: ISelection }) {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        selection: {
          start: 0,
          end: -1,
        },
        ...meta
      },
      source: 'list',
      type: 'multiline'
    }]);

    if (store.default.getState().present.projectCotrol.selectedStyleEditType !== 'word') {
      ProjectControlActions.setSelectedStyleEditType('word');
    }
  }

  function _handleRemoveClick(evt: React.MouseEvent<HTMLButtonElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleRemoveClick');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.pragraphIndex', '_handleRemoveClick');
      return;
    }

    if (multilineCaptions === undefined) {
      logger.variableIsUndefined('multilineCaptions', '_handleRemoveClick');
      return;
    }

    const MultilineCaptionActions = Redux.bindActionCreators(multilineCaptionActions, dispatch);
    MultilineCaptionActions.removeParagraph(meta.paragraphIndex);
    evt.stopPropagation();
  }

  function _handleStartTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) {
    if (meta?.time === undefined) {
      logger.variableIsUndefined('meta?.time', '_handleStartTimeTextBulr');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleStartTimeTextBulr');
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleStartTimeTextBulr');
      return;
    }

    if (multilineCaptions === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleStartTimeTextBulr');
      return;
    }

    const MultilineCaptionActions = Redux.bindActionCreators(multilineCaptionActions, dispatch);
    MultilineCaptionActions.setStartTime({
      paragraphIndex: meta.paragraphIndex,
      lineIndex: meta.lineIndex,
      value: meta.time
    });
  }


  function _handleLineClick(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        ...meta
      },
      source: 'list',
      type: 'multiline'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'line');
    
    if (multilineCaptions === undefined) {
      logger.variableIsUndefined('multilineCaptions', '_handleLineClick');
      return;
    }

    if (!meta) {
      logger.variableIsUndefined('meta', '_handleLineClick');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleLineClick');
      return;
    }

    const lines = multilineCaptions[meta.paragraphIndex].lines;
    const words = lines.first().words;
    const word = words.first();

    if (!player) {
      logger.variableIsUndefined('player', '_handleLineClick');
      return;
    }

    if (player?.isReady) {
      player.currentTime = word.start;
    }
  }

  function _handleWordClick(evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        selection: {
          start: evt.currentTarget.selectionStart ?? 0,
          end: evt.currentTarget.selectionEnd ?? evt.currentTarget.value.length
        },
        ...meta
      },
      source: 'list',
      type: 'multiline'
    }]);

    evt.stopPropagation();
    ProjectControlManager.changeStyleEditType(rootStore, 'word');
  }

  function _handleWordFocus(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (!player) {
      logger.variableIsUndefined('player', '_handleWordFocus');
      return;
    }

    const _multilineCaptions = rootStore.getState().present.multiline?.captions;
    if (_multilineCaptions === undefined) {
      logger.variableIsUndefined('_multilineCaptions', '_handleWordFocus');
      return;
    }

    if (!meta) {
      logger.variableIsUndefined('meta', '_handleWordFocus');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleWordFocus');
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleWordFocus');
      return;
    }

    if (meta.wordIndex === undefined) {
      logger.variableIsUndefined('meta.wordIndex', '_handleWordFocus');
      return;
    }

    const lines = _multilineCaptions[meta.paragraphIndex].lines;
    if (lines === undefined) {
      logger.variableIsUndefined('lines', '_handleWordFocus');
      return;
    }

    const words = lines[meta.lineIndex].words;
    if (words === undefined) {
      logger.variableIsUndefined('words', '_handleWordFocus');
      return;
    }

    const word = words[meta.wordIndex];
    if (player?.isReady) {
      player.currentTime = word.start;
      player.pause();
    }
  }
}

export default MultilineListContainer;