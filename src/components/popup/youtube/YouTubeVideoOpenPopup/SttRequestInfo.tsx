import { useTranslation } from "react-i18next";

export interface ISttInfoProps {
  duration?: number;
  paymentLetter?: number;
}

export default function SttRequestInfo(props: ISttInfoProps) {
  const { t } = useTranslation('YouTubeVideoOpenPopup');
  return (
    <>
      <div className="prediction-box">
        <label className="content-title">{t('SttRequestInfo_AboutTime')}</label>
        <div className="prediction-element">
          <label className="prediction-value-unit">{t('SttRequestInfo_About')}</label>
          <label className="prediction-value">{props.duration ?? t('SttRequestInfo_DefulatPredictionValue')}</label>
          <label className="prediction-value-unit">{t('SttRequestInfo_Minute')}</label>
        </div>
      </div>
      <div className="prediction-box">
        <label className="content-title">Letter</label>
        <div className="prediction-element">
          <label className="prediction-value-unit">{t('SttRequestInfo_About')}</label>
          <label className="prediction-value">{props.paymentLetter ?? t('SttRequestInfo_DefulatPredictionValue')}</label>
          <label className="prediction-value-unit">{t('SttRequestInfo_LetterUsing')}</label>
        </div>
      </div>
    </>
  )
}