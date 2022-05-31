import React from "react";
import MultiLineTitle from "./MultilineTitle";
import MultiLineTitleBar from "./MultilineTitleBar";
import MultiLineTitleOptions from "./MultilineTitleOptions";

export interface IMultiLineTitleBarDefaultTypeProps {
  onCreateButtonClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function MultiLineTitleBarDefaultType(props: IMultiLineTitleBarDefaultTypeProps) {
  return (
    <MultiLineTitleBar>
      <MultiLineTitle />
      <MultiLineTitleOptions
        onCreateButtonClick={props.onCreateButtonClick}
      />
    </MultiLineTitleBar>
  )
}

export default React.memo<IMultiLineTitleBarDefaultTypeProps>(MultiLineTitleBarDefaultType);