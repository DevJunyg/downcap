
import React from 'react';
import { ReadOnlyTimeBox } from 'components/common/captionsTimeBox';
import { ICaptionEventMeta } from 'components/caption/CaptionInput';

interface IReadOnlyTimeSubtitleProps {
  className?: string;
  start?: number,
  end?: number,
  insideStyle?: React.CSSProperties,
  meta?: ICaptionEventMeta;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function ReadOnlyTimeSubtitle(props: React.PropsWithChildren<IReadOnlyTimeSubtitleProps>) {
  return (
    <div
      className={props.className}
      tabIndex={1000}
      onClick={props.onClick}
    >
      <ReadOnlyTimeBox
        start={props.start}
        end={props.end}
      />
      {props.children}
    </div>
  )
}

function areEqual(prevProps: React.PropsWithChildren<IReadOnlyTimeSubtitleProps>, 
  nextProps: React.PropsWithChildren<IReadOnlyTimeSubtitleProps>): boolean {
  return prevProps.start === nextProps.start
    && prevProps.end === nextProps.end
    && prevProps.insideStyle === nextProps.insideStyle
    && prevProps.meta === nextProps.meta
    && prevProps.onClick === nextProps.onClick;
}

export default React.memo<React.PropsWithChildren<IReadOnlyTimeSubtitleProps>>(ReadOnlyTimeSubtitle, areEqual);