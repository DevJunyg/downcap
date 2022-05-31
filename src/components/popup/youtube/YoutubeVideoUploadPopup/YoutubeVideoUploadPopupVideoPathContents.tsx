import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupVideoPathContentsProps {
  videoFileName: string;
}

export default function YoutubeVideoUploadPopupVideoPathContents(props: IYoutubeVideoUploadPopupVideoPathContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupVideoPathContents')
  return (
    <div className="video-path-contents">
      <div className="content-title">
        <label>{t('file')}</label>
      </div>
      <div className="video-path-content">
        <label>{props.videoFileName}</label>
      </div>
    </div>
  );
}