import React from 'react';

interface ITimeBoxProperties {
  startTimeText?: string,
  endTimeText?: string,
  onEndTimeBoxBlur?: React.FocusEventHandler<HTMLInputElement>,
  onEndTimeBoxChange?: React.ChangeEventHandler<HTMLInputElement>,
  onStartTimeBoxBlur?: React.FocusEventHandler<HTMLInputElement>,
  onStartTimeBoxChange?: React.ChangeEventHandler<HTMLInputElement>,
  onClick?: React.MouseEventHandler<HTMLInputElement>
}


const timeBoxPropsAreEqual: ((prevProps: Readonly<ITimeBoxProperties>, nextProps: Readonly<ITimeBoxProperties>) => boolean) = (prevProps, nextProps) => {
  return prevProps.startTimeText === nextProps.startTimeText
    && prevProps.endTimeText === nextProps.endTimeText
}

function TimeBox(props: ITimeBoxProperties) {
  return (
    <div className="time-table">
      <input type="text"
        value={props.startTimeText}
        data-testid="timebox-start-input"
        onChange={props.onStartTimeBoxChange}
        onBlur={props.onStartTimeBoxBlur}
        onClick={_handleClick}
      />
      <input type="text"
        value={props.endTimeText}
        data-testid="timebox-end-input"
        onChange={props.onEndTimeBoxChange}
        onBlur={props.onEndTimeBoxBlur}
        onClick={_handleClick}
      />
    </div>
  )

  function _handleClick(evt: React.MouseEvent<HTMLInputElement>) {
    // Stop events propagating to the line.
    evt.stopPropagation();
    props.onClick && props.onClick(evt);
  }
}

export default React.memo(TimeBox, timeBoxPropsAreEqual);
