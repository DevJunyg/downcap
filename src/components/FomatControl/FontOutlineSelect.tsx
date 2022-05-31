import React from 'react';
import ToggleButton from '@material-ui/lab/ToggleButton';
import YoutubeOutlineStylesSelector from 'components/YoutubeOutlineStylesSelector';

interface IFontOutlineSelect {
  value?: number,
  disabled?: boolean,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const AMark = React.memo(() => <label>A</label>)

const youtubeOutlineStylesSelectorStyle = { border: '0', backgroundColor: 'transparent', cursor: 'pointer' }
const classes = { root: 'font-outline-select-button' }

const FontOutlineSelect = (props: IFontOutlineSelect) => (
  <ToggleButton value={false} classes={classes} disabled={props.disabled}>
    <AMark />
    <YoutubeOutlineStylesSelector
      style={youtubeOutlineStylesSelectorStyle}
      disabled={props.disabled}
      value={props.value}
      onChange={props.onChange}
    />
  </ToggleButton>
);

function areEqual(prevProps: IFontOutlineSelect, nextProps: IFontOutlineSelect) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.value === nextProps.value
    && prevProps.disabled === nextProps.disabled
    && prevProps.onChange !== nextProps.onChange;
}

export default React.memo<IFontOutlineSelect>(FontOutlineSelect, areEqual);
