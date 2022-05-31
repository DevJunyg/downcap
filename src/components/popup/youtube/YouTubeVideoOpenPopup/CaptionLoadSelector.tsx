import YoutubeCaption from "models/YoutubeCaption";
import CaptionOptions from "./CaptionOptions";

interface ICaptionLoadSelectorProps {
  captions?: YoutubeCaption[];
  onChange?: React.ChangeEventHandler<HTMLSelectElement>;

}

export default function CaptionLoadSelector(props: ICaptionLoadSelectorProps) {
  return (
    <select onChange={props.onChange}>
      <CaptionOptions captions={props.captions} />
    </select>
  )
}