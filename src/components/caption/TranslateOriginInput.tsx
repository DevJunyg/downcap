import AutoResizeTextarea from "components/common/AutoResizeTextarea";
import { ISelection } from "models/ISelection";
import React from "react";
import OriginToTranslatedButton from "./OriginToTranslatedButton";

interface ITranslateOriginInputProps {
  selection?: ISelection;
  value?: string;
  displayedButton?: boolean;
  onButtonClick?: React.MouseEventHandler;
  onChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onFocus?: React.FocusEventHandler<HTMLTextAreaElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLTextAreaElement>;
}

function TranslateOriginInput(props: ITranslateOriginInputProps) {
  const autoResizeTextareaRef = React.useRef<AutoResizeTextarea>(null);
  const renderedButton = props.displayedButton && (
    <OriginToTranslatedButton
      onMouseDown={props.onButtonClick}
    />
  );

  React.useEffect(_focuseEffect, [props.selection])

  return (
    <div className="ko-origin">
      <AutoResizeTextarea
        ref={autoResizeTextareaRef}
        value={props.value}
        onChange={props.onChange}
        onFocus={props.onFocus}
        onKeyDown={props.onKeyDown}
      />
      {renderedButton}
    </div>
  )

  function _focuseEffect() {
    if (!props.selection) {
      return;
    }

    const autoResizeTextarea = autoResizeTextareaRef.current;
    if (!autoResizeTextarea?.textareaRef) {
      return;
    }

    autoResizeTextarea.textareaRef.focus();
    autoResizeTextarea.textareaRef.selectionStart = props.selection.start;
    autoResizeTextarea.textareaRef.selectionEnd = props.selection.end;
  }
}

export default TranslateOriginInput;