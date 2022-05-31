import React from 'react';
import Group from './Group';
import Item from './Item';
import { useTranslation } from 'react-i18next';

interface IFileMenuProps {
  selected?: boolean;
  fileOpenDisabled?: boolean;
  projectSaveDisabled?: boolean;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
  onNewProjectClick?: React.MouseEventHandler<HTMLDivElement>;
  onOpenClick?: React.MouseEventHandler<HTMLDivElement>;
  onProjectSaveClick?: React.MouseEventHandler<HTMLDivElement>;
  onProjectSaveAsClick?: React.MouseEventHandler<HTMLDivElement>;
}


function FileMenu(props: IFileMenuProps) {
  const { t } = useTranslation()
  const title = <label>{t("File")}</label>;
  return (
    <Group title={title} selected={props.selected} onClick={props.onClick} >
      <Item onClick={props.onNewProjectClick}>
        <label>{t('NewProject')}</label>
      </Item>
      <Item onClick={props.onOpenClick} disabled={props.fileOpenDisabled}>
        <label>{t('Open')}</label>
      </Item>
      <Item onClick={props.onProjectSaveClick} disabled={props.projectSaveDisabled}>
        <label>{t('SaveProject')}</label>
      </Item>
      <Item onClick={props.onProjectSaveAsClick} disabled={props.projectSaveDisabled}>
        <label>{t('SaveAsProject')}</label>
      </Item>
    </Group>
  );
}

export default FileMenu;
