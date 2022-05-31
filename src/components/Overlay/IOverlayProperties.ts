import { ICaptionEventMeta } from "components/caption/CaptionInput";
import IArea from "IArea";
import IPoint from "IPoint";
import { PreviewType } from 'storeV2';
export default interface IOverlayProperties extends React.HTMLAttributes<HTMLDivElement> {
  /** A rectangular area with width and height direction based on top and right on x, y starting from the bottom left. */
  area?: IArea;
  selectedPreviewType: PreviewType;
  horizontal: number;
  vertical: number;
  draggabled?: boolean;
  meta?: ICaptionEventMeta;
  onLocationChangeEnd?: (location: IPoint, meta?: ICaptionEventMeta) => void;
  onMouseDown?: React.MouseEventHandler<HTMLDivElement>;
  onClickCapture?: (evt: React.MouseEvent<HTMLDivElement>, meta?: ICaptionEventMeta) => void;
}