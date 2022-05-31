import TranslatedCaptionMenu from "components/TranslatedCaptionMenu";
import RedoUndoContainer from "containers/RedoUndoContainer";
import TranslateProgressbarCotainer from "containers/TranslateProgressbarCotainer";
import VideoTitlebar from "./VideoTitlebar";
import VideoTitlebarTitle from "./VideoTitlebarTitle";

interface ITranslateVideoCaptionTiltbarProps {
}

function TranslateVideoCaptionTiltbar(props: ITranslateVideoCaptionTiltbarProps) {
  return (
    <VideoTitlebar>
      <div className='d-flex'>
        <VideoTitlebarTitle />
        <RedoUndoContainer />
        <TranslateProgressbarCotainer />
      </div>
      <TranslatedCaptionMenu />
    </VideoTitlebar>
  )
}

export default TranslateVideoCaptionTiltbar;