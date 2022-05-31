//TODO: 클래스형으로 변경 필요, hook에 ref 참조 제약이 있어서 권장 되지 않는 방식으로 redux를 사용중입니다.

import React from 'react';
import "JsExtensions";
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import * as originCaptionActions from 'storeV2/modules/originCaption';
import { CursorHelper } from 'CursorHelper';
import CaptionLine, { ICaptionTimeFocusEventMeta } from 'components/caption/CaptionLine';
import { ISelection } from 'models/ISelection';
import PlayerContext from 'contexts/PlayerContext';
import { PlayerEvent } from 'lib/player/Player';
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import { ICaptionEventMeta } from 'components/caption/CaptionInput';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux'
import * as store from 'storeV2';
import * as projectControlActions from 'storeV2/modules/projectControl';
import downcapOptions from 'downcapOptions';
import ProjectControlManager from 'managers/ProjectControlManager';
import CaptionCotrolButtons from 'components/caption/CaptionCotrolButtons';

interface IOriginCaptionListContainerStateProps {
  originCaptions?: store.ICaptionsParagraph[],
  focusParagraphMetas?: store.IFocusParagraphMeta[]
  selectedStyleEditType: store.RootState['present']['projectCotrol']['selectedStyleEditType'];
}

interface IOriginCaptionListContainerDispatchProps {
  OriginCaptionActions: typeof originCaptionActions,
  ProjectControlActions: typeof projectControlActions
}

interface IOriginCaptionListContainerProps extends IOriginCaptionListContainerStateProps, IOriginCaptionListContainerDispatchProps {
}

function OriginCaptionListContainer(props: IOriginCaptionListContainerProps) {
  const logger = React.useMemo(() => ReactLoggerFactoryHelper.build('OriginCaptionListContainer'), []);
  const { player } = React.useContext(PlayerContext);

  const [currentTime, setCurrnetTime] = React.useState<number>(player?.isReady ? player.currentTime : 0);
  const [indexEnd, setIndexEnd] = React.useState<number>(0);
  const [isControllingLine, setIsControllingLine] = React.useState<boolean>(false);
  const lineRef = React.useRef<HTMLDivElement>(null);

  const rootStore = ReactRedux.useStore<store.RootState>();
  const handleChangeCallback = React.useCallback(_handleChange, [props.OriginCaptionActions]);
  const handleWordClickCallback = React.useCallback(_handleWordClick, [props.ProjectControlActions, rootStore]);
  const handleWordFocusCallback = React.useCallback(_handleWordFocus, [player, rootStore]);

  React.useEffect(_timeUpdateEffect, [player, player?.isReady]);
  React.useEffect(_increaseIndexEnd, [indexEnd, rootStore, props.originCaptions?.length]);
  React.useEffect(_focusLineAgain, [isControllingLine]);

  let focusMeta = props.focusParagraphMetas
    ?.filter(focusMeta => focusMeta.type === "originCaption")
    .first();

  let focusMetaPath = focusMeta?.source === "list"
    ? focusMeta.path
    : undefined;

  const playerIsPlay = player?.isReady && player.isPlay;

  const lineComponents = props.originCaptions
    ?.filter((caption, index) => index < indexEnd)
    .map((caption, index) => {
      try {
        return _renderLineComponent(caption, index);
      } catch (err) {
        if (err instanceof Error) logger.logWarning(`Rendering failed on line ${index}.`, err);
        return null;
      }
    });

  return (
    <div className="subtitles-list" >
      {lineComponents}
    </div>
  )

  function _renderLineComponent(caption: store.ICaptionsParagraph, paragraphIndex: number) {
    const line = caption.lines && caption.lines[0];
    if (line === undefined) {
      throw new TypeError('line reference not set to an instance of a caption.');
    }

    const words = caption.lines?.first().words;
    let focuseMeta = focusMetaPath?.paragraphIndex === paragraphIndex ? focusMetaPath : undefined;

    const highlightMeta = words && (playerIsPlay || !focusMetaPath)
      ? ParagraphCaptionsHelper.findInclusionTimesByWords(words, currentTime)
      : undefined;

    const TopControlButton = focuseMeta ? () => (
      <CaptionCotrolButtons reverse
        combineButtonRendered={paragraphIndex !== 0}
        onCombineButtonClick={evt => handleTopCombineButtonClick(
          evt,
          focuseMeta as Required<Pick<store.IIndexPath, 'paragraphIndex'>>
        )}
      />
    ) : () => null;

    const BottomControlButton = focuseMeta ? () => (
      <CaptionCotrolButtons
        combineButtonRendered={paragraphIndex + 1 < props.originCaptions!.length}
        onCombineButtonClick={evt => handleBottomCombineButtonClick(
          evt,
          focuseMeta as Required<Pick<store.IIndexPath, 'paragraphIndex'>>
        )}
      />
    ) : () => null;

    return (
      <span key={caption.id}>
        <TopControlButton />
        <CaptionLine autoScroll
          ref={lineRef}
          line={line}
          highlightMeta={highlightMeta}
          focusMeta={focuseMeta}
          meta={{ paragraphIndex: paragraphIndex }}
          onChange={handleChangeCallback}
          onEndTimeTextBlur={_handleEndTimeTextBlur}
          onKeyDown={_handleKeyDown}
          onLineKeyDown={_handleLineKeyDown}
          onLineClick={_handleLineClick}
          onRemoveClick={_handleRemoveClick}
          onStartTimeTextBlur={_handleStartTimeTextBlur}
          onWordClick={handleWordClickCallback}
          onWordFocus={handleWordFocusCallback}
        />
        <BottomControlButton />
      </span>

    )
  }

  function handleTopCombineButtonClick(
    evt: React.MouseEvent,
    meta?: Required<Pick<store.IIndexPath, 'paragraphIndex'>>
  ) {
    const caption = props.originCaptions;

    if (!caption) {
      return;
    }

    props.OriginCaptionActions.setCaptions(
      ParagraphCaptionsHelper.concatParagraphInCaptions(caption, meta!, 'forward')
    );

    let nextFocusMeta = {
      paragraphIndex: meta!.paragraphIndex - 1,
      lineIndex: 0
    }

    _setFocusMetaByKeybordEvent(nextFocusMeta);
  }


  function handleBottomCombineButtonClick(
    evt: React.MouseEvent,
    meta?: Required<Pick<store.IIndexPath, 'paragraphIndex'>>
  ) {
    const caption = rootStore.getState().present.originCaption.captions;

    if (!caption) {
      return;
    }

    props.OriginCaptionActions.setCaptions(
      ParagraphCaptionsHelper.concatParagraphInCaptions(caption, meta!, 'backward')
    );

    _setFocusMetaByKeybordEvent(meta!);
  }

  function _handleLineKeyDown(evt: React.KeyboardEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    if (evt.nativeEvent.isComposing) {
      return;
    }

    const originCaptions = rootStore.getState().present.originCaption.captions!;
    return _handleLineKeyDownInternal(evt, originCaptions, meta as Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex'>>);

    function _handleLineKeyDownInternal(
      evt: React.KeyboardEvent<HTMLDivElement>,
      captions: store.ICaptionsParagraph[],
      meta: Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex'>>
    ) {
      const keyDownEventHandleDict: { [code: string]: () => void } = {
        "ArrowDown": _handleArrowDownKeyDown,
        "ArrowUp": _handleArrowUpKeyDown,
      }

      try {
        const handle = keyDownEventHandleDict[evt.code];
        handle && handle();
      } catch (err) {
        err instanceof Error && logger.logWarning(err);
      }
      return;

      function _handleArrowDownKeyDown() {
        if (meta.paragraphIndex + 1 >= captions.length) {
          return;
        }

        const nextParagraphIndex = meta.paragraphIndex + 1;
        _setFocusMetaByKeybordEvent({
          ...meta,
          paragraphIndex: nextParagraphIndex
        });

        const lines = captions[nextParagraphIndex].lines;
        const words = lines[meta.lineIndex].words;
        const word = words.first();

        if (player && player.isReady) {
          player.currentTime = word.start;
          player.pause();
        }

        setIsControllingLine(true);
      }

      function _handleArrowUpKeyDown() {
        if (meta.paragraphIndex === 0) {
          return;
        }

        const nextParagraphIndex = meta.paragraphIndex - 1;
        _setFocusMetaByKeybordEvent({
          ...meta,
          paragraphIndex: nextParagraphIndex
        });

        const lines = captions[nextParagraphIndex].lines;
        const words = lines[meta.lineIndex].words;
        const word = words.first();

        if (player && player.isReady) {
          player.currentTime = word.start;
          player.pause();
        }

        setIsControllingLine(true);
      }
    }
  }

  function _handleLineClick(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const originCaptions = rootStore.getState().present.originCaption.captions!;
    const lines = originCaptions[meta!.paragraphIndex!].lines;
    const words = lines[meta!.lineIndex!].words;
    const word = words.first();

    if (player && player.isReady) {
      player.currentTime = word.start;
      player.pause();
    }

    props.ProjectControlActions.setFocusParagraphMetas([{
      path: {
        ...meta
      },
      source: 'list',
      type: 'originCaption'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'line');
    setIsControllingLine(true);
  }

  function _increaseIndexEnd() {
    const originCaptions = rootStore.getState().present.originCaption.captions!;
    const length = originCaptions?.length ?? 0;
    if (indexEnd >= length) return;

    const indexTimeout = setTimeout(() => {
      setIndexEnd(Math.min(length, indexEnd + downcapOptions.itemRenderingQuantity));
    }, 0.1);

    return () => clearTimeout(indexTimeout);
  }

  function _handleRemoveClick(evt: React.MouseEvent<HTMLButtonElement>, meta?: ICaptionEventMeta) {
    evt.stopPropagation();
    const originCaptions = rootStore.getState().present.originCaption.captions!;

    let paragraphs = [...originCaptions!];
    paragraphs.splice(meta!.paragraphIndex!, 1);

    if (!paragraphs.any()) {
      props.ProjectControlActions.setFocusParagraphMetas(null);
    }

    props.OriginCaptionActions.setCaptions(paragraphs);
  }

  function _handleStartTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) {
    const originCaption = rootStore.getState().present.originCaption;

    const prevWord = ParagraphCaptionsHelper.getPrevWord(originCaption.captions!, {
      paragraphIndex: meta!.paragraphIndex!,
      lineIndex: 0,
      wordIndex: 0
    });

    const end = originCaption.captions![meta!.paragraphIndex!].lines![meta!.lineIndex!].words!.last().end!;
    const prevEnd = prevWord?.end ?? 0;
    const timeSetValue = Math.min(end, Math.max(prevEnd, meta!.time));

    props.OriginCaptionActions.setStartTime({
      paragraphIndex: meta!.paragraphIndex,
      lineIndex: meta!.lineIndex,
      value: timeSetValue
    });
  }

  function _handleEndTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) {
    const originCaption = rootStore.getState().present.originCaption;

    const lines = originCaption.captions![meta!.paragraphIndex!].lines!;
    const lineIndex = lines.length - 1;
    const words = lines[lineIndex].words!;

    const nextWord = ParagraphCaptionsHelper.getNextWord(originCaption.captions!, {
      paragraphIndex: meta!.paragraphIndex!,
      lineIndex: lineIndex,
      wordIndex: words.length - 1
    });

    const nextStart = nextWord?.start ?? (player?.isReady ? (player?.duration ?? Infinity) : Infinity);
    const timeSetValue = Math.max(words.first().start, Math.min(nextStart, meta!.time));

    props.OriginCaptionActions.setEndTime({
      paragraphIndex: meta!.paragraphIndex,
      lineIndex: meta!.lineIndex,
      value: timeSetValue
    });
  }

  function _handleWordFocus(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    const originCaption = rootStore.getState().present.originCaption;

    const lines = originCaption.captions![meta!.paragraphIndex!].lines;
    const words = lines[meta!.lineIndex!].words;
    const word = words[meta!.wordIndex!];
    if (player && player.isReady) {
      player.currentTime = word.start;
      player.pause();
    }
  }

  function _handleChange(evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    const { paragraphIndex, lineIndex, wordIndex } = meta!;
    props.OriginCaptionActions.setText({
      path: {
        paragraphIndex: paragraphIndex!,
        lineIndex: lineIndex!,
        wordIndex: wordIndex!
      },
      text: evt.target.value
    });
  }

  function _handleWordClick(evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    evt.stopPropagation();
    props.ProjectControlActions.setFocusParagraphMetas([{
      path: {
        selection: {
          start: evt.currentTarget.selectionStart ?? 0,
          end: evt.currentTarget.selectionEnd ?? evt.currentTarget.value.length,
        },
        ...meta
      },
      source: 'list',
      type: 'originCaption'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'word');
  }

  function _setFocusMetaByKeybordEvent(meta: ICaptionEventMeta & { selection?: ISelection }) {
    props.ProjectControlActions.setFocusParagraphMetas([{
      path: {
        selection: {
          start: 0,
          end: -1,
        },
        ...meta
      },
      source: 'list',
      type: 'originCaption'
    }]);
  }

  function _handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    const originCaption = rootStore.getState().present.originCaption.captions;

    return _handleKeyDownInternal(evt, originCaption!, meta as Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>);

    function _handleKeyDownInternal(
      evt: React.KeyboardEvent<HTMLInputElement>,
      captions: store.ICaptionsParagraph[],
      meta: Required<Pick<ICaptionEventMeta, 'paragraphIndex' | 'lineIndex' | 'wordIndex'>>
    ) {
      const keyDownEventHandleDict: { [code: string]: () => void } = {
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
        if (err instanceof Error) logger.logWarning(err);
      }
      return;

      function _handleEnterKeyDown() {
        if ((meta.wordIndex === 0 && CursorHelper.isCursorStart(evt))) {
          return;
        }

        let nextCaptions = [...captions!];
        const paragraph = nextCaptions[meta.paragraphIndex!];
        const words = paragraph.lines![meta.lineIndex!].words!;

        if (meta.wordIndex === words!.length - 1
          && CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        const { paragraphIndex, lineIndex, wordIndex } = meta;
        const paragraphs = ParagraphCaptionsHelper.splitParagraph(paragraph, {
          cursorIndex: evt.currentTarget.selectionStart!,
          lineIndex: lineIndex!,
          wordIndex: wordIndex!
        });

        nextCaptions.splice(paragraphIndex!, 1, ...paragraphs);
        props.OriginCaptionActions.setCaptions(nextCaptions);

        evt.preventDefault();
        evt.stopPropagation();
        _setFocusMetaByKeybordEvent({
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

        evt.preventDefault();

        if (meta.wordIndex !== 0) {
          props.OriginCaptionActions.setCaptions(
            [...ParagraphCaptionsHelper.concatWordInCaptions(captions, meta, 'forward')]
          );

          const toWord = ParagraphCaptionsHelper.getWord(captions, {
            ...meta,
            wordIndex: meta.wordIndex - 1
          })!;

          _setFocusMetaByKeybordEvent({
            ...meta,
            wordIndex: meta.wordIndex - 1,
            selection: {
              start: toWord.text.length,
              end: toWord.text.length,
            }
          })

          return;
        }

        const paragraphIndex = meta.paragraphIndex;

        props.OriginCaptionActions.setCaptions(
          ParagraphCaptionsHelper.concatParagraphInCaptions(captions, meta, 'forward')
        );
        const wordLength = ParagraphCaptionsHelper.getWordLengthByParagraphLine(captions, {
          ...meta,
          paragraphIndex: paragraphIndex - 1,
        })!;

        _setFocusMetaByKeybordEvent({
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

        evt.preventDefault();

        const isLastParagraph = meta.paragraphIndex === captions.length - 1;
        const wordsLength = ParagraphCaptionsHelper.getWordLengthByParagraphLine(captions, meta);
        const fromWord = ParagraphCaptionsHelper.getWord(
          captions, {
          ...meta,
        });

        if (isLastParagraph && meta.wordIndex === wordsLength - 1 && CursorHelper.isCursorEnd(evt)) {
          return;
        }

        if (meta.wordIndex === wordsLength - 1) {
          props.OriginCaptionActions.setCaptions(
            ParagraphCaptionsHelper.concatParagraphInCaptions(captions, meta, 'backward')
          );

          _setFocusMetaByKeybordEvent({
            ...meta,
            wordIndex: meta.wordIndex,
            selection: {
              start: fromWord.text.length,
              end: fromWord.text.length,
            }
          })

          return;
        }

        props.OriginCaptionActions.setCaptions(
          ParagraphCaptionsHelper.concatWordInCaptions(captions, meta, 'backward')
        );

        _setFocusMetaByKeybordEvent({
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

      function _handleArrowDownKeyDown() {
        if (meta.paragraphIndex! + 1 >= captions.length) {
          const lastWordIndex = captions.last().lines!.last().words.length - 1;
          _setFocusMetaByKeybordEvent({
            ...meta,
            wordIndex: lastWordIndex,
          });

          return;
        }

        evt.preventDefault();

        const nextParagraphIndex = meta.paragraphIndex! + 1;
        const words = captions[nextParagraphIndex].lines[meta.lineIndex!].words;
        const nextWordIndex = Math.min(meta.wordIndex, words.length - 1);
        _setFocusMetaByKeybordEvent({
          ...meta,
          paragraphIndex: nextParagraphIndex,
          wordIndex: nextWordIndex
        });
      }

      function _handleArrowUpKeyDown() {
        if (meta.paragraphIndex === 0) {
          _setFocusMetaByKeybordEvent({
            ...meta,
            wordIndex: 0,
          });

          return;
        }

        evt.preventDefault();

        const nextParagraphIndex = meta.paragraphIndex! - 1;
        const nextWordIndex = Math.min(meta.wordIndex, captions[nextParagraphIndex]!.lines![meta.lineIndex!].words!.length - 1);
        _setFocusMetaByKeybordEvent({
          ...meta,
          paragraphIndex: nextParagraphIndex,
          wordIndex: nextWordIndex
        });
      }

      function _handleArrowLeftKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt)) {
          return;
        }

        evt.currentTarget.blur();
        evt.preventDefault();
        evt.stopPropagation();

        if (meta.paragraphIndex === 0 && meta.wordIndex === 0 && meta.lineIndex === 0) {
          _setFocusMetaByKeybordEvent({ ...meta });
          return;
        }

        const nextIndex = ParagraphCaptionsHelper.getPrevWordIndex(captions!, {
          paragraphIndex: meta.paragraphIndex!,
          lineIndex: meta.lineIndex,
          wordIndex: meta.wordIndex
        });

        _setFocusMetaByKeybordEvent({ ...nextIndex });

        return;
      }

      function _handleArrowRightKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        evt.preventDefault();
        evt.stopPropagation();

        const wordLength = captions[meta.paragraphIndex!]!.lines![meta.lineIndex!].words!.length;
        if (meta.wordIndex + 1 >= wordLength) {
          if (meta.paragraphIndex! + 1 === captions.length) {
            _setFocusMetaByKeybordEvent({ ...meta })
            return;
          }

          const nextParagraphIndex = meta.paragraphIndex! + 1;
          _setFocusMetaByKeybordEvent({
            ...meta,
            paragraphIndex: nextParagraphIndex,
            wordIndex: 0
          });

          return;
        }

        _setFocusMetaByKeybordEvent({
          ...meta,
          wordIndex: meta.wordIndex + 1,
          selection: {
            start: 0,
            end: -1
          }
        });

        return;
      }
    }
  }

  function _handleTimeUpdate(evt: PlayerEvent) {
    setCurrnetTime(evt.target.currentTime);
  }

  function _timeUpdateEffect() {
    if (!player?.isReady) {
      return;
    }

    player.addTimeUpdateEventListener(_handleTimeUpdate);

    return () => {
      player.removeTimeUpdateEventListener(_handleTimeUpdate);
    }
  }

  function _focusLineAgain() {
    if (isControllingLine) {
      lineRef.current?.focus();
      setIsControllingLine(false);
    }
  }
}

export default ReactRedux.connect<IOriginCaptionListContainerStateProps, IOriginCaptionListContainerDispatchProps, {}, store.RootState>(
  state => ({
    originCaptions: state.present.originCaption.captions,
    focusParagraphMetas: state.present.projectCotrol.focusParagraphMetas,
    selectedStyleEditType: state.present.projectCotrol.selectedStyleEditType
  }),
  dispatch => ({
    OriginCaptionActions: Redux.bindActionCreators(originCaptionActions, dispatch),
    ProjectControlActions: Redux.bindActionCreators(projectControlActions, dispatch)
  })
)(OriginCaptionListContainer);