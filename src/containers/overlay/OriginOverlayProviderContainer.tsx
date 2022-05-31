import { ICaptionEventMeta } from 'components/caption/CaptionInput';
import CaptionInputs from 'components/caption/CaptionInputs';
import Overlay from 'components/Overlay';
import PlayerContext from 'contexts/PlayerContext';
import IArea from 'IArea';
import BinarySearchHelper from 'lib/BinarySearchHelper';
import ComparerHelper from 'lib/ComparerHelper';
import { PlayerEvent } from 'lib/player/Player';
import { rgbaToString } from 'lib/utils';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import React from 'react';
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as originCaptionActions from 'storeV2/modules/originCaption';
import * as projectControlActions from 'storeV2/modules/projectControl';
import { CursorHelper } from 'CursorHelper';
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import { ISelection } from 'models/ISelection';
import IPoint from 'IPoint';
import downcapOptions from 'downcapOptions';
import ProjectControlManager from 'managers/ProjectControlManager';
import { IHighlightMeta } from 'containers/captions';
import StyleParser from 'StyleParser';
import OverlayHelper from 'OverlayHelper';

interface IOriginOverlayProviderCotainerProps {
  area?: IArea;
  fontUnitSize?: number;
}

const logger = ReactLoggerFactoryHelper.build('OriginOverlayProviderCotainer');

function OriginOverlayProviderCotainer(props: IOriginOverlayProviderCotainerProps) {
  const { player } = React.useContext(PlayerContext);

  const originCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.originCaption.captions);

  const defaultStyle = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsStyle | undefined
  >(state => state.present.originCaption.defaultStyle ?? state.present.project.projectDefaultStyle);

  const selectedPreviewType = ReactRedux.useSelector<
    store.RootState,
    store.PreviewType | undefined
  >(state => state.present.project.selectedPreviewType);

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const multilineCaptions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsParagraph[] | undefined
  >(state => state.present.multiline.captions);

  const defaultLocation = ReactRedux.useSelector<
    store.RootState,
    store.ILocation | undefined
  >(state => state.present.originCaption.defaultLocation);

  const rootStore = ReactRedux.useStore<store.RootState>();
  const dispatch = ReactRedux.useDispatch();

  const setFocusMetaAfterTimeUpdateCallback = React.useCallback(_setFocusMetaAfterTimeUpdate, [rootStore, player, dispatch])
  const playControlCallback = React.useCallback(_playControl, [rootStore, originCaptions, player, setFocusMetaAfterTimeUpdateCallback])

  const [currentTime, setCurrentTime] = React.useState<number>(player?.isReady ? player.currentTime : -Infinity);

  React.useEffect(_timeUpdateEffect, [player, player?.isReady]);
  React.useEffect(_shortcutEffect, [playControlCallback]);

  const focusType = focusParagraphMetas?.first().type;
  const focusPath = focusParagraphMetas?.first().path;

  const overlayTime = OverlayHelper.getStartTimeByfocusedParagraph({ originCaption: originCaptions, multiline: multilineCaptions }, focusType, focusPath) ?? currentTime;

  const overlayIndex = originCaptions && BinarySearchHelper.findIndex(
    originCaptions,
    overlayTime,
    ComparerHelper.compareParagraphAndTime
  );

  const paragraph = originCaptions && overlayIndex !== undefined && overlayIndex >= 0
    ? originCaptions[overlayIndex]
    : undefined;

  const line = paragraph?.lines?.first();

  const meta = React.useMemo<ICaptionEventMeta | undefined>(() => {
    if (overlayIndex === undefined) {
      return undefined;
    }

    return ({
      lineIndex: 0,
      paragraphIndex: overlayIndex
    })
  }, [overlayIndex])

  const lineBackground = line?.style?.background ?? defaultStyle?.background;
  const lineStyle = React.useMemo(() => {
    let style: React.CSSProperties = {
      fontSize: props.fontUnitSize ?? downcapOptions.defaultFontSize
    };

    let background = StyleParser.backgroundParse(lineBackground, selectedPreviewType);
    if (background) {
      style.background = rgbaToString(background);
    }

    return style;
  }, [props.fontUnitSize, lineBackground, selectedPreviewType]);

  const wordDefaultStyle = React.useMemo(() => {
    if (line?.style === undefined && defaultStyle === undefined) {
      return undefined;
    }

    const style = ({
      ...defaultStyle,
      ...line?.style
    });

    delete style.background;
    return style;
  }, [line?.style, defaultStyle]);

  let focusMeta = focusParagraphMetas?.first();
  focusMeta = focusMeta?.source === "overlay" && focusMeta.type === "originCaption" ? focusMeta : undefined;

  const wordIndex = _getWordIndex();

  const highlightMeta = React.useMemo<IHighlightMeta | undefined>(() => {
    if (wordIndex < 0) {
      return undefined;
    }

    return ({
      lineIndex: 0,
      wordIndex: wordIndex,
      paragraphIndex: overlayIndex
    })
  }, [overlayIndex, wordIndex]);


  if (line === undefined) {
    return null;
  }

  const vertical = paragraph?.vertical ?? defaultLocation?.vertical;
  const horizontal = paragraph?.horizontal ?? defaultLocation?.horizontal;
  return (
    <Overlay draggabled
      area={props.area}
      meta={meta}
      style={lineStyle}
      vertical={vertical}
      horizontal={horizontal}
      selectedPreviewType={selectedPreviewType}
      onClickCapture={_handleClickCapture}
      onLocationChangeEnd={_handleLocationChangeEnd}
    >
      <CaptionInputs
        className="cursor-default"
        selectedPreviewType={selectedPreviewType}
        words={line.words}
        meta={meta}
        highlightMeta={(player?.isReady && player.isPlay) ? highlightMeta : undefined}
        fontUnitSize={props.fontUnitSize}
        focusMeta={
          focusMeta?.path.paragraphIndex === overlayIndex
            ? focusMeta?.path
            : undefined
        }
        wordDefaultStyle={wordDefaultStyle}
        onChange={_handleChange}
        onKeyDown={_handleKeyDown}
        onClick={_handleWordClick}
      />
    </Overlay>
  )

  function _getWordIndex() {
    let index = -1;

    if (line !== undefined) {
      while (++index < line.words.length) {
        if (line.words[index].start > currentTime) {
          break;
        }
      }
    }
    return index - 1;
  }

  function _handleClickCapture(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        ...meta
      },
      source: 'overlay',
      type: 'originCaption'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'line');
    if (player?.isReady) {
      player.pause();
    }
  }

  function _playControl(evt: KeyboardEvent) {
    if (evt.isComposing) {
      return;
    }

    if (!player?.isReady || player.isPlay || !(evt.shiftKey && evt.code === "Space")) {
      return;
    }

    const captions = originCaptions;
    if (!captions) {
      return;
    }

    const currentTime = player.currentTime;

    let paragraphIndex = captions && BinarySearchHelper.findInsertIndex(
      captions,
      currentTime,
      ComparerHelper.compareParagraphAndTime
    );

    let path: Omit<store.IIndexPath, "cursorIndex"> & { selection?: ISelection };
    if (paragraphIndex === 0) {
      path = {
        paragraphIndex: 0,
        lineIndex: 0,
        wordIndex: 0,
        selection: {
          start: 0,
          end: -1
        },
      }
    } else {
      paragraphIndex -= 1;
      const caption = captions![paragraphIndex];
      const line = caption.lines.first();
      const words = line.words;

      let index = 1;
      for (index = 1; index < words.length; index++) {
        const word = words[index];
        if (currentTime < word.start) {
          break;
        }
      }

      path = {
        paragraphIndex: paragraphIndex,
        lineIndex: 0,
        wordIndex: index - 1,
        selection: {
          start: 0,
          end: -1
        },
      }
    }

    setFocusMetaAfterTimeUpdateCallback(path);
  }

  function _shortcutEffect() {
    document.body.addEventListener('keydown', playControlCallback);
    return () => {
      document.body.removeEventListener('keydown', playControlCallback);
    }
  }

  function _handleWordClick(evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    _setFocusMetaAfterTimeUpdate({
      ...meta,
      selection: {
        start: evt.currentTarget.selectionStart ?? 0,
        end: evt.currentTarget.selectionEnd ?? -1
      }
    });
  }

  function _handleLocationChangeEnd(location: IPoint, meta?: ICaptionEventMeta) {
    if (!meta) {
      logger.variableIsUndefined('meta', '_handleLocationChangeEnd');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleLocationChangeEnd');
      return;
    }

    const paragraphIndex = meta.paragraphIndex;
    const captions = (rootStore.getState() as store.RootState).present.originCaption.captions;

    if (!captions) {
      logger.variableIsUndefined('captions', '_handleLocationChangedEnd');
      return;
    }

    const paragraph: store.ICaptionsParagraph = {
      ...captions[paragraphIndex],
      horizontal: location.x,
      vertical: location.y
    };

    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);
    OriginCaptionActions.updateCaption(
      meta.paragraphIndex,
      paragraph
    );
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
    const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);
    OriginCaptionActions.setText({
      path: {
        paragraphIndex: paragraphIndex,
        lineIndex: lineIndex,
        wordIndex: wordIndex
      },
      text: evt.target.value
    });
  }

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

  function _setFocusMetaAfterTimeUpdate(focusMeta: ICaptionEventMeta & { selection?: ISelection }) {
    const reudxState = rootStore.getState();
    const captions = reudxState.present.originCaption?.captions;
    const paragraph = captions![focusMeta.paragraphIndex!];

    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    const focusUpdate = () => {
      ProjectControlActions.setFocusParagraphMetas([{
        path: {
          selection: {
            start: 0,
            end: -1
          },
          ...focusMeta,
        },
        source: 'overlay',
        type: 'originCaption'
      }]);

      player?.removeTimeUpdateEventListener(focusUpdate);
    };

    if (reudxState.present.projectCotrol.selectedStyleEditType !== "word") {
      ProjectControlActions.setSelectedStyleEditType('word');
    }

    if (!player?.isReady) {
      focusUpdate();
      return;
    }

    const words = paragraph.lines[focusMeta.lineIndex!].words;
    const wordIndex = focusMeta.wordIndex! < 0 ? words.length + focusMeta.wordIndex! : focusMeta.wordIndex!;
    const start = words[wordIndex].start;
    if (player.currentTime === start) {
      focusUpdate();
    }
    else {
      player.pause();
      player.addTimeUpdateEventListener(focusUpdate);
      player.currentTime = start;
    }
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
      logger.variableIsUndefined('meta.paragraphIndex', '_handleKeyDown', new Error("meta is undefined."));
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleKeyDown', new Error("meta is undefined."));
      return;
    }

    if (meta.wordIndex === undefined) {
      logger.variableIsUndefined('meta.wordIndex', '_handleKeyDown', new Error("meta is undefined."));
      return;
    }

    const originCaptions = (rootStore.getState() as store.RootState)?.present.originCaption?.captions;
    if (originCaptions === undefined) {
      logger.variableIsUndefined('originCaptions', '_handleKeyDown', new Error("meta is undefined."));
      return;
    }

    return _handleKeyDownInternal(
      evt,
      originCaptions,
      meta as Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>
    );

    function _handleKeyDownInternal(
      evt: React.KeyboardEvent<HTMLInputElement>,
      originCaptions: store.ICaptionsParagraph[],
      meta: Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>
    ) {
      const keyDownEventHandleDict: {
        [code: string]: () => void
      } = {
        "ArrowDown": _handleArrowDownKeyDown,
        "ArrowUp": _handleArrowUpKeyDown,
        "ArrowLeft": _handleArrowLeftKeyDown,
        "ArrowRight": _handleArrowRightKeyDown,
        "Enter": _handleEnterKeyDown,
        "NumpadEnter": _handleEnterKeyDown,
        "Backspace": _handleBackspaceKeyDown,
        "Delete": _handleDeleteKeyDown,
        "Tab": () => { evt.preventDefault(); evt.stopPropagation(); }
      }

      try {
        const handle = keyDownEventHandleDict[evt.code];
        handle && handle();
      } catch (err) {
        err instanceof Error && logger.logWarning(err);
      }

      return;

      function _getOriginLineStartTime(paragraphIndex: number) {
        return originCaptions[paragraphIndex].lines.first().words.first().start;
      }

      function _getOriginLineEndTime(paragraphIndex: number) {
        return originCaptions[paragraphIndex].lines.last().words.last().end;
      }

      function paragraphIndexUpBySkipDurationZeroLine(nextParagraphIndex: number, nextWordIndex: number) {
        let targetParagraphIndex = nextParagraphIndex;
        let targetWordIndex = nextWordIndex;

        let nextLineStart: number = 0;
        let nextLineEnd: number = 0;

        while (nextLineStart === nextLineEnd) {
          targetParagraphIndex++;

          if (targetParagraphIndex >= originCaptions.length) {
            _setFocusMetaAfterTimeUpdate({
              ...meta,
              paragraphIndex: nextParagraphIndex - 1,
              wordIndex: -1,
            });

            return;
          }
          if (targetParagraphIndex < 0) {
            _setFocusMetaAfterTimeUpdate({
              ...meta,
              paragraphIndex: nextParagraphIndex + 1,
              wordIndex: 0,
            });

            return;
          }

          targetWordIndex = Math.min(targetWordIndex, originCaptions[targetParagraphIndex].lines.first().words.length - 1);
          nextLineStart = _getOriginLineStartTime(targetParagraphIndex);
          nextLineEnd = _getOriginLineEndTime(targetParagraphIndex);
        }

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          paragraphIndex: targetParagraphIndex,
          wordIndex: targetWordIndex
        });
      }

      function paragraphIndexDownBySkipDurationZeroLine(nextParagraphIndex: number, nextWordIndex: number) {
        let targetParagraphIndex = nextParagraphIndex;
        let targetWordIndex = nextWordIndex;

        let nextLineStart: number = 0;
        let nextLineEnd: number = 0;

        while (nextLineStart === nextLineEnd) {
          targetParagraphIndex--;

          if (targetParagraphIndex >= originCaptions.length) {
            _setFocusMetaAfterTimeUpdate({
              ...meta,
              paragraphIndex: nextParagraphIndex - 1,
              wordIndex: -1,
            });

            return;
          }
          if (targetParagraphIndex < 0) {
            _setFocusMetaAfterTimeUpdate({
              ...meta,
              paragraphIndex: nextParagraphIndex + 1,
              wordIndex: 0,
            });

            return;
          }

          targetWordIndex = Math.min(targetWordIndex, originCaptions[targetParagraphIndex].lines.first().words.length - 1);
          nextLineStart = _getOriginLineStartTime(targetParagraphIndex);
          nextLineEnd = _getOriginLineEndTime(targetParagraphIndex);
        }

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          paragraphIndex: targetParagraphIndex,
          wordIndex: targetWordIndex
        });
      }

      function _handleArrowDownKeyDown() {
        const nextParagraphIndex = meta.paragraphIndex + 1;

        if (nextParagraphIndex >= originCaptions.length) {
          _setFocusMetaAfterTimeUpdate({
            ...meta,
            wordIndex: -1,
          });

          return;
        }


        const wordIndex = Math.min(
          meta.wordIndex,
          ParagraphCaptionsHelper.getWordLengthByParagraphLine(originCaptions, {
            paragraphIndex: nextParagraphIndex!,
            lineIndex: 0
          }) - 1
        );

        const nextLineStart = _getOriginLineStartTime(nextParagraphIndex);
        const nextLineEnd = _getOriginLineEndTime(nextParagraphIndex);

        if (nextLineStart === nextLineEnd) {
          paragraphIndexUpBySkipDurationZeroLine(nextParagraphIndex, wordIndex);
          return;
        }

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          paragraphIndex: nextParagraphIndex,
          wordIndex: wordIndex,
        });
      }

      function _handleArrowUpKeyDown() {
        const nextParagraphIndex = meta.paragraphIndex - 1;

        if (meta.paragraphIndex === 0) {
          _setFocusMetaAfterTimeUpdate({
            ...meta,
            wordIndex: 0,
          });

          return;
        }

        const nextWordLength = ParagraphCaptionsHelper.getWordLengthByParagraphLine(originCaptions, {
          lineIndex: 0,
          paragraphIndex: nextParagraphIndex
        });

        const nextWordIndex = Math.min(meta.wordIndex, nextWordLength! - 1);

        const nextLineStart = _getOriginLineStartTime(nextParagraphIndex);
        const nextLineEnd = _getOriginLineEndTime(nextParagraphIndex);

        if (nextLineStart === nextLineEnd) {
          paragraphIndexDownBySkipDurationZeroLine(nextParagraphIndex, nextWordIndex);
          return;
        }

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          paragraphIndex: nextParagraphIndex,
          wordIndex: nextWordIndex
        });
      }

      function _handleArrowLeftKeyDown() {

        if (!CursorHelper.isCursorStartWithoutSelection(evt)) {
          return;
        }

        if (meta.paragraphIndex === 0 && meta.wordIndex === 0 && meta.lineIndex === 0) {
          _setFocusMetaAfterTimeUpdate({ ...meta });
          return;
        }

        const nextIndexs = ParagraphCaptionsHelper.getPrevWordIndex(originCaptions, {
          paragraphIndex: meta.paragraphIndex!,
          lineIndex: meta.lineIndex!,
          wordIndex: meta.wordIndex!
        });

        if (nextIndexs !== null) {
          const nextLineStart = _getOriginLineStartTime(nextIndexs.paragraphIndex);
          const nextLineEnd = _getOriginLineEndTime(nextIndexs.paragraphIndex);

          if (nextLineStart === nextLineEnd) {
            paragraphIndexDownBySkipDurationZeroLine(nextIndexs.paragraphIndex, -1);
            return;
          }
        }

        _setFocusMetaAfterTimeUpdate({ ...nextIndexs });
        return;
      }

      function _handleArrowRightKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        const nextIndex = ParagraphCaptionsHelper.getNextWordIndex(originCaptions, {
          lineIndex: meta.lineIndex!,
          paragraphIndex: meta.paragraphIndex!,
          wordIndex: meta.wordIndex!
        });

        if (nextIndex !== null) {
          const nextLineStart = _getOriginLineStartTime(nextIndex.paragraphIndex);
          const nextLineEnd = _getOriginLineEndTime(nextIndex.paragraphIndex);

          if (nextLineStart === nextLineEnd) {
            paragraphIndexUpBySkipDurationZeroLine(nextIndex.paragraphIndex, 0);
            return;
          }
        }

        _setFocusMetaAfterTimeUpdate(nextIndex ? nextIndex : meta);
        return;
      }


      function _handleEnterKeyDown() {
        if (meta.wordIndex === 0 && CursorHelper.isCursorStart(evt)) {
          return;
        }

        let captions = [...originCaptions!];
        const paragraph = captions[meta.paragraphIndex!];
        const words = paragraph.lines[meta.lineIndex].words;

        if (meta.wordIndex === words.length - 1
          && CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        const { paragraphIndex, lineIndex, wordIndex } = meta;
        const paragraphs = ParagraphCaptionsHelper.splitParagraph(paragraph, {
          cursorIndex: evt.currentTarget.selectionStart!,
          lineIndex: lineIndex!,
          wordIndex: wordIndex!
        });

        captions.splice(paragraphIndex!, 1, ...paragraphs);

        const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);
        OriginCaptionActions.setCaptions(captions);

        evt.preventDefault();
        evt.stopPropagation();
        _setFocusMetaAfterTimeUpdate({
          paragraphIndex: meta.paragraphIndex! + 1,
          lineIndex: 0,
          wordIndex: 0,
          selection: {
            start: 0,
            end: 0
          }
        });
      }

      function _handleBackspaceKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt)) {
          return;
        }

        const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);

        let captions = [...originCaptions];

        if (meta.wordIndex! !== 0) {
          OriginCaptionActions.setCaptions(
            [...ParagraphCaptionsHelper.concatWordInCaptions(captions, meta, 'forward')]
          );

          const toWord = ParagraphCaptionsHelper.getWord(captions, {
            ...meta,
            wordIndex: meta.wordIndex - 1
          })!;

          _setFocusMetaAfterTimeUpdate({
            ...meta,
            wordIndex: meta.wordIndex! - 1,
            selection: {
              start: toWord.text.length,
              end: toWord.text.length,
            }
          });

          return;
        }

        const paragraphIndex = meta.paragraphIndex;
        if (paragraphIndex === 0) {
          return;
        }

        OriginCaptionActions.setCaptions(
          ParagraphCaptionsHelper.concatParagraphInCaptions(captions, meta, 'forward')
        );

        const wordLength = ParagraphCaptionsHelper.getWordLengthByParagraphLine(captions, {
          ...meta,
          paragraphIndex: paragraphIndex - 1,
        })!;

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          paragraphIndex: paragraphIndex - 1,
          lineIndex: 0,
          wordIndex: wordLength,
          selection: {
            start: 0,
            end: 0,
          }
        });
      }

      function _handleDeleteKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        let captions = [...originCaptions];

        const OriginCaptionActions = Redux.bindActionCreators(originCaptionActions, dispatch);
        const wordsLength = ParagraphCaptionsHelper.getWordLengthByParagraphLine(captions, meta);
        const fromWord = ParagraphCaptionsHelper.getWord(
          captions, {
          ...meta,
        });

        if (meta.wordIndex! < wordsLength - 1) {
          OriginCaptionActions.setCaptions(
            ParagraphCaptionsHelper.concatWordInCaptions(captions, meta, 'backward')
          );

          _setFocusMetaAfterTimeUpdate({
            ...meta,
            wordIndex: meta.wordIndex,
            selection: {
              start: fromWord.text.length,
              end: fromWord.text.length,
            }
          })
          return;
        }

        if (meta.paragraphIndex === captions.length - 1) {
          return;
        }

        OriginCaptionActions.setCaptions(
          ParagraphCaptionsHelper.concatParagraphInCaptions(captions, meta, 'backward')
        );

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          paragraphIndex: meta.paragraphIndex,
          lineIndex: 0,
          wordIndex: meta.wordIndex,
          selection: {
            start: fromWord.text.length,
            end: fromWord.text.length,
          }
        });
      }

    }
  }
}

export default OriginOverlayProviderCotainer;