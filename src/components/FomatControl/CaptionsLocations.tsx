import React from 'react';
import SubtitleCenterIcon from 'components/common/SubtitleCenterIcon';
import ToggleButton from '@material-ui/lab/ToggleButton';

interface ICaptionsLocationsProps {
  disabled?: boolean,
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const classes = { root: "captions-location-button" };

const CaptionsLocations = (props: ICaptionsLocationsProps) => (
  <ToggleButton value="default"
    aria-label="location-default"
    classes={classes}
    onClick={props.onClick}
    disabled={props.disabled}>
    <SubtitleCenterIcon />
  </ToggleButton>
);

function areEqual(prevProps: ICaptionsLocationsProps, nextProps: ICaptionsLocationsProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.disabled === nextProps.disabled
    && prevProps.onClick === nextProps.onClick;
}

export default React.memo(CaptionsLocations, areEqual);