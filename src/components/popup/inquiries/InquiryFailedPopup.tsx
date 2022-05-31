import InfoPopup, { IInfoPopupActions } from "components/common/PopUp/InfoPopup"
import { useTranslation } from "react-i18next"

interface IInquiryFailedPopupProps extends IInfoPopupActions {
}

export default function InquiryFailedPopup(props: IInquiryFailedPopupProps) {
  const { t } = useTranslation('InquiryFailedPopup');

  return (
    <InfoPopup closePressedOutside
      title={t('title')}
      confirmContent={t('confirmContent')}
      onConfirmClick={props.onConfirmClick}
      onCloseClick={props.onCloseClick}
    >
      <div className="inquiry-popup">
        <div className="inquiry-success-content">
          {t('failed_Message')}
        </div>
      </div>
    </InfoPopup>
  )
}
