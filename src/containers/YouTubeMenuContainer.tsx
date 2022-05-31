import React from 'react';
import YoutubeMenu from 'components/RibbonMenu/YoutubeMenu';
import PopupManager from 'managers/PopupManager';
import * as store from 'storeV2';
import * as windows from 'lib/windows';
import * as ReactRedux from 'react-redux';
import { IRinbbonMenuItemProps } from './RibbonMenuContainer';
import ProjectManager, { StcStatusChangeEvent, StcStatusType } from 'managers/ProjectManager';

interface IYouTubeMenuContainer extends IRinbbonMenuItemProps {
}

function YouTubeMenuContainer(props: IYouTubeMenuContainer) {
  const existOriginCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.originCaption.captions?.any() ?? false
  );

  const existTranslatedCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.translatedCaption.captions?.any() ?? false
  )

  const existMultilineCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.multiline.captions?.any() ?? false
  );

  const existTranslatedMultilineCaptions = ReactRedux.useSelector<store.RootState, boolean>(
    state => state.present.translatedMultiline.captions?.any() ?? false
  )

  const dispatch = ReactRedux.useDispatch();
  
  const existAnyCaption = existOriginCaptions || existTranslatedCaptions || existMultilineCaptions || existTranslatedMultilineCaptions;

  const [stcStatus, setStcStatus] = React.useState<StcStatusType>(ProjectManager.stcStatus)
  React.useEffect(() => {
    ProjectManager.onStcStatusChange(_handleStcState)

    return () => {
      ProjectManager.removeStcStatusChange(_handleStcState);
    }
  });

  return (
    <YoutubeMenu selected={props.selected}
      onTitleClick={props.onTitleClick}
      captionsUploadDisabled={!existAnyCaption || stcStatus === "Pending"}
      onYouTubeCaptionsUploadClick={_handleYouTubeCaptionsUploadClick}
      onYouTubeVideoUploadClick={_handleYoutubeVideoUploadClick}
    />
  )

  function _handleYouTubeCaptionsUploadClick(evt: React.MouseEvent<HTMLDivElement>) {
    PopupManager.openYoutubeCaptionUploadPopup(dispatch);
  }


  function _handleYoutubeVideoUploadClick(evt: React.MouseEvent<HTMLDivElement>) {
    windows.youtubeUploadVideoSelect();
  }

  function _handleStcState(evt: StcStatusChangeEvent) {
    setStcStatus(evt.status);
  }
}

export default YouTubeMenuContainer;