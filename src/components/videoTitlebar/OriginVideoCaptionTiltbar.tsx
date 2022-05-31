import RedoUndoContainer from "containers/RedoUndoContainer";
import RetranslateButtonCotainer from "containers/RetranslateButtonCotainer";
import VideoTitlebar from "./VideoTitlebar";
import VideoTitlebarTitle from "./VideoTitlebarTitle";


function OriginVideoCaptionTiltbar() {
  return (
    <VideoTitlebar>
      <div className='d-flex'>
        <VideoTitlebarTitle />
        <RedoUndoContainer />
      </div>
      <div style={{ marginRight: '1rem', marginBottom: '2px' }}>
        <RetranslateButtonCotainer />
      </div>
    </VideoTitlebar>
  )
}

export default OriginVideoCaptionTiltbar;