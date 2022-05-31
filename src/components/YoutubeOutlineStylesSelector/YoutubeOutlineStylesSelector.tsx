import React from 'react';
import { YoutubeOutlineStyles } from 'youtube/YoutubeOutlineStyles';
import { useTranslation } from 'react-i18next';

interface IYoutubeOutlineStylesSelector {
  value?: number,
  disabled?: boolean,
  style?: React.CSSProperties,
  onChange?: React.ChangeEventHandler<HTMLSelectElement>
}

const YoutubeOutlineStylesSelector = (props: IYoutubeOutlineStylesSelector) => {
  const { t } = useTranslation('YoutubeOutlineStylesSelector')
  const { disabled, ...rest } = props;
  const options = YoutubeOutlineStyles.map(item => {
    return <option key={item.id} value={item.id}>{t(item.name)}</option>
  });

  return (
    <select disabled={disabled} {...rest}>
      {options}
    </select>
  );
}

function areEqual(prevProps: IYoutubeOutlineStylesSelector, nextProps: IYoutubeOutlineStylesSelector) {
  if (prevProps === nextProps) {
    return true;
  }

  return prevProps.value === nextProps.value
    && prevProps.disabled === nextProps.disabled
    && prevProps.onChange === nextProps.onChange;
}

export default React.memo<IYoutubeOutlineStylesSelector>(YoutubeOutlineStylesSelector, areEqual);