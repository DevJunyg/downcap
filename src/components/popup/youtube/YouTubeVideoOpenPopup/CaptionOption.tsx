import YoutubeCaption from "models/YoutubeCaption";
import { Languages } from 'lib/Languages';

interface ICpationsOptionProps {
  caption: YoutubeCaption
}

export default function CaptionOption(props: ICpationsOptionProps) {
  const lang = Languages[props.caption.snippet.language];
  const captionLanguage = lang ?? props.caption.snippet.language;
  const captionName = `${captionLanguage}-${props.caption.snippet.name}`;
  const displayValue = props.caption.snippet.name ? captionName : captionLanguage;

  return <option value={props.caption.id}>{displayValue}</option>
}
