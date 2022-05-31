import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { useTranslation } from 'react-i18next';

interface IApplyAllStylesButtonProps {
  disabled?: boolean;
  onClick?: React.MouseEventHandler;
}

const buttonDefualtStyle: CSSProperties = {
  width: '100px',
  height: '30px',
  padding: '0'
};

const ApplyAllStylesButton = (props: IApplyAllStylesButtonProps) => {
  const { t } = useTranslation('ApplyAllStylesButton');
  return (
    <ToggleButton
      value={false}
      classes={{ root: 'caption-style-apply-button center' }}
      style={buttonDefualtStyle}
      onClick={props.onClick}
      disabled={props.disabled}>
      <label className='select-language-button-label center'>{t('applyAll')}</label>
    </ToggleButton>
  );
}


function areEqual(prevProps: IApplyAllStylesButtonProps, nextProps: IApplyAllStylesButtonProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.disabled === nextProps.disabled
    && prevProps.onClick === nextProps.onClick;
}

export default React.memo<IApplyAllStylesButtonProps>(ApplyAllStylesButton, areEqual);
