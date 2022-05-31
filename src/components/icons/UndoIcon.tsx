import { faUndo } from "@fortawesome/pro-solid-svg-icons";
import FontAwesomeProIcon, { FontAwesomeIconProProps } from "FontAwesomeProIcon";
import React from "react";

function UndoIcon(props: Omit<FontAwesomeIconProProps, "icon"> & { disabled?: boolean }) {
  return (
    <FontAwesomeProIcon {...props} icon={faUndo} />
  );
}

export default React.memo(UndoIcon);