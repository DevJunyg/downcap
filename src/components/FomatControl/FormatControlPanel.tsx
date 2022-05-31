import React from 'react';
import FormatControl from 'components/FomatControl';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import FormatControlTitleLine from 'components/FomatControl/FormatControlTitleLine';
import * as store from 'storeV2';
import { FontFormatType } from 'components/FomatControl/FormatTextGroup';
import { ColorChangeHandler } from 'react-color';
import downcapOptions from 'downcapOptions';

export interface IFormatControlCotainerProps {
  style?: store.ICaptionsStyle;
  selectedStyleEditType?: store.StyleEditType;
  locationChangeDisabled?: boolean;
  styleEditDisabled?: boolean;
  splitDisabled?: boolean;
  styleSelectDisabled?: boolean;
  captionStyleApplyBtnDisabled?: boolean;
  onStyleChange?: <T extends keyof store.ICaptionsStyle>(name: T, value: store.ICaptionsStyle[T]) => void;
  onApplyAllStylesButtonClick?: React.MouseEventHandler;
}

export default class FormatControlPanel extends React.Component<IFormatControlCotainerProps> {
  logger = ReactLoggerFactoryHelper.build(FormatControlPanel.name);

  changedStylePaser = (oringStyle: store.ICaptionsStyle, changedNames: Array<FontFormatType>) => {
    const targetNames = ['bold', 'italic', 'underline'] as Array<FontFormatType>;
    for (const name of targetNames) {
      const changeValue = changedNames.includes(name);

      if (oringStyle[name] !== changeValue) {
        return {
          name: name,
          value: changeValue
        };
      }
    }
  }

  handleFontFormatChange = (_event: any, styleNames: Array<FontFormatType>) => {
    const changedStyle = this.props.style && this.changedStylePaser(this.props.style, styleNames);
    if (changedStyle) {
      this.props.onStyleChange && this.props.onStyleChange(changedStyle.name, changedStyle.value);
    }
  }

  changeFontSize = (value: number) => {
    this.props.onStyleChange && this.props.onStyleChange('fontSize', Math.round(value * 100 / downcapOptions.defaultFontSize))
  }

  handleFontSizeChange: React.ChangeEventHandler<HTMLInputElement> = evt => {
    this.changeFontSize(evt.target.valueAsNumber);
  }

  handleFontSizeButtonClick = (evt: React.MouseEvent<SVGSVGElement>, value: number) => {
    const originFontSize = this.props.style?.fontSize ?? downcapOptions.defaultFontSize;
    const fontsize = Math.round(originFontSize / 100 * downcapOptions.defaultFontSize);
    this.changeFontSize(Math.max(0, fontsize + value));
  }

  handleFontSizeUpButtonClick: React.MouseEventHandler<SVGSVGElement> = evt => this.handleFontSizeButtonClick(evt, 1);
  handleFontSizDownButtonClick: React.MouseEventHandler<SVGSVGElement> = evt => this.handleFontSizeButtonClick(evt, -1);

  handleBackgroundChange: ColorChangeHandler = color => {
    this.props.onStyleChange && this.props.onStyleChange('background', color.rgb);
  }

  handleFontColorChange: ColorChangeHandler = evt => {
    this.props.onStyleChange && this.props.onStyleChange('color', evt.rgb);
  }

  handleFontChange: React.ChangeEventHandler<HTMLSelectElement> = evt => {
    const value = evt.target.value;

    this.props.onStyleChange && this.props.onStyleChange(
      'font',
      !Number.isNaN(Number(value)) ? Number.parseInt(value) : value
    );
  }

  handleFontOutlineChange: React.ChangeEventHandler<HTMLSelectElement> = evt => {
    this.props.onStyleChange && this.props.onStyleChange('outline', Number.parseInt(evt.target.value));
  }

  handleFontOutlineColorChange: ColorChangeHandler = evt => {
    this.props.onStyleChange && this.props.onStyleChange('outlineColor', evt.rgb);
  }

  render() {
    const style = this.props.style;
    const fontSize = style?.fontSize !== undefined
      ? Math.round(style.fontSize / 100 * downcapOptions.defaultFontSize)
      : downcapOptions.defaultFontSize;

    const font = style?.font;
    let formats: FontFormatType[] = [];
    if (style?.bold) formats.push('bold');
    if (style?.italic) formats.push('italic');
    if (style?.underline) formats.push('underline');

    return (
      <div className='styles-control-context-item'>
        <FormatControlTitleLine
          applyAllStylesButtonDisalbed={this.props.styleEditDisabled}
          styleSelectDisabled={this.props.styleSelectDisabled}
          splitDisabled={this.props.splitDisabled}
          onApplyAllStylesButtonClick={this.props.onApplyAllStylesButtonClick}
        />
        <FormatControl
          disabled={this.props.styleEditDisabled}
          selectedStyleEditType={this.props.selectedStyleEditType}
          fontSize={fontSize}
          background={style?.background}
          color={style?.color}
          font={font}
          formats={formats}
          outline={style?.outline}
          outlineColor={style?.outlineColor}
          locationChangeDisabled={this.props.locationChangeDisabled}
          onFontSizeChange={this.handleFontSizeChange}
          onFontSizeUpButtonClick={this.handleFontSizeUpButtonClick}
          onFontSizeDonwButtonClick={this.handleFontSizDownButtonClick}
          onFontFormatChange={this.handleFontFormatChange}
          onFontColorChange={this.handleFontColorChange}
          onFontBackgroundChange={this.handleBackgroundChange}
          onFontChange={this.handleFontChange}
          onFontOutlineChange={this.handleFontOutlineChange}
          onFontOutlineColorChange={this.handleFontOutlineColorChange}
        />
      </div>
    )
  }
}