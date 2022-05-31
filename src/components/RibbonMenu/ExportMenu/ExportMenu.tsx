import Item from "../Item";
import Group from "../Group";
import { useTranslation } from "react-i18next";

interface IExportMenu {
  selected?: boolean;
  captionsExportDisabled?: boolean;
  videoExportDisabled?: boolean;
  onClick?: React.MouseEventHandler;
  onCaptionsExportClick?: React.MouseEventHandler;
  onVideoExportClick?: React.MouseEventHandler;
}

function ExportMenu(props: IExportMenu) {
  const { t } = useTranslation();
  return (
    <Group title={<label>{t('Export')}</label>} selected={props.selected} onClick={props.onClick} >
      <Item onClick={props.onCaptionsExportClick} disabled={props.captionsExportDisabled}>
        <label>{t('SubtitlesExport')}</label>
      </Item>
      <Item onClick={props.onVideoExportClick} disabled={props.videoExportDisabled}>
        <label>{t('VideoExport')}</label>
      </Item>
    </Group>
  );
}

export default ExportMenu;