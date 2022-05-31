import React from 'react';
import * as store from "storeV2";
import './VideoExportSettingPopup.scss'
import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import { WithTranslation, withTranslation } from 'react-i18next';

export interface IVideoExportSettingPopupProperties {
  originDisabled: boolean;
  translatedDisabled: boolean;
  dualDisabled: boolean;
  VideoExportLanguage?: store.EditType;
  onCloseClick?: React.MouseEventHandler<HTMLDivElement>;
  onAcceptClick: React.MouseEventHandler<HTMLDivElement>;
  onSelectLangugeChange: (evt: React.ChangeEvent<HTMLInputElement>, value: store.EditType) => void;
}

class VideoExportSettingPopup extends React.Component<IVideoExportSettingPopupProperties & WithTranslation> {
  render() {
    const {
      VideoExportLanguage,
      originDisabled,
      translatedDisabled,
      dualDisabled,
      onCloseClick,
      onAcceptClick,
      onSelectLangugeChange,
      t
    } = this.props;

    const cursorStyle: Array<React.CSSProperties> = [
      { cursor: originDisabled ? 'default' : 'pointer' },
      { cursor: translatedDisabled ? 'default' : 'pointer' },
      { cursor: dualDisabled ? 'default' : 'pointer' }
    ];

    return (
      <AcceptCancelPopup closePressedOutside
        title={t('title')}
        closeContent={t('closeContent')}
        acceptContent={t('acceptContent')}
        onCancelClick={onCloseClick}
        onCloseClick={onCloseClick}
        onAcceptClick={onAcceptClick}
      >
        <div className="rendering-popup-contents center">
          <div className="rendering-popup-message">
            <div className="select-box">
              <label className="content-title">
                {t('selectCaptionLanguage')}
              </label>
              <div className="selectable-elements middle-line">
                <div className="select-element">
                  <input
                    type="radio"
                    name="rendering-language"
                    id="origin"
                    value="origin"
                    onChange={evt => onSelectLangugeChange(evt, 'origin')}
                    checked={VideoExportLanguage === "origin"}
                    disabled={originDisabled}
                    style={cursorStyle[0]}
                  />
                  <label htmlFor="origin" style={cursorStyle[0]}>
                    {t('ko')}
                  </label>
                </div>
                <div className="select-element">
                  <input
                    type="radio"
                    name="rendering-language"
                    id="translated"
                    value="translated"
                    onChange={evt => onSelectLangugeChange(evt, 'translated')}
                    checked={VideoExportLanguage === "translated"}
                    disabled={translatedDisabled}
                    style={cursorStyle[1]}
                  />
                  <label htmlFor="translated" style={cursorStyle[1]}>
                    {t('en')}
                  </label>
                </div>
                <div className="select-element">
                  <input
                    type="radio"
                    name="rendering-language"
                    id="dual"
                    value="dual"
                    onChange={evt => onSelectLangugeChange(evt, 'dual')}
                    checked={VideoExportLanguage === "dual"}
                    disabled={dualDisabled}
                    style={cursorStyle[2]}
                  />
                  <label htmlFor="dual" style={cursorStyle[2]}>
                    {t('dual')}
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </AcceptCancelPopup>
    );
  }
}

export default withTranslation('VideoExportSettingPopup')(VideoExportSettingPopup);