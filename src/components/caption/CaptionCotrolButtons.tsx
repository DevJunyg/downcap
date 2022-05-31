import AddCaptionButton from "components/subtitle/ControlButtons/AddCaptionButton";
import CombineButton from "components/subtitle/ControlButtons/CombineButton";

interface ICaptionCotrolButtonsProps {
  reverse?: boolean;
  addCaptionButtonRendered?: boolean;
  combineButtonRendered?: boolean;
  onCaptionAddClick?: React.MouseEventHandler<HTMLDivElement>;
  onCombineButtonClick?: React.MouseEventHandler<HTMLDivElement>;
}

function CaptionCotrolButtons(props: ICaptionCotrolButtonsProps) {
  return (
    <div className='subtitles-control-buttons'>
      {props.addCaptionButtonRendered && <AddCaptionButton onClick={props.onCaptionAddClick} />}
      {props.combineButtonRendered && <CombineButton reverse={props.reverse} onClick={props.onCombineButtonClick} />}
    </div>
  )
}

export default CaptionCotrolButtons;

