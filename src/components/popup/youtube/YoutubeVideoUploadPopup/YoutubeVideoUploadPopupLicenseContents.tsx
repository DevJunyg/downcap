import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupLicenseContentsProps {
  onVideoLicense: (value: string) => void;
}

export default function YoutubeVideoUploadPopupLicenseContents(props: IYoutubeVideoUploadPopupLicenseContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupLicenseContents');
  return (
    <div className='license-contents'>
      <div className="content-title">
        <label>{t('title')}</label>
      </div>
      <div className="license-content">
        <select name="license-options" onChange={(e) => { props.onVideoLicense(e.target.value) }}>
          <option value="youtube">{t('license_Youtube')}</option>
          <option value="creativeCommon">{t('license_CreativeCommon')}</option>
        </select>
      </div>
    </div>
  );
}