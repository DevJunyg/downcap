import React from "react";
import InquiryPopup from "components/popup/inquiries/InquiryPopup";
import { IPopupProps } from "containers/PopupContainer";
import IpcSender from "lib/IpcSender";
import InquirySuccessPopup from "components/popup/inquiries/InquirySuccessPopup";
import InquiryFailedPopup from "components/popup/inquiries/InquiryFailedPopup";
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import { useTranslation } from "react-i18next";

interface IInquiryPopupContainerProps extends IPopupProps { }

const logger = ReactLoggerFactoryHelper.build('InquiryPopupContainer');

function InquiryPopupContainer(props: IInquiryPopupContainerProps) {
  const { t } = useTranslation('InquiryPopupContainer');
  const sendResult = React.useRef<Promise<boolean | void> | null>(null);
  const [title, setTitle] = React.useState<string>();
  const [content, setContent] = React.useState<string>();
  const [validationSummary, setValidationSummary] = React.useState<{ [name: string]: string }>();
  const [result, setResult] = React.useState<boolean | null>(null);

  React.useEffect(() => {
    return () => { sendResult.current = null };
  }, []);

  switch (result) {
    case true:
      return (
        <InquirySuccessPopup
          onConfirmClick={props.onCloseClick}
          onCloseClick={props.onCloseClick}
        />
      );
    case false:
      return (
        <InquiryFailedPopup
          onConfirmClick={props.onCloseClick}
          onCloseClick={props.onCloseClick}
        />
      );
    default:
      return (
        <InquiryPopup
          title={title}
          content={content}
          validationSummary={validationSummary}
          onConfirmClick={_handleConfirmClickAsync}
          onCloseClick={props.onCloseClick}
          onTitleChange={_handleTitleChange}
          onContentChange={_handleContentChange}
        />
      );
  }

  async function _handleConfirmClickAsync(evt: React.MouseEvent<HTMLDivElement>) {
    if (!title || title.length === 0) {
      setValidationSummary({ "title": t('TITLTE_IS_EMPTY_ERROR') });
      return;
    }

    if (title.length > 100) {
      setValidationSummary({ "title": t('TITLTE_MAXIMUME_CHARACTER_EXCEEDE_ERROR') });
      return;
    }

    if (sendResult.current !== null) {
      return;
    }

    sendResult.current = IpcSender.invokeInquiry({
      title: title,
      content: content
    })
      .then(result => {
        if (sendResult.current === null) {
          return;
        }
        setResult(result);
      })
      .catch(err => {
        logger.logWarning('Sending inquiry failed', err);
      })
      .finally(() => {
        sendResult.current = null;
      });

    return;
  }

  function _handleTitleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setTitle(evt.target.value);
  }

  function _handleContentChange(evt: React.ChangeEvent<HTMLTextAreaElement>) {
    setContent(evt.target.value);
  }
}

export default InquiryPopupContainer;
