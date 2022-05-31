import { IFocusMeta, IHighlightMeta } from "containers/captions";
import lodash from "lodash";
import React from "react";
import { ICaptionsStyle, ICaptionsWord, PreviewType } from "storeV2";
import CaptionInput, { CaptionChangeEventHanlder, CaptionClickEventHanlder, CaptionFocusEventHanlder, CaptionKeyDownEventHanlder, ICaptionEventMeta } from "./CaptionInput";

interface ICaptionInputsProps {
  autoScroll?: boolean;
  className?: string;
  words?: ICaptionsWord[];
  highlightMeta?: IHighlightMeta;
  focusMeta?: IFocusMeta;
  meta?: ICaptionEventMeta;
  style?: React.CSSProperties;
  selectedPreviewType?: PreviewType;
  wordDefaultStyle?: ICaptionsStyle;
  fontUnitSize?: number;
  onChange?: CaptionChangeEventHanlder;
  onKeyDown?: CaptionKeyDownEventHanlder;
  onClick?: CaptionClickEventHanlder;
  onBlur?: CaptionFocusEventHanlder;
  onFocus?: CaptionFocusEventHanlder;
  onMouseDown?: React.MouseEventHandler<HTMLInputElement>
}

function CaptionInputs(props: ICaptionInputsProps) {
  const content = props.words?.map((word, wordIndex) => {
    const focusMetaWordIndex = props.focusMeta?.wordIndex;
    const focusIndex = focusMetaWordIndex && (focusMetaWordIndex > 0 ? focusMetaWordIndex : (props.words!.length + focusMetaWordIndex));
    const wordFocuse = focusIndex === wordIndex;

    const style = props.wordDefaultStyle && {
      ...props.wordDefaultStyle,
      ...word.style
    }

    return (
      <CaptionInput key={word.id} autoScroll
        style={style}
        selectedPreviewType={props.selectedPreviewType}
        fontUnitSize={props.fontUnitSize}
        highlight={props.highlightMeta?.wordIndex === wordIndex}
        activated={wordFocuse}
        selection={wordFocuse ? props.focusMeta!.selection : undefined}
        value={word.text}
        confidence={word.confidence}
        meta={{
          ...props.meta,
          lineIndex: 0,
          wordIndex: wordIndex
        }}
        onClick={props.onClick}
        onKeyDown={props.onKeyDown}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
      />
    )
  });

  return (
    <div className={props.className} style={props.style}>
      {content}
    </div >
  )
}

function propsAreEqual(prevProps: Readonly<ICaptionInputsProps>, nextProps: Readonly<ICaptionInputsProps>): boolean {
  return lodash.isEqual(prevProps.meta, nextProps.meta)
    && prevProps.words === nextProps.words
    && prevProps.focusMeta === nextProps.focusMeta
    && prevProps.style === nextProps.style
    && prevProps.selectedPreviewType === nextProps.selectedPreviewType
    && prevProps.highlightMeta?.wordIndex === nextProps.highlightMeta?.wordIndex
    && prevProps.wordDefaultStyle === nextProps.wordDefaultStyle
    && prevProps.fontUnitSize === nextProps.fontUnitSize
}

export default React.memo(CaptionInputs, propsAreEqual);