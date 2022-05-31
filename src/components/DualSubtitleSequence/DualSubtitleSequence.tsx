import React from 'react';
import { useTranslation } from 'react-i18next';

import './DualSubtitleSequence.scss'

const DualSubtitleSequence = ({ first, second, onClick }: {
  first: string,
  second: string,
  onClick: React.MouseEventHandler<HTMLButtonElement>
}) => {
  const { t } = useTranslation("translation");

  return (
    <div className="dual-subtitle-sequence">
      <div className='block'>
        <div className='dual-subtitle-item'>
          <div className='dual-subtitle-item-label'>
            <label>{t("DualCaption_Sequence_Up")}</label>
          </div>
          <div className='dual-subtitle-item-text text-align'>
            {first}
          </div>
        </div>
        <div className='dual-subtitle-item'>
          <div className='dual-subtitle-item-label'>
            <label>{t("DualCaption_Sequence_Down")}</label>
          </div>
          <div className='dual-subtitle-item-text border-purple'>
            {second}
          </div>
        </div>
      </div>
      <button
        className='center dual-subtitle-button-icon pointer'
        onClick={onClick}
      >
        <img src="https://downcap.net/client/svg/자막상하위치변경.svg" height="16" alt='자막 상하 위치 변경' />
      </button>
    </div>
  )
}


export default DualSubtitleSequence;
