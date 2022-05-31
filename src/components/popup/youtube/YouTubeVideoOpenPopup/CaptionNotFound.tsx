import { useTranslation } from "react-i18next";

export default function CaptionNotFound() {
  const { t } = useTranslation('YouTubeVideoOpenPopup');
  return (
    <div className="notice-captionNullError" >
      {t('CaptionNotFound_Notice_CaptionNullError')}
    </div>
  )
}
