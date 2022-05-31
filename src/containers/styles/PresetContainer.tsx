import React from 'react';
import Presets from 'Presets';
import PresetPanel from 'components/preset/PresetPanel';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import { IsNumber } from 'lib/utils';
import IIdPreset from 'IIdPreset';
import * as store from 'storeV2';
import * as windows from 'lib/windows';
import ClientAnalysisService from 'services/ClientAnalysisService';

const toInt = (value: number | string) => typeof value === "string" && IsNumber(value)
  ? Number.parseInt(value)
  : value;

export interface IPresetContainerProps {
  selectedStyleEditType?: store.StyleEditType;
  style?: store.ICaptionsStyle;
  onPresetClick?: (evt: React.MouseEvent<HTMLDivElement>, preset: IIdPreset) => void;
}

interface IPresetContainerState {
  customPresets?: IIdPreset[];
  recommandPresets?: IIdPreset[];
}

export default class PresetContainer extends React.Component<IPresetContainerProps, IPresetContainerState> {
  static presetToWordPreset(preset: IIdPreset) {
    let { background, font, fontSize, ...wordPreset } = preset;
    return wordPreset;
  }

  logger = ReactLoggerFactoryHelper.build("PresetContainer");
  state: IPresetContainerState = {}

  presets = {
    recommend: {
      word: [] as IIdPreset[],
      line: [] as IIdPreset[]
    },
    custom: {
      word: [] as IIdPreset[],
      line: [] as IIdPreset[]
    }
  }

  setCustomPresets = (presets: IIdPreset[]) => this.setState(state => ({
    ...state,
    customPresets: [...presets]
  }));

  setRecommandPresets = (presets: IIdPreset[]) => this.setState(state => ({
    ...state,
    recommandPresets: [...presets]
  }));

  handelCustomPresetDeleteClick = (evt: React.MouseEvent<HTMLDivElement>, index: number) => {
    const nextCustomPresets = [...this.presets.custom.line];
    nextCustomPresets.splice(index, 1)

    const nextCustomWordPreset = nextCustomPresets.map(PresetContainer.presetToWordPreset);
    this.presets.custom = {
      line: nextCustomPresets,
      word: nextCustomWordPreset
    };

    const wordSelected = this.props.selectedStyleEditType === 'word';
    if (wordSelected) {
      this.setCustomPresets(nextCustomWordPreset);
    } else {
      this.setCustomPresets(nextCustomPresets);
    }

    windows.customPresetsSave(nextCustomPresets);
  }

  handleCustomPresetSaveClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    ClientAnalysisService.saveMyStyleClick();

    const style = this.props.style;
    if (!style) {
      return;
    }

    const customPreset: IIdPreset = {
      ...style,
      id: ((this.state.customPresets && this.state.customPresets[0]?.id) ?? 1) + 1
    };

    const presetKeys = Object.keys(customPreset) as (keyof IIdPreset)[];
    presetKeys.forEach(key => customPreset[key] === undefined && delete customPreset[key]);
    const newCustomPresets = [customPreset, ...this.presets.custom.line];

    const newCustomWordPreset = newCustomPresets.map(PresetContainer.presetToWordPreset);
    this.presets.custom = {
      line: newCustomPresets,
      word: newCustomWordPreset
    };

    const wordSelected = this.props.selectedStyleEditType === 'word';
    if (wordSelected) {
      this.setCustomPresets(newCustomWordPreset);
    } else {
      this.setCustomPresets(newCustomPresets);
    }

    windows.customPresetsSave(newCustomPresets);
  }

  async componentDidMount() {
    try {
      const customPresetsLoadTask = windows.customPresetsLoadAsync() as Promise<IIdPreset[]>;
      const wordSelected = this.props.selectedStyleEditType === 'word';

      const wordRecommendStyle = Presets.map(PresetContainer.presetToWordPreset);
      this.presets.recommend = {
        line: [...Presets],
        word: wordRecommendStyle
      }

      if (wordSelected) {
        this.setRecommandPresets(wordRecommendStyle);
      } else {
        this.setRecommandPresets(this.presets.recommend.line);
      }

      const customPresets = await customPresetsLoadTask;
      customPresets.forEach(preset => {
        preset.outline = toInt(preset.outline as number | string) as number;
        preset.font = toInt(preset.font as number | string)
      });

      const customWordPresets = customPresets.map(PresetContainer.presetToWordPreset);

      this.presets.custom = {
        line: customPresets,
        word: customWordPresets
      };

      if (wordSelected) {
        this.setCustomPresets(customWordPresets);
      } else {
        this.setCustomPresets(customPresets);
      }
    } catch (err) {
      try {
        err instanceof Error && this.logger.logWarning('Preste load error', err);
      } catch {
        this.logger.logWarning('Preset load failed unknown err');
      }
    }
  }

  componentDidUpdate(prevProps: IPresetContainerProps) {
    if (this.props.selectedStyleEditType !== prevProps.selectedStyleEditType) {
      const wordSelected = this.props.selectedStyleEditType === 'word';
      if (wordSelected) {
        this.setRecommandPresets(this.presets.recommend.word);
        this.setCustomPresets(this.presets.custom.word);
      } else {
        this.setRecommandPresets(this.presets.recommend.line);
        this.setCustomPresets(this.presets.custom.line);
      }
    }
  }

  render() {
    return (
      <PresetPanel
        saveDisabled={this.props.style === undefined}        
        customPresets={this.state.customPresets}
        recommendPresets={this.state.recommandPresets}
        onCustomPresetSaveClick={this.handleCustomPresetSaveClick}
        onPresetClick={this.props.onPresetClick}
        onPresetRemoveClick={this.handelCustomPresetDeleteClick}
      />
    );
  }
}