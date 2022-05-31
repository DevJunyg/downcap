import { useTranslation } from "react-i18next";

interface ILocalCaptionLoadInfoProps {
  srtFileName?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

export default function LocalCaptionLoadInfo(props: ILocalCaptionLoadInfoProps) {
  const { t } = useTranslation('YouTubeVideoOpenPopup');
  const fileInfo = props.srtFileName ?? <div className="srt-error">{t('LocalCaptionLoadInfo_StrSelectError')}</div>;

  return (
    <div className="prediction-box">
      <label className="content-title">{t('LocalCaptionLoadInfo_ConttnesTitle')}</label>
      <div className="prediction-element">
        <label className="file-name">{fileInfo}</label>
        <div className="attach-file-button" onClick={props.onClick}>{t('LocalCaptionLoadInfo_AttachFileButton_Text')}</div>
      </div>
    </div>
  )
}