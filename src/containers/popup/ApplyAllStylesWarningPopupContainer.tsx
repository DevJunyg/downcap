import React from 'react';
import { IPopupProps } from 'containers/PopupContainer';
import ApplyAllStylesWarningPopup from 'components/popup/ApplyAllStylesWarningPopup';
import { ICaptionsStyle, IIndexPath, ILocation } from 'storeV2';
import * as Redux from 'redux';
import * as ReactRedux from 'react-redux';
import captionActionsDictractory from 'captionActionsDictractory';
import PopupManager from 'managers/PopupManager';

export interface IApplyAllStylesWarningPopupPayload {
  style?: ICaptionsStyle | null;
  path?: IIndexPath;
  location?: ILocation;
  type: keyof typeof captionActionsDictractory;
}

interface IApplyAllStylesWarningPopupContainerProps extends IPopupProps, IApplyAllStylesWarningPopupPayload { }

function ApplyAllStylesWarningPopupContainer(props: IApplyAllStylesWarningPopupContainerProps) {
  const dispatch = ReactRedux.useDispatch();

  return (
    <ApplyAllStylesWarningPopup
      onCloseClick={props.onCloseClick}
      onAcceptClick={_handleAcceptClick}
    />
  );

  function _handleAcceptClick(evt: React.MouseEvent) {
    if (props.onCloseClick) {
      props.onCloseClick(evt);
    } else {
      PopupManager.close(dispatch);
    }

    const type = props.type;
    const StyleActions = Redux.bindActionCreators(
      captionActionsDictractory[type],
      dispatch
    );

    StyleActions.setDefaultStyle({
      path: { ...props.path },
      style: props.style ?? null,
    })

    StyleActions.setDefaultLocation({
      path: { ...props.path },
      location: props.location
    })
  }
}

export default ApplyAllStylesWarningPopupContainer;