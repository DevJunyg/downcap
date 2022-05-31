import ClassNameHelper from "ClassNameHelper";
import React from 'react';
import './AcceptCancelPopup.scss';

interface IAcceptCancelPopupProps {
  className?: string;
  title?: string;
  titlebarMaxWidth?: string | number;
  reversedButton?: boolean;
  acceptContent?: React.ReactNode;
  closeContent?: React.ReactNode;
  closePressedOutside?: boolean;
  buttonReversed?: boolean;
  "data-testid-cancel"?: string;
  "data-testid-accept"?: string;
  onAcceptClick?: React.MouseEventHandler<HTMLDivElement>;
  onCancelClick?: React.MouseEventHandler<HTMLDivElement>;
  onCloseClick?: React.MouseEventHandler<HTMLDivElement>;
}

const AcceptButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  let { className, children, ...rest } = props;
  if (!children) {
    children = "수락";
  }

  return (
    <div ref={ref}
      className={ClassNameHelper.concat('btn popup-btn ok-btn', className)}
      {...rest}
    >
      {children}
    </div>
  )
});

const CancelButton = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>((props, ref) => {
  let { className, children, ...rest } = props;
  if (!children) {
    children = "취소";
  }

  return (
    <div ref={ref}
      className={ClassNameHelper.concat('btn popup-btn cancel-btn', className)}
      {...rest}
    >
      {children}
    </div>
  )
});


const outlineNoneStlye: React.CSSProperties = {
  outline: 'none'
}

function AcceptCancelPopup(props: React.PropsWithChildren<IAcceptCancelPopupProps>) {
  const popupContentRef = React.useRef<HTMLDivElement>(null);
  const popupAcceptButtonRef = React.useRef<HTMLDivElement>(null);
  const popupCancelButtonRef = React.useRef<HTMLDivElement>(null);

  const titlebarStyle = { maxWidth: props.titlebarMaxWidth };
  let buttonGroupStyle: React.CSSProperties | undefined;

  if (props.reversedButton) {
    buttonGroupStyle = {
      ...buttonGroupStyle,
      flexDirection: "row-reverse"
    }
  }

  return (
    <div className="ok-cancel-popup center no-drag"
      onClick={props.closePressedOutside ? props.onCloseClick : undefined}
    >
      <div ref={popupContentRef}
        className={ClassNameHelper.concat("ok-cancel-popup-content", props.className)}
        tabIndex={0}
        onKeyDown={_handleKeyDown}
        style={outlineNoneStlye}
        onClick={_handleClickEventPreventPropagation}
      >
        <div className="ok-cancel-popup-titlebar center">
          <div className="ok-cancel-popup-title" style={titlebarStyle}>
            {props.title}
          </div>
        </div>
        {props.children}
        <div
          className="ok-cancel-popup-dialog center"
          style={buttonGroupStyle}
        >
          <CancelButton ref={popupCancelButtonRef} 
            onClick={props.onCancelClick}
            data-testid={props["data-testid-cancel"] ?? "test-id-acceptclose-popup-cancel-btn"}
          >
            {props.closeContent}
          </CancelButton>
          <AcceptButton ref={popupAcceptButtonRef} 
            onClick={props.onAcceptClick}
            data-testid={props["data-testid-accept"] ?? "test-id-acceptclose-popup-accept-btn"}
          >
            {props.acceptContent}
          </AcceptButton>
        </div>
      </div>
    </div >
  )

  function _handleKeyDown(evt: React.KeyboardEvent<HTMLDivElement>) {
    if (evt.code !== "Tab") {
      return;
    }

    const popupContent = popupContentRef.current;
    const lastButton = props.buttonReversed ? popupCancelButtonRef.current : popupAcceptButtonRef.current;
    if (evt.shiftKey && evt.target === popupContent) {
      lastButton?.focus();
      evt.preventDefault();
    }
    else if (evt.target === lastButton) {
      popupContent?.focus();
      evt.preventDefault();
    }
  }

  function _handleClickEventPreventPropagation(evt: React.MouseEvent<HTMLDivElement>) {
    evt.stopPropagation();
  }
}

export default AcceptCancelPopup;
