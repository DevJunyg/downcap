import YoutubeCaption from "models/YoutubeCaption";
import CaptionLoadHelpMessage from "./CaptionLoadHelpMessage";
import CaptionNotFound from "./CaptionNotFound";


interface ICaptionLoadInfoProps {
  captionDoesNotExist?: boolean;
  captions?: YoutubeCaption[];
  onClick?: React.MouseEventHandler<HTMLSpanElement>;
}

export default function CaptionLoadInfo(props: ICaptionLoadInfoProps) {
  return (
    <>
      {!props.captions && <CaptionLoadHelpMessage onClick={props.onClick} />}
      {props.captionDoesNotExist && <CaptionNotFound />}
    </>
  )
}