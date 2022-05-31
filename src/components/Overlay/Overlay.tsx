import IOverlayProperties from './IOverlayProperties';
import IArea from 'IArea';
import IFrameDisplayControl from 'IFrameDisplayControl';
import IPoint from 'IPoint';
import MouseButton from 'MouseButton';
import React, { CSSProperties } from 'react';
import ClassNameHelper from 'ClassNameHelper';
import downcapOptions from 'downcapOptions';

const defaultArea = {
  x: 16,
  y: 99,
  width: 592,
  height: 333
}

function calculatePointPercentagByArea(area: IArea | undefined, x: number, y: number): IPoint {
  area = area ?? defaultArea;
  const width = area.width !== 0 ? area.width : 1;
  const height = area.height !== 0 ? area.height : 1;
  return {
    x: (x - area.x) / width,
    y: (y - area.y) / height
  }
}

function Overlay(props: IOverlayProperties) {
  const overlayEl = React.useRef<HTMLDivElement>(null);
  const iFrameDisplayControl = new IFrameDisplayControl();
  const [dragged, setDragged] = React.useState(false);
  const [stateHorizontal, setHorizontal] = React.useState(props.horizontal);
  const [stateVertical, setVertical] = React.useState(props.vertical);
  const [occurrencePointX, setOccurrencePointX] = React.useState(0.5);
  const [occurrencePointY, setOccurrencePointY] = React.useState(0.5);
  const [occurrenceOverlayHorizontal, setOccurrenceLocationHorizontal] = React.useState(0.5);
  const [occurrenceOverlayVertical, setOccurrenceLocatioVertical] = React.useState(0.5);

  React.useEffect(() => {
    subscribe();
    if (!dragged && (props.horizontal !== stateHorizontal || props.vertical !== stateVertical)) {
      setOverlayLocation(props.horizontal, props.vertical);
    }

    return unsubscribe;
  });

  const {
    area,
    style,
    children,
    horizontal,
    vertical,
    className,
    draggabled,
    meta,
    selectedPreviewType,
    onMouseDown,
    onLocationChangeEnd,
    onClick,
    onClickCapture,
    ...rest
  } = props;

  const styleArea = area ?? defaultArea;
  const nowStyle: CSSProperties = {
    left: `${stateHorizontal * 100}%`,
    bottom: `${stateVertical * 100}%`,
    maxWidth: `calc(${styleArea.x}+${styleArea.width})`,
    cursor: props.draggabled ? 'move' : 'default',
    background: props.style?.background,
    fontSize: props.style?.fontSize
  }

  const spreadMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {

    if (onMouseDown) onMouseDown(e);
    if (e.target === overlayEl.current) {
      handleMouseDown(e);
    }
  }

  const concatClassName = ClassNameHelper.concat(
    'caption-ovleray',
    'text-center',
    className,
    props.draggabled || 'disabled'
  )

  return (
    <div ref={overlayEl}
      tabIndex={1}
      onMouseDown={spreadMouseDown}
      onClickCapture={_handleClickCapture}
      style={nowStyle}
      className={concatClassName}
      {...rest}>
      {children}
    </div>
  );

  function _handleClickCapture(evt: React.MouseEvent<HTMLDivElement>) {
    props.onClickCapture && props.onClickCapture(evt, props.meta);
  }

  function setOverlayLocation(hor: number, ver: number) {
    hor = Math.round(hor * 100) / 100;
    ver = Math.round(ver * 100) / 100;
    setHorizontal(Math.max(0, Math.min(1, hor)));
    setVertical(Math.max(0, Math.min(0.95, ver)));
  }

  function setOccurrencePoint(occurrencePoint: IPoint) {
    setOccurrencePointX(occurrencePoint.x);
    setOccurrencePointY(occurrencePoint.y);
  }

  function setOccurrenceLocation(location: IPoint) {
    setOccurrenceLocationHorizontal(location.x);
    setOccurrenceLocatioVertical(location.y);
  }

  function dragStart(occurrencePoint: IPoint) {
    if (dragged) {
      return;
    }

    setDragged(true);
    setOccurrencePoint(occurrencePoint);
    setOccurrenceLocation({ x: stateHorizontal, y: stateVertical });
    iFrameDisplayControl.disable();
  }

  function dragEnd() {
    setDragged(false);
    if (props.onLocationChangeEnd) {
      props.onLocationChangeEnd({ x: stateHorizontal, y: stateVertical }, props.meta);
    }
    iFrameDisplayControl.enable();
  }

  function handleDrag(ev: globalThis.MouseEvent) {
    const point = calculatePointPercentagByArea(props.area, ev.clientX, ev.clientY);
    const relativePointX = point.x - occurrencePointX;
    const relativePointY = occurrencePointY - point.y;

    setOverlayLocation(
      occurrenceOverlayHorizontal + relativePointX,
      occurrenceOverlayVertical + relativePointY
    );
  }

  function handleMouseMainDown(ev: React.MouseEvent<HTMLDivElement>) {
    if (!props.area) {
      return;
    }

    if (!props.draggabled) {
      return;
    }

    const occurrencePoint = calculatePointPercentagByArea(props.area, ev.clientX, ev.clientY);
    dragStart(occurrencePoint);
  }

  function handleMouseDown(ev: React.MouseEvent<HTMLDivElement>) {
    if (ev.button === MouseButton.Main) {
      handleMouseMainDown(ev);
    }
  }

  function handleMouseUp(ev: globalThis.MouseEvent) {
    if (ev.button === MouseButton.Main && dragged) {
      dragEnd();
    }
  }

  function handleMouseMove(ev: globalThis.MouseEvent) {
    if (!dragged) {
      return;
    }
    handleDrag(ev);
    ev.stopPropagation();
    ev.preventDefault();
    return false;
  }

  function subscribe() {
    document.addEventListener("mousemove", handleMouseMove, false);
    document.addEventListener("mouseup", handleMouseUp, false);
    if (dragged) {
      iFrameDisplayControl.disable();
    }

    if (overlayEl.current) {
      overlayEl.current.ondragstart = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
      }
    }
  }

  function unsubscribe() {
    document.removeEventListener("mousemove", handleMouseMove, false);
    document.removeEventListener("mouseup", handleMouseUp, false);
    iFrameDisplayControl.enable();

    if (overlayEl.current) {
      overlayEl.current.ondragstart = null;
    }
  }
}

const defaultProps: IOverlayProperties = {
  area: defaultArea,
  selectedPreviewType: 'web',
  horizontal: downcapOptions.defaultLocation.horizontal,
  vertical: downcapOptions.defaultLocation.vertical,
}

Overlay.defaultProps = defaultProps;

export default Overlay;
