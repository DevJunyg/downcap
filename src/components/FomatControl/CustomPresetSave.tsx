import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';

interface ICustomPresetSaveProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const classes = { root: 'MuiButtonBase-root preset-save' };

const CustomPresetSave = (props: ICustomPresetSaveProps) => (
  <ToggleButton value={false}
    onClick={props.onClick}
    classes={classes}>
    <label>내 스타일</label>
  </ToggleButton>
)

function areEqual(prevProps: ICustomPresetSaveProps, nextProps: ICustomPresetSaveProps) {
  return prevProps === nextProps || prevProps.onClick === nextProps.onClick;
}

export default React.memo<ICustomPresetSaveProps>(CustomPresetSave, areEqual);
