import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupPrivacyContentsProps {
  videoPrivacyStatus: string;
  onVideoPrivacyStatus: (value: string) => void;
}

export default function YoutubeVideoUploadPopupPrivacyContents(props: IYoutubeVideoUploadPopupPrivacyContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupPrivacyContents');
  const { videoPrivacyStatus, onVideoPrivacyStatus } = props;

  return (
    <div className="privacy-contents">
      <div className="content-title">
        <label>{t('title')}</label>
      </div>
      <div className="privacy-content">
        <div className="select-element">
          <input
            type="radio"
            name="privacy-option"
            id="public-state"
            value={'public'}
            checked={videoPrivacyStatus === 'public'}
            onChange={(e) => { onVideoPrivacyStatus(e.target.value) }}
          />
          <label htmlFor="public-state">{t('privacyOption_public')}</label>
        </div>
        <div className="select-element">
          <input
            type="radio"
            name="privacy-option"
            id="unlisted-state"
            value={'unlisted'}
            checked={videoPrivacyStatus === 'unlisted'}
            onChange={(e) => { onVideoPrivacyStatus(e.target.value) }}
          />
          <label htmlFor="unlisted-state">{t('privacyOption_unlisted')}</label>
        </div>
        <div className="select-element">
          <input
            type="radio"
            name="privacy-option"
            id="private-state"
            value={'private'}
            checked={videoPrivacyStatus === 'private'}
            onChange={(e) => { onVideoPrivacyStatus(e.target.value) }}
          />
          <label htmlFor="private-state">{t('privacyOption_private')}</label>
        </div>
      </div>
    </div>
  );
}