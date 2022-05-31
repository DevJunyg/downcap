import { useTranslation } from "react-i18next";

export default function YoutubeOption() {
  const { t } = useTranslation('FontListTitle');
  const disabledStyle = { backgroundColor: '#dedede' }
  return (
    <option disabled={true} style={disabledStyle}> ---- {t('YoutubeOptions_Title')} ---- </option>
  )
}