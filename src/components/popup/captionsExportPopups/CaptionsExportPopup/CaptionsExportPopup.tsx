import React from "react";
import "./CaptionsExportPopup.scss";
import AcceptCancelPopup from "components/common/PopUp/AcceptCancelPopup";
import ExportLanguage from 'ExportLanguage';
import { WithTranslation, withTranslation } from "react-i18next";

interface ICaptionsExportPopupProps extends WithTranslation {
  exportLanguage?: string;
  format?: string;
  xml?: string;
  enIsEmptyOrNull?: boolean;
  onAcceptClick: React.MouseEventHandler;
  onCloseClick?: React.MouseEventHandler;
  onExportLanguageChange: React.ChangeEventHandler<HTMLInputElement>
  onFormatChange: React.ChangeEventHandler<HTMLInputElement>
  onXmlChange: React.ChangeEventHandler<HTMLSelectElement>
}

class CaptionsExportPopup extends React.Component<ICaptionsExportPopupProps> {
  render() {
    const {
      exportLanguage,
      format,
      xml,
      enIsEmptyOrNull,
      onAcceptClick,
      onCloseClick,
      onExportLanguageChange,
      onFormatChange,
      onXmlChange,
      t
    } = this.props;

    const cursorStyle: React.CSSProperties = enIsEmptyOrNull
      ? { cursor: "default" }
      : { cursor: "pointer" };

    return (
      <AcceptCancelPopup closePressedOutside
        title={t('title')}
        onAcceptClick={onAcceptClick}
        onCancelClick={onCloseClick}
        onCloseClick={onCloseClick}
        acceptContent={t('acceptContent')}
        closeContent={t('closeContent')}
      >
        <div className="export-contents">
          <label className="content-title">{t('lnguage_Type_Select_Title')}</label>
          <div className="select-box">
            <div className="selectable-elements middle-line">
              <div className="select-element">
                <input
                  type="radio"
                  name="export-language"
                  id={ExportLanguage.origin}
                  value={ExportLanguage.origin}
                  onChange={onExportLanguageChange}
                  checked={exportLanguage === ExportLanguage.origin}
                />
                <label htmlFor={ExportLanguage.origin}>{t('lnguage_Type_Select_Ko')}</label>
              </div>
              <div className="select-element" style={cursorStyle}>
                <input
                  type="radio"
                  name="export-language"
                  id={ExportLanguage.translated}
                  value={ExportLanguage.translated}
                  onChange={onExportLanguageChange}
                  checked={exportLanguage === ExportLanguage.translated}
                  disabled={enIsEmptyOrNull}
                  style={cursorStyle}
                />
                <label htmlFor={ExportLanguage.translated}>{t('lnguage_Type_Select_En')}</label>
              </div>
              <div className="select-element" style={cursorStyle}>
                <input
                  type="radio"
                  name="export-language"
                  id={ExportLanguage.dual}
                  value={ExportLanguage.dual}
                  onChange={onExportLanguageChange}
                  checked={exportLanguage === ExportLanguage.dual}
                  disabled={enIsEmptyOrNull}
                  style={cursorStyle}
                />
                <label htmlFor={ExportLanguage.dual}>{t('lnguage_Type_Select_KoEn')}</label>
              </div>
              <div className="select-element" style={cursorStyle}>
                <input
                  type="radio"
                  name="export-language"
                  id={ExportLanguage.translated_Origin}
                  value={ExportLanguage.translated_Origin}
                  onChange={onExportLanguageChange}
                  checked={exportLanguage === ExportLanguage.translated_Origin}
                  disabled={enIsEmptyOrNull}
                  style={cursorStyle}
                />
                <label htmlFor={ExportLanguage.translated_Origin}>{t('lnguage_Type_Select_EnKo')}</label>
              </div>
            </div>
          </div>
          <label className="content-title">{t('export_Type_Select_Title')}</label>
          <div className="select-box">
            <div className="selectable-elements">
              <div className="select-element">
                <input
                  type="radio"
                  name="format"
                  id="srt"
                  value="Srt"
                  onChange={onFormatChange}
                  checked={format === "Srt"}
                />
                <label htmlFor="srt">SRT</label>
              </div>
              <div className="select-element">
                <input
                  type="radio"
                  name="format"
                  id="text"
                  value="Text"
                  onChange={onFormatChange}
                  checked={format === "Text"}
                />
                <label htmlFor="text">Text</label>
              </div>
              <div className="select-element" style={{ width: "49px" }}>
                <input
                  type="radio"
                  name="format"
                  id="xml"
                  value="Xml"
                  onChange={onFormatChange}
                  checked={format === "Xml"}
                />
                {format === "Xml" ? (
                  <select
                    value={xml}
                    onChange={onXmlChange}
                    disabled={format !== "Xml"}
                  >
                    <option value="Xmeml">{t('export_Type_Select_Xml_Xmeml')}</option>
                    <option value="Fcpxml">{t('export_Type_Select_Xml_Fcpxml')}</option>
                    <option value="Resolve">{t('export_Type_Select_Xml_Resolve')}</option>
                  </select>
                ) : (
                  <label htmlFor="xml">XML</label>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="notice-grid">
          <label className="notice">{t('export_Notice')}</label>
        </div>
      </AcceptCancelPopup>
    );
  }
}

export default withTranslation('CaptionsExportPopup')(CaptionsExportPopup);