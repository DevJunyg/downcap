import React from "react";
import FontAwesomeProIcon from "FontAwesomeProIcon";
import { faTimes } from '@fortawesome/pro-solid-svg-icons';

const RemoveButton = React.memo<React.ButtonHTMLAttributes<HTMLButtonElement>>(props => (
  <button {...props} >
    <FontAwesomeProIcon icon={faTimes} />
  </button>
));

export default RemoveButton;