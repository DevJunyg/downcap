import React from 'react';
import { useTranslation } from 'react-i18next';

interface IYoutubeCaptionsUploadPopupSelectBoxProps {
  exportLanguage: string;
  captionLanguage: string;
  koDisabled: boolean;
  enDisabled: boolean;
  onExportLanguageChange: (value: string) => void;
}

export default function YoutubeCaptionsUploadPopupSelectBox(props: IYoutubeCaptionsUploadPopupSelectBoxProps) {
  const { t } = useTranslation('YoutubeCaptionsUploadPopup');
  const {
    exportLanguage,
    koDisabled,
    enDisabled,
    captionLanguage,
    onExportLanguageChange
  } = props;

  return (
    <div className="select-box">
      <label className="content-title">{t('captionLanguage')}</label>
      <div className="languages-box">
        <div className="language-element">
          <label className="content-secondary-title">
            {t('uploadToKo')}
          </label>
          <div className="selectable-elements middle-line">
            <div className="select-element">
              <input type="radio"
                name="export-language"
                id="ko"
                value="ko"
                onChange={e => onExportLanguageChange(e.target.value)}
                checked={exportLanguage === 'ko'}
                disabled={koDisabled}
              />
              <label htmlFor="ko">{t('koCaption')}</label>
            </div>
            <div className="select-element">
              <input type="radio"
                name="export-language"
                id="ko-ko-en"
                value="ko-ko-en"
                onChange={e => onExportLanguageChange(e.target.value)}
                checked={exportLanguage === 'ko-ko-en'}
                disabled={koDisabled || enDisabled}
              />
              <label htmlFor="ko-ko-en">{t('koEnCaption')}</label>
            </div>
            <div className="select-element">
              <input type="radio"
                name="export-language"
                id="ko-en-ko"
                value="ko-en-ko"
                onChange={e => onExportLanguageChange(e.target.value)}
                checked={exportLanguage === 'ko-en-ko'}
                disabled={koDisabled || enDisabled}
              />
              <label htmlFor="ko-en-ko">{t('EnKoCaption')}</label>
            </div>
          </div>
        </div>
        <div className="language-element">
          <label className="content-secondary-title">
          {t('uploadToEn')}
          </label>
          <div className="selectable-elements middle-line">
            <div className="select-element">
              <input type="radio"
                name="export-language"
                id="en"
                value="en"
                onChange={e => onExportLanguageChange(e.target.value)}
                checked={exportLanguage === 'en'}
                disabled={captionLanguage === 'en' ? false : enDisabled}
              />
              <label htmlFor="en">{t('enCaption')}</label>
            </div>
            <div className="select-element">
              <input type="radio"
                name="export-language"
                id="en-ko-en"
                value="en-ko-en"
                onChange={e => onExportLanguageChange(e.target.value)}
                checked={exportLanguage === 'en-ko-en'}
                disabled={koDisabled || enDisabled}
              />
              <label htmlFor="en-ko-en">{t('koEnCaption')}</label>
            </div>
            <div className="select-element">
              <input type="radio"
                name="export-language"
                id="en-en-ko"
                value="en-en-ko"
                onChange={e => onExportLanguageChange(e.target.value)}
                checked={exportLanguage === 'en-en-ko'}
                disabled={koDisabled || enDisabled}
              />
              <label htmlFor="en-en-ko">{t('EnKoCaption')}</label>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}