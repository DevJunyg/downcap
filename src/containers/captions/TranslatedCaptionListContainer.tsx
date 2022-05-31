import "JsExtensions";
import React from "react";
import ProjectManager from "managers/ProjectManager";
import TranslatedInformationBoard from "components/TranslatedInformationBoard";
import TranslatedCaption from "components/caption/TranslatedCaption";
import { ICaptionEventMeta } from "components/caption/CaptionInput";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import * as translateCaptionActions from "storeV2/modules/translatedCaption";
import { CursorHelper } from "CursorHelper";
import PlayerContext from "contexts/PlayerContext";
import { PlayerEvent } from "lib/player/Player";
import TranslatedCaptionHelper from "helpers/TranslatedCaptionHelper";
import downcapOptions from "downcapOptions";
import IdGenerator from "storeV2/IdGenerator";
import { ISelection } from "models/ISelection";
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux'
import * as store from 'storeV2';
import * as projectControlActions from 'storeV2/modules/projectControl';
import ProjectControlManager from "managers/ProjectControlManager";
import { ICaptionTimeFocusEventMeta } from "components/caption/CaptionLine";
import CaptionCotrolButtons from "components/caption/CaptionCotrolButtons";
import ClientAnalysisService from "services/ClientAnalysisService";

interface ITranslatedCaptionListContainerStateProps {
  originCaptions?: store.ICaptionsParagraph[];
  translatedCaptions?: store.ICaptionTranslatedParagraphWithId[];
  translateGuideOpen?: boolean;
  realTimeTranslationFlag?: boolean;
  focusParagraphMetas?: store.IFocusParagraphMeta[];
  totalTranslateTaskLength?: number;
  selectedStyleEditType?: store.RootState['present']['projectCotrol']['selectedStyleEditType'];
}

interface ITranslatedCaptionListContainerDispatchProps {
  TranslatedCaptionActions: typeof translateCaptionActions;
  ProjectControlActions: typeof projectControlActions;
}

interface ITranslatedCaptionListContainerProps extends ITranslatedCaptionListContainerStateProps,
  ITranslatedCaptionListContainerDispatchProps {

}

const translatedTask: { [id: number]: NodeJS.Timeout } = {}
let deletedTargetCaption: store.ICaptionTranslatedParagraphWithId | undefined = undefined;

function TranslatedCaptionListContainer(props: ITranslatedCaptionListContainerProps) {
  const logger = React.useMemo(() => ReactLoggerFactoryHelper.build('TranslatedCaptionListContainer'), []);
  const { player } = React.useContext(PlayerContext);

  const captionListRef = React.useRef<HTMLDivElement>(null);

  const [currentTime, setCurrnetTime] = React.useState<number>(player?.isReady ? player.currentTime : 0);
  const [indexEnd, setIndexEnd] = React.useState<number>(0);
  const [isControllingLine, setIsControllingLine] = React.useState<boolean>(false);
  const lineRef = React.useRef<HTMLDivElement>(null);

  const rootStore = ReactRedux.useStore<store.RootState>();
  const dispatch = ReactRedux.useDispatch();

  React.useEffect(_firstTranslationEffect, [props.originCaptions, props.translatedCaptions, props.totalTranslateTaskLength]);
  React.useEffect(_timeUpdateEffect, [player]);
  React.useEffect(_increaseIndexEnd, [indexEnd, props.translatedCaptions?.length]);
  React.useEffect(_focusLineAgain, [isControllingLine])

  const TranslateGuid = props.translateGuideOpen && (
    <TranslatedInformationBoard
      onClick={_handleTranslatedInfoBoardCloseClick} />
  )

  let focusMeta = props.focusParagraphMetas
    ?.filter(focusMeta => focusMeta.type === "translatedCaption")
    .first();

  const focusMetaPath = focusMeta?.source === "list"
    ? focusMeta.path
    : undefined;

  const playerIsPlay = player?.isReady && player.isPlay;
  const playHighlightMeta = React.useMemo(() => {
    return (props.translatedCaptions && (playerIsPlay || !focusMetaPath))
      ? TranslatedCaptionHelper.findCaptionIndexByTime(props.translatedCaptions, currentTime)
      : undefined;
  }, [props.translatedCaptions, playerIsPlay, focusMetaPath, currentTime])

  const highlightMeta = playHighlightMeta ?? focusMetaPath;

  const setFocusMetaCallback = React.useCallback(
    setFocusMeta, [props.selectedStyleEditType, props.ProjectControlActions]
  );

  const handleOriginkeyDownCallback = React.useCallback(
    _handleOriginKeyDown, [props.realTimeTranslationFlag, props.translatedCaptions, logger, setFocusMetaCallback, props.TranslatedCaptionActions]
  );

  const handleOriginToTranslatedButtonClickCallback = React.useCallback(handleOriginToTranslatedButtonClick, [rootStore, dispatch, logger]);

  if (!props.translatedCaptions) {
    return null;
  }

  const TranslatedCaptions = props.translatedCaptions
    ?.filter((caption, index) => index < indexEnd)
    .map((caption, index) => {
      const focused = focusMetaPath?.captionIndex === index;
      const paragraphFocuse = focused && focusMetaPath?.paragraphIndex !== undefined;

      const TopControlButton = (focused && !paragraphFocuse) ? () => (
        <CaptionCotrolButtons reverse
          combineButtonRendered={index > 0}
          onCombineButtonClick={evt => handleCaptionTopCombineButtonClick(
            evt,
            focusMetaPath as Required<Pick<store.IIndexPath, 'captionIndex'>>,
            props.translatedCaptions!
          )}
        />
      ) : () => null;

      const BottomControlButton = (focused && !paragraphFocuse) ? () => (
        <CaptionCotrolButtons
          combineButtonRendered={index + 1 < props.translatedCaptions!.length}
          onCombineButtonClick={evt => handleCaptionBottomCombineButtonClick(
            evt,
            focusMetaPath as Required<Pick<store.IIndexPath, 'captionIndex'>>,
            props.translatedCaptions!
          )}
        />
      ) : () => null;

      return (
        <span key={caption.id}>
          <TopControlButton />
          <TranslatedCaption ref={lineRef}
            autoTranslation={props.realTimeTranslationFlag}
            caption={caption}
            meta={{ captionIndex: index }}
            highlightMeta={highlightMeta?.captionIndex === index ? highlightMeta : undefined}
            focusMeta={focusMetaPath?.captionIndex === index ? focusMetaPath : undefined}
            onWordClick={_handleWordClick}
            onWordChange={_handleWordChange}
            onWordKeyDown={_handleWordKeyDown}
            onWordFocus={_handleWordFocus}
            onLineClick={_handleLineClick}
            onLineKeyDown={_handleLineKeyDown}
            onOriginChange={_handleOriginWordChange}
            onOriginFocus={_handleOriginFocus}
            onOriginKeyDown={handleOriginkeyDownCallback}
            onOriginToTranslatedButtonClick={handleOriginToTranslatedButtonClickCallback}
            onReversTranslateButtonClick={handleReversTranslateButtonClick}
            onRemoveCaptionButtonClick={handelRemoveCaptionButtonClick}
            onRemoveParagraghButtonClick={handelRemoveParagraghButtonClick}
            onStartTimeTextBlur={_handleStartTimeTextBlur}
            onEndTimeTextBlur={_handleEndTimeTextBlur}
            onTopCombineButtonClick={handleTopCombineButtonClick}
            onBottomCombineButtonClick={handleBottomCombineButtonClick}
          />
          <BottomControlButton />
        </span>
      );
    });

  return (
    <div ref={captionListRef}>
      {TranslateGuid}
      {TranslatedCaptions}
    </div>
  )

  function _focusLineAgain() {
    if (isControllingLine) {
      lineRef.current?.focus();
      setIsControllingLine(false);
    }
  }

  function handleTopCombineButtonClick(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const captions = props.translatedCaptions!;

    const concatResult = TranslatedCaptionHelper.concatCaptionsForwardInCaptions(captions, {
      captionIndex: meta!.captionIndex!,
      paragraphIndex: meta!.paragraphIndex!,
      lineIndex: 0,
      wordIndex: 0
    });

    if (concatResult === null) {
      return;
    }

    props.TranslatedCaptionActions.setCaptions(concatResult.captions);
    setFocusMetaCallback({ ...meta, paragraphIndex: meta!.paragraphIndex! - 1 });
  }

  function handleBottomCombineButtonClick(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const captions = props.translatedCaptions!;
    const words = captions[meta!.captionIndex!].paragraphs[meta!.paragraphIndex!].lines[0].words
    const concatResult = TranslatedCaptionHelper.concatCaptionsBackwardInCaptions(captions, {
      captionIndex: meta!.captionIndex!,
      paragraphIndex: meta!.paragraphIndex!,
      lineIndex: 0,
      wordIndex: words.length - 1
    });

    if (concatResult === null) {
      return;
    }

    props.TranslatedCaptionActions.setCaptions(concatResult.captions);

    setFocusMetaCallback(meta!);
  }

  function handleCaptionTopCombineButtonClick(
    _evt: React.MouseEvent,
    path: Required<Pick<store.IIndexPath, 'captionIndex'>>,
    captions: store.ICaptionTranslatedParagraphWithId[]
  ) {
    const concatResult = TranslatedCaptionHelper.concatOriginCaptionsForwardInCaption(captions, path);
    if (concatResult === null) {
      return;
    }

    props.TranslatedCaptionActions.setCaptions(concatResult.captions);
    const { cursorIndex, ...nextFocusMeta } = concatResult.nextCursorMeta;

    setFocusMetaCallback({
      ...nextFocusMeta,
    });

    if (props.realTimeTranslationFlag) {
      let caption = { ...concatResult.captions[nextFocusMeta.captionIndex] };
      const task = translatedTask[caption.id];
      if (task) {
        clearTimeout(task);
      }

      caption = { ...caption };
      translatedTask[caption.id] = setTimeout(() => {
        ProjectManager.originTranslationAsync(caption);
      }, 0);
    }
  }

  function handleCaptionBottomCombineButtonClick(
    _evt: React.MouseEvent,
    path: Required<Pick<store.IIndexPath, 'captionIndex'>>,
    captions: store.ICaptionTranslatedParagraphWithId[]
  ) {
    const concatResult = TranslatedCaptionHelper.concatOriginCaptionsBackwardInCaption(captions, path);
    if (concatResult === null) {
      return;
    }

    props.TranslatedCaptionActions.setCaptions(concatResult.captions);
    const { cursorIndex, ...nextFocusMeta } = concatResult.nextCursorMeta;

    setFocusMetaCallback({
      ...nextFocusMeta
    });

    if (props.realTimeTranslationFlag) {
      let caption = { ...concatResult.captions[nextFocusMeta.captionIndex] };
      const task = translatedTask[caption.id];
      if (task) {
        clearTimeout(task);
      }

      caption = { ...caption };
      translatedTask[caption.id] = setTimeout(() => {
        ProjectManager.originTranslationAsync(caption);
      }, 0);
    }
  }

  function _setPlayerCurrentTime(meta: ICaptionEventMeta) {
    const captions = props.translatedCaptions!;
    const paragraphs = captions[meta.captionIndex!].paragraphs;

    if (player && player.isReady) {
      player.currentTime = paragraphs[meta.paragraphIndex!].lines.first().words.first().start;
      player.pause();
    }
  }

  function _handleLineKeyDown(evt: React.KeyboardEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    return _handleLineKeyDownInternal(evt, meta as Required<Omit<ICaptionEventMeta, 'cursorIndex'>>);

    function _handleLineKeyDownInternal(
      evt: React.KeyboardEvent<HTMLDivElement>,
      meta: Required<Omit<ICaptionEventMeta, 'cursorIndex'>>
    ) {
      const captions = props.translatedCaptions!;

      const keyDownEventHandleDict: { [code: string]: () => void } = {
        "ArrowDown": _handleArrowDownKeyDown,
        "ArrowUp": _handleArrowUpKeyDown
      }

      try {
        const handle = keyDownEventHandleDict[evt.code];
        handle && handle();
      } catch (err) {
        err instanceof Error && logger.logWarning(err);
      }

      return;

      function _handleArrowDownKeyDown() {
        let downIndex = TranslatedCaptionHelper.getLineDownIndex(captions, meta);

        if (downIndex === null) {
          return;
        }

        _setPlayerCurrentTime({ ...downIndex });
        setFocusMetaCallback({ ...downIndex });
        setIsControllingLine(true);
      }

      function _handleArrowUpKeyDown() {
        let upIndex = TranslatedCaptionHelper.getLineUpIndex(captions, meta);

        if (upIndex === null) {
          return;
        }

        _setPlayerCurrentTime({ ...upIndex });
        setFocusMetaCallback({ ...upIndex });
        setIsControllingLine(true);
      }
    }
  }

  function _handleStartTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) {
    const prevWord = TranslatedCaptionHelper.getPrevWord(props.translatedCaptions!, {
      captionIndex: meta!.captionIndex!,
      paragraphIndex: meta!.paragraphIndex!,
      lineIndex: 0,
      wordIndex: 0
    });

    const end = props.translatedCaptions![meta!.captionIndex!].paragraphs[meta!.paragraphIndex!].lines![meta!.lineIndex!].words!.last().end!;
    const prevEnd = prevWord?.end ?? 0;
    const timeSetValue = Math.min(end, Math.max(prevEnd, meta!.time));

    props.TranslatedCaptionActions.setStartTime({
      captionIndex: meta!.captionIndex,
      paragraphIndex: meta!.paragraphIndex,
      lineIndex: meta!.lineIndex,
      value: timeSetValue
    });
  }

  function _handleEndTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) {
    const paragraphs = props.translatedCaptions![meta!.captionIndex!].paragraphs;
    const lines = paragraphs[meta!.paragraphIndex!].lines!;
    const lineIndex = lines.length - 1;
    const words = lines[lineIndex].words!;

    const nextWord = TranslatedCaptionHelper.getNextWord(props.translatedCaptions!, {
      captionIndex: meta!.captionIndex!,
      paragraphIndex: meta!.paragraphIndex!,
      lineIndex: lineIndex,
      wordIndex: words.length - 1
    });

    const nextStart = nextWord?.start ?? (player?.isReady ? (player?.duration ?? Infinity) : Infinity);
    const timeSetValue = Math.max(words.first().start, Math.min(nextStart, meta!.time));

    props.TranslatedCaptionActions.setEndTime({
      captionIndex: meta!.captionIndex,
      paragraphIndex: meta!.paragraphIndex,
      lineIndex: meta!.lineIndex,
      value: timeSetValue
    });
  }

  function _handleLineClick(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const captions = props.translatedCaptions!;
    const paragraphs = captions[meta!.captionIndex!].paragraphs;

    if (player && player.isReady) {
      player.currentTime = paragraphs[meta!.paragraphIndex!].lines.first().words.first().start;
      player.pause();
    }

    props.ProjectControlActions.setFocusParagraphMetas([{
      path: {
        ...meta
      },
      source: 'list',
      type: 'translatedCaption'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'line');
    setIsControllingLine(true);
  }

  function setFocusMeta(
    meta: Omit<store.IIndexPath, "cursorIndex"> & { selection?: ISelection }
  ) {
    props.ProjectControlActions.setFocusParagraphMetas([{
      path: {
        ...meta
      },
      source: 'list',
      type: 'translatedCaption'
    }]);

    const selectedStyleEditType = props.selectedStyleEditType;
    if (selectedStyleEditType !== 'word' && meta.wordIndex !== undefined) {
      props.ProjectControlActions.setSelectedStyleEditType('word');
    }

    if (selectedStyleEditType !== 'line' && meta.wordIndex === undefined) {
      props.ProjectControlActions.setSelectedStyleEditType('line');
    }
  }

  function _handleWordClick(evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    evt.stopPropagation();

    setFocusMetaCallback({
      ...meta,
      selection: {
        start: evt.currentTarget.selectionStart ?? 0,
        end: evt.currentTarget.selectionEnd ?? -1,
      }
    });
  }

  function _increaseIndexEnd() {
    const length = props.translatedCaptions?.length ?? 0;
    if (indexEnd >= length) return;

    const indexTimeout = setTimeout(() => {
      setIndexEnd(Math.min(length, indexEnd + downcapOptions.itemRenderingQuantity));
    }, 0.1);

    return () => clearTimeout(indexTimeout);
  }

  function _handleWordFocus(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    const captions = props.translatedCaptions;
    const { captionIndex, paragraphIndex, lineIndex, wordIndex } = meta!;
    const word = captions![captionIndex!].paragraphs[paragraphIndex!].lines[lineIndex!].words[wordIndex!];
    if (player && player.isReady) {
      player.pause();
      player.currentTime = word.start;
    }
  }

  function _handleTimeUpdate(evt: PlayerEvent) {
    setCurrnetTime(evt.target.currentTime);
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

  function _firstTranslationEffect() {
    if (!props.originCaptions?.any() || props.translatedCaptions?.any() || props.totalTranslateTaskLength !== undefined) {
      return;
    }

    ProjectManager.translateCaptionsAsync(props.originCaptions);
  }

  function handleOriginToTranslatedButtonClick(evt: React.MouseEvent, meta?: ICaptionEventMeta) {
    ClientAnalysisService.translationClick();

    if (!meta) {
      logger.variableIsUndefined('meta', 'handleOriginToTranslatedButtonClick');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', 'handleOriginToTranslatedButtonClick');
      return;
    }

    const { captionIndex } = meta;
    const captions = rootStore.getState().present.translatedCaption.captions;
    if (captions === undefined) {
      logger.variableIsUndefined('captions', 'handleOriginToTranslatedButtonClick');
      return;
    }

    const caption = captions[captionIndex];
    if (!caption) {
      logger.variableIsUndefined('caption', 'handleOriginToTranslatedButtonClick');
      return;
    }

    ProjectManager.originTranslationAsync(caption, dispatch);
  }

  function handleReversTranslateButtonClick(evt: React.MouseEvent, meta?: ICaptionEventMeta) {
    ClientAnalysisService.reversTranslationClick();

    if (!meta) {
      logger.variableIsUndefined('meta', 'handleReversTranslateButtonClick');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', 'handleReversTranslateButtonClick');
      return;
    }

    const { captionIndex } = meta;
    const captions = rootStore.getState().present.translatedCaption.captions;
    if (captions === undefined) {
      logger.variableIsUndefined('captions', 'handleReversTranslateButtonClick');
      return;
    }

    const caption = captions[captionIndex];
    ProjectManager.reversTranslationAsync(caption);
  }

  function handelRemoveCaptionButtonClick(evt: React.MouseEvent, meta?: ICaptionEventMeta) {
    removeCaption(meta!.captionIndex!);
  }

  function handelRemoveParagraghButtonClick(evt: React.MouseEvent, meta?: ICaptionEventMeta) {
    let captions = [...props.translatedCaptions!];

    if (captions[meta!.captionIndex!].paragraphs.length === 1) {
      removeCaption(meta!.captionIndex!);
      return;
    }

    props.TranslatedCaptionActions.removeParagraph({
      path: {
        captionIndex: meta!.captionIndex,
        paragraphIndex: meta!.paragraphIndex,
      }
    });
  }

  function _handleOriginKeyDown(evt: React.KeyboardEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) {
    if (evt.nativeEvent.isComposing) {
      return;
    }

    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleOriginKeyDown');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', '_handleOriginKeyDown');
      return;
    }

    return _handleOriginKeyDownInternal(evt, meta as Required<Pick<ICaptionEventMeta, 'captionIndex'>>);

    function _handleOriginKeyDownInternal(
      evt: React.KeyboardEvent<HTMLTextAreaElement>,
      meta: Required<Pick<ICaptionEventMeta, 'captionIndex'>>
    ) {
      const captions = props.translatedCaptions!;
      if (!captions) {
        logger.variableIsUndefined('captions', '_handleOriginKeyDownInternal');
        return;
      }

      const keyDownEventHandleDict: { [code: string]: () => void } = {
        "ArrowDown": _handleOriginArrowDownKeyDown,
        "ArrowUp": _handleOriginArrowUpKeyDown,
        "ArrowLeft": _handleOriginArrowLeftKeyDown,
        "ArrowRight": _handleOriginArrowRightKeyDown,
        "Enter": _handleOriginEnterKeyDown,
        "NumpadEnter": _handleOriginEnterKeyDown,
        "Backspace": _handleOriginBackspaceKeyDown,
        "Delete": _handleOriginDeleteKeyDown,
        "Tab": () => { evt.preventDefault(); evt.stopPropagation(); }
      }

      try {
        const handle = keyDownEventHandleDict[evt.code];
        handle && handle();
      } catch (err) {
        if (err instanceof Error) logger.logWarning(err);
      }
      return;

      function _handleOriginEnterKeyDown() {
        evt.preventDefault();

        if (!CursorHelper.isSelectionNone(evt)
          || CursorHelper.isCursorEnd(evt)
          || CursorHelper.isCursorStart(evt)) {
          return;
        }

        const captionIndex = meta.captionIndex;

        const [prevCaption, laterCaption] = TranslatedCaptionHelper.splitOriginCaption(
          captions[captionIndex],
          { cursorIndex: evt.currentTarget.selectionStart }
        );

        prevCaption.id = IdGenerator.getNextId('translated', 'caption');
        laterCaption.id = IdGenerator.getNextId('translated', 'caption');

        let nextCaptions = [...captions];

        nextCaptions.splice(
          captionIndex,
          1,
          prevCaption as store.ICaptionTranslatedParagraphWithId,
          laterCaption as store.ICaptionTranslatedParagraphWithId
        );

        props.TranslatedCaptionActions.setCaptions(nextCaptions);

        _translate(prevCaption as store.ICaptionTranslatedParagraphWithId);
        _translate(laterCaption as store.ICaptionTranslatedParagraphWithId);

        setFocusMetaCallback({
          captionIndex: captionIndex + 1,
          selection: {
            start: 0,
            end: 0
          }
        })

        function _translate(caption: store.ICaptionTranslatedParagraphWithId) {
          const task = translatedTask[caption.id];
          if (task) {
            clearTimeout(task);
          }

          caption = { ...caption };
          translatedTask[caption.id] = setTimeout(() => {
            ProjectManager.originTranslationAsync(caption).finally(() => {
              delete translatedTask[caption.id];
            });
          }, 0);
        }
      }

      function _handleOriginDeleteKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        const concatResult = TranslatedCaptionHelper.concatOriginCaptionsBackwardInCaption(captions, meta);
        if (concatResult === null) {
          return;
        }

        props.TranslatedCaptionActions.setCaptions(concatResult.captions);
        const { cursorIndex, ...focusMeta } = concatResult.nextCursorMeta;

        setFocusMetaCallback({
          ...focusMeta,
          selection: {
            start: cursorIndex,
            end: cursorIndex
          }
        });

        if (props.realTimeTranslationFlag) {
          let caption = { ...concatResult.captions[focusMeta.captionIndex] };
          const task = translatedTask[caption.id];
          if (task) {
            clearTimeout(task);
          }

          caption = { ...caption };
          translatedTask[caption.id] = setTimeout(() => {
            ProjectManager.originTranslationAsync(caption);
          }, 0);
        }
      }

      function _handleOriginArrowDownKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt) || meta.captionIndex + 1 >= captions.length) {
          return;
        }

        evt.preventDefault();

        setFocusMetaCallback({
          ...meta,
          captionIndex: meta.captionIndex + 1,
          selection: {
            end: 0,
            start: 0,
          }
        });
      }

      function _handleOriginArrowUpKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt) || meta.captionIndex <= 0) {
          return;
        }

        evt.preventDefault();

        setFocusMetaCallback({
          ...meta,
          captionIndex: meta.captionIndex - 1,
          selection: {
            end: -1,
            start: -1,
          }
        });
      }

      function _handleOriginArrowLeftKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt) || meta.captionIndex <= 0) {
          return;
        }

        setFocusMetaCallback({
          ...meta,
          captionIndex: meta.captionIndex - 1,
          selection: {
            end: -1,
            start: -1,
          }
        });
      }

      function _handleOriginArrowRightKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt) || meta.captionIndex + 1 >= captions.length) {
          return;
        }

        setFocusMetaCallback({
          ...meta,
          captionIndex: meta.captionIndex + 1,
          selection: {
            end: 0,
            start: 0,
          }
        });
      }

      function _handleOriginBackspaceKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt)) {
          return;
        }

        const concatResult = TranslatedCaptionHelper.concatOriginCaptionsForwardInCaption(captions, meta);
        if (concatResult === null) {
          return;
        }

        props.TranslatedCaptionActions.setCaptions(concatResult.captions);
        const { cursorIndex, ...focusMeta } = concatResult.nextCursorMeta;

        setFocusMetaCallback({
          ...focusMeta,
          selection: {
            start: cursorIndex,
            end: cursorIndex
          }
        });

        if (props.realTimeTranslationFlag) {
          let caption = { ...concatResult.captions[focusMeta.captionIndex] };
          const task = translatedTask[caption.id];
          if (task) {
            clearTimeout(task);
          }

          caption = { ...caption };
          translatedTask[caption.id] = setTimeout(() => {
            ProjectManager.originTranslationAsync(caption);
          }, 0);
        }
      }
    }
  }

  function _handleWordKeyDown(evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    evt.stopPropagation();

    if (evt.nativeEvent.isComposing || evt.nativeEvent.key === 'Process') {
      return;
    }

    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleWordKeyDown');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', '_handleWordKeyDown');
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleWordKeyDown');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleWordKeyDown');
      return;
    }

    if (meta.wordIndex === undefined) {
      logger.variableIsUndefined('meta.wordIndex', '_handleWordKeyDown');
      return;
    }

    return _handleWordKeyDownInternal(evt, meta as Required<Omit<ICaptionEventMeta, 'cursorIndex'>>);

    function _handleWordKeyDownInternal(
      evt: React.KeyboardEvent<HTMLInputElement>,
      meta: Required<Omit<ICaptionEventMeta, 'cursorIndex'>>
    ) {

      const captions = rootStore.getState().present.translatedCaption.captions!;
      if (!captions) {
        logger.variableIsUndefined('captions', '_handleWordKeyDownInternal');
        return;
      }

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

      function _handleArrowDownKeyDown() {
        const downIndex = TranslatedCaptionHelper.getDownIndex(captions, meta);
        if (downIndex === null) {
          return;
        }
        evt.preventDefault();

        setFocusMetaCallback({ ...downIndex, selection: { start: 0, end: -1 } });
      }

      function _handleArrowUpKeyDown() {
        const upIndex = TranslatedCaptionHelper.getUpIndex(captions, meta);
        if (upIndex === null) {
          return;
        }
        evt.preventDefault();

        setFocusMetaCallback({ ...upIndex, selection: { start: 0, end: -1 } });
      }

      function _handleArrowLeftKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt)) {
          return;
        }

        const leftIndex = TranslatedCaptionHelper.getLeftIndex(captions, meta);
        if (leftIndex === null) {
          return;
        }
        evt.preventDefault();

        setFocusMetaCallback({ ...leftIndex, selection: { start: 0, end: -1 } });
      }

      function _handleArrowRightKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        const rightIndex = TranslatedCaptionHelper.getRightIndex(captions, meta);
        if (rightIndex === null) {
          return;
        }
        evt.preventDefault();

        setFocusMetaCallback({ ...rightIndex, selection: { start: 0, end: -1 } });
      }


      function _handleEnterKeyDown() {
        const { captionIndex, paragraphIndex, lineIndex, wordIndex } = meta;

        if (wordIndex === 0 && CursorHelper.isCursorStart(evt)) {
          return;
        }

        const caption = captions[captionIndex];
        const paragraph = caption.paragraphs[paragraphIndex];
        const words = paragraph.lines[meta.lineIndex].words;

        if (wordIndex === words.length - 1 && CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        evt.preventDefault();

        const nextCaption = TranslatedCaptionHelper.splitParagraphInCaptions(caption, {
          cursorIndex: evt.currentTarget.selectionStart!,
          lineIndex: lineIndex,
          paragraphIndex: paragraphIndex,
          wordIndex: wordIndex
        })

        props.TranslatedCaptionActions.updateCaptions({
          index: captionIndex,
          caption: nextCaption
        });

        setFocusMetaCallback({
          ...meta,
          paragraphIndex: paragraphIndex + 1,
          lineIndex: 0,
          wordIndex: 0,
          selection: {
            end: 0,
            start: 0
          }
        });
      }

      function _handleBackspaceKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt)) {
          return;
        }

        const concatResult = TranslatedCaptionHelper.concatCaptionsForwardInCaptions(captions, meta);
        if (concatResult === null) {
          return;
        }

        deletedTargetCaption = concatResult.captions[meta.captionIndex];

        evt.preventDefault();

        props.TranslatedCaptionActions.setCaptions(concatResult.captions);
        const { cursorIndex, ...focusMeta } = concatResult.nextCursorMeta;

        setFocusMetaCallback({
          ...focusMeta,
          selection: {
            start: cursorIndex,
            end: cursorIndex
          }
        });
      }

      function _handleDeleteKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        const concatResult = TranslatedCaptionHelper.concatCaptionsBackwardInCaptions(captions, meta);
        if (concatResult === null) {
          return;
        }

        deletedTargetCaption = concatResult.captions[meta.captionIndex];

        props.TranslatedCaptionActions.setCaptions(concatResult.captions);
        const { cursorIndex, ...focusMeta } = concatResult.nextCursorMeta;

        setFocusMetaCallback({
          ...focusMeta,
          selection: {
            start: cursorIndex,
            end: cursorIndex
          }
        });

      }
    }
  }

  function _handleWordChange(evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleWordChange');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', '_handleWordChange');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex ', '_handleWordChange');
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleWordChange');
      return;
    }

    if (meta.wordIndex === undefined) {
      logger.variableIsUndefined('meta.wordIndex', '_handleWordChange');
      return;
    }

    let captions = [...props.translatedCaptions!];
    let caption = { ...captions[meta.captionIndex] };
    if (caption.meta.reversTranslateStatus === "Pending") {
      return;
    }

    caption = TranslatedCaptionHelper.changeTextInCaption(caption, meta as Required<ICaptionEventMeta>, evt.target.value);

    props.TranslatedCaptionActions.setTextByCaptionId(caption);

    if (props.realTimeTranslationFlag) {
      const task = translatedTask[caption.id];
      if (task) {
        clearTimeout(task);
      }

      caption = { ...caption };
      translatedTask[caption.id] = setTimeout(() => {
        if (deletedTargetCaption !== undefined) {
          caption = deletedTargetCaption;
        }

        ProjectManager.reversTranslationAsync(caption)
          .finally(() => {
            delete translatedTask[caption.id];
          });
      }, downcapOptions.realtimeTranslationDelayTime);
      deletedTargetCaption = undefined;
    }
  }

  function _handleOriginWordChange(evt: React.ChangeEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleOriginWordChange');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', '_handleOriginWordChange');
      return;
    }

    let captions = [...props.translatedCaptions!];
    let caption = { ...captions[meta.captionIndex] };
    if (caption.meta.translatStatus === "Pending"
      || caption.meta.reversTranslateStatus === "Pending") {
      return;
    }

    caption.origin = evt.target.value;
    props.TranslatedCaptionActions.updateCaptions({
      caption,
      index: meta.captionIndex
    });

    if (props.realTimeTranslationFlag) {
      const task = translatedTask[caption.id];
      if (task) {
        clearTimeout(task);
      }

      caption = { ...caption };
      translatedTask[caption.id] = setTimeout(() => {
        ProjectManager.originTranslationAsync(caption).finally(() => {
          delete translatedTask[caption.id];
        });
      }, downcapOptions.realtimeTranslationDelayTime);
    }
  }

  function _handleOriginFocus(evt: React.ChangeEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleOriginWordChange');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', '_handleOriginWordChange');
      return;
    }

    setFocusMetaCallback({ ...meta });
    if (!player?.isReady) {
      return;
    }
    player.pause();

    const captions = props.translatedCaptions!;
    const paragraphs = captions[meta.captionIndex].paragraphs;
    if (!paragraphs?.any()) {
      return;
    }

    const start = paragraphs.first().lines.first().words.first().start;
    player.currentTime = start;
  }

  function _handleTranslatedInfoBoardCloseClick(evt: React.MouseEvent) {
    ProjectManager.closeTranslatedGuide();
  }

  function removeCaption(captionIndex: number) {
    let captions = [...props.translatedCaptions!];
    captions.splice(captionIndex, 1)

    if (captionIndex === captions.length) {
      props.ProjectControlActions.setFocusParagraphMetas(null)
    }

    props.TranslatedCaptionActions.setCaptions(captions);
  }
}

export default ReactRedux.connect<ITranslatedCaptionListContainerStateProps, ITranslatedCaptionListContainerDispatchProps, {}, store.RootState>(
  state => ({
    originCaptions: state.present.originCaption.captions,
    translatedCaptions: state.present.translatedCaption.captions,
    translateGuideOpen: state.present.project.translateGuideOpen,
    realTimeTranslationFlag: state.present.appSetting.realTimeTranslationFlag,
    focusParagraphMetas: state.present.projectCotrol.focusParagraphMetas,
    totalTranslateTaskLength: state.present.project.totalTranslateTaskLength,
    selectedStyleEditType: state.present.projectCotrol.selectedStyleEditType
  }),
  dispatch => ({
    TranslatedCaptionActions: Redux.bindActionCreators(translateCaptionActions, dispatch),
    ProjectControlActions: Redux.bindActionCreators(projectControlActions, dispatch)
  })
)(TranslatedCaptionListContainer);