//@ts-check
import React from 'react';
// eslint-disable-next-line 
import IIdPreset from 'IIdPreset';

import './PresetPanel.scss';
import PresetItems from '../PresetItems';
import { withTranslation } from 'react-i18next';

/**
 * @typedef {object} Props
 * @property {boolean} [saveDisabled]
 * @property {IIdPreset[] | undefined} [customPresets]
 * @property {IIdPreset[] | undefined} [recommendPresets]
 * @property {React.MouseEventHandler} [onCustomPresetSaveClick]
 * @property {(evt: React.MouseEvent<HTMLDivElement, MouseEvent>, index: number) => void} [onPresetRemoveClick]
 * @property {(evt: React.MouseEvent<HTMLDivElement, MouseEvent>, preset: IIdPreset) => void} [onPresetClick]
 * 
 * @typedef {import('react-i18next').WithTranslation & Props} PresetPanelProps
 * 
 * @extends {React.Component<PresetPanelProps> }
 * 
 */
class PresetPanel extends React.Component  {
  render() {
    return (
      <div className="preset-cotent" >
        <div className="preset-content-column">
          <div className="preset-content-context">
            <div className='styles-control-context-item-title' style={{ marginTop: 0 }}>
              <h4>{this.props.t('recommendedStyle')}</h4>
            </div>
          </div>
          <PresetItems readonly
            presets={this.props.recommendPresets}
            onClick={this.props.onPresetClick}
          />
        </div >
        <div className="preset-content-column">
          <div className="preset-content-context">
            <div className='styles-control-context-item-title' style={{ marginTop: 0 }}>
              <div>
                <h4>{this.props.t('userStyle')}</h4>
              </div>
            </div>
            <div
              className='MuiButtonBase-root preset-save'
              onClick={!this.props.saveDisabled ? this.props.onCustomPresetSaveClick : undefined}
            >
              <img src="https://downcap.net/client/img/style_save_button.png" alt="StyleSaveButton" />
              <span>{this.props.t('saveStyle')}</span>
            </div>
          </div>
          <PresetItems
            presets={this.props.customPresets}
            onClick={this.props.onPresetClick}
            onRemoveClick={this.props.onPresetRemoveClick}
          />
        </div >
      </div>
    )
  }
}

export default withTranslation('PresetStyle')(PresetPanel);
