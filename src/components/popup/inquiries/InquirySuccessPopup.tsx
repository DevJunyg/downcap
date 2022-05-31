import InfoPopup, { IInfoPopupActions } from "components/common/PopUp/InfoPopup"
import { useTranslation } from "react-i18next";

interface IInquirySuccessPopupProps extends IInfoPopupActions {
}

export default function InquirySuccessPopup(props: IInquirySuccessPopupProps) {
  const { t } = useTranslation('InquirySuccessPopup');
  return (
    <InfoPopup closePressedOutside
      title={t('title')}
      confirmContent={t('confirmContent')}
      onConfirmClick={props.onConfirmClick}
      onCloseClick={props.onCloseClick}
    >
      <div className="inquiry-popup">
        <div className="inquiry-success-content">
          {t('succes_Message')}
        </div>
      </div>
    </InfoPopup>
  )
}
