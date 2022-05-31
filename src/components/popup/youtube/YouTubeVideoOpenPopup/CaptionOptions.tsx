import YoutubeCaption from "models/YoutubeCaption";
import { useTranslation } from "react-i18next";
import CaptionOption from "./CaptionOption";

interface ICaptionOptionsProps {
  captions?: YoutubeCaption[]
}

export default function CaptionOptions(props: ICaptionOptionsProps) {
  const { t } = useTranslation('YouTubeVideoOpenPopup');
  if (!props.captions) {
    return <option key='default' value=''>{t('CaptionOptions_Default')}</option>;
  }

  return (
    <>
      {
        props.captions.map((caption, index) => (
          <CaptionOption
            key={`${caption.snippet.language} - ${caption.snippet.name}`}
            caption={caption}
            data-index={index}
          />
        ))
      }
    </>
  );
}