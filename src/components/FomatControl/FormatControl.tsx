
import React from 'react';
import FormatTextGroup, { FontFormatType } from './FormatTextGroup';
import FontColor from './FontColor';
import FontSize from './FontSize';
import FontBackgroundColor from './FontBackgroundColor';
import FontSelect from './FontSelect';
import FontOutlineSelect from './FontOutlineSelect';
import FontOutlineColor from './FontOutlineColor';
import { ColorChangeHandler } from 'react-color';
import { IRGBA } from 'models';
import * as store from 'storeV2';
import LocationButtonsContainer from 'containers/LocationButtonsContainer';
import './FormatControl.scss';

const groupStyle = { marginBottom: '10px' };

interface IFormatControlProps {
  disabled?: boolean;
  fontSize?: number;
  locationChangeDisabled?: boolean;
  formats: readonly FontFormatType[];
  outline?: number;
  outlineColor?: IRGBA;
  background?: IRGBA;
  color?: IRGBA;
  font?: number | string;
  selectedStyleEditType?: store.StyleEditType;
  onFontOutlineColorChange: ColorChangeHandler;
  onFontColorChange: ColorChangeHandler;
  onFontBackgroundChange: ColorChangeHandler;
  onFontOutlineChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onFontChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onFontFormatChange?: (evt: React.MouseEvent, value: any) => void;
  onFontSizeDonwButtonClick?: React.MouseEventHandler<SVGSVGElement>;
  onFontSizeUpButtonClick?: React.MouseEventHandler<SVGSVGElement>;
  onFontSizeChange?: React.ChangeEventHandler<HTMLInputElement>;
}

const FormatControl = (props: IFormatControlProps) => {
  const selectedLine = props.selectedStyleEditType === "line";

  return (
    <div className="format-control-style">
      <div role="group" className="MuiToggleButtonGroup-root style-group" style={groupStyle}>
        <FormatTextGroup
          disabled={props.disabled}
          value={props.formats}
          onChange={props.onFontFormatChange}
        />
        <FontColor
          disabled={props.disabled}
          color={props.color}
          onChange={props.onFontColorChange}
        />
        <FontOutlineSelect
          disabled={props.disabled}
          value={props.outline}
          onChange={props.onFontOutlineChange}
        />
        <FontOutlineColor
          disabled={props.disabled}
          color={props.outlineColor}
          onChange={props.onFontOutlineColorChange}
        />
        <FontBackgroundColor
          disabled={!selectedLine || props.disabled}
          color={props.background}
          onChange={props.onFontBackgroundChange}
        />
        <FontSize
          disabled={!selectedLine || props.disabled}
          value={props.fontSize}
          onChange={props.onFontSizeChange}
          onDownClick={props.onFontSizeDonwButtonClick}
          onUpClick={props.onFontSizeUpButtonClick}
        />
        <FontSelect
          disabled={!selectedLine || props.disabled}
          value={props.font}
          onChange={props.onFontChange}
        />
        <LocationButtonsContainer />
      </div>
    </div>
  )
}

export default FormatControl;
