import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ColorPalette from 'components/common/ColorPalette';
import ArrowDropDownIcon from '@material-ui/icons/ArrowDropDown';
import { faFillDrip } from '@fortawesome/pro-duotone-svg-icons';
import { rgbaToString } from 'lib/utils';
import FontAwesomeProIcon, { FontAwesomeIconProStyle } from 'FontAwesomeProIcon';
import { ColorChangeHandler } from 'react-color';
import { IRGBA } from 'models';

interface IFontBackgroundColorProps {
  color?: IRGBA;
  disabled?: boolean;
  onChange?: ColorChangeHandler;
}

const defualtIconStyle: FontAwesomeIconProStyle = {
  "--fa-primary-color": "black",
  "--fa-primary-opacity": 1,
  "--fa-secondary-opacity": 1,
  "borderBottom": "solid transparent 5px",
  "paddingBottom": "5px",
}

const classes = { root: 'font-background-color-button' }

const FontBackgroundColor = (props: IFontBackgroundColorProps) => {
  const color = props.color;
  const colorString = color && rgbaToString(color);

  return (
    <ToggleButton value={false} classes={classes} disabled={props.disabled}>
      <ColorPalette color={color} onChange={props.onChange}>
        <FontAwesomeProIcon icon={faFillDrip} style={{
          ...defualtIconStyle,
          "--fa-secondary-color": colorString,
          borderColor: colorString
        }} size="lg" />
        <ArrowDropDownIcon />
      </ColorPalette>
    </ToggleButton>
  )
}

function areEqual(prevProps: IFontBackgroundColorProps, nextProps: IFontBackgroundColorProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.color === nextProps.color
    && prevProps.disabled === nextProps.disabled
    && prevProps.onChange === nextProps.onChange;
}

export default React.memo(FontBackgroundColor, areEqual);
