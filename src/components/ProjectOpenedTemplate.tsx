import ProjectControlPannelContainer from "containers/ProjectControlPannelContainer";
import VideoPlayerContainer from "containers/VideoPlayerContainer";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';

interface IProjectOpenedTemplateProps {
  videoAreaHeight: string;
}

function ProjectOpenedTemplate(props: IProjectOpenedTemplateProps) {
  const projectProprtiesPaddingHeight = '1rem';

  const videoPath = ReactRedux.useSelector<store.RootState, string | undefined>(
    state => state.present.project.videoPath
  );

  return (
    <div className="editor-template-cotent left-content">
      <VideoPlayerContainer
        path={videoPath}
        videoAreaHeight={props.videoAreaHeight}
      />
      <ProjectControlPannelContainer
        height={`calc(100% - ${projectProprtiesPaddingHeight} - ${props.videoAreaHeight})`}
      />
    </div>
  );
}

export default ProjectOpenedTemplate;
