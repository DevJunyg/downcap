import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faQuestionCircle } from '@fortawesome/pro-regular-svg-icons';
import React from 'react';

interface IHelpImageIconProps {
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

export default function HelpImageIcon(props: IHelpImageIconProps) {
  return (
    <FontAwesomeIcon className='help-image-icon'
      icon={faQuestionCircle}
      onClick={props.onClick}
    />
  )
}