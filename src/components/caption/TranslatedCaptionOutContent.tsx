import React from 'react';
import TranslatedToReversButton from './TranslatedToReversButton';
import './EnSubtitles.scss';
import TranslateOriginInput from './TranslateOriginInput';
import { ICaptionEventMeta } from './CaptionInput';
import { IFocusMeta } from 'containers/captions';
import ClassNameHelper from 'ClassNameHelper';
import RemoveButton from 'components/common/RemoveButton';

const reversPendingStyle = { paddingLeft: "10%" };

function ReversPending() {
  return (
    <p className="text-center" style={reversPendingStyle}>번역중...</p>
  )
}

interface ITranslatedCaptionOutContentProps {
  className?: string;
  highlight?: boolean;
  meta?: ICaptionEventMeta;
  focusMeta?: IFocusMeta;
  origin?: string;
  revers?: React.ReactNode;
  translationButtonDisabled?: boolean;
  autoTranslation?: boolean;
  onBlur?: React.FocusEventHandler<HTMLDivElement>;
  onMouseDownTransleateEnToKo?: React.MouseEventHandler<HTMLDivElement>;
  onMouseDownTransleateKoToEn?: React.MouseEventHandler<HTMLDivElement>;
  onUpInsertIconMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onDownInsertIconMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onOriginFocus?: (evt: React.FocusEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) => void;
  onOriginChange?: (evt: React.ChangeEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) => void;
  onOriginKeyDown?: (evt: React.KeyboardEvent<HTMLTextAreaElement>, meta?: ICaptionEventMeta) => void;
  onMouseDownKoCaption?: React.FocusEventHandler<HTMLDivElement>;
  onOriginToTranslatedButtonClick?: (evt: React.MouseEvent, meta?: ICaptionEventMeta) => void;
  onReversTranslateButtonClick?: (evt: React.MouseEvent, meta?: ICaptionEventMeta) => void;
  onRemoveCaptionButtonClick?: (evt: React.MouseEvent<HTMLButtonElement>, meta: ICaptionEventMeta) => void;
}


const reversStyle: React.CSSProperties = { width: 'auto', wordWrap: 'normal', wordBreak: 'break-all' };

function TranslatedCaptionOutContent(props: React.PropsWithChildren<ITranslatedCaptionOutContentProps>) {
  const handleDeleteButtonClick: React.MouseEventHandler<HTMLButtonElement> = evt => {
    props.meta
      && props.onRemoveCaptionButtonClick
      && props.onRemoveCaptionButtonClick(evt, props.meta)
  }

  const handleChange: React.ChangeEventHandler<HTMLTextAreaElement> = evt => {
    props.onOriginChange && props.onOriginChange(evt, props.meta);
  }

  const handleFocus: React.FocusEventHandler<HTMLTextAreaElement> = evt => {
    props.onOriginFocus && props.onOriginFocus(evt, props.meta);
  }

  const handleKeyDown: React.KeyboardEventHandler<HTMLTextAreaElement> = evt => {
    props.onOriginKeyDown && props.onOriginKeyDown(evt, props.meta);
  }

  const handleButtonClcik: React.MouseEventHandler = evt => {
    props.onOriginToTranslatedButtonClick && props.onOriginToTranslatedButtonClick(evt, props.meta);
  }

  const handleEnKoButtonClick: React.MouseEventHandler = evt => {
    props.onReversTranslateButtonClick && props.onReversTranslateButtonClick(evt, props.meta);
  }
  const displayedHelperButton = !props.autoTranslation && props.focusMeta !== undefined;

  const renderedEnToKoButton = displayedHelperButton && (
    <TranslatedToReversButton onMouseDown={handleEnKoButtonClick} />
  );

  const ReverContent = props.revers !== undefined
    ? <label style={reversStyle}>{props.revers}</label>
    : <ReversPending />

  const originSelection = props.focusMeta && props.focusMeta.paragraphIndex === undefined
    ? props.focusMeta.selection
    : undefined;

  const divRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(_autoScrollEffect, [props.highlight]);

  return (
    <div className={ClassNameHelper.concat('en-subtitles', props.className)}
      ref={divRef}
      onBlur={_handleBlur}
    >
      {props.highlight && <RemoveButton className='exit' onClick={handleDeleteButtonClick} />}
      <div className="ko-revers-box outline-none"
        tabIndex={0}
        onFocus={props.onMouseDownKoCaption}
      >
        <TranslateOriginInput
          displayedButton={displayedHelperButton}
          value={props.origin}
          selection={originSelection}
          onChange={handleChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          onButtonClick={handleButtonClcik}
        />
        <div className="en-revers">
          {ReverContent}
          {renderedEnToKoButton}
        </div>
      </div>
      {props.children}
    </div>
  );

  function _handleBlur(evt: React.FocusEvent<HTMLDivElement>) {
    if (evt.target === divRef.current) {
      props.onBlur && props.onBlur(evt);
    }
  }

  function _autoScrollEffect() {
    const div = divRef.current;
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
}

export default TranslatedCaptionOutContent;
