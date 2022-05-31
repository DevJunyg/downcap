import ClassNameHelper from "ClassNameHelper";
import React from 'react';

export interface IInfoPopupActions {
  onConfirmClick?: React.MouseEventHandler<HTMLDivElement>;
  onCloseClick?: React.MouseEventHandler<HTMLDivElement>;
}

interface IInfoPopupProps extends IInfoPopupActions {
  children?: React.ReactNode;
  className?: string;
  title?: string;
  titlebarMaxWidth?: string | number;
  confirmContent?: React.ReactNode;
  closePressedOutside?: boolean;
}

const ConfirmButton = React.forwardRef<
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

const outlineNoneStlye: React.CSSProperties = {
  outline: 'none'
}

function InfoPopup(props: React.PropsWithChildren<IInfoPopupProps>) {
  const popupContentRef = React.useRef<HTMLDivElement>(null);
  const popupConfirmButtonRef = React.useRef<HTMLDivElement>(null);

  const titlebarStyle = { maxWidth: props.titlebarMaxWidth };
  let buttonGroupStyle: React.CSSProperties | undefined;

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
          <ConfirmButton ref={popupConfirmButtonRef} onClick={props.onConfirmClick}>
            {props.confirmContent}
          </ConfirmButton>
        </div>
      </div>
    </div >
  )

  function _handleKeyDown(evt: React.KeyboardEvent<HTMLDivElement>) {
    if (evt.code !== "Tab") {
      return;
    }

    const popupContent = popupContentRef.current;
    const lastButton = popupConfirmButtonRef.current;
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

export default InfoPopup;
