import AcceptCancelPopup from "components/common/PopUp/AcceptCancelPopup";
import React from "react";
import { useTranslation } from "react-i18next";
import "./InquiryPopup.scss";

interface IInquiryPopupProps {
  title?: string;
  content?: string;
  validationSummary?: { [name: string]: string }
  onConfirmClick?: React.MouseEventHandler<HTMLDivElement>;
  onCloseClick?: React.MouseEventHandler<HTMLDivElement>;
  onContentChange?: React.ChangeEventHandler<HTMLTextAreaElement>;
  onTitleChange?: React.ChangeEventHandler<HTMLInputElement>;
}

function InquiryPopup(props: IInquiryPopupProps) {
  const { t } = useTranslation('InquiryPopup');
  const titleValidation = props.validationSummary && props.validationSummary["title"] && (
    <div className="text-danger">{props.validationSummary["title"]}</div>
  );

  return (
    <AcceptCancelPopup closePressedOutside
      title={t('title')}
      acceptContent={t('acceptContent')}
      closeContent={t('closeContent')}
      onAcceptClick={props.onConfirmClick}
      onCloseClick={props.onCloseClick}
      onCancelClick={props.onCloseClick}
    >
      <div className="inquiry-popup">
        <label className="content-title">{t('inquryTitle')}</label>
        <div className="inquiry-box">
          <div className="title-box">
            <input type="text" value={props.title} onChange={props.onTitleChange} name="title" />
            {titleValidation}
          </div>
        </div>
        <label className="content-title">{t('inquryContents')}</label>
        <div className="inquiry-content">
          <div className="content-box">
            <textarea rows={5} cols={20}
              name="content"
              className="inquiry-textarea"
              value={props.content}
              onChange={props.onContentChange}
            />
          </div>
        </div>
        <div className="inquiry-info-title">{t('inqurySub')}</div>
        <div className="inquiry-info">
          <div className="inquiry-connection">
            <div>{t('mail_Title')}<span className="connection-info">{t('mail_Contents')}</span></div>
            <div>{t('kakao_Title')}<span className="connection-info">{t('kakao_Contents')}</span></div>
            <div>{t('call_Title')}<span className="connection-info">{t('call_Contents')}</span></div>
          </div>
        </div>
      </div>
    </AcceptCancelPopup>
  );
}

export default InquiryPopup;
