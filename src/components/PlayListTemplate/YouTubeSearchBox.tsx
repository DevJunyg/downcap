import React from 'react';
import { useTranslation } from 'react-i18next';

type PredefinedAttributeType = "type" | "placeholder";

export default function YouTubeSearchBox(props: Omit<React.InputHTMLAttributes<HTMLInputElement>, PredefinedAttributeType>) {
  const { t } = useTranslation('YoutubeSearchBox');
  return (
    <input type="text" placeholder={t('placeholder_Text')} {...props} />
  )
}
