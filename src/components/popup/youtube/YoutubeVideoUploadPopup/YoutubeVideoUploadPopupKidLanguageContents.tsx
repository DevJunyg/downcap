import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupKidLanguageContentsProps {
  onVideoDefaultLanguage: (value: string) => void;
  onSelfDeclaredMadeForKid: (value: string) => void;
}

export default function YoutubeVideoUploadPopupKidLanguageContents(props: IYoutubeVideoUploadPopupKidLanguageContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupKidLanguageContents');
  return (
    <div className="kid-language-contents">
      <div className='kid-contents'>
        <div className="content-title">
          <label>{t('kidOption_title')}</label>
        </div>
        <div className="kid-content">
          <select name="kid-options" onChange={(e) => { props.onSelfDeclaredMadeForKid(e.target.value) }}>
            <option value="false">{t('kidOption_false')}</option>
            <option value="true">{t('kidOption_ture')}</option>
          </select>
        </div>
      </div>
      <div className='language-contents'>
        <div className="content-title">
          <label>{t('languageOption_Title')}</label>
        </div>
        <div className="language-content">
          <select name="language-options" onChange={(e) => { props.onVideoDefaultLanguage(e.target.value) }}>
            <option value="ko">{t('languageOption_Korean')}</option>
            <option value="en">{t('languageOption_English')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}