import React, { CSSProperties, useRef, useState, useEffect } from 'react';
import MouseButton from 'MouseButton';
import FaderHintProperties from './FaderHintProperties';
import FaderProperties from './FaderProperties';
import LineProperties from './LineProperties';
import SliderBarProps from './SliderBarProps';
import IFrameDisplayControl from 'IFrameDisplayControl';

const ColorResources = {
  "Default_Slider_Line_Background_Color": "#D6D6D6",
  "Disable_Slider_Line_Background_Color": "#D6D6D6",
  "Active_Slider_Line_Color": "#29ABE2",
  "Deactive_Slider_Line_Color": "#7A7A7A",
};

function InnerLine(props: LineProperties) {
  const { lineColor, per } = props;
  function BuildStyleByActive(): CSSProperties {
    return {
      position: 'absolute',
      width: 'inherit',
      height: `${(per ?? 0) * 100}%`,
      background: lineColor,
      bottom: 0,
      borderRadius: "2px"
    }
  }

  const style = BuildStyleByActive()

  return <div style={style} draggable={false}></div>;
}

function Line(props: LineProperties) {
  const { backgroundColor, ...rest } = props;
  const lineStyle: CSSProperties = {
    width: 'inherit',
    height: 'inherit',
    backgroundColor: backgroundColor,
    borderRadius: "2px"
  }

  return (
    <div style={lineStyle} draggable={false}>
      <InnerLine {...rest} />
    </div>
  )
}

function FaderHint(props: FaderHintProperties) {
  const { style, value, isDisplay } = props;
  const hint: React.RefObject<HTMLDivElement> = useRef(null);
  const animeDt = 300;
  const display = style?.display ?? "initial";

  useEffect(() => {
    let _id: NodeJS.Timeout | null = null;

    function ClearTimeout() {
      if (_id === null) {
        return;
      }

      clearTimeout(_id);
      _id = null;
    }

    if (!hint.current) {
      throw new Error("Hint not loaded yet");
    }

    ClearTimeout();
    const dom = hint.current;
    if (!isDisplay) {
      dom.animate([
        { "opacity": 1 },
        { "opacity": 0 }
      ], {
        duration: animeDt,
      })
      _id = setTimeout(() => dom.style.display = "none", animeDt - 20);
    }
    else {
      dom.style.display = display;
      dom.style.opacity = "1";
    }

    return () => {
      ClearTimeout();
    }
  })

  return <div
    className="user-select-none"
    ref={hint}
    style={{
      position: "absolute",
      cursor: "default",
      transform: "translate(-110%, -50%)",
      boxSizing: "border-box",
      ...style,
      zIndex: 10020,
      display: "none"
    }}>{Math.round(value ?? 0)}</div>
}

const Fader = React.forwardRef<HTMLDivElement, FaderProperties>((props, ref) => {
  const style: CSSProperties = {
    ...props.style,
    position: "absolute",
    transform: "translate(-15%, 50%)"
  }

  return (
    <div ref={ref}
      style={style} draggable={false}>{props.children}</div>
  );
});


function Track(props: SliderBarProps) {
  const { width, heigth, faderProperties, faderHintPropertie, lineColor, value, min, max, style, backgroundColor, onChange } = props;
  const track: React.RefObject<HTMLDivElement> = useRef(null);
  const faderEl: React.RefObject<HTMLDivElement> = useRef(null);
  const iFrameDisplayControl = new IFrameDisplayControl();

  const [dragged, setDragged] = useState(false);
  const [faderHintDisplayed, setFaderHintDisplayed] = useState(false);

  function CalculateYOffsetByMouseY(py: number) {
    if (!track.current || !faderEl.current) {
      return 0;
    }

    const { top } = track.current.getBoundingClientRect();
    const offsetHeight = track.current.offsetHeight;
    const faderHeight = faderEl.current.offsetHeight;

    let offsetY = py - top + (faderHeight / 2);
    if (offsetY < 0) offsetY = 0;
    else if (offsetHeight < offsetY) offsetY = offsetHeight;
    return 1 - (offsetY / offsetHeight);
  }

  function setFaderY(position: number) {
    if (!faderEl.current) {
      return 0;
    }
    position = 1 - position;
    const { current } = faderEl;
    const height = current.offsetHeight;

    faderEl.current.style.top = `calc(${position * 100}% - ${height}px)`;
  }

  function SetValue(per: number) {
    if (onChange) onChange(per * (max! - min!));
    setFaderY(per);
  }

  function handleDrag(ev: globalThis.MouseEvent) {
    const per = CalculateYOffsetByMouseY(ev.y);
    SetValue(per);
  }

  function handleMouseMainDown(ev: React.MouseEvent<HTMLDivElement>) {
    const per = CalculateYOffsetByMouseY(ev.clientY);
    SetValue(per);
    DragStart();
  }

  function handleMouseDown(ev: React.MouseEvent<HTMLDivElement>) {
    if (ev.button === MouseButton.Main) {
      handleMouseMainDown(ev);
      ev.preventDefault();
      return false;
    }
  }

  function DragStart() {
    if (dragged) {
      return;
    }

    setDragged(true);
    setFaderHintDisplayed(true);
    iFrameDisplayControl.disable();
  }

  function DragEnd() {
    setDragged(false);
    setFaderHintDisplayed(false);
    iFrameDisplayControl.enable();
  }

  function handleMouseUp(ev: globalThis.MouseEvent) {
    if (ev.button === MouseButton.Main && dragged) {
      DragEnd();
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
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp, false);
    if (dragged) iFrameDisplayControl.disable();

    if (faderEl.current) {
      faderEl.current.ondragstart = (ev) => {
        ev.preventDefault();
        ev.stopPropagation();
        return false;
      }
    }
  }

  function unsubscribe() {
    document.removeEventListener("mousemove", handleMouseMove);
    document.removeEventListener("mouseup", handleMouseUp, false);
    iFrameDisplayControl.enable();

    if (faderEl.current) {
      faderEl.current.ondragstart = null;
    }
  }
  let percent = (value - min!) / max!;
  const lineProperties: LineProperties = {
    backgroundColor: backgroundColor,
    per: percent,
    lineColor: lineColor,
  }
  faderHintPropertie!.value = value;

  useEffect(() => {
    subscribe();
    setFaderY(percent);

    return unsubscribe;
  });

  return (
    <div
      onMouseDown={handleMouseDown}
      style={{
        ...style,
        position: 'sticky',
        width: width,
        height: heigth,
      }}
      draggable={false}
      ref={track}>
      <Line {...lineProperties} />
      <Fader ref={faderEl} {...faderProperties}  >
        <FaderHint {...faderHintPropertie} isDisplay={faderHintDisplayed} />
      </Fader>
    </div>
  )
}

function InactiveTrack(props: SliderBarProps) {
  const { width, heigth, style, lineColor, backgroundColor } = props;

  const lineProperties: LineProperties = {
    per: 0,
    lineColor: lineColor ?? ColorResources.Deactive_Slider_Line_Color,
  }

  return (
    <div draggable={false}
      style={{
        ...style,
        backgroundColor: backgroundColor ?? ColorResources.Default_Slider_Line_Background_Color,
        position: 'sticky',
        width: width,
        height: heigth,
      }}>
      <Line {...lineProperties} />
    </div>
  )
}


function SliderBar(props: SliderBarProps) {
  const { disabled, ...rest } = props;
  const RenderTrack = disabled ? InactiveTrack : Track;

  return <RenderTrack {...rest} />
}

// after default value setting

let silderbarDefaultValue = 50;
function handleSilderbardDefaultChange(value: number) {
  silderbarDefaultValue = value;
}

const defaultProps: SliderBarProps = {
  value: silderbarDefaultValue,
  max: 100,
  min: 0,
  width: 13,
  heigth: 95,
  disabled: false,
  lineColor: ColorResources.Active_Slider_Line_Color,
  backgroundColor: ColorResources.Default_Slider_Line_Background_Color,
  faderProperties: {
    style: {
      width: "19px",
      height: "7px",
      background: "#FFFFFF",
      border: "1px solid #D6D6D6",
      boxSizing: "border-box",
      borderRadius: "2px",
      cursor: "pointer"
    }
  },
  faderHintPropertie: {
    style: {
      alignItems: "center",
      display: "flex",
      width: "30px",
      height: "20px",
      background: "#FFF",
      textAlign: "center",
      border: "1px solid #D6D6D6",
      boxSizing: "border-box",
      boxShadow: "0px 1px 2px rgba(0, 0, 0, 0.25)",
      justifyContent: "center"
    },
  },
  onChange: handleSilderbardDefaultChange
}

SliderBar.defaultProps = defaultProps;

export default SliderBar;