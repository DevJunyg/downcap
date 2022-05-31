import { IErrors } from "containers/popup/YoutubeVideoUploadPopupContainer"
import { useTranslation } from "react-i18next";
import YoutubeVideoUploadPopupError from "./YoutubeVideoUploadPopupError";

interface IYoutubeVideoUploadPopupDescriptionContentsProps {
  errors: IErrors;
  videoDescription?: string;
  onVideoDescription: (value: string) => void;
}

export default function YoutubeVideoUploadPopupDescriptionContents(props: IYoutubeVideoUploadPopupDescriptionContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupDescriptionContents')
  return (
    <div className="description-contents">
      <div className="content-title">
        <label>{t('description')}</label>
      </div>
      <div className="description-content">
        <textarea
          placeholder={t('description_Placeholder')}
          value={props.videoDescription}
          onChange={(e) => { props.onVideoDescription(e.target.value) }}
        />
        {(props.errors.descriptionExceed)
          ? <YoutubeVideoUploadPopupError err={t('error_DescriptionExceed')}/>
          : null
        }
        {(props.errors.descriptionAngleBrackets)
          ? <YoutubeVideoUploadPopupError err={t('error_DescriptionAngleBrackets')}/>
          : null
        }
      </div>
    </div>
  );
}