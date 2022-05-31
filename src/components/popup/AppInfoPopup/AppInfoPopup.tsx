import React, { useEffect, useState } from "react";
import PopUp from "components/common/PopUp";
import "./AppInfoPopup.scss";
import IpcSender from "lib/IpcSender";
import { useTranslation } from "react-i18next";

interface IAppInfoPopupProps {
  onCloseClick?: React.MouseEventHandler;
}

function AppInfoPopup(props: IAppInfoPopupProps) {
  const { t } = useTranslation('AppInfoPopup');
  const [version, setVersion] = useState<string>('');

  useEffect(() => {
    IpcSender.invokeGetVersion().then(setVersion);
  }, []);

  return (
    <PopUp title="info" onCloseClick={props.onCloseClick}>
      <div className="info">
        <div className="info-item">
          <div className="info-title">{t('Info_Information')}</div>
          <div className="info-content middle-line">
            <p>{t('Info_Version')}{version}</p>
          </div>
        </div>
        <div className="info-item">
          <div className="info-title">
            <p>{t('Info_Policy')}</p>
          </div>
          <div className="info-content policy middle-line">
            <p className="pointer" onClick={IpcSender.sendDowncapPrivacyPolicyPopup}>
              {t('Info_Privacy_Policy')}
            </p>
            <p className="pointer" onClick={IpcSender.sendGooglePrivacyPolicyPopup}>
              {t('Info_Google_Privacy_Policy')}
            </p>
            <p className="pointer" onClick={IpcSender.sendYoutubeTermsOfServicePopup}>
              {t('Info_Youtube_Terms_Of_Service')}
            </p>
          </div>
        </div>
        <div className="info-item">
          <div className="info-title">
            <p>{t('Info_Contact')}</p>
          </div>
          <div className="info-content">
            <p>{t("Info_Business_Email")}</p>
            <p>{t('Info_Technical_Inquiry_Email')}</p>
          </div>
        </div>
      </div>
    </PopUp>
  );
}

export default AppInfoPopup;
