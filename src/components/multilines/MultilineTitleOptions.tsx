import React from "react";
import { withTranslation, WithTranslation } from "react-i18next";

interface IMultiLineTitleOptionsProperties extends WithTranslation{
  onCreateButtonClick?: React.MouseEventHandler
}

const MultiLineTitleOptions = React.memo<IMultiLineTitleOptionsProperties>(props => (
  <div>
    <button className="pointer" onClick={props.onCreateButtonClick}>
      <div className="d-flex">
        <label>{props.t('MultLineCreateNewLine')}</label>
        <div style={{
          backgroundImage: `url("https://downcap.net/client/svg/자막추가.svg")`,
          width: '1rem',
          height: '1rem',
          margin: "0.1rem 0.1rem 0.1rem 0.5rem"
        }} />
      </div>
    </button>
  </div>
));

export default withTranslation()(MultiLineTitleOptions);