import React from 'react';
import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import ExportMenu from 'components/RibbonMenu/ExportMenu';
import PopupManager from 'managers/PopupManager';
import ProjectManager, { StcStatusChangeEvent, StcStatusType } from 'managers/ProjectManager';
import { IRinbbonMenuItemProps } from './RibbonMenuContainer';

interface IExportMenuContainerProps extends IRinbbonMenuItemProps { }

function ExportMenuContainer(props: IExportMenuContainerProps) {
  const videoPath = ReactRedux.useSelector<store.RootState, string | undefined>(
    state => state.present.project.videoPath
  );

  const existOriginCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.originCaption.captions?.any() ?? false
  );

  const existTranslatedCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.translatedCaption.captions?.any() ?? false
  );

  const existMultilineCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.multiline.captions?.any() ?? false
  );

  const existTranslatedMultilineCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.translatedMultiline.captions?.any() ?? false
  );

  const existOriginAndTranslatedCaption = existOriginCaptions || existTranslatedCaptions;
  const existAnyCaption = existOriginAndTranslatedCaption || existMultilineCaptions || existTranslatedMultilineCaptions;

  const [stcStatus, setStcStatus] = React.useState<StcStatusType>(ProjectManager.stcStatus)
  React.useEffect(() => {
    ProjectManager.onStcStatusChange(_handleStcState)

    return () => {
      ProjectManager.removeStcStatusChange(_handleStcState);
    }
  });

  const splitVideoPath = videoPath?.split("/")[2];
  const isYoutubeVideo = splitVideoPath === "youtu.be"|| splitVideoPath === "www.youtube.com";

  const dispath = ReactRedux.useDispatch();

  return (
    <ExportMenu
      selected={props.selected}
      captionsExportDisabled={stcStatus === 'Pending' || !existOriginAndTranslatedCaption}
      videoExportDisabled={!videoPath || isYoutubeVideo || !existAnyCaption}
      onClick={props.onTitleClick}
      onCaptionsExportClick={() => PopupManager.openCaptionsExportPopup(dispath)}
      onVideoExportClick={() => PopupManager.openVideoExportSettingPopup(dispath)}
    />
  );

  function _handleStcState(evt: StcStatusChangeEvent) {
    setStcStatus(evt.status);
  }
}

export default ExportMenuContainer;