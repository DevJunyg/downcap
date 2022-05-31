import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ColorPalette from 'components/common/ColorPalette';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { rgbToString } from 'lib/utils';
import { ColorChangeHandler } from 'react-color';
import { IRGBA } from 'models';

interface IFontOutlineColorProps {
  disabled?: boolean;
  color?: IRGBA;
  onChange?: ColorChangeHandler;
}

const classes = { root: "font-outline-color-button" };

const FontOutlineColor = (props: IFontOutlineColorProps) => {
  const colorString = props.color && rgbToString(props.color);

  return (
    <ToggleButton value={false} classes={classes} disabled={props.disabled}>
      <ColorPalette color={props.color} onChange={props.onChange} disableAlpha>
        <label style={{ borderColor: colorString, cursor: 'pointer' }}>A</label>
        <ArrowDropDownIcon />
      </ColorPalette>
    </ToggleButton>
  )
};

function areEqual(prevProps: IFontOutlineColorProps, nextProps: IFontOutlineColorProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.color === nextProps.color
    && prevProps.disabled === nextProps.disabled
    && prevProps.onChange === nextProps.onChange;
}

export default React.memo(FontOutlineColor, areEqual);
