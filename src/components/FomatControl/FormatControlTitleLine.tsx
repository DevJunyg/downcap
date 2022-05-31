import StyleSelectContainer from 'containers/styles/StyleSelectContainer';
import WordSplitContainer from 'containers/WordSplitContainer';
import React from 'react';
import ApplyAllStylesButton from './ApplyAllStylesButton';
import FormatControlTitle from './FormatControlTitle';

interface IFormatControlTitleLine {
  splitDisabled?: boolean;
  applyAllStylesButtonDisalbed?: boolean;
  styleSelectDisabled?: boolean;
  onApplyAllStylesButtonClick?: React.MouseEventHandler;
}

const FormatControlTitleLine = (props: IFormatControlTitleLine) => (
  <div className="selecet-apply-style">
    <FormatControlTitle />
    <div className="d-flex">
      <div className="selecet-apply-button">
        <WordSplitContainer />
        <StyleSelectContainer disabled={props.styleSelectDisabled} />
        <ApplyAllStylesButton
          onClick={props.onApplyAllStylesButtonClick}
          disabled={props.applyAllStylesButtonDisalbed}
        />
      </div>
    </div>
  </div>
);

function areEqual(prevProps: IFormatControlTitleLine, nextProps: IFormatControlTitleLine) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.applyAllStylesButtonDisalbed === nextProps.applyAllStylesButtonDisalbed
    && prevProps.styleSelectDisabled === nextProps.styleSelectDisabled
    && prevProps.onApplyAllStylesButtonClick === nextProps.onApplyAllStylesButtonClick
}

export default React.memo<IFormatControlTitleLine>(FormatControlTitleLine, areEqual);