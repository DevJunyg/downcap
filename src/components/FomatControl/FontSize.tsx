import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import FormatSizeIcon from '@material-ui/icons/FormatSize';
import UpDownButton from 'components/common/UpDownButton';

const PXMarkStyle = { fontSize: '0.8rem' };
const PXMark = React.memo(() => <label style={PXMarkStyle}>px</label>)

interface IFontSize {
  disabled?: boolean,
  value?: number,
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onUpClick?: React.MouseEventHandler<SVGSVGElement>;
  onDownClick?: React.MouseEventHandler<SVGSVGElement>;
}

const classes = { root: 'font-size-button' };
const darkgrayColor = { color: 'darkgray' };

const FontSize = (props: IFontSize) => (
  <ToggleButton value={false}
    classes={classes}
    style={props.disabled ? darkgrayColor : undefined}
    disabled={props.disabled}>
    <FormatSizeIcon />
    <input type="number" min={0} max={72}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
    <PXMark />
    <UpDownButton disabled={props.disabled}
      onUpClick={props.onUpClick}
      onDownClick={props.onDownClick}
    />
  </ToggleButton>
)

function areEqual(prevProps: IFontSize, nextProps: IFontSize) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.disabled === nextProps.disabled
    && prevProps.value === nextProps.value;
}

export default React.memo(FontSize, areEqual);
