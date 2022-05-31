import HelpImageIcon from "components/icons/HelpImageIcon";
import PopupManager from "managers/PopupManager";
import React from "react";
import { useDispatch } from "react-redux";
import * as store from 'storeV2';

function HelpImgContainer() {
  const dispatch = useDispatch();

  const handleClick = React.useCallback(() => {
    const selectedEditType = store.default.getState().present.project.selectedEditType; 
    PopupManager.openHelpImagePopup({ domain: selectedEditType, imageState: true }, dispatch);
  }, []);

  return (
    <HelpImageIcon onClick={handleClick} />
  )
}

export default React.memo(HelpImgContainer);