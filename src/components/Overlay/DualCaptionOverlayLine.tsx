import downcapOptions from "downcapOptions";
import { rgbaToString } from "lib/utils";
import React from "react";
import { IEventLine, PreviewType } from "storeV2";
import StyleParser from "StyleParser";

interface IDualCaptionOverlayLineProps {
  line?: IEventLine;
  fontUnitSize?: number;
  selectedPreviewType?: PreviewType;
}

function DualCaptionOverlayLine(props: IDualCaptionOverlayLineProps) {
  const lineStyle = {
    ...props.line!.style,
  }

  const labels = props.line?.words?.map((word, index) => {
    const style = StyleParser.wordStyleParse({
      ...lineStyle,
      ...word.style,
    }, props.selectedPreviewType);

    return (
      <span key={index} className='affter-space' >
        <label style={style}>{word.text}</label>
      </span>
    )
  });

  const background = StyleParser.backgroundParse(lineStyle.background, props.selectedPreviewType);

  return (
    <div className="text-center">
      <div style={{
        display: "inline-block",
        fontSize: props.fontUnitSize ?? downcapOptions.defaultFontSize,
        background: background && rgbaToString(background)
      }}>
        {labels}
      </div>
    </div>
  )
}

export default React.memo(DualCaptionOverlayLine, (prevProps, nextProps) => {
  return prevProps.line === nextProps.line
    && prevProps.fontUnitSize === nextProps.fontUnitSize
    && prevProps.selectedPreviewType === nextProps.selectedPreviewType
});