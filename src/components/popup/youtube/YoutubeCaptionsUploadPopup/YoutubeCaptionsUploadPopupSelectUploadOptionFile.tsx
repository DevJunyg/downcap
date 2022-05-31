import { useTranslation } from "react-i18next";

interface IYoutubeCaptionsUploadPopupSelectUploadOptionFileProps {
  overwrited: boolean;
  onOverwriteChange: (value: boolean) => void;
}

export default function YoutubeCaptionsUploadPopupSelectUploadOptionFile(props: IYoutubeCaptionsUploadPopupSelectUploadOptionFileProps) {
  const { t } = useTranslation('YoutubeCaptionsUploadPopup');

  return (
    <div className="select-upload-option">
      <label className="content-title">{t('file')}</label>
      <div className="selectable-option-elements middle-line">
        <div className="option-element">
          <input type="radio"
            name="overwrite"
            id="overwrite"
            value="true"
            onChange={() => props.onOverwriteChange(true)}
            checked={props.overwrited}
          />
          <label htmlFor="overwrite">{t('overWrite')}</label>
        </div>
        <div className="option-element">
          <input type="radio"
            name="overwrite"
            id="insert"
            value="false"
            onChange={() => props.onOverwriteChange(false)}
            checked={!props.overwrited}
          />
          <label htmlFor="insert">{t('insert')}</label>
        </div>
      </div>
    </div>
  );
}