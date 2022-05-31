import React from 'react';
import './FileOpenPopup.scss'

import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import { useTranslation } from 'react-i18next';

export type FileOpenOptionValueType = 'STC' | 'video' | 'srt';

interface IFileOpenOptionsProps {
  validationSummary?: { [key: string]: string }
  onChange?: React.ChangeEventHandler<HTMLInputElement>
}

function FileOpenOptions(props: IFileOpenOptionsProps) {
  const { t } = useTranslation('FileOpenPopup');
  return (
    <div className="options-box">
      <div className="option-element">
        <input type="radio"
          name="selectOption"
          id="STC"
          value="STC"
          defaultChecked
          onChange={props.onChange}
        />
        <label htmlFor="STC">{t('fileOpiton_stc')}</label>
      </div>
      <div className="option-element">
        <input type="radio"
          name="selectOption"
          id="video"
          value="video"
          onChange={props.onChange}
        />
        <label htmlFor="video">{t('fileOpiton_video')}</label>
      </div>
      <div className="option-element">
        <input type="radio"
          name="selectOption"
          id="srt"
          value="srt"
          onChange={props.onChange}
        />
        <label htmlFor="srt">{t('fileOpiton_srt')}</label>
      </div>
    </div>
  );
}

interface IStcDetailProps {
  estimatedTime?: number;
  estimatedPaymentLetter?: number;
  validationSummary?: { [key: string]: string };
}

function STCDetailInfo(props: IStcDetailProps) {
  const { t } = useTranslation('FileOpenPopup');
  return (
    <>
      <div className="prediction-box">
        <label className="content-title">{t('stcDetail_expectedTime')}</label>
        <div className="prediction-element">
          <label className="prediction-value-unit">{t('stcDetail_about')}</label>
          <label className="prediction-value">{props.estimatedTime}</label>
          <label className="prediction-value-unit"> {t('stcDetail_minute')}</label>
        </div>
      </div>
      <div className="prediction-box">
        <label className="content-title">Letter</label>
        <div className="prediction-element">
          <label className="prediction-value-unit">{t('stcDetail_about')}</label>
          <label className="prediction-value">{props.estimatedPaymentLetter}</label>
          <label className="prediction-value-unit">{t('stcDetail_letterUsing')}</label>
        </div>
      </div>
      <div className="prediction-box">
        <div className="text-center">
          <label className="notice">{t('stcDetail_notice')}</label>
        </div>
      </div>
    </>
  )
}

interface ICaptionsDetailProps {
  captionPath?: string;
  validationSummary?: { [key: string]: string }
  onOpenClick?: React.MouseEventHandler<HTMLDivElement>;
}

function CaptionsDetail(props: ICaptionsDetailProps) {
  const { t } = useTranslation('FileOpenPopup');
  const pathInfo = props.captionPath ? props.captionPath : <div className="srt-error">{t('captionDetail_error')}</div>;

  return (
    <div className="prediction-box">
      <label className="content-title">{t('captionDetail_title')}</label>
      <div className="prediction-element">
        <label className="file-name">
          {pathInfo}
        </label>
        <div className="attach-file-button" onClick={props.onOpenClick}>
          {t('captionDetail_selectCaption')}
        </div>
      </div>
    </div>
  )
}

interface IFileOpenPopupProps {
  videoTitle?: string;
  selectedOption?: FileOpenOptionValueType;
  stcEstimatedTime?: number;
  stcEstimatedPaymentLetter?: number;
  srtFileName?: string;
  srtError?: boolean;
  validationSummary?: { [key: string]: string }
  onAcceptClick?: React.MouseEventHandler;
  onCloseClick?: React.MouseEventHandler;
  onSelectOptionChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSrtOpenClick?: React.MouseEventHandler<HTMLInputElement>;
}

function FileOpenPopup(props: IFileOpenPopupProps) {
  const { t } = useTranslation('FileOpenPopup');
  const detailInfoDictionary: { [key in FileOpenOptionValueType]?: (() => JSX.Element) | undefined } = {
    STC: () => (
      <STCDetailInfo
        estimatedPaymentLetter={props.stcEstimatedPaymentLetter}
        estimatedTime={props.stcEstimatedTime}
      />
    ),
    srt: () => (
      <CaptionsDetail
        captionPath={props.srtFileName}
        validationSummary={props.validationSummary}
        onOpenClick={props.onSrtOpenClick}
      />
    )
  }

  const DetailInfo = props.selectedOption && detailInfoDictionary[props.selectedOption];

  return (
    <AcceptCancelPopup closePressedOutside
      title={`${t('filePath')} - ${props.videoTitle}`}
      closeContent={t('closeContent')}
      acceptContent={t('acceptContent')}
      titlebarMaxWidth={300}
      onAcceptClick={props.onAcceptClick}
      onCancelClick={props.onCloseClick}
      onCloseClick={props.onCloseClick}
    >
      <div className="file-open-popup-contents">
        <div className="select-box middle-line">
          <label className="content-title">{t('fileOpen')}</label>
          <FileOpenOptions onChange={props.onSelectOptionChange} />
        </div>
        {DetailInfo && <DetailInfo />}
        <div className="d-block text-center" >
          <label className="text-danger">
            {props.validationSummary && props.validationSummary["srtPathNotExist"]}
          </label>
        </div>
      </div>
    </AcceptCancelPopup>
  )
}

export default FileOpenPopup;
