import React from 'react';
import { useTranslation } from 'react-i18next';
import * as store from 'storeV2';

interface IInvalidFontCheckLineProps {
  meta: store.IFocusLineMeta;
  lineText: string;
  lineTime: string;
  lineLang: store.LineLanguageType;
  lineType: store.LineType;
  onMoveClick: (evt: React.MouseEvent, meta: store.IFocusLineMeta) => void;
}

export default function InvalidFontCheckLine(props: IInvalidFontCheckLineProps) {
  const { t } = useTranslation('InvalidFontCheckLine');
  return (
    <div className="font-invalid-list-item">
      <div className="font-invalid-list-item-time">
        {props.lineTime}
      </div>
      <div className="font-invalid-list-item-text-line d-flex justify-content-center align-items-center">
        <span className="font-invalid-list-item-text">
          {props.lineText}
        </span>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <span className="font-invalid-list-item-lang">{t(props.lineLang)}</span>
        <span className="font-invalid-list-item-separator">|</span>
        <span className="font-invalid-list-item-type">{t(props.lineType)}</span>
      </div>
      <div className="btn font-invalid-list-item-btn" onClick={evt => props.onMoveClick(evt, props.meta)}>
        <button className="font-invalid-list-item-btn-text">{t('move')}</button>
      </div>
    </div>
  );
}