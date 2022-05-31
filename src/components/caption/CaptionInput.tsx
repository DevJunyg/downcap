import CanvasContext from 'contexts/CanvasContext';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import React from 'react';
import * as store from 'storeV2';
import lodash from 'lodash';
import { ISelection } from 'models/ISelection';
import ClassNameHelper from 'ClassNameHelper';
import StyleParser from 'StyleParser';
import downcapOptions from 'downcapOptions';

export interface ICaptionEventMeta {
  captionIndex?: number;
  paragraphIndex?: number;
  lineIndex?: number;
  wordIndex?: number;
}

export type CaptionChangeEventHanlder = (evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
export type CaptionFocusEventHanlder = (evt: React.FocusEvent<HTMLInputElement>, meta: ICaptionEventMeta) => void;
export type CaptionClickEventHanlder = (evt: React.MouseEvent<HTMLInputElement>, meta: ICaptionEventMeta) => void;
export type CaptionKeyDownEventHanlder = (evt: React.KeyboardEvent<HTMLInputElement>, meta: ICaptionEventMeta) => void;

interface ICaptionLabelProps {
  style?: store.ICaptionsStyle;
  selectedPreviewType?: store.PreviewType;
  value?: string;
  meta: ICaptionEventMeta;
  activated?: boolean;
  selection?: ISelection;
  highlight?: boolean;
  autoScroll?: boolean;
  fontUnitSize?: number;
  confidence?: number;
  onChange?: CaptionChangeEventHanlder;
  onKeyDown?: CaptionKeyDownEventHanlder;
  onClick?: CaptionClickEventHanlder;
  onBlur?: CaptionFocusEventHanlder;
  onFocus?: CaptionFocusEventHanlder;
}

const logger = ReactLoggerFactoryHelper.build('CaptionLabel');

function getCssValue(element: HTMLElement, propertyName: string) {
  return window.getComputedStyle(element).getPropertyValue(propertyName);
}

function getFontValue(element: HTMLElement) {
  return getCssValue(element, 'font');
}

const confidenceColor = ['red', 'orange', 'black'];
function getConfidenceColor(confidence: number) {
  const confidenceBoundaries = downcapOptions.confidenceBoundaries;
  let index;
  for (index = 0; index < confidenceBoundaries.length; index++) {
    const boundary = confidenceBoundaries[index];
    if (confidence < boundary) break;
  }

  return confidenceColor[index] ?? 'black';
}

function CaptionInput(props: ICaptionLabelProps) {
  const { canvas } = React.useContext(CanvasContext);
  const inputEl = React.useRef<HTMLInputElement>(null);
  const divEl = React.useRef<HTMLDivElement>(null);
  const [width, setWidth] = React.useState<string | null>(null);
  const measureTextWidthCallback = React.useCallback(_measureTextWidth, [canvas]);

  React.useEffect(_resizeCalcEffect, [
    measureTextWidthCallback,
    props.value,
    props.style?.italic,
    props.style?.fontSize,
    props.style?.font,
    props.selectedPreviewType,
    props.fontUnitSize
  ]);
  React.useEffect(_activateEffect, [props.activated, props.selection]);
  React.useEffect(_selectionEffect, [props.selection])

  React.useEffect(_autoScrollEffect, [props.autoScroll, props.highlight]);

  const inputStyle: React.CSSProperties = {
    outline: 0,
    border: 0,
    margin: 0,
    padding: 0,
    backgroundColor: "transparent",
    width: width !== null ? width : `${props.value?.length ?? 1}rem`,
    ...(
      props.style
        ? StyleParser.wordStyleParse(props.style, props.selectedPreviewType, props.value)
        : { color: getConfidenceColor(props.confidence ?? 1) }
    )
  }

  const className = ClassNameHelper.concat(
    "input-label affter-space text-center",
    props.highlight && !props.activated && "highlight"
  );

  return (
    <div ref={divEl} className={className}>
      <input type="text"
        ref={inputEl}
        value={props.value}
        style={inputStyle}
        onClick={_handleClick}
        onBlur={_handleBulr}
        onChange={_handleChange}
        onKeyDown={_handleKeyDown}
        onFocus={_handleFocus}
        data-testid={'caption-input'}
      />
    </div>
  )

  function _autoScrollEffect() {
    const div = divEl.current;
    if (!props.highlight || !div) {
      return;
    }

    let timeoutId = setTimeout(() => {
      div.scrollIntoView({
        behavior: 'auto',
        block: 'center'
      });
    }, 100);

    return () => {
      clearTimeout(timeoutId);
    }
  }

  function _selectionEffect() {
    if (!props.selection) {
      return;
    }

    const input = inputEl.current;
    if (!input) {
      logger.variableIsUndefined('input', '_activateEffect');
      return;
    }

    input.selectionStart = props.selection.start;
    input.selectionEnd = props.selection.end;
  }

  function _handleClick(evt: React.MouseEvent<HTMLInputElement>) {
    props.onClick && props.onClick(evt, props.meta);
  }

  function _handleBulr(evt: React.FocusEvent<HTMLInputElement>) {
    props.onBlur && props.onBlur(evt, props.meta);
  }

  function _handleFocus(evt: React.FocusEvent<HTMLInputElement>) {
    props.onFocus && props.onFocus(evt, props.meta);
  }

  function _handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    props.onChange && props.onChange(evt, props.meta);
  }

  function _handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    props.onKeyDown && props.onKeyDown(evt, props.meta);
  }

  function _resizeCalcEffect() {
    const currentEl = inputEl.current;
    if (!currentEl) {
      logger.variableIsUndefined('currentEl', '_resizeEffect');
      return;
    }

    const widthPx = measureTextWidthCallback(props.value ?? ' ', getFontValue(currentEl));
    setWidth(props.style?.italic ? `calc(${widthPx + widthPx / 16}px + 0.25rem)` : `${widthPx}px`);
  }

  function _measureTextWidth(text: string | number, font: string) {
    let textWidth: number | undefined;
    const ctx = canvas?.current?.getContext("2d");
    if (!!ctx) {
      ctx.font = font;
      let str = text.toString();
      textWidth = ctx.measureText(str).width + 1.5;
    }

    return textWidth ?? text.toString().length * downcapOptions.defaultFontSize;
  }

  function _activateEffect() {
    const input = inputEl.current;
    if (!input) {
      logger.variableIsUndefined('input', '_activateEffect');
      return;
    }

    if (props.activated && document.activeElement !== input) {
      input.focus();
    }
  }
}

function propsAreEqual(prevProps: ICaptionLabelProps, nextProps: ICaptionLabelProps) {
  return lodash.isEqual(prevProps.meta, nextProps.meta)
    && prevProps.style === nextProps.style
    && prevProps.selectedPreviewType === nextProps.selectedPreviewType
    && prevProps.value === nextProps.value
    && prevProps.activated === nextProps.activated
    && prevProps.highlight === nextProps.highlight
    && prevProps.fontUnitSize === nextProps.fontUnitSize
    && prevProps.onChange === nextProps.onChange
    && prevProps.onClick === nextProps.onClick;
}

export default React.memo(CaptionInput, propsAreEqual);