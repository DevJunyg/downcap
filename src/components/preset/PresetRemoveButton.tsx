import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

interface IRemoveButtonProps {
  onClick?: React.MouseEventHandler<HTMLDivElement>
}

function areRemoveButtonEqual(prevProps: IRemoveButtonProps, nextProps: IRemoveButtonProps) {
  return prevProps.onClick === nextProps.onClick;
}

const PresetRemoveButton = function (props: IRemoveButtonProps) {
  return (
    <div className='preset-delete pointer' onClick={props.onClick}>
      <FontAwesomeIcon icon={faTimes} />
    </div>
  )
}

export default React.memo<IRemoveButtonProps>(PresetRemoveButton, areRemoveButtonEqual);
