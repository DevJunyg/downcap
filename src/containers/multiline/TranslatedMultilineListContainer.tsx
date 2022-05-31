import React from 'react';
import MultiLineList from "../../components/multilines/MultilineList";
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as translatedMultilineActions from 'storeV2/modules/translatedMultiline';
import * as sagasActions from 'storeV2/sagaActions';
import { ISelection } from "models/ISelection";
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import CaptionLine, { ICaptionTimeFocusEventMeta } from 'components/caption/CaptionLine';
import { ICaptionEventMeta } from 'components/caption/CaptionInput';
import PlayerContext from 'contexts/PlayerContext';
import * as projectControlActions from 'storeV2/modules/projectControl';
import IdGenerator from 'storeV2/IdGenerator';
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper'
import ComparerHelper from 'lib/ComparerHelper';
import ProjectControlManager from 'managers/ProjectControlManager';

const logger = ReactLoggerFactoryHelper.build('TranslatedMultilineListContainer');

export interface IFocusMeta extends store.IIndexPath {
  selection?: ISelection;
}

export interface IHighlightMeta extends store.IIndexPath { }

function TranslatedMultilineListContainer() {
  const { player } = React.useContext(PlayerContext);

  const multiline = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.multiline.captions);

  const translatedMultilines = ReactRedux.useSelector<
    store.RootState,
    store.ITranslatedMultilineCaption[] | undefined
  >(state => state.present.translatedMultiline.captions);

  const checkPointId = ReactRedux.useSelector<
    store.RootState,
    number | undefined
  >(state => state.present.translatedMultiline.checkpoint) ?? -1;

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const rootStore = ReactRedux.useStore()
  const dispatch = ReactRedux.useDispatch();
  const handleChangeCallback = React.useCallback(_handleChange, [dispatch]);
  const handleWordClickCallback = React.useCallback(_handleWordClick, [dispatch, player, rootStore]);
  const hadnleFocusCallback = React.useCallback(_handleWordFocus, [player]);

  const [lock, setLock] = React.useState(false);
  React.useEffect(_captionUpdateEffect, [
    multiline,
    dispatch,
    checkPointId,
    translatedMultilines,
    lock
  ]);

  let focusMeta = focusParagraphMetas
    ?.filter(meta => meta.type === "translatedMultiline")
    .first();

  let focusMetaPath = focusMeta?.path;

  const lineComponents = translatedMultilines?.map((caption, index) => {
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

  function _captionUpdateEffect() {
    if (lock) {
      return;
    }

    setLock(true);
    const SagaActions = Redux.bindActionCreators(sagasActions, dispatch);
    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, dispatch);

    let sourceLineDict: { [key: number]: store.ICaptionsParagraph } = {};
    multiline?.forEach(line => sourceLineDict[line.id!] = line);

    let translatedDict: { [key: number]: store.ITranslatedMultilineCaption } = {};
    translatedMultilines?.forEach(line => translatedDict[line.id!] = line);

    if (Object.keys(translatedDict).length === 0) {
      multiline?.forEach(line => {
        SagaActions.createTranslatedMultilineByOriginMultiline(line);
      });

      TranslatedMultilineActions?.setCheckPoint(
        IdGenerator.getNextId('origin', 'paragraph')
      );
      return;
    }

    const translatedSourceIds = new Set(translatedMultilines?.map(
      line => line.meta?.sourceId
    ));

    const sourceLineIds = new Set(multiline?.map(line => line.id!));

    const existingSourceLines = ToLines(sourceLineDict, line => translatedSourceIds.has(line.id!));

    if (existingSourceLines.length > 0) {
      handleExistingLiensDetection(existingSourceLines);
    }

    const newSourceLines = ToLines(sourceLineDict, line => {
      const id = line.id!
      return checkPointId < id && !translatedSourceIds.has(id);
    });

    if (newSourceLines.length > 0) {
      handleNewLiensDetection(newSourceLines);
    }

    const removedLines = ToLines(translatedDict, line => {
      const sourceId = line.meta?.sourceId;
      return sourceId !== undefined && !sourceLineIds.has(sourceId);
    });

    if (removedLines.length > 0) {
      handleRemoveLiensDetection(removedLines);
    }

    TranslatedMultilineActions.setCheckPoint(
      IdGenerator.getNextId('origin', 'paragraph')
    );

    return;

    function ToLines<T>(dict: { [key: number]: T }, filter: (origin: T) => boolean) {
      let output = [];
      for (const key of Object.keys(dict)) {
        const line = dict[Number.parseInt(key)];
        if (filter(line)) {
          output.push(line);
        }
      }

      return output;
    }

    function handleNewLiensDetection(newLines: store.ICaptionsParagraph[]) {
      newLines.forEach(line => SagaActions?.addTranslatedMultilineByOriginMultiline(line));
    }

    function handleExistingLiensDetection(sourceLines: store.ICaptionsParagraph[]) {
      let existingSourceLineDict: { [key: number]: store.ICaptionsParagraph } = {};
      sourceLines.forEach(sourceLine => existingSourceLineDict[sourceLine.id!] = sourceLine);

      translatedMultilines?.forEach(translatedLine => {
        const existingSourceLine = translatedLine.meta?.sourceId !== undefined
          ? existingSourceLineDict[translatedLine.meta.sourceId]
          : undefined;

        if (existingSourceLine === undefined) {
          return;
        }

        const sourceText = ParagraphCaptionsHelper.toText([existingSourceLine]);

        if (translatedLine.meta?.sourceText !== sourceText
          || ComparerHelper.compareParagraph(existingSourceLine, translatedLine) !== 0) {
          SagaActions.updateTranslatedMultiline({
            originCaption: existingSourceLine,
            translatedCaption: translatedLine
          });
        }
      });
    }

    function handleRemoveLiensDetection(removedCaptions: store.ITranslatedMultilineCaption[]) {
      removedCaptions.forEach(caption => {
        const { sourceId, ...meta } = caption.meta!;
        caption = {
          ...caption,
          meta: meta
        };

        TranslatedMultilineActions.updateCaptionById(caption);
      })
    }
  }

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

  function _handleLineClick(_evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        ...meta
      },
      source: 'list',
      type: 'translatedMultiline'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'line');

    if (translatedMultilines === undefined) {
      logger.variableIsUndefined('translatedMultilines', '_handleLineClick');
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

    const lines = translatedMultilines[meta.paragraphIndex].lines;
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
    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, dispatch);
    TranslatedMultilineActions.setText({
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

    if (translatedMultilines === undefined) {
      logger.variableIsUndefined('translatedMultilines', '_handleStartTimeTextBulr');
      return;
    }

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, dispatch);
    TranslatedMultilineActions.setEndTime({
      caption: translatedMultilines[meta.paragraphIndex],
      time: meta.time
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

    const multilineCaptions = store
      .default
      .getState()
      ?.present
      .translatedMultiline
      .captions;

    if (multilineCaptions === undefined) {
      logger.variableIsUndefined('multilineCaptions', '_handleKeyDown', new Error('multilineCaptions are undefined.'));
      return;
    }

    return _handleKeyDownInternal(
      evt, multilineCaptions,
      meta as Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>);

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
        "Tab": () => { evt.preventDefault(); evt.stopPropagation(); }
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
      type: 'translatedMultiline'
    }]);


    if (rootStore.getState().present.projectCotrol.selectedStyleEditType !== 'line') {
      ProjectControlActions.setSelectedStyleEditType('line');
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

    if (translatedMultilines === undefined) {
      logger.variableIsUndefined('translatedMultilines', '_handleRemoveClick');
      return;
    }

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, dispatch);
    TranslatedMultilineActions.removeCaption(meta.paragraphIndex);
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

    if (translatedMultilines === undefined) {
      logger.variableIsUndefined('translatedMultilines', '_handleStartTimeTextBulr');
      return;
    }

    const TranslatedMultilineActions = Redux.bindActionCreators(translatedMultilineActions, dispatch);
    TranslatedMultilineActions.setStartTime({
      caption: translatedMultilines[meta.paragraphIndex],
      time: meta.time
    });
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
      type: 'translatedMultiline'
    }]);

    if (player?.isReady) {
      player.pause();
    }

    evt.stopPropagation();
    ProjectControlActions.setSelectedStyleEditType('word');
  }

  function _handleWordFocus(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    const _translatedMultiline = store
      .default
      .getState()
      .present
      .translatedMultiline
      ?.captions;

    if (_translatedMultiline === undefined) {
      logger.variableIsUndefined('_translatedMultiline', '_handleWordFocus');
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

    const lines = _translatedMultiline[meta.paragraphIndex].lines;
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

export default TranslatedMultilineListContainer;