import { useTranslation } from "react-i18next";

interface IYoutubeVideoUploadPopupEmbeddableContentsProps {
  videoEmbeddable: string;
  embeddableMessage?: string | JSX.Element;
  onVideoEmbeddable: (value: string) => void;
}

export default function YoutubeVideoUploadPopupEmbeddableContents(props: IYoutubeVideoUploadPopupEmbeddableContentsProps) {
  const { t } = useTranslation('YoutubeVideoUploadPopupEmbeddableContents');
  return (
    <div className="embeddable-contents">
      <div className="content-title">
        <label>{t('title')}</label>
      </div>
      <div className="embeddable-content">
        <div className="select-element">
          <input
            type="radio"
            name="embeddable-option"
            id="embeddable-permit"
            value={"true"}
            checked={props.videoEmbeddable === "true"}
            onChange={(e) => { props.onVideoEmbeddable(e.target.value) }}
          />
          <label htmlFor="embeddable-permit">{t('embeddable_Permit')}</label>
        </div>
        <div className="select-element">
          <input
            type="radio"
            name="embeddable-option"
            id="embeddable-forbid"
            value={"false"}
            checked={props.videoEmbeddable === "false"}
            onChange={(e) => { props.onVideoEmbeddable(e.target.value) }}
          />
          <label htmlFor="embeddable-forbid">{t('embeddable_Forbid')}</label>
        </div>
        {props.embeddableMessage && <p>{props.embeddableMessage}</p>}
      </div>
    </div>
  );
}