import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import YoutubeFontSelect from 'components/YoutubeFontSelect';

interface IFMarkProps {
  disabled?: boolean
}

const drakgray = { color: 'darkgray' };

function areFMarkEqual(prevProps: IFMarkProps, nextProps: IFMarkProps) {
  return prevProps === nextProps || prevProps.disabled === nextProps.disabled
}

const FMark = React.memo((props: IFMarkProps) => (
  <label style={props.disabled ? drakgray : undefined} >F</label>
), areFMarkEqual)

interface IFontSelect {
  disabled?: boolean,
  value?: string | number,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const classes = { root: "font-select-button" };

const FontSelect = (props: IFontSelect) => (
  <ToggleButton value={false} classes={classes} disabled={props.disabled}>
    <FMark disabled={props.disabled} />
    <YoutubeFontSelect
      value={props.value}
      disabled={props.disabled}
      onChange={props.onChange} />
  </ToggleButton>
);

function areFontSelectEqual(prevProps: IFontSelect, nextProps: IFontSelect) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.value === nextProps.value
    && prevProps.disabled === nextProps.disabled
    && prevProps.onChange === nextProps.onChange
}

export default React.memo<IFontSelect>(FontSelect, areFontSelectEqual);