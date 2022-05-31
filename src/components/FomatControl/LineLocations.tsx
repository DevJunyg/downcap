import React from 'react';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import ToggleButton from '@material-ui/lab/ToggleButton';

interface IArrowBlack {
  alt: string
  className?: string
}
const arrow_black_url = 'https://downcap.net/client/img/arrow_black.png';

function areArrowBlackEqual(prevProps: IArrowBlack, nextProps: IArrowBlack) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.alt === nextProps.alt
    && prevProps.className === nextProps.className;
}

const ArrowBlack = React.memo((props: IArrowBlack) => (
  <div className={props.className}>
    <img src={arrow_black_url} alt={props.alt} />
  </div>
), areArrowBlackEqual);

const ArrowBlackUp = React.memo(() => <ArrowBlack className='arrow-up justify-content-center horizontal-layout' alt='arrow-up' />)
const ArrowBlackDown = React.memo(() => <ArrowBlack className='arrow-down justify-content-center horizontal-layout' alt='arrow-down' />)
const ArrowBlackLeft = React.memo(() => <ArrowBlack className='arrow-left justify-content-center horizontal-layout' alt='arrow-left' />)
const ArrowBlackRight = React.memo(() => <ArrowBlack className='arrow-right justify-content-center horizontal-layout' alt='arrow-right' />)

interface IArrowButtonProps {
  disabled?: boolean,
  onClick?: React.MouseEventHandler<HTMLButtonElement>
}

const arrowButtonClasses = { root: "line-location-button" };

const ArrowButton = (props: React.PropsWithChildren<IArrowButtonProps>) => (
  <ToggleButton value={false}
    onClick={props.onClick}
    classes={arrowButtonClasses}
    disabled={props.disabled} >
    {props.children}
  </ToggleButton>
)

const renderArrowButtonWithArrow = (props: IArrowButtonProps, Arrow: React.MemoExoticComponent<() => JSX.Element>) => (
  <ArrowButton disabled={props.disabled}
    onClick={props.onClick}>
    <Arrow />
  </ArrowButton>
);

function areArrowButtonEqual(prevProps: IArrowButtonProps, nextProps: IArrowButtonProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.disabled === nextProps.disabled
    && prevProps.onClick === nextProps.onClick
}

const UpArrowButton = React.memo<IArrowButtonProps>(props => renderArrowButtonWithArrow(props, ArrowBlackUp), areArrowButtonEqual);
const DonwArrowButton = React.memo<IArrowButtonProps>(props => renderArrowButtonWithArrow(props, ArrowBlackDown), areArrowButtonEqual);
const LeftArrowButton = React.memo<IArrowButtonProps>(props => renderArrowButtonWithArrow(props, ArrowBlackLeft), areArrowButtonEqual);
const RightArrowButton = React.memo<IArrowButtonProps>(props => renderArrowButtonWithArrow(props, ArrowBlackRight), areArrowButtonEqual);

interface ILineLocationsProps {
  locationButtonDisabled?: boolean,
  onUpButtonClick?: React.MouseEventHandler<HTMLButtonElement>,
  onDownButtonClick?: React.MouseEventHandler<HTMLButtonElement>,
  onLeftButtonClick?: React.MouseEventHandler<HTMLButtonElement>,
  onRightButtonClick?: React.MouseEventHandler<HTMLButtonElement>
}

const LineLocations = (props: ILineLocationsProps) => (
  <ToggleButtonGroup exclusive>
    <UpArrowButton onClick={props.onUpButtonClick}
      disabled={props.locationButtonDisabled} />
    <DonwArrowButton onClick={props.onDownButtonClick}
      disabled={props.locationButtonDisabled} />
    <LeftArrowButton onClick={props.onLeftButtonClick}
      disabled={props.locationButtonDisabled} />
    <RightArrowButton onClick={props.onRightButtonClick}
      disabled={props.locationButtonDisabled} />
  </ToggleButtonGroup >
);

function AreLineLocationsEqual(prevProps: ILineLocationsProps, nextProps: ILineLocationsProps) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.locationButtonDisabled === nextProps.locationButtonDisabled
    && prevProps.onUpButtonClick === nextProps.onUpButtonClick
    && prevProps.onDownButtonClick === nextProps.onDownButtonClick
    && prevProps.onLeftButtonClick === nextProps.onLeftButtonClick
    && prevProps.onRightButtonClick === nextProps.onRightButtonClick;
}

export default React.memo(LineLocations, AreLineLocationsEqual);