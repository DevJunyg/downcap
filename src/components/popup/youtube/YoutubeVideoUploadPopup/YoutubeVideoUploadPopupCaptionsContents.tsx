import { ICaptionsUploadDisabledOption, ICaptionsUploadOption } from "containers/popup/YoutubeVideoUploadPopupContainer"
import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupCaptionsContentsProps {
  captionsUpload: ICaptionsUploadOption;
  captionsUploadDisabledOption: ICaptionsUploadDisabledOption;
  onCaptionsUploadOptionChange: (value: string, checked: boolean) => void;
}

export default function YoutubeVideoUploadPopupCaptionsContents(props: IYoutubeVideoUploadPopupCaptionsContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupCaptionsContents');
  const { captionsUpload, captionsUploadDisabledOption, onCaptionsUploadOptionChange } = props;

  return (
    <div className='captions-contents'>
      <div className="content-title">
        <label>{t('title')}</label>
      </div>
      <div className="captions-content">
        <div className="select-element">
          <input
            type="checkbox"
            name="captions-upload-option"
            id="none-caption-upload"
            className="none-caption-upload"
            value="none"
            checked={captionsUpload.none || (!captionsUpload.origin && !captionsUpload.translated)}
            onChange={(e) => { onCaptionsUploadOptionChange(e.target.value, e.target.checked) }}
          />
          <label htmlFor="none-caption-upload">{t('ccOption_None')}</label>
        </div>
        <div className="select-element">
          <input
            type="checkbox"
            name="captions-upload-option"
            id="origin-caption-upload"
            className="origin-caption-upload"
            value="origin"
            checked={captionsUpload.origin}
            disabled={captionsUploadDisabledOption.originDisabled}
            onChange={(e) => { onCaptionsUploadOptionChange(e.target.value, e.target.checked) }}
          />
          <label htmlFor="origin-caption-upload">{t('ccOption_Origin')}</label>
        </div>
        <div className="select-element">
          <input
            type="checkbox"
            name="captions-upload-option"
            id="translated-caption-upload"
            className="translated-caption-upload"
            value="translated"
            checked={captionsUpload.translated}
            disabled={captionsUploadDisabledOption.translatedDisabled}
            onChange={(e) => { onCaptionsUploadOptionChange(e.target.value, e.target.checked) }}
          />
          <label htmlFor="translated-caption-upload">{t('ccOption_Translated')}</label>
        </div>
      </div>
    </div>
  );
}