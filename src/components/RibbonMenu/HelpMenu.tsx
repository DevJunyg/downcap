import React from 'react';
import { useTranslation } from 'react-i18next';
import Group from './Group';
import Item from './Item';

interface IHelpMenuProps {
  selected?: boolean;
  onTitleClick?: React.MouseEventHandler<HTMLDivElement>;
  onInfoClick?: React.MouseEventHandler<HTMLDivElement>;
  onShortcutClick?: React.MouseEventHandler<HTMLDivElement>;
  onNoticeClick?: React.MouseEventHandler<HTMLDivElement>;
  onInquiryClick?: React.MouseEventHandler<HTMLDivElement>;
  onHelpImageClick?: React.MouseEventHandler<HTMLDivElement>;
}

function HelpMenu(props: IHelpMenuProps) {
  const { t } = useTranslation();

  return (
    <Group
      title={<label>{t('HelpMenu')}</label>}
      selected={props.selected}
      onClick={props.onTitleClick}
      data-testid="test-id-help-title"
    >
      <Item onClick={props.onInfoClick} data-testid="test-id-help-info">
        <label>{t('Info')}</label>
      </Item>
      <Item onClick={props.onShortcutClick} data-testid="test-id-help-shortcut">
        <label>{t('Shortcut')}</label>
      </Item>
      <Item onClick={props.onNoticeClick} data-testid="test-id-help-notice">
        <label>{t('Notice')}</label>
      </Item>
      <Item onClick={props.onInquiryClick} data-testid="test-id-help-inquiry">
        <label>{t('Inquiry')}</label>
      </Item>
      <Item onClick={props.onHelpImageClick} data-testid="test-id-help-help-img">
        <label>{t('HelpImg')}</label>
      </Item>
    </Group>
  )
}


export default HelpMenu;
