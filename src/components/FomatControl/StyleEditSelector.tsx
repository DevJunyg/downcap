import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import * as store from 'storeV2';
import { useTranslation } from 'react-i18next';

const buttonDefualtStyle = {
  width: '53px',
  height: '30px',
  padding: '0',
};

interface ISelectApplyStyleProps {
  value?: store.StyleEditType;
  wordSelectDisabled?: boolean;
  lineSelectDisabled?: boolean;
  disabled?: boolean;
  onChange?: (event: React.MouseEvent<HTMLElement, MouseEvent>, value: store.StyleEditType | null) => void;
}

const StyleEditSelector = (props: ISelectApplyStyleProps) => {
  const { t } = useTranslation('StyleEditSelector');

  return (
    <ToggleButtonGroup exclusive
      onChange={props.onChange}
      value={props.value}
      aria-label="Select Language"
      size="small"
    >
      <ToggleButton
        value="line"
        aria-label="line"
        disabled={props.lineSelectDisabled || props.disabled}
        style={buttonDefualtStyle}
      >
        <label className='select-language-button-label center'>{t('LineButton_Content')}</label>
      </ToggleButton>
      <ToggleButton
        value="word"
        aria-label="word"
        disabled={props.wordSelectDisabled || props.disabled}
        style={buttonDefualtStyle}
      >
        <label className='select-language-button-label center'>{t('WordButton_Content')}</label>
      </ToggleButton>
    </ToggleButtonGroup>
  )
};

function areEqual(prevProps: ISelectApplyStyleProps, nextProps: ISelectApplyStyleProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.value === nextProps.value
    && prevProps.disabled === nextProps.disabled
    && prevProps.lineSelectDisabled === nextProps.lineSelectDisabled
    && prevProps.wordSelectDisabled === nextProps.wordSelectDisabled
    && prevProps.onChange === nextProps.onChange;
}

export default React.memo<ISelectApplyStyleProps>(StyleEditSelector, areEqual);