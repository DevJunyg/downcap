//@ts-check

import React from 'react';
import FormatBoldIcon from '@material-ui/icons/FormatBold';
import FormatItalicIcon from '@material-ui/icons/FormatItalic';
import FormatUnderlinedIcon from '@material-ui/icons/FormatUnderlined';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

export type FontFormatType = 'bold' | 'italic' | 'underline';

const classes = { root: 'text-format-button' };

interface IFormatTextGroupProps {
  value: readonly FontFormatType[]
  disabled?: boolean
  onChange?: (event: React.MouseEvent, value: FontFormatType) => void;
}

function FormatTextGroup(props: IFormatTextGroupProps) {
  return (
    <ToggleButtonGroup value={props.value} aria-label="text formatting" onChange={props.onChange}>
      <ToggleButton value="bold" aria-label="bold" classes={classes} disabled={props.disabled}>
        <FormatBoldIcon />
      </ToggleButton>
      <ToggleButton value="italic" aria-label="italic" classes={classes} disabled={props.disabled}>
        <FormatItalicIcon />
      </ToggleButton>
      <ToggleButton value="underline" aria-label="underline" classes={classes} disabled={props.disabled}>
        <FormatUnderlinedIcon />
      </ToggleButton>
    </ToggleButtonGroup>
  );
}


function areEqual(prevProps: IFormatTextGroupProps, nextProps: IFormatTextGroupProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.value === nextProps.value
    && prevProps.onChange === nextProps.onChange
}

export default React.memo(FormatTextGroup, areEqual);