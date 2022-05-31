import React from 'react';
import lodash from 'lodash';
import Subtitle from 'components/subtitle/Subtitle';
import { CaptionChangeEventHanlder, ICaptionEventMeta } from './CaptionInput';
import * as store from 'storeV2';
import { isFloat, zeroPadding } from 'lib/utils';
import ReadOnlyTimeSubtitle from '../subtitle/ReadOnlyTimeSubtitle';
import ClassNameHelper from 'ClassNameHelper';
import { IFocusMeta, IHighlightMeta } from 'containers/captions';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import CaptionInputs from './CaptionInputs';

export interface ICaptionTimeFocusEventMeta extends ICaptionEventMeta {
  time: number;
}

export type CaptionTimeTextFocusEventHandler = (
  evt: React.FocusEvent<HTMLInputElement>,
  time: ICaptionTimeFocusEventMeta
) => void;

interface ICaptionLineProps {
  autoScroll?: boolean;
  className?: string;
  line?: store.ICaptionsLine;
  meta?: ICaptionEventMeta;
  focusMeta?: IFocusMeta;
  highlightMeta?: IHighlightMeta;
  onChange?: CaptionChangeEventHanlder;
  onRemoveClick?: (evt: React.MouseEvent<HTMLButtonElement>, meta?: ICaptionEventMeta) => void;
  onKeyDown?: (evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void
  onLineKeyDown?: (evt: React.KeyboardEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
  onStartTimeTextBlur?: CaptionTimeTextFocusEventHandler;
  onEndTimeTextBlur?: CaptionTimeTextFocusEventHandler;
  onWordClick?: (evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onWordFocus?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onWordBlur?: (evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) => void;
  onLineClick?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
}

function dateFormat(t: number) {
  let milis = Math.floor((t * 1000) % 1000);
  t = Math.floor(t);
  let sec = t % 60;
  t = Math.floor(t / 60);
  let min = t % 60;
  let hour = Math.floor(t / 60);
  return `${zeroPadding(hour, 2)}:${zeroPadding(min, 2)}:${zeroPadding(sec, 2)},${zeroPadding(milis, 3)}`
}

function timeToTimestamp(time: number) {
  let timestamp = dateFormat(time);
  timestamp = timestamp.replace(/[,]/g, '.');

  if (timestamp.slice(0, 2) === '00') {
    return timestamp.slice(3);
  }
  return timestamp;
}

function timestampToTime(timestamp: string) {
  const times = timestamp.split(':');
  let time = 0;

  for (const t of times) {
    time *= 60;
    if (!isFloat(t)) {
      return null;
    }

    time += Number.parseFloat(t);
  }

  return time;
}

const logger = ReactLoggerFactoryHelper.build('CaptionLine');

function CaptionLine(props: ICaptionLineProps, ref: React.ForwardedRef<HTMLDivElement>) {
  const startTime = props.line!.words.first().start;
  const endTime = props.line!.words.last().end;

  const [startTimeText, setStartTimeText] = React.useState(timeToTimestamp(startTime));
  const [endTimeText, setEndTimeText] = React.useState(timeToTimestamp(endTime));
  React.useEffect(_propsTimeUpdateEffect, [startTime, endTime]);

  const focused = props.focusMeta !== undefined;

  const inputs = props.line?.words && (
    <CaptionInputs autoScroll
      className="words-box"
      words={props.line.words}
      focusMeta={props.focusMeta}
      highlightMeta={props.highlightMeta}
      meta={props.meta}
      onChange={_handleChange}
      onClick={_handleWordClick}
      onKeyDown={_handleKeyDown}
      onFocus={_handleWordFocus}
      onBlur={_handleWordBlur}
    />
  );

  const className = ClassNameHelper.concat(
    'subtitles',
    props.className,
    focused || props.highlightMeta ? 'highlight-subtitle' : undefined
  );

  if (focused) {
    return (
      <Subtitle
        ref={ref}
        className={className}
        startTimeText={startTimeText}
        endTimeText={endTimeText}
        onClick={_handleLineClick}
        onKeyDown={_handleLineKeyDown}
        onRemoveClick={_handleRemoveClick}
        onEndTimeTextBlur={_handleEndTimeTextBlur}
        onEndTimeTextChange={_handleEndTimeTextChange}
        onStartTimeTextBlur={_handleStartTimeTextBlur}
        onStartTimeTextChange={_handleStartTimeTextChange}
      >
        {inputs}
      </Subtitle>
    );
  }
  
  return (
    <ReadOnlyTimeSubtitle
      className={className}
      start={startTime}
      end={endTime}
      onClick={_handleLineClick}
    >
      {inputs}
    </ReadOnlyTimeSubtitle>
  );

  function _handleLineKeyDown(evt: React.KeyboardEvent<HTMLDivElement>) {
    if (props.meta === undefined) {
      logger.variableIsUndefined('meta', '_handleLineKeyDown');
      return;
    }

    if (props.meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleLineKeyDown');
      return;
    }

    props.onLineKeyDown && props.onLineKeyDown(evt, { lineIndex: 0, ...props.meta });
  }

  function _handleLineClick(evt: React.MouseEvent<HTMLDivElement>) {
    if (props.meta === undefined) {
      logger.variableIsUndefined('meta', '_handleLineClick');
      return;
    }

    if (props.meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleLineClick');
      return;
    }

    props.onLineClick && props.onLineClick(evt, { lineIndex: 0, ...props.meta })
  }

  function _handleStartTimeTextChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setStartTimeText(evt.target.value);
  }

  function _handleStartTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>) {
    if (props.meta === undefined) {
      logger.variableIsUndefined('meta', '_handleStartTimeTextBlur');
      return;
    }

    if (props.meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraph', '_handleStartTimeTextBlur');
      return;
    }

    const time = timestampToTime(evt.target.value);
    setStartTimeText(timeToTimestamp(props.line?.words.first().start!))

    if (time === null) {
      //TODO: 시간 변경 안된 점에 대해 유저 피드백이 필요합니다. 피드백 생성후 아래의 로거를 지워주세요!
      logger.logWarning("Time not changed");
      return;
    }

    props.onStartTimeTextBlur && props.onStartTimeTextBlur(
      evt, {
      ...props.meta,
      lineIndex: 0,
      time: time
    });
  }

  function _handleEndTimeTextChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setEndTimeText(evt.target.value);
  }

  function _handleEndTimeTextBlur(evt: React.FocusEvent<HTMLInputElement>) {
    if (props.meta === undefined) {
      logger.variableIsUndefined('meta', '_handleEndTimeTextBlur');
      return;
    }

    if (props.meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraph', '_handleEndTimeTextBlur');
      return;
    }

    const time = timestampToTime(evt.target.value);
    setEndTimeText(timeToTimestamp(props.line!.words.last().end!))

    if (time === null) {
      //TODO: 시간 변경 안된 점에 대해 유저 피드백이 필요합니다. 피드백 생성후 아래의 로거를 지워주세요!
      logger.logWarning("Time not changed");
      return;
    }

    props.onEndTimeTextBlur && props.onEndTimeTextBlur(
      evt, {
      ...props.meta,
      lineIndex: 0,
      time: time
    });
  }

  function _handleRemoveClick(evt: React.MouseEvent<HTMLButtonElement>) {
    if (props.meta === undefined) {
      logger.variableIsUndefined('meta', '_handleRemoveclick');
      return;
    }

    if (props.meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleaRemoveclick');
      return;
    }

    props.onRemoveClick && props.onRemoveClick(evt, props.meta);
  }

  function _handleKeyDown(evt: React.KeyboardEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    //@Assignees: @mnutube-bbd
    //@TODO: 해당 로직이 필요한 이유 서술 부탁드립니다.
    evt.stopPropagation();
    if (evt.nativeEvent.isComposing) {
      return;
    }

    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleKeyDown');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleKeyDown');
      return;
    }

    props.onKeyDown && props.onKeyDown(evt, meta);
  }

  function _propsTimeUpdateEffect() {
    setStartTimeText(timeToTimestamp(startTime));
    setEndTimeText(timeToTimestamp(endTime));
  }

  function _handleChange(evt: React.ChangeEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleChange');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleChange');
      return;
    }

    props.onChange && props.onChange(evt, meta);
  }

  function _handleWordClick(evt: React.MouseEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleWordClick');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleWordClick');
      return;
    }

    props.onWordClick && props.onWordClick(evt, meta);
  }

  function _handleWordFocus(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleWordFocus');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleWordFocus');
      return;
    }

    props.onWordFocus && props.onWordFocus(evt, meta);
  }

  function _handleWordBlur(evt: React.FocusEvent<HTMLInputElement>, meta?: ICaptionEventMeta) {
    if (meta === undefined) {
      logger.variableIsUndefined('meta', '_handleWordBlur');
      return;
    }

    if (meta.paragraphIndex === undefined) {
      logger.variableIsUndefined('meta.paragraphIndex', '_handleWordBlur');
      return;
    }

    props.onWordBlur && props.onWordBlur(evt, meta);
  }
}

function CaptionLineAreEquals(prevProps: ICaptionLineProps, nextProps: ICaptionLineProps) {
  return lodash.isEqual(prevProps.meta, nextProps.meta)
    && lodash.isEqual(prevProps.highlightMeta, nextProps.highlightMeta)
    && prevProps.line === nextProps.line
    && prevProps.focusMeta === nextProps.focusMeta
    && prevProps.className === nextProps.className
    && prevProps.onWordFocus === nextProps.onWordFocus;
}

export default React.memo(React.forwardRef(CaptionLine), CaptionLineAreEquals);
