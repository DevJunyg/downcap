//@ts-check
import React from 'react';
import './PopUp.scss'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes } from '@fortawesome/pro-solid-svg-icons'
import ClassNameHelper from 'ClassNameHelper';

/**
 * 
 * @param {object} param0
 * @param {string} [param0.title]
 * @param {React.ReactNode} param0.children
 * @param {React.MouseEventHandler} [param0.onCloseClick]
 * @param {boolean} [param0.CloseStopper]
 * @param {string} [param0.className]
 * @param {React.CSSProperties} [param0.style]
 */
const PopUp = ({ title, children, CloseStopper, className, style, onCloseClick }) => {
  /**
   * @param {React.KeyboardEvent<HTMLDivElement>} e 
   */
  const handleKeyDown = (e) => {
    if (e.code === "Tab") {
      e.stopPropagation();
      e.preventDefault();
    }
  }

  const PopupTitle = () => {
    const CloseButton = CloseStopper ? null : <FontAwesomeIcon icon={faTimes} className="pointer" />;
    return title !== undefined
      ? (
        <div className="popup-titlebar center">
          <div className="popup-title">
            {title}
          </div>
          <div className="popup-close" onClick={onCloseClick} data-testid="popup-close">
            {CloseButton}
          </div>
        </div>
      ) : null;
  }

  return (
    <div className="popup center" onClick={onCloseClick} tabIndex={0} onKeyDown={handleKeyDown} style={{ outline: 'none' }}>
      <div className={ClassNameHelper.concat("popup-content", className)}
        onClick={e => {
          e.stopPropagation();
          return false;
        }}
        style={{ ...(title === 'info') ? { backgroundColor: '#7D1ED8' } : undefined, ...style }}
      >
        <PopupTitle />
        {children}
      </div>
    </div>
  )
}

export default PopUp;
