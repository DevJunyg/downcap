import InfoPopup from "components/common/PopUp/InfoPopup";
import { IPopupProps } from "containers/PopupContainer";
import { useTranslation } from "react-i18next";

export default function CaptionsExportSuccessPopup(props: IPopupProps) {
  const { t } = useTranslation('CaptionsExportSuccessPopup');
  return (
    <InfoPopup closePressedOutside
      title={t('title')}
      confirmContent={t('confirmContent')}
      onConfirmClick={props.onCloseClick}
    >
      <div className="export-success-contents center">
        <div>{t('Captions_Export_Success_Message')}</div>
      </div>
    </InfoPopup>
  );
}