import { IErrors } from "containers/popup/YoutubeVideoUploadPopupContainer"
import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupVideoTitleContentsProps {
  errors: IErrors;
  videoTitle: string;
  onVideoTitle: (value: string) => void;
}

export default function YoutubeVideoUploadPopupVideoTitleContents(props: IYoutubeVideoUploadPopupVideoTitleContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupVideoTitleContents');
  const errorMessage = (err: string) => {
    return <div className="error-message">
      <label>* {err}</label>
    </div>
  }

  return (
    <div className="video-title-contents">
      <div className="content-title">
        <label>{t('title')}</label>
      </div>
      <div className="video-title-content">
        <input
          type="text"
          placeholder={t('title_Placehloder')}
          value={props.videoTitle}
          onChange={(e) => { props.onVideoTitle(e.target.value) }}
        />
        {(props.errors.titleNull)
          ? errorMessage(t('error_TitleNull'))
          : null
        }
        {(props.errors.titleExceed)
          ? errorMessage(t('error_TitleExceed'))
          : null
        }
        {(props.errors.titleAngleBrackets)
          ? errorMessage(t('error_TitleAngleBrackets'))
          : null
        }
      </div>
    </div>
  );
}