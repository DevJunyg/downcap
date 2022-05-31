import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMinus } from '@fortawesome/pro-light-svg-icons';
import React from 'react';
import MinSecTime from '../MinSecTime';

interface IReadOnlyTimeBox {
  start?: number;
  end?: number;
}

function ReadOnlyTimeBox(props: IReadOnlyTimeBox) {
  return (
    <div className="time-table">
      <MinSecTime time={props.start} />
      <FontAwesomeIcon icon={faMinus} rotation={90} />
      <MinSecTime time={props.end} />
    </div>
  )
}

function areEqualReadOnlyTimeBox(prevProps: IReadOnlyTimeBox, nextProps: IReadOnlyTimeBox): boolean {
  return prevProps.start === nextProps.start
    && prevProps.end === nextProps.end;
}

export default React.memo<IReadOnlyTimeBox>(ReadOnlyTimeBox, areEqualReadOnlyTimeBox);
