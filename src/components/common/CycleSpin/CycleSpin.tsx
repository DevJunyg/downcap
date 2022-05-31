import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircleNotch } from '@fortawesome/pro-solid-svg-icons';

const CycleSpin = ({ fontSize }: { fontSize: string }) => (
  <FontAwesomeIcon style={{ fontSize: fontSize }} icon={faCircleNotch} spin />
)

export default CycleSpin;
