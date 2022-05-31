import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import React from 'react';
import * as Redux from 'redux'
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as translatedCaptionActions from 'storeV2/modules/translatedCaption';
import * as appSettingActions from 'storeV2/modules/appSetting';
import PlayerContext from 'contexts/PlayerContext';
import { ICaptionEventMeta } from 'components/caption/CaptionInput';
import IArea from 'IArea';
import { rgbaToString } from 'lib/utils';
import { PlayerEvent } from 'lib/player/Player';
import TranslatedCaptionHelper from 'helpers/TranslatedCaptionHelper';
import Overlay from 'components/Overlay';
import CaptionInputs from 'components/caption/CaptionInputs';
import IPoint from 'IPoint';
import { ISelection } from 'models/ISelection';
import { CursorHelper } from 'CursorHelper';
import downcapOptions from 'downcapOptions';
import * as projectControlActions from 'storeV2/modules/projectControl';
import ComparerHelper from 'lib/ComparerHelper';
import BinarySearchHelper from 'lib/BinarySearchHelper';
import ProjectControlManager from 'managers/ProjectControlManager';
import { IHighlightMeta } from 'containers/captions';
import StyleParser from 'StyleParser';
import OverlayHelper from 'OverlayHelper';

interface ITranslateOverlayProviderCotainerProps {
  area?: IArea;
  fontUnitSize?: number;
}

function TranslatedOverlayProviderCotainer(props: ITranslateOverlayProviderCotainerProps) {
  const logger = ReactLoggerFactoryHelper.build('TranslateOverlayProviderCotainer');
  const { player } = React.useContext(PlayerContext);


  const captions = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionTranslatedParagraphWithId[] | undefined
  >(state => state.present.translatedCaption.captions);

  const defaultStyle = ReactRedux.useSelector<
    store.RootState,
    store.ICaptionsStyle | undefined
  >(state => state.present.translatedCaption.defaultStyle ?? state.present.project.projectDefaultStyle);

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const selectedPreviewType = ReactRedux.useSelector<
    store.RootState,
    store.PreviewType | undefined
  >(state => state.present.project.selectedPreviewType);

  const translatedMultilineCaptions = ReactRedux.useSelector<
    store.RootState, store.ITranslatedMultilineCaption[] | undefined
  >(state => state.present.translatedMultiline.captions);

  const defaultLocation = ReactRedux.useSelector<
    store.RootState,
    store.ILocation | undefined
  >(state => state.present.translatedCaption.defaultLocation);

  const dispatch = ReactRedux.useDispatch();

  const [currentTime, setCurrentTime] = React.useState<number>(player?.isReady ? player.currentTime : -Infinity);
  const [prevAutoTranslateFlag, setPrevAutoTranslateFlag] = React.useState<boolean>();

  const focusType = focusParagraphMetas?.first().type;
  const focusPath = focusParagraphMetas?.first().path;

  const overlayTime = OverlayHelper.getStartTimeByfocusedParagraph({ translatedCaption: captions, translatedMultiline: translatedMultilineCaptions }, focusType, focusPath) ?? currentTime;
  const overlayPaths = captions && TranslatedCaptionHelper.findCaptionIndexByTime(captions, overlayTime);

  const paragraph = (overlayPaths?.paragraphIndex ?? -1) >= 0
    ? captions![overlayPaths!.captionIndex!].paragraphs[overlayPaths!.paragraphIndex!]
    : undefined;

  const line = paragraph && paragraph.lines[overlayPaths!.lineIndex!];
  const rootStore = ReactRedux.useStore();

  const meta = React.useMemo<ICaptionEventMeta | undefined>(() => {
    if (overlayPaths?.paragraphIndex === undefined) {
      return undefined;
    }

    return ({
      captionIndex: overlayPaths.captionIndex,
      paragraphIndex: overlayPaths.paragraphIndex,
      lineIndex: 0
    })
  }, [overlayPaths?.captionIndex, overlayPaths?.paragraphIndex])

  const wordDefaultStyle = React.useMemo(() => {
    if (line?.style === undefined && defaultStyle === undefined) {
      return undefined;
    }

    return {
      ...defaultStyle,
      ...line?.style
    }
  }, [line?.style, defaultStyle]);

  const lineBackground = line?.style?.background ?? defaultStyle?.background;
  const lineStyle = React.useMemo(() => {
    let style: React.CSSProperties = {
      fontSize: props.fontUnitSize ?? 16,
    };

    let background = StyleParser.backgroundParse(lineBackground, selectedPreviewType);
    if (background) {
      style.background = rgbaToString(background);
    }

    return style;
  }, [props.fontUnitSize, lineBackground, selectedPreviewType])

  React.useEffect(_timeUpdateEffect, [player, player?.isReady]);
  React.useEffect(_shortcutEffect);

  let focusMetaPath = focusParagraphMetas
    ?.filter(focusMeta => focusMeta.type === "translatedCaption" && focusMeta.source === "overlay")
    .first()?.path;

  if (focusMetaPath?.captionIndex !== overlayPaths?.captionIndex
    || focusMetaPath?.paragraphIndex !== overlayPaths?.paragraphIndex) {
    focusMetaPath = undefined;
  }

  const highlightMeta = React.useMemo<IHighlightMeta | undefined>(() => {
    if (overlayPaths?.wordIndex === undefined) {
      return undefined;
    }

    return {
      captionIndex: overlayPaths?.captionIndex,
      lineIndex: overlayPaths?.lineIndex,
      paragraphIndex: overlayPaths?.paragraphIndex,
      wordIndex: overlayPaths?.wordIndex
    };
  }, [
    overlayPaths?.captionIndex,
    overlayPaths?.lineIndex,
    overlayPaths?.paragraphIndex,
    overlayPaths?.wordIndex
  ]);


  if (line === undefined) {
    return null;
  }

  const vertical = paragraph?.vertical ?? defaultLocation?.vertical ?? downcapOptions.defaultLocation.vertical;
  const horizontal = paragraph?.horizontal ?? defaultLocation?.horizontal ?? downcapOptions.defaultLocation.horizontal;
  return (
    <Overlay draggabled
      area={props.area}
      meta={meta}
      style={lineStyle}
      vertical={vertical}
      horizontal={horizontal}
      selectedPreviewType={selectedPreviewType}
      onBlur={_handleOverlayBlur}
      onClickCapture={_handleClickCapture}
      onLocationChangeEnd={_handleLocationChangeEnd}
    >
      <CaptionInputs
        selectedPreviewType={selectedPreviewType}
        fontUnitSize={props.fontUnitSize}
        className="cursor-default"
        words={line.words}
        meta={meta}
        focusMeta={focusMetaPath}
        wordDefaultStyle={wordDefaultStyle}
        highlightMeta={player?.isReady && player.isPlay ? highlightMeta : undefined}
        onFocus={_handleWordFocus}
        onChange={_handleChange}
        onKeyDown={_handleWordKeyDown}
        onClick={_handleWordClick}
      />
    </Overlay>
  )

  function _handleClickCapture(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectControlActions.setFocusParagraphMetas([{
      path: { ...meta },
      source: 'overlay',
      type: 'translatedCaption'
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

    const captions = store.default.getState().present.translatedCaption?.captions;
    if (!captions) {
      return;
    }

    const currentTime = player.currentTime;

    let captionIndex = BinarySearchHelper.findInsertIndex(captions, currentTime, (caption, time) => {
      if (!caption.paragraphs?.any()) {
        return 1;
      }

      const start = caption.paragraphs.first().lines.first().words.first().start;
      const end = caption.paragraphs.last().lines.last().words.last().end;
      const captionTime = ({
        end: end,
        start: start
      });

      return ComparerHelper.compareTimeAndCurrentTime(captionTime, time);
    });

    let paragraphIndex = captions[captionIndex]?.paragraphs && BinarySearchHelper.findInsertIndex(
      captions[captionIndex].paragraphs,
      currentTime,
      ComparerHelper.compareParagraphAndTime
    );

    let path: Required<ICaptionEventMeta> & { selection?: ISelection };
    if (captionIndex <= 0 && paragraphIndex !== undefined && paragraphIndex <= 0) {
      path = {
        captionIndex: 0,
        paragraphIndex: 0,
        lineIndex: 0,
        wordIndex: 0,
        selection: {
          start: 0,
          end: -1
        },
      }
    } else {
      captionIndex -= 1;
      if (!captions[captionIndex]?.paragraphs?.any()) {
        return;
      }

      paragraphIndex = BinarySearchHelper.findInsertIndex(
        captions[captionIndex].paragraphs,
        currentTime,
        ComparerHelper.compareParagraphAndTime
      );

      if (paragraphIndex === 0) {
        captionIndex -= 1;
        paragraphIndex = captions[captionIndex].paragraphs.length;
      }

      paragraphIndex -= 1;
      const caption = captions![captionIndex];
      const paragraph = caption.paragraphs[paragraphIndex];
      const line = paragraph.lines.first();
      const words = line.words;

      let index = 1;
      for (index = 1; index < words.length; index++) {
        const word = words[index];
        if (currentTime < word.start) {
          break;
        }
      }

      path = {
        captionIndex: captionIndex,
        paragraphIndex: paragraphIndex,
        lineIndex: 0,
        wordIndex: index - 1,
        selection: {
          start: 0,
          end: -1
        },
      }
    }

    _setFocusMetaAfterTimeUpdate(path);
  }

  function _shortcutEffect() {
    document.body.addEventListener('keydown', _playControl);

    return () => {
      document.body.removeEventListener('keydown', _playControl);
    }
  }

  function _handleWordClick(evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (!meta) {
      return;
    }

    _setFocusMetaAfterTimeUpdate({
      ...(meta as Required<ICaptionEventMeta>),
      selection: {
        start: evt.currentTarget.selectionStart ?? 0,
        end: evt.currentTarget.selectionEnd ?? evt.currentTarget.value.length,
      }
    });

    if (store.default.getState().present.projectCotrol.selectedStyleEditType !== 'word') {
      const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
      ProjectControlActions.setSelectedStyleEditType('word');
    }
  }

  function _handleWordFocus() {
    const realTimeTranslationFlag = store.default.getState().present.appSetting.realTimeTranslationFlag;
    if (realTimeTranslationFlag) {
      setPrevAutoTranslateFlag(true);
      const AppSettingActionsActions = Redux.bindActionCreators(appSettingActions, dispatch);
      AppSettingActionsActions.setRealTimeTranslationFlag(false);
    }
  }

  function _handleChange(evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (!meta) {
      logger.variableIsUndefined('meta', '_handleChange');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', '_handleChange');
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

    const { captionIndex, paragraphIndex, lineIndex, wordIndex } = meta;
    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, dispatch);
    TranslatedCaptionActions.setText({
      path: {
        captionIndex: captionIndex,
        paragraphIndex: paragraphIndex,
        lineIndex: lineIndex,
        wordIndex: wordIndex
      },
      text: evt.target.value
    });
  }

  function _handleLocationChangeEnd(location: IPoint, meta?: ICaptionEventMeta) {
    if (!meta) {
      logger.variableIsUndefined('meta', '_handleLocationChangeEnd');
      return;
    }

    if (meta.captionIndex === undefined) {
      logger.variableIsUndefined('meta.captionIndex', '_handleLocationChangeEnd');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleLocationChangeEnd');
      return;
    }

    const { captionIndex, paragraphIndex } = meta;
    const captions = store.default.getState().present.translatedCaption.captions;

    if (!captions) {
      logger.variableIsUndefined('captions', '_handleLocationChangeEnd');
      return;
    }

    const paragraph: store.ICaptionsParagraph = {
      ...captions[captionIndex].paragraphs[paragraphIndex],
      horizontal: location.x,
      vertical: location.y
    };

    const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, dispatch);
    TranslatedCaptionActions.updateParagraph({
      paragraph: paragraph,
      path: {
        captionIndex: meta.captionIndex,
        paragraphIndex: meta.paragraphIndex
      }
    });
  }

  function _handleOverlayBlur(evt: React.FocusEvent) {
    if (prevAutoTranslateFlag) {
      const AppSettingActionsActions = Redux.bindActionCreators(appSettingActions, dispatch);
      AppSettingActionsActions.setRealTimeTranslationFlag(true);
      setPrevAutoTranslateFlag(false);
    }
  }

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

  function _setFocusMetaAfterTimeUpdate(meta: Required<ICaptionEventMeta> & { selection?: ISelection }) {
    const focusUpdate = () => {
      const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
      ProjectControlActions.setFocusParagraphMetas([{
        path: {
          selection: {
            start: 0,
            end: -1
          },
          ...meta
        },
        source: 'overlay',
        type: 'translatedCaption'
      }]);

      if (store.default.getState().present.projectCotrol.selectedStyleEditType !== 'word') {
        ProjectControlActions.setSelectedStyleEditType('word');
      }

      player?.removeTimeUpdateEventListener(focusUpdate);
    };

    if (!player) {
      focusUpdate();
      return;
    }

    const captions = store.default.getState().present.translatedCaption?.captions;
    if (captions === undefined) {
      logger.variableIsUndefined('_setFocusMetaByKeybordEventAfterTimeUpdate', captions);
      return;

    }
    const words = captions[meta.captionIndex].paragraphs[meta.paragraphIndex].lines[meta.lineIndex].words;
    const wordIndex = meta.wordIndex < 0 ? words.length + meta.wordIndex : meta.wordIndex;
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

  function _handleWordKeyDown(evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (evt.nativeEvent.isComposing) {
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

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleWordKeyDown');
      return;
    }

    if (meta.lineIndex === undefined) {
      logger.variableIsUndefined('meta.lineIndex', '_handleWordKeyDown');
      return;
    }


    if (meta.wordIndex === undefined) {
      logger.variableIsUndefined('meta.wordIndex', '_handleWordKeyDown');
      return;
    }

    return _handleWordKeyDownInternal(evt, meta as Required<Omit<ICaptionEventMeta, 'cursorIndex'>>);

    function _handleWordKeyDownInternal(
      evt: React.KeyboardEvent<HTMLInputElement>,
      meta: Required<ICaptionEventMeta>
    ) {
      const translatedCaptions = rootStore.getState().present.translatedCaption.captions!;
      if (!translatedCaptions) {
        logger.variableIsUndefined('captions', '_handleWordKeyDownInternal');
        return;
      }
      const TranslatedCaptionActions = Redux.bindActionCreators(translatedCaptionActions, dispatch);

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
        err instanceof Error && logger.logWarning(err);
      }

      return;

      function _getTranslatedLineStartTime(captionIndex: number, paragraphIndex: number) {
        return translatedCaptions[captionIndex].paragraphs[paragraphIndex].lines.first().words.first().start;
      }

      function _getTranslatedLineEndTime(captionIndex: number, paragraphIndex: number) {
        return translatedCaptions[captionIndex].paragraphs[paragraphIndex].lines.last().words.last().end;
      }

      function paragraphIndexUpBySkipDurationZeroLine(nextCaptionIndex: number, nextParagraphIndex: number, nextWordIndex: number) {
        let targetCaptionIndex = nextCaptionIndex;
        let targetParagraphIndex = nextParagraphIndex;
        let targetWordIndex = nextWordIndex;

        let nextLineStart: number = 0;
        let nextLineEnd: number = 0;

        while (nextLineStart === nextLineEnd) {
          targetParagraphIndex++;

          if (targetParagraphIndex >= translatedCaptions[targetCaptionIndex].paragraphs.length) {
            targetCaptionIndex++;
            if (targetCaptionIndex >= translatedCaptions.length) {
              _setFocusMetaAfterTimeUpdate({
                ...meta,
                captionIndex: meta.captionIndex,
                paragraphIndex: meta.paragraphIndex,
                wordIndex: -1,
              });

              return;
            }

            targetParagraphIndex = 0;
          }

          targetWordIndex = Math.min(targetWordIndex, translatedCaptions[targetCaptionIndex].paragraphs[targetParagraphIndex].lines.last().words.length - 1);
          nextLineStart = _getTranslatedLineStartTime(targetCaptionIndex, targetParagraphIndex);
          nextLineEnd = _getTranslatedLineEndTime(targetCaptionIndex, targetParagraphIndex);
        }

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          captionIndex: targetCaptionIndex,
          paragraphIndex: targetParagraphIndex,
          wordIndex: targetWordIndex
        });
      }

      function paragraphIndexDownBySkipDurationZeroLine(nextCaptionIndex: number, nextParagraphIndex: number, nextWordIndex: number) {
        let targetCaptionIndex = nextCaptionIndex;
        let targetParagraphIndex = nextParagraphIndex;
        let targetWordIndex = nextWordIndex;

        let nextLineStart: number = 0;
        let nextLineEnd: number = 0;

        while (nextLineStart === nextLineEnd) {
          targetParagraphIndex--;

          if (targetParagraphIndex < 0) {
            targetCaptionIndex--;

            if (targetCaptionIndex < 0) {
              _setFocusMetaAfterTimeUpdate({
                ...meta,
                captionIndex: meta.captionIndex,
                paragraphIndex: meta.paragraphIndex,
                wordIndex: 0,
              });

              return;
            }

            targetParagraphIndex = translatedCaptions[targetCaptionIndex].paragraphs.length - 1
          }

          targetWordIndex = Math.min(targetWordIndex, translatedCaptions[targetCaptionIndex].paragraphs[targetParagraphIndex].lines.last().words.length - 1);
          nextLineStart = _getTranslatedLineStartTime(targetCaptionIndex, targetParagraphIndex);
          nextLineEnd = _getTranslatedLineEndTime(targetCaptionIndex, targetParagraphIndex);
        }

        _setFocusMetaAfterTimeUpdate({
          ...meta,
          captionIndex: targetCaptionIndex,
          paragraphIndex: targetParagraphIndex,
          wordIndex: targetWordIndex
        });
      }

      function _handleArrowDownKeyDown() {
        const downIndex = TranslatedCaptionHelper.getDownIndex(translatedCaptions, meta);
        if (downIndex === null) {
          return;
        }

        const nextLineStart = _getTranslatedLineStartTime(downIndex.captionIndex, downIndex.paragraphIndex);
        const nextLineEnd = _getTranslatedLineEndTime(downIndex.captionIndex, downIndex.paragraphIndex);

        if (nextLineStart === nextLineEnd) {
          paragraphIndexUpBySkipDurationZeroLine(downIndex.captionIndex, downIndex.paragraphIndex, downIndex.wordIndex);
          return;
        }

        evt.preventDefault();
        _setFocusMetaAfterTimeUpdate(downIndex);
      }

      function _handleArrowUpKeyDown() {
        const upIndex = TranslatedCaptionHelper.getUpIndex(translatedCaptions, meta);
        if (upIndex === null) {
          return;
        }

        const nextLineStart = _getTranslatedLineStartTime(upIndex.captionIndex, upIndex.paragraphIndex);
        const nextLineEnd = _getTranslatedLineEndTime(upIndex.captionIndex, upIndex.paragraphIndex);

        if (nextLineStart === nextLineEnd) {
          paragraphIndexDownBySkipDurationZeroLine(upIndex.captionIndex, upIndex.paragraphIndex, upIndex.wordIndex);
          return;
        }

        evt.preventDefault();
        _setFocusMetaAfterTimeUpdate(upIndex);
      }

      function _handleArrowLeftKeyDown() {
        if (!CursorHelper.isCursorStartWithoutSelection(evt)) {
          return;
        }

        const leftIndex = TranslatedCaptionHelper.getLeftIndex(translatedCaptions, meta);
        if (leftIndex === null) {
          return;
        }

        const nextLineStart = _getTranslatedLineStartTime(leftIndex.captionIndex, leftIndex.paragraphIndex);
        const nextLineEnd = _getTranslatedLineEndTime(leftIndex.captionIndex, leftIndex.paragraphIndex);

        if (nextLineStart === nextLineEnd) {
          paragraphIndexDownBySkipDurationZeroLine(leftIndex.captionIndex, leftIndex.paragraphIndex, -1);
          return;
        }

        evt.preventDefault();
        _setFocusMetaAfterTimeUpdate(leftIndex);
      }

      function _handleArrowRightKeyDown() {
        if (!CursorHelper.isCursorEndWithoutSelection(evt)) {
          return;
        }

        const rightIndex = TranslatedCaptionHelper.getRightIndex(translatedCaptions, meta);
        if (rightIndex === null) {
          return;
        }

        const nextLineStart = _getTranslatedLineStartTime(rightIndex.captionIndex, rightIndex.paragraphIndex);
        const nextLineEnd = _getTranslatedLineEndTime(rightIndex.captionIndex, rightIndex.paragraphIndex);

        if (nextLineStart === nextLineEnd) {
          paragraphIndexUpBySkipDurationZeroLine(rightIndex.captionIndex, rightIndex.paragraphIndex, 0);
          return;
        }

        evt.preventDefault();
        _setFocusMetaAfterTimeUpdate(rightIndex);
      }

      function _handleEnterKeyDown() {
        const { captionIndex, paragraphIndex, lineIndex, wordIndex } = meta;

        if (wordIndex === 0 && CursorHelper.isCursorStart(evt)) {
          return;
        }

        const caption = translatedCaptions[captionIndex];
        const paragraph = caption.paragraphs[paragraphIndex];
        const words = paragraph.lines![meta.lineIndex!].words!;

        if (wordIndex === words!.length - 1 && CursorHelper.isCursorEnd(evt)) {
          return;
        }

        const nextCaption = TranslatedCaptionHelper.splitParagraphInCaptions(caption, {
          cursorIndex: evt.currentTarget.selectionStart!,
          lineIndex: lineIndex,
          paragraphIndex: paragraphIndex,
          wordIndex: wordIndex
        })

        TranslatedCaptionActions.updateCaptions({
          index: captionIndex,
          caption: nextCaption
        });

        evt.preventDefault();
        _setFocusMetaAfterTimeUpdate({
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

        const concatResult = TranslatedCaptionHelper.concatCaptionsForwardInCaptions(translatedCaptions, meta);
        if (concatResult === null) {
          return;
        }

        TranslatedCaptionActions.setCaptions(concatResult.captions);
        const { cursorIndex, ...focusMeta } = concatResult.nextCursorMeta;

        evt.preventDefault();
        _setFocusMetaAfterTimeUpdate({
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

        const concatResult = TranslatedCaptionHelper.concatCaptionsBackwardInCaptions(translatedCaptions, meta);
        if (concatResult === null) {
          return;
        }

        TranslatedCaptionActions.setCaptions(concatResult.captions);
        const { cursorIndex, ...focusMeta } = concatResult.nextCursorMeta;

        evt.preventDefault();
        _setFocusMetaAfterTimeUpdate({
          ...focusMeta,
          selection: {
            start: cursorIndex,
            end: cursorIndex
          }
        });
      }
    }
  }
}

export default TranslatedOverlayProviderCotainer;