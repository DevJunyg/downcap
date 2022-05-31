import React from 'react';
import { zeroPadding } from 'lib/utils';

interface IMinSecTimeProps {
  time?: number;
}

function MinSecTime(props: IMinSecTimeProps) {
  const min = Math.floor((props.time ?? 0) / 60);
  const sec = Math.floor((props.time ?? 0) % 60);

  return (
    <label data-testid='time-label'>
      {`${zeroPadding(min, 2)}:${zeroPadding(sec, 2)}`}
    </label>
  );
}

export default React.memo(MinSecTime, (props, nextProps) => {
  return props.time === nextProps.time;
});