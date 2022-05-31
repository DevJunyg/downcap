import React from 'react';
import './YouTubeVideoOpenPopup.scss';

import AcceptCancelPopup from 'components/common/PopUp/AcceptCancelPopup';
import { SelectOptionType } from 'containers/popup/YouTubeVideoOpenPopupContainer';
import { YoutubeCaption } from 'models/YoutubeCaptionListResponse';
import { useTranslation } from 'react-i18next';
import SttInfo from './SttInfo';
import LocalCaptionLoadInfo from './LocalCaptionLoadInfo';
import CaptionLoadInfo from './CaptionLoadInfo';
import CaptionLoadSelector from './CaptionLoadSelector';


interface IYoutubePlayListSelectPopupProps {
  stcEstimatedTime?: number;
  paymentLetter?: number;
  captionDoesNotExist?: boolean;
  captions?: YoutubeCaption[];
  srtFileName?: string;
  selectedOption?: SelectOptionType;
  videoTitle?: string;
  onCancelClick?: React.MouseEventHandler<HTMLDivElement>;
  onCloseClick?: React.MouseEventHandler<HTMLDivElement>;
  onAcceptClick?: React.MouseEventHandler<HTMLDivElement>;
  onOptionChange?: React.ChangeEventHandler<HTMLInputElement>;
  onYouTubeCaptionSelectChange?: React.ChangeEventHandler<HTMLSelectElement>;
  onYouTubeCaptionLoadHelpMessageClick?: React.MouseEventHandler<HTMLDivElement>; 
  onSrtFileOpenClick?: React.MouseEventHandler<HTMLDivElement>;
}

function YouTubeVideoOpenPopup(props: IYoutubePlayListSelectPopupProps) {
  const { t } = useTranslation('YouTubeVideoOpenPopup');
  const detailInfoGeneratorDictionary: { [name in SelectOptionType]?: () => JSX.Element } = {
    "stt": () => (
      <SttInfo
        duration={props.stcEstimatedTime}
        paymentLetter={props.paymentLetter}
      />
    ),
    "localCaptionLoad": () => (
      <LocalCaptionLoadInfo
        srtFileName={props.srtFileName}
        onClick={props.onSrtFileOpenClick}
      />
    ),
    "youTubeCaption": () => (
      <CaptionLoadInfo
        captionDoesNotExist={props.captionDoesNotExist}
        captions={props.captions}
        onClick={props.onYouTubeCaptionLoadHelpMessageClick}
      />
    )
  }

  const DetailInfo = props.selectedOption && detailInfoGeneratorDictionary[props.selectedOption];

  const captionOptions = props.selectedOption === 'youTubeCaption'
    ? <CaptionLoadSelector captions={props.captions} onChange={props.onYouTubeCaptionSelectChange} />
    : <label htmlFor="youTubeCaption">{t('youtubeCaption')}</label>

  return (
    <AcceptCancelPopup
      title={`${t('title')} - ${props.videoTitle}`}
      titlebarMaxWidth="250px"
      closeContent={t('closeContent')}
      acceptContent={t('acceptContent')}
      onAcceptClick={props.onAcceptClick}
      onCancelClick={props.onCancelClick}
      onCloseClick={props.onCloseClick}
    >
      <div className="youtube-play-list-select-contents">
        <div className="select-box middle-line">
          <label className="content-title">{t('youtubeCaption')}</label>
          <div className="selectable-elements">
            <div className="select-element">
              <input type="radio"
                name="format"
                id="stt"
                value="stt"
                onChange={props.onOptionChange}
                checked={props.selectedOption === 'stt'}
              />
              <label htmlFor="stt">{t('loadVideo_Option_Stt')}</label>
            </div>
            <div className="select-element">
              <input type="radio"
                name="youTubeCaption"
                id="youTubeCaption"
                value="youTubeCaption"
                onChange={props.onOptionChange}
                checked={props.selectedOption === 'youTubeCaption'}
              />
              {captionOptions}
            </div>
            <div className="select-element">
              <input type="radio"
                name="format"
                id="video"
                value="video"
                onChange={props.onOptionChange}
                checked={props.selectedOption === 'video'}
              />
              <label htmlFor="video">{t('loadVideo_Option_Video')}</label>
            </div>
            <div className="select-element">
              <input type="radio"
                name="format"
                id="localCaptionLoad"
                value="localCaptionLoad"
                onChange={props.onOptionChange}
                checked={props.selectedOption === 'localCaptionLoad'}
              />
              <label htmlFor="localCaptionLoad">{t('loadVideo_Option_Caption')}</label>
            </div>
          </div>
        </div>
        {DetailInfo && <DetailInfo />}
      </div>
      <div id='playlist-popup-player' className='playlist-popup-player' />
    </AcceptCancelPopup >
  )
}

export default YouTubeVideoOpenPopup;
