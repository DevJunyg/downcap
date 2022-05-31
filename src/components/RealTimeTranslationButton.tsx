import { useTranslation } from "react-i18next";
import SwtichButton, { ISwtichButton } from "./common/SwtichButton";

export default function RealTimeTranslationButton(props: ISwtichButton) {
  const { t } = useTranslation();
  return (
    <span style={{display: "flex", alignItems: "flex-end", margin: "0 0.5rem", padding: '4px 0'}}>
      <SwtichButton {...props} />
      <label style={{paddingLeft: "0.5rem"}}>{t('RealTimeTranslation')}</label>
    </span >
  )
}
