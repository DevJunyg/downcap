import RedoUndoContainer from "containers/RedoUndoContainer";
import TranslateProgressbarCotainer from "containers/TranslateProgressbarCotainer";
import VideoTitlebar from "./VideoTitlebar";
import VideoTitlebarTitle from "./VideoTitlebarTitle";

interface IDualVideoCaptionTiltbarProps {
}

function DualVideoCaptionTiltbar(props: IDualVideoCaptionTiltbarProps) {
  return (
    <VideoTitlebar>
      <div className='d-flex'>
        <VideoTitlebarTitle />
        <RedoUndoContainer />
        <TranslateProgressbarCotainer />
      </div>
    </VideoTitlebar>
  )
}

export default DualVideoCaptionTiltbar;