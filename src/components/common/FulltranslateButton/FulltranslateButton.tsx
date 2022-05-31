import React from "react";
import './FulltranslateButton.scss';

interface IFulltranslateButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function FulltranslateButton(props: IFulltranslateButtonProps) {
  return (
    <div className="downcap-fulltranslateButton-container">
      <button className="downcap-fulltranslateButton-button"
        onClick={props.onClick}>
        <img
          className='fulltranslate-icon'
          src="https://downcap.net/client/img/translate_by_ko.png"
          alt="ReTranslate">
        </img>
        <div>
          전체번역
        </div>
      </button>
    </div>
  );
}

export default FulltranslateButton;