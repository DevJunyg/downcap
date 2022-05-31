import * as store from 'storeV2';
import IArea from "IArea";
import Overlay from 'components/Overlay';
import DualCaptionOverlayLine from 'components/Overlay/DualCaptionOverlayLine';

interface IDualMultilineOverlayContainerProps {
  area?: IArea;
  fontUnitSize?: number;
  paragraphIndex?: number;
  caption?: store.IEventParagraph;
  defaultStyle?: store.ICaptionsStyle;
}

function DualMultilineOverlayContainer(props: IDualMultilineOverlayContainerProps) {
  let line = props.caption?.lines?.first();

  if (line === undefined) {
    return null;
  }

  if (props.caption === undefined) {
    return null;
  }

  return (
    <Overlay
      area={props.area}
      horizontal={props.caption?.horizontal}
      vertical={props.caption?.vertical}
    >
      {props.caption.lines.map((line, index) => (
        <DualCaptionOverlayLine
          key={`${props.paragraphIndex} - ${index}`}
          fontUnitSize={props.fontUnitSize}
          line={line}
        />
      ))}
    </Overlay>
  );
}

export default DualMultilineOverlayContainer;