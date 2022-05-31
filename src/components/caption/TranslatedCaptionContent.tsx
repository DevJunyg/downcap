import { IFocusMeta, IHighlightMeta } from 'containers/captions';
import lodash from 'lodash';
import React from 'react';
import * as store from 'storeV2';
import CaptionCotrolButtons from './CaptionCotrolButtons';
import { ICaptionEventMeta } from './CaptionInput';
import CaptionLine, { ICaptionTimeFocusEventMeta } from './CaptionLine';
import TranlsatedPending from './TranlsatedPending';

interface ITranslatedCaptionContentProps {
  parentId?: number;
  paragraphs?: store.ICaptionsParagraph[]
  translatStatus?: store.TranlsateEditableStatus;
  meta?: ICaptionEventMeta
  focusMeta?: IFocusMeta;
  highlightMeta?: IHighlightMeta;
  onClick?: (evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onChange?: (evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onRemoveClick?: (evt: React.MouseEvent<HTMLButtonElement>, meta?: ICaptionEventMeta) => void;
  onFocus?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onStartTimeTextBlur?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) => void;
  onEndTimeTextBlur?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionTimeFocusEventMeta) => void;
  onWordBlur?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onLineClick?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
  onTopCombineButtonClick?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
  onBottomCombineButtonClick?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
  onLineKeyDown?: (evt: React.KeyboardEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
}

function TranslatedCaptionContent(props: ITranslatedCaptionContentProps, ref: React.ForwardedRef<HTMLDivElement>) {
  if (props.translatStatus === 'Pending') {
    return <TranlsatedPending />;
  }

  const Content = props.paragraphs?.map((paragrah, index) => {
    const focused = props.focusMeta?.paragraphIndex === index;
    const TopControlButton = focused ? () => (
      <CaptionCotrolButtons reverse
        combineButtonRendered={index > 0}
        onCombineButtonClick={evt => {
          props.focusMeta
            && props.onTopCombineButtonClick
            && props.onTopCombineButtonClick(evt, props.focusMeta);
        }}
      />
    ) : () => null;

    const BottomControlButton = focused ? () => (
      <CaptionCotrolButtons
        combineButtonRendered={index + 1 < (props.paragraphs?.length ?? 0)}
        onCombineButtonClick={evt => {
          props.focusMeta
            && props.onBottomCombineButtonClick
            && props.onBottomCombineButtonClick(evt, props.focusMeta);
        }}
      />
    ) : () => null;

    return (
      <span key={`${props.parentId}-${paragrah.id}`}>
        <TopControlButton />
        <CaptionLine autoScroll
                   ref={ref}
                   focusMeta={props.focusMeta?.paragraphIndex === index ? props.focusMeta : undefined}
          highlightMeta={props.highlightMeta?.paragraphIndex === index ? props.highlightMeta : undefined}
          line={paragrah.lines?.first()}
          meta={props.meta && {
            ...props.meta,
            paragraphIndex: index,
            lineIndex: 0
          }}
          onChange={props.onChange}
          onRemoveClick={props.onRemoveClick}
          onEndTimeTextBlur={props.onEndTimeTextBlur}
          onKeyDown={props.onKeyDown}
          onLineClick={props.onLineClick}
          onLineKeyDown={props.onLineKeyDown}
          onStartTimeTextBlur={props.onStartTimeTextBlur}
          onWordBlur={props.onWordBlur}
          onWordClick={props.onClick}
          onWordFocus={props.onFocus}
        />
        <BottomControlButton />
      </span>
    )
  });

  return (
    <div>
      {Content}
    </div>
  )
}

export default React.memo(React.forwardRef(TranslatedCaptionContent), (prevProps, nextProps) => {
  return lodash.isEqual(prevProps.focusMeta, nextProps.focusMeta)
    && lodash.isEqual(prevProps.meta, nextProps.meta)
    && lodash.isEqual(prevProps.highlightMeta, nextProps.highlightMeta)
    && prevProps.paragraphs === nextProps.paragraphs
    && prevProps.translatStatus === nextProps.translatStatus
});