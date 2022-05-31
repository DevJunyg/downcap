import React from 'react';
import TimeBox from "components/common/captionsTimeBox/TimeBox";
import RemoveButton from "components/common/RemoveButton";

interface ISubtitlesProps {
  className?: string;
  insideStyle?: React.CSSProperties;
  startTimeText?: string;
  endTimeText?: string;
  onRemoveClick?: React.MouseEventHandler<HTMLButtonElement>;
  onEndTimeTextBlur?: React.ChangeEventHandler<HTMLInputElement>;
  onEndTimeTextChange?: React.ChangeEventHandler<HTMLInputElement>;
  onStartTimeTextBlur?: React.ChangeEventHandler<HTMLInputElement>;
  onStartTimeTextChange?: React.ChangeEventHandler<HTMLInputElement>;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
}

function Subtitle(props: React.PropsWithChildren<ISubtitlesProps>, ref: React.ForwardedRef<HTMLDivElement>) {
  return (
    <div ref={ref}
      className={props.className}
      tabIndex={1000}
      onClick={props.onClick}
      onKeyDown={props.onKeyDown}
      data-testid={'subtitle'}
    >
      <TimeBox
        endTimeText={props.endTimeText}
        startTimeText={props.startTimeText}
        onEndTimeBoxBlur={props.onEndTimeTextBlur}
        onEndTimeBoxChange={props.onEndTimeTextChange}
        onStartTimeBoxBlur={props.onStartTimeTextBlur}
        onStartTimeBoxChange={props.onStartTimeTextChange}
      />
      {props.children}
      <RemoveButton className='exit' onClick={props.onRemoveClick} data-testid="line-remove-btn" />
    </div>
  )
}

export default React.forwardRef<HTMLDivElement, React.PropsWithChildren<ISubtitlesProps>>(Subtitle);
