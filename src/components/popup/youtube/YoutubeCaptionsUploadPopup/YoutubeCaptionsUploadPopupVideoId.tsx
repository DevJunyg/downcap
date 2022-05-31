import { useTranslation } from "react-i18next";

interface IYoutubeCaptionsUploadPopupVideoIdProps {
  videoId?: string;
  onVideoIdChange: React.ChangeEventHandler<HTMLInputElement>;
}

export default function YoutubeCaptionsUploadPopupVideoId(props: IYoutubeCaptionsUploadPopupVideoIdProps) {
  const { t } = useTranslation('YoutubeCaptionsUploadPopup');
  return (
    <div className="youtube-video-id">
      <label className="content-title">{t('address')}</label>
      <input type='text' value={props.videoId} onChange={props.onVideoIdChange} />
    </div>
  );
}