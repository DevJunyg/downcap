import { useTranslation } from "react-i18next";

interface IYoutubeCaptionsUploadPopupSelectUploadOptionContentTitleProps {
  closedCaption: boolean;
  onClosedCaption: (value: boolean) => void;
}

export default function YoutubeCaptionsUploadPopupSelectUploadOptionContentTitle(props: IYoutubeCaptionsUploadPopupSelectUploadOptionContentTitleProps) {
  const { t } = useTranslation('YoutubeCaptionsUploadPopup');
  
  return (
    <div className="select-upload-option">
      <label className="content-title">{t('optoin')}</label>
      <div className="selectable-option-elements middle-line">
        <div className="option-element">
          <input type="checkbox"
            name="closedCaption"
            id="closedCaption"
            onChange={e => props.onClosedCaption(e.target.checked)}
            checked={props.closedCaption}
          />
          <label htmlFor="closedCaption">{t('cc_Option')}</label>
        </div>
      </div>
    </div>
  );
}