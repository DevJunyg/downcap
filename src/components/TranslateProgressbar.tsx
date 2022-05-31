import { useTranslation } from "react-i18next";
import ProgressBar from "./common/ProgressBar";

interface ITranslateProgressbarProps {
  percent?: number
}

export default function TranslateProgressbar(props: ITranslateProgressbarProps) {
  const { t } = useTranslation('TranslateProgressbar');
  const prePrecent = 0.45;
  let text = t('Translate_Un_Start_Text');
  if (props.percent !== undefined) {
    text = props.percent < 1 ? `${t('Translate_Progress_Text')} ${Math.floor(props.percent * 100)}%` : t('Trnaslate_Complate_Text');
  }

  let percent: number;
  if (props.percent === undefined) {
    percent = prePrecent;
  }
  else {
    percent = prePrecent + props.percent * (1 - prePrecent);
  }

  return (
    <ProgressBar className={percent === 1 ? 'fade-out' : undefined} translationPercentage={percent} innerText={text} />
  )
}