import React from "react";
import FileMenu from "components/RibbonMenu/FileMenu";
import IpcSender from "lib/IpcSender";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import ProjectIOManager from "managers/ProjectIOManagerV2";
import PopupManager from "managers/PopupManager";
import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import { IRinbbonMenuItemProps } from "./RibbonMenuContainer";
import ProjectManager from "managers/ProjectManager";
import PathHelper from "PathHelper";
import ClientAnalysisService from "services/ClientAnalysisService";

const logger = ReactLoggerFactoryHelper.build('FileMenuContainer');

interface IFileMenuContainerProps extends IRinbbonMenuItemProps {

}

function FileMenuContainer(props: IFileMenuContainerProps) {
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

  const existAnyCaption = existOriginCaptions
    || existTranslatedCaptions
    || existMultilineCaptions
    || existTranslatedMultilineCaptions;
  const dispatch = ReactRedux.useDispatch();
  const rootStore = ReactRedux.useStore<store.RootState>();

  return (
    <FileMenu
      selected={props.selected}
      projectSaveDisabled={!videoPath && !existAnyCaption}
      onClick={props.onTitleClick}
      onNewProjectClick={() => {
        PopupManager.openNewProjectPopup(dispatch)
      }}
      onOpenClick={_handleOpenClick}
      onProjectSaveAsClick={_handleProjectSaveAsClickAsync}
      onProjectSaveClick={_handleProjectSaveClickAsync}
    />
  );

  function _handleOpenClick(evt: React.MouseEvent<HTMLDivElement>) {
    ClientAnalysisService.fileOpenClick();
    IpcSender.sendProjectFileOpen();
  }

  async function _saveProejctAsync(saveActionAsync: (state: store.RootState) => Promise<string | null>) {
    try {
      const result = await saveActionAsync(rootStore.getState());
      if (result) {
        const name = PathHelper.getFileNameWithoutExtension(result)
        name && ProjectManager.setProjectName(name);
        PopupManager.openSaveSuccessPopup(dispatch);
      }
    } catch (err) {
      err instanceof Error && logger.logError(`SaveAs failed`, err);
    }
  }

  function _handleProjectSaveClickAsync(_evt: React.MouseEvent<HTMLDivElement>) {
    ClientAnalysisService.projectSaveClick();
    _saveProejctAsync(ProjectIOManager.saveAsync);
  }

  function _handleProjectSaveAsClickAsync(_evt: React.MouseEvent<HTMLDivElement>) {
    ClientAnalysisService.projectSaveAsClick();
    _saveProejctAsync(ProjectIOManager.saveAsAsync);
  }
}

export default FileMenuContainer;
