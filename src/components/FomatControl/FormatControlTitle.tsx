import React from 'react';
import { useTranslation } from 'react-i18next';

const FormatControlTitle = () => {
  const { t } = useTranslation();
  return (
    <div className='styles-control-context-item-title'>
      <h4>{t('FormatControlTitle_Title')}</h4>
    </div>
  )
};

export default React.memo(FormatControlTitle);