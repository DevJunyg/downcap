import React from "react";
import { useTranslation } from "react-i18next";

const titleStyle = { fontSize: '1.2rem', color: '#7d1ed8', margin: 0, paddingBottom: '0.3rem' };

function VideoTitlebarTitle() {
  const { t } = useTranslation();
  return (
    <h3 className='align-self-end' style={titleStyle}>{t('VideoSubutitlesTitle')}</h3>
  )
}

export default React.memo(VideoTitlebarTitle)