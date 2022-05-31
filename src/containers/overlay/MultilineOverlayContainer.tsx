import { ICaptionEventMeta } from "components/caption/CaptionInput";
import CaptionInputs from "components/caption/CaptionInputs";
import Overlay from "components/Overlay";
import IArea from "IArea";
import { rgbaToString } from "lib/utils";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import React from "react";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as multilineCaptionActions from 'storeV2/modules/multiline'
import * as Redux from 'redux';
import IPoint from 'IPoint';
import downcapOptions from "downcapOptions";
import * as projectControlActions from 'storeV2/modules/projectControl';
import ProjectControlManager from "managers/ProjectControlManager";
import PlayerContext from "contexts/PlayerContext";
import StyleParser from "StyleParser";

interface IMultilineOverlayProviderContainerProps {
  area?: IArea;
  fontUnitSize?: number;
  paragraphIndex?: number;
  caption?: store.ICaptionsParagraph;
  defaultStyle?: store.ICaptionsStyle;
}

function MultilineOverlayContainer(props: IMultilineOverlayProviderContainerProps) {
  const { player } = React.useContext(PlayerContext);
  const logger = React.useMemo(() => ReactLoggerFactoryHelper.build('MultilineOverlayContainer'), []);

  const rootStore = ReactRedux.useStore();
  const dispatch = ReactRedux.useDispatch();

  const line = props.caption?.lines?.first();
  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const selectedPreviewType = ReactRedux.useSelector<
    store.RootState,
    store.PreviewType | undefined
  >(state => state.present.project.selectedPreviewType);

  const defaultLocation = ReactRedux.useSelector<
    store.RootState,
    store.ILocation | undefined
  >(state => state.present.multiline.defaultLocation);

  const meta = React.useMemo<ICaptionEventMeta | undefined>(() => {
    if (props.paragraphIndex === undefined) {
      return undefined;
    }

    return ({
      paragraphIndex: props.paragraphIndex,
      lineIndex: 0
    });
  }, [props.paragraphIndex]);

  const lineBackground = line?.style?.background ?? props.defaultStyle?.background;

  const wordDefaultStyle = React.useMemo(() => {
    if (line?.style === undefined && props.defaultStyle === undefined) {
      return undefined;
    }

    const style = ({
      ...props.defaultStyle,
      ...line?.style
    });

    delete style.background;
    return style;
  }, [line?.style, props.defaultStyle]);

  const lineStyle = React.useMemo(() => {
    let style: React.CSSProperties = {
      fontSize: props.fontUnitSize ?? downcapOptions.defaultFontSize
    };

    let background = StyleParser.backgroundParse(lineBackground, selectedPreviewType);
    if (background) {
      style.background =  rgbaToString(background);
    }

    return style;
  }, [props.fontUnitSize, lineBackground, selectedPreviewType]);

  if (line === undefined) {
    return null;
  }

  let focusMeta = focusParagraphMetas?.first();
  focusMeta = (
    focusMeta?.source === "overlay"
    && focusMeta.type === "multiline"
    && focusMeta.path.paragraphIndex === props.paragraphIndex
  ) ? focusMeta
    : undefined;

  const vertical = props.caption?.vertical ?? defaultLocation?.vertical ?? downcapOptions.defaultLocation.vertical;
  const horizontal = props.caption?.horizontal ?? defaultLocation?.horizontal ?? downcapOptions.defaultLocation.horizontal;
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
        selectedPreviewType={selectedPreviewType}
        fontUnitSize={props.fontUnitSize}
        className="cursor-default"
        words={line.words}
        meta={meta}
        focusMeta={focusMeta?.path}
        wordDefaultStyle={wordDefaultStyle}
        onChange={_handleChange}
        onClick={_handleWordClick}
      />
    </Overlay>
  );

  function _handleClickCapture(evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        ...meta
      },
      source: 'overlay',
      type: 'multiline'
    }]);

    ProjectControlManager.changeStyleEditType(rootStore, 'line');
    if (player?.isReady) {
      player.pause();
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
      source: 'overlay',
      type: 'multiline'
    }]);

    if (player?.isReady) {
      player.pause();
    }

    ProjectControlActions.setSelectedStyleEditType('word');
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
    const captions = store.default.getState().present.multiline.captions;

    if (!captions) {
      logger.variableIsUndefined('captions', '_handleLocationChangedEnd');
      return;
    }

    const paragraph: store.ICaptionsParagraph = {
      ...captions[paragraphIndex],
      horizontal: location.x,
      vertical: location.y
    };

    const MultilineCaptionActions = Redux.bindActionCreators(multilineCaptionActions, dispatch);
    MultilineCaptionActions.updateParagraph({
      path: {
        paragraphIndex: meta.paragraphIndex
      },
      paragraph: paragraph
    });
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
    })
  }
}

export default MultilineOverlayContainer;