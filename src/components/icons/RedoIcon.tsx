import { faRedo } from "@fortawesome/pro-solid-svg-icons";
import FontAwesomeProIcon, { FontAwesomeIconProProps } from "FontAwesomeProIcon";
import React from "react";

function RedoIcon(props: Omit<FontAwesomeIconProProps, "icon"> & { disabled?: boolean }) {
  return (
    <FontAwesomeProIcon {...props} icon={faRedo} />
  );
}

export default React.memo(RedoIcon);