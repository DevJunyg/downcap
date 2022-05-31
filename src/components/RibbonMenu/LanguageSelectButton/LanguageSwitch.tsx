import IpcSender from "lib/IpcSender";
import { useTranslation } from 'react-i18next';
import './LanguageSwitch.scss';

const LanguageSwitch = (props: any) => {
  const { i18n } = useTranslation();

  const switching = () => {
    const recentlyLan = i18n.language === 'ko' ? 'en' : 'ko';
    i18n.changeLanguage(recentlyLan);
    IpcSender.sendChangeLanguage(recentlyLan);
  };

  return (
    <div className={`LanguageSwitch no-drag ${props.className}`} onClick={switching}>
      <label className="current-language">{i18n.language}</label>
    </div>
  )
}

export default LanguageSwitch