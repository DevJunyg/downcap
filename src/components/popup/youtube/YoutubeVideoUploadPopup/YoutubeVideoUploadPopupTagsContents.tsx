import { IErrors } from "containers/popup/YoutubeVideoUploadPopupContainer"
import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupTagsContentsProps {
  errors: IErrors;
  videoTags?: string;
  onVideoTags: (value: string) => void;
}

export default function YoutubeVideoUploadPopupTagsContents(props: IYoutubeVideoUploadPopupTagsContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupTagsContents');
  return (
    <div className="tags-contents">
      <div className="content-title">
        <label>{t('title')}</label>
      </div>
      <div className="tags-content">
        <textarea
          placeholder={t('tags_Placeholder')}
          value={props.videoTags}
          onChange={(e) => { props.onVideoTags(e.target.value) }}
        />
        {(props.errors.tagIsTooLong)
          ? <div className="error-message">
            <label>{t('errorMessage_TagIsTooLong')}</label>
          </div>
          : null
        }
        {(props.errors.tagsExceed)
          ? <div className="error-message">
            <label>{t('errorMessage_TagsExceed')}</label>
          </div>
          : null
        }
        {(props.errors.tagAngleBrackets)
          ? <div className="error-message">
            <label>{t('errorMessage_TagAngleBrackets')}</label>
          </div>
          : null
        }
      </div>
    </div>
  );
}