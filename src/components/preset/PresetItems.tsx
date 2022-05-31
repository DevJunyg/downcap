import IIdPreset from "IIdPreset";
import React from "react";
import PresetItem from "./PresetItem";

interface IPresetItemsProps {
  presets?: IIdPreset[]
  readonly?: boolean;
  onClick?: (evt: React.MouseEvent<HTMLDivElement>, preset: IIdPreset) => void;
  onRemoveClick?: (evt: React.MouseEvent<HTMLDivElement>, index: number) => void;
}

function PresetItems(props: IPresetItemsProps) {
  const content = props.presets?.map((item, index) => {
    return (
      <PresetItem readonly={props.readonly}
        key={item.id}
        preset={item}
        index={index}
        onClick={props.onClick}
        onRemoveClick={props.onRemoveClick}
      />
    )
  })

  return (
    <div className="styles-control-context-items">
      {content}
    </div>
  )
}

export default React.memo<IPresetItemsProps>(PresetItems, (prevProps, nextProps) => {
  return prevProps.presets === nextProps.presets
    && prevProps.readonly === nextProps.readonly
    && prevProps.onClick === nextProps.onClick
    && prevProps.onRemoveClick === nextProps.onRemoveClick
});