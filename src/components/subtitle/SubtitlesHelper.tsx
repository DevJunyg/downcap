import React from "react";
import ControlButtons from "./ControlButtons";
import AddCaptionButton from "./ControlButtons/AddCaptionButton";
import CombineButton from "./ControlButtons/CombineButton";

export interface ISubtitlesHelper {
  addCaptionButtonRendered?: boolean;
  combineButtonRendered?: boolean;
  onCaptionAddClick?: React.MouseEventHandler<HTMLDivElement>;
  onCombineButtonClick?: React.MouseEventHandler<HTMLDivElement>;
  combineOptions?: React.HTMLAttributes<HTMLDivElement>;
}

export function SubtitlesHelper(props: ISubtitlesHelper) {
  return (
    <ControlButtons>
      {props.addCaptionButtonRendered && <AddCaptionButton onClick={props.onCaptionAddClick} />}
      {props.combineButtonRendered && <CombineButton onClick={props.onCombineButtonClick} {...props.combineOptions} />}
    </ControlButtons>
  )
}