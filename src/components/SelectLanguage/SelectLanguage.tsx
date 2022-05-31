import './SelectLanguage.scss'
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';
import React from 'react';
import { EditType } from 'storeV2';
import { useTranslation } from 'react-i18next';

const buttonDefualtStyle: React.CSSProperties = {
  width: '53px',
  height: '28px',
  padding: '0',
  boxSizing: 'border-box'
};

interface ISelectLanguageProps {
  disabled: boolean[];
  selected: boolean[];
  onChange?: (event: React.MouseEvent<HTMLElement>, value: EditType) => void;
  onHelpImageClick?: React.MouseEventHandler<SVGSVGElement>;
}

function SelectLanguage(props: ISelectLanguageProps) {
  const { t } = useTranslation('SelectLanguage');
  const { selected, disabled } = props;

  return (
    <ToggleButtonGroup
      exclusive
      onChange={props.onChange}
      aria-label="Select Language"
      size="small"
      style={{ height: '30px' }}
    >
      <ToggleButton
        style={{
          ...buttonDefualtStyle,
          ...(selected[0] ? ({ color: 'white' }) : null),
        }}
        value="origin"
        aria-label="origin"
        selected={selected[0]}
        disabled={disabled[0]}
      >
        <label className='select-language-button-label center'>{t('ko')}</label>
      </ToggleButton>
      <ToggleButton
        className='temp'
        classes={{ disabled: 'true' }}
        selected={selected[1]}
        disabled={disabled[1]}
        style={{
          ...buttonDefualtStyle,
          ...(selected[1] ? ({ color: 'white' }) : null),
        }}
        value="translated"
        aria-label="translated"
      >
        <label className='select-language-button-label center'>{t('en')}</label>
      </ToggleButton>
      <ToggleButton
        className='temp'
        classes={{ disabled: 'true' }}
        style={{
          ...buttonDefualtStyle,
          ...(selected[2] ? ({ color: 'white' }) : null),
        }} value="dual" aria-label="dual" selected={selected[2]} disabled={disabled[2]}>
        <label className='select-language-button-label center'>{t('dual')}</label>
      </ToggleButton>
    </ToggleButtonGroup>
  )
}

export default React.memo(SelectLanguage, (prevProps, nextProps) => {
  return prevProps.disabled === nextProps.disabled
    && prevProps.selected === nextProps.selected;
});