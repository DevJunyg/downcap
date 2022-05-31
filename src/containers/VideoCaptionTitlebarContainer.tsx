import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import OriginVideoCaptionTiltbar from "components/videoTitlebar/OriginVideoCaptionTiltbar";
import TranslateVideoCaptionTiltbar from "components/videoTitlebar/TranslateVideoCaptionTiltbar";
import DualVideoCaptionTiltbar from 'components/videoTitlebar/DualVideoCaptionTiltbar';

const titlebarDict: { [type in store.EditType]: typeof OriginVideoCaptionTiltbar | typeof TranslateVideoCaptionTiltbar | typeof DualVideoCaptionTiltbar } = {
  origin: OriginVideoCaptionTiltbar,
  translated: TranslateVideoCaptionTiltbar,
  dual: DualVideoCaptionTiltbar
}

export default function VideoCaptionTitlebarContainer() {
  const selectedEditType = ReactRedux.useSelector<store.RootState, store.EditType | undefined>(
    state => state.present.project.selectedEditType
  ) ?? 'origin';

  const VideoCaptionTitlebar = titlebarDict[selectedEditType];
  return (
    <VideoCaptionTitlebar />
  )
}