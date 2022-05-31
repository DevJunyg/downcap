import { Component } from 'react';
import { connect } from 'react-redux';

import * as store from 'storeV2';
import Overlay from 'components/Overlay';
import DualCaptionOverlayLine from 'components/Overlay/DualCaptionOverlayLine';
import PlayerContext from 'contexts/PlayerContext';
import downcapOptions from 'downcapOptions';
import IArea from 'IArea';
import Player, { PlayerEvent } from 'lib/player/Player';
import "JsExtensions";
import BinarySearchHelper from 'lib/BinarySearchHelper';
import ComparerHelper from 'lib/ComparerHelper';

interface IDualCaptionOverlayContainerStateProps {
  dual?: store.IEventParagraph[];
  defaultStyle?: store.ICaptionsStyle;
  selectedPreviewType?: store.PreviewType;
  sequence?: store.SequenceType[];
  originDefaultLocation?: store.ILocation;
  translatedDefaultLocation?: store.ILocation;
}

interface IDualCaptionOverlayContainerOwnProps {
  fontUnitSize?: number;
  area?: IArea;
}

interface IDualCaptionOverlayContainerProps extends IDualCaptionOverlayContainerOwnProps, IDualCaptionOverlayContainerStateProps { }

interface IDualCaptionOverlayContainerState {
  currentTime: number;
}

class DualCaptionOverlayContainer extends Component<IDualCaptionOverlayContainerProps, IDualCaptionOverlayContainerState> {
  static contextType = PlayerContext;

  state: IDualCaptionOverlayContainerState = {
    currentTime: this.context.player?.isReady ? this.context.player.duration : -Infinity
  }

  setCurrentTime = (time: number) => this.setState(state => ({
    ...state,
    currentTime: time
  }))

  handleTimeUpdate = (evt: PlayerEvent) => {
    this.setCurrentTime(evt.target.currentTime);
  }

  componentDidMount() {
    /**  Manage dual caption updates in @see DualCaptionListContainer */
    const player = this.context.player as Player | null;
    if (player) {
      if (player.isReady) {
        player.addTimeUpdateEventListener(this.handleTimeUpdate);
      } else {
        const readyEvent = () => {
          player.addTimeUpdateEventListener(this.handleTimeUpdate);
          player.removeReadyEventListener(readyEvent);
        }
        player.addReadyEventListener(readyEvent);
      }
    }
    this.setCurrentTime(player?.isReady ? player.currentTime : 0);
  }

  componentWillUnmount() {
    this.context.player?.removeTimeUpdateEventListener(this.handleTimeUpdate);
  }

  render() {
    if (!this.props.dual?.any()) {
      return null;
    }

    const fontUnitSize = this.props.fontUnitSize ?? downcapOptions.defaultFontSize;
    const area = { x: 16, y: 99, width: 1, height: 1 };
    const player = this.context.player as Player;
    if (player?.isReady) {
      area.width = player.width;
      area.height = player.height;
    }

    const captionIndex = BinarySearchHelper.findIndex(
      this.props.dual,
      this.state.currentTime,
      (left, right) => ComparerHelper.compareTimeAndCurrentTime({ start: left.start, end: left.end }, right)
    );

    const dual = this.props.dual[captionIndex];
    if (!dual) {
      return null;
    }

    const defaultLocationDic = {
      origin: this.props.originDefaultLocation,
      translated: this.props.translatedDefaultLocation
    }

    const defaultLocation = defaultLocationDic[(this.props.sequence && this.props.sequence[0]) ?? 'origin'];

    return (
      <Overlay area={area}
        selectedPreviewType={this.props.selectedPreviewType}
        horizontal={dual.horizontal ?? defaultLocation?.horizontal ?? downcapOptions.defaultLocation.horizontal}
        vertical={dual.vertical ?? defaultLocation?.vertical ?? downcapOptions.defaultLocation.vertical}
        style={{ padding: 0 }}
      >
        {dual?.lines.map((line, index) => (
          <DualCaptionOverlayLine
            selectedPreviewType={this.props.selectedPreviewType}
            key={`${captionIndex}-${index}`}
            line={line}
            fontUnitSize={fontUnitSize}
          />))}
      </Overlay>
    )
  }
}

export default connect<IDualCaptionOverlayContainerStateProps, {}, IDualCaptionOverlayContainerOwnProps, store.RootState>(
  state => ({
    dual: state.present.dualCaption.captions,
    selectedPreviewType: state.present.project.selectedPreviewType,
    sequence: state.present.project.sequence,
    originDefaultLocation: state.present.originCaption.defaultLocation,
    translatedDefaultLocation: state.present.translatedCaption.defaultLocation,
  } as IDualCaptionOverlayContainerStateProps)
)(DualCaptionOverlayContainer)
