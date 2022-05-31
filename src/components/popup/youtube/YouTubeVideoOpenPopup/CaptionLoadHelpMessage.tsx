import { useTranslation } from "react-i18next";

interface ICaptionLoadHelpMessageProps {
  onClick?: React.MouseEventHandler<HTMLSpanElement>
}

export default function CaptionLoadHelpMessage(props: ICaptionLoadHelpMessageProps) {
  const { t } = useTranslation('YouTubeVideoOpenPopup');
  return (
    <div className="notice" >
      {t('CaptionLoadHelpMessage_Notice')}
      <span className="notice-link" onClick={props.onClick}>{t('CaptionLoadHelpMessage_NoticeLink')}</span>{t('CaptionLoadHelpMessage_NoticeLink_Sub')}
    </div>
  )
}