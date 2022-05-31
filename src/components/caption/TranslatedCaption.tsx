import TranslatedCaptionContent from "./TranslatedCaptionContent";
import TranslatedCaptionOutContent from "./TranslatedCaptionOutContent";
import * as store from 'storeV2';
import { IFocusMeta, IHighlightMeta } from "containers/captions";
import { ICaptionEventMeta } from "./CaptionInput";
import { ICaptionTimeFocusEventMeta } from "./CaptionLine";
import React from "react";
import lodash from "lodash";

interface ITranslatedCaptionContentProps {
  autoTranslation?: boolean
  caption?: store.ICaptionTranslatedParagraphWithId
  focusMeta?: IFocusMeta;
  highlightMeta?: IHighlightMeta;
  meta?: ICaptionEventMeta;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onWordClick?: (evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onWordChange?: (evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onWordKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onWordFocus?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onWordBlur?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onLineClick?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
  onLineKeyDown?: (evt: React.KeyboardEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
  onEndTimeTextBlur?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) => void;
  onStartTimeTextBlur?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) => void;
  onOriginChange?: (evt: React.ChangeEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) => void;
  onOriginFocus?: (evt: React.FocusEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) => void;
  onOriginKeyDown?: (evt: React.KeyboardEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) => void;
  onOriginToTranslatedButtonClick?: (evt: React.MouseEvent, meta?: ICaptionEventMeta) => void;
  onReversTranslateButtonClick?: (evt: React.MouseEvent, meta?: ICaptionEventMeta) => void;
  onRemoveCaptionButtonClick?: (evt: React.MouseEvent<HTMLButtonElement>, meta?: ICaptionEventMeta) => void;
  onRemoveParagraghButtonClick?: (evt: React.MouseEvent<HTMLButtonElement>, meta?: ICaptionEventMeta) => void;
  onTopCombineButtonClick?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
  onBottomCombineButtonClick?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
}

function TranslatedCaption(props: ITranslatedCaptionContentProps, ref: React.ForwardedRef<HTMLDivElement>) {
  return (
    <TranslatedCaptionOutContent
      className={props.highlightMeta || props.focusMeta ? 'caption-highlight' : undefined}
      autoTranslation={props.autoTranslation}
      highlight={props.highlightMeta !== undefined || props.focusMeta !== undefined}
      meta={props.meta}
      focusMeta={props.focusMeta}
      revers={props.caption?.revers}
      origin={props.caption?.origin}
      onOriginChange={props.onOriginChange}
      onOriginFocus={props.onOriginFocus}
      onOriginKeyDown={props.onOriginKeyDown}
      onBlur={props.onBlur}
      onOriginToTranslatedButtonClick={props.onOriginToTranslatedButtonClick}
      onReversTranslateButtonClick={props.onReversTranslateButtonClick}
      onRemoveCaptionButtonClick={props.onRemoveCaptionButtonClick}
    >
      <TranslatedCaptionContent ref={ref}
        parentId={props.caption?.id}
        paragraphs={props.caption?.paragraphs}
        translatStatus={props.caption?.meta.translatStatus}
        focusMeta={props.focusMeta?.paragraphIndex !== undefined ? props.focusMeta : undefined}
        highlightMeta={props.highlightMeta}
        meta={props.meta}
        onChange={props.onWordChange}
        onKeyDown={props.onWordKeyDown}
        onClick={props.onWordClick}
        onRemoveClick={props.onRemoveParagraghButtonClick}
        onFocus={props.onWordFocus}
        onWordBlur={props.onWordBlur}
        onLineClick={props.onLineClick}
        onLineKeyDown={props.onLineKeyDown}
        onEndTimeTextBlur={props.onEndTimeTextBlur}
        onStartTimeTextBlur={props.onStartTimeTextBlur}
        onBottomCombineButtonClick={props.onBottomCombineButtonClick}
        onTopCombineButtonClick={props.onTopCombineButtonClick}
      />
    </TranslatedCaptionOutContent>
  )
}

function arePropsEquals(prevProps: ITranslatedCaptionContentProps, nextProps: ITranslatedCaptionContentProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return lodash.isEqual(prevProps.focusMeta, nextProps.focusMeta)
    && lodash.isEqual(prevProps.meta, nextProps.meta)
    && lodash.isEqual(prevProps.highlightMeta, nextProps.highlightMeta)
    && prevProps.caption === nextProps.caption
    && prevProps.onOriginKeyDown === nextProps.onOriginKeyDown
}

export default React.memo(React.forwardRef(TranslatedCaption), arePropsEquals);