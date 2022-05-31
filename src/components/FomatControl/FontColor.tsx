import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ColorPalette from 'components/common/ColorPalette';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { rgbaToString } from 'lib/utils';
import { ColorChangeHandler } from 'react-color';
import { IRGBA } from 'models';

interface IFontColorProps {
  disabled?: boolean;
  color?: IRGBA;
  onChange?: ColorChangeHandler;
}

const classes = { root: 'font-color-button' };

const FontColor = (props: IFontColorProps) => {
  const colorString = props.color && rgbaToString(props.color);

  return (
    <ToggleButton value={false} classes={classes} disabled={props.disabled}>
      <ColorPalette color={props.color} onChange={props.onChange}>
        <label style={{ borderColor: colorString, cursor: 'pointer' }}>A</label>
        <ArrowDropDownIcon />
      </ColorPalette>
    </ToggleButton >
  )
};

function areEqual(prevProps: IFontColorProps, nextProps: IFontColorProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.color === nextProps.color
    && prevProps.disabled === nextProps.disabled
    && prevProps.onChange === nextProps.onChange;
}

export default React.memo<IFontColorProps>(FontColor, areEqual);
