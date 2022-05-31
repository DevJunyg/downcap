import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { faChevronDown, faChevronUp, IconDefinition } from '@fortawesome/pro-solid-svg-icons';
import React from "react";

type Direction = 'up' | 'down' | 'left' | 'bottom';

interface IChevronButton {
  direction?: Direction;
  disabled?: boolean;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

interface IDefinedChevronButtonProps {
  disabled?: boolean;
  onClick?: React.MouseEventHandler<SVGSVGElement>;
}

interface UpDownButtonProperties extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  onUpClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
  onDownClick?: (event: React.MouseEvent<SVGSVGElement, MouseEvent>) => void;
}

const defaultChevron = faChevronUp;

const chevronDictionary: { [name in Direction]?: IconDefinition } = {
  'up': faChevronUp,
  'down': faChevronDown
}

const ChevronButton = (props: IChevronButton) => {
  let icon: IconDefinition | undefined = undefined;
  if (props.direction !== undefined) {
    icon = chevronDictionary[props.direction]
  }

  if (icon === undefined) {
    icon = defaultChevron;
  }

  return (
    <div>
      <FontAwesomeIcon
        icon={icon}
        onClick={props.disabled ? undefined : props.onClick}
      />
    </div>
  )
}

const areEqualfinedChevronButton = (
  prevProps: IDefinedChevronButtonProps,
  nextProps: IDefinedChevronButtonProps
) => {
  return prevProps.onClick === nextProps.onClick
    && prevProps.disabled === nextProps.disabled
}

const UpChevronButton = React.memo((props: IDefinedChevronButtonProps) => (
  <ChevronButton direction='up'
    onClick={props.onClick}
    disabled={props.disabled}
  />
), areEqualfinedChevronButton);

const DownChevronButton = React.memo((props: IDefinedChevronButtonProps) => (
  <ChevronButton direction='down'
    onClick={props.onClick}
    disabled={props.disabled}
  />
), areEqualfinedChevronButton);

const UpDownButton = React.memo((props: UpDownButtonProperties) => {
  const { onUpClick, onDownClick, disabled, ...rest } = props;
  return (
    <div {...rest} className="split-updown-buttons-box test-updown-buttons-box">
      <UpChevronButton onClick={onUpClick} disabled={disabled} />
      <DownChevronButton onClick={onDownClick} disabled={disabled} />
    </div>
  )
});

export default UpDownButton;