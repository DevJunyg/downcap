import { useTranslation } from "react-i18next";

export default function LocalOption() {
  const { t } = useTranslation('FontListTitle');
  const disabledStyle = { backgroundColor: '#dedede' }
  return (
    <option disabled={true} style={disabledStyle}> ---- {t('LocalOptions_Title')} ---- </option>
  )
}