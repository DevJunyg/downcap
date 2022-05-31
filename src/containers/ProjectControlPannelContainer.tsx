import React from 'react';
import ProjectPropertyControlPanel from 'components/ProjectPropertyControlPanel';
import StylesControlContainer from 'containers/StylesControlContainer'
import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import * as Redux from 'redux';
import * as projectActions from 'storeV2/modules/project';
import ClientAnalysisService from 'services/ClientAnalysisService';

interface IProjectControlPannelProps {
  height: string;
}

function ProjectControlPannelContainer(props: IProjectControlPannelProps) {
  const [tabIndex, setTabIndex] = React.useState<number>(0);

  const selectedPreviewType = ReactRedux.useSelector<store.RootState, store.PreviewType>(
    state => state.present.project.selectedPreviewType as store.PreviewType | undefined ?? 'web'
  );

  const dispatch = ReactRedux.useDispatch();
  const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);

  const TabComponents = [<StylesControlContainer />];

  return (
    <ProjectPropertyControlPanel
      tabComponent={TabComponents[tabIndex]}
      selectedPreviewName={selectedPreviewType}
      tabIndex={tabIndex}
      height={props.height}
      onTabIndexChange={setTabIndex}
      onChange={_handleSelectedPreviewNameChange}
    />
  );

  function _handleSelectedPreviewNameChange(evt: React.MouseEvent, value: store.PreviewType) {
    ClientAnalysisService.previewClick(value);
    ProjectActions.setSelectedPreviewName(value);
  }
}

export default ProjectControlPannelContainer;