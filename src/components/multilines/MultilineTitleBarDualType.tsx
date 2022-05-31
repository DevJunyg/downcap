import React from "react";
import MultiLineTitle from "./MultilineTitle";
import MultiLineTitleBar from "./MultilineTitleBar";

function MultiLineTitleBarDualType() {
  return (
    <MultiLineTitleBar>
      <MultiLineTitle />
    </MultiLineTitleBar>
  )
}

export default React.memo(MultiLineTitleBarDualType);