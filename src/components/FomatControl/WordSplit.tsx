import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import UpDownButton from 'components/common/UpDownButton';
import { useTranslation } from 'react-i18next';

const classes = { root: 'word-split-button' }

interface IWordSplitProps {
  value?: number | string;
  disabled?: boolean;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  onUpButtonClick?: React.MouseEventHandler<SVGSVGElement>;
  onDownButtonClick?: React.MouseEventHandler<SVGSVGElement>;
}

const WordSplit = (props: IWordSplitProps) => {
  const { t } = useTranslation('WordSplit');
  return (
    <ToggleButton value={false} disabled={props.disabled} classes={classes} style={{ marginRight: "0.5rem" }}>
      <label>{t('wordLength')}</label>
      <input className="word-split-number"
        type="number"
        value={props.value}
        min={0}
        onChange={props.onChange}
        onBlur={props.onBlur}
        disabled={props.disabled}
        data-testid="test-id-word-split-input"
      />
      <UpDownButton className="split-updown-buttons-box"
        onUpClick={props.onUpButtonClick}
        onDownClick={props.onDownButtonClick}
      />
    </ToggleButton>
  )
}
function areEqual(prevProps: IWordSplitProps, nextProps: IWordSplitProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.disabled === nextProps.disabled
    && prevProps.value === nextProps.value
    && prevProps.onChange === nextProps.onChange
    && prevProps.onBlur === nextProps.onBlur
    && prevProps.onUpButtonClick === nextProps.onUpButtonClick
    && prevProps.onDownButtonClick === nextProps.onDownButtonClick;
}

export default React.memo<IWordSplitProps>(WordSplit, areEqual);
