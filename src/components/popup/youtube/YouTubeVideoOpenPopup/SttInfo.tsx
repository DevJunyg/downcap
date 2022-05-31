import { useTranslation } from "react-i18next";
import SttRequestInfo, { ISttInfoProps } from "./SttRequestInfo";


export default function SttInfo(props: ISttInfoProps) {
  const { t } = useTranslation('YouTubeVideoOpenPopup');
  return props.duration !== undefined
    ? <SttRequestInfo duration={props.duration} paymentLetter={props.paymentLetter} />
    : <div className="notice">{t('SttInfo_Notice')}</div>
}