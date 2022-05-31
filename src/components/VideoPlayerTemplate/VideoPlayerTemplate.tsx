import React, { forwardRef } from 'react';
import VideoPlayer from 'components/VideoPlayer';
import './VideoPlayerTemplate.scss';
import ClassNameHelper from 'ClassNameHelper';
import { useTranslation } from 'react-i18next';

interface IProgressBarProps {
  successed?: boolean;
  animationDuration?: object;
}

function ProgressBar(props: IProgressBarProps) {
  const { t } = useTranslation();

  return (
    <div className="progress-bar-box">
      <div className="progress-bar stripes animated reverse slower">
        <div className="progress-bar-text">{t('progressBar_Text')}</div>
        <span className={ClassNameHelper.concat('progress-bar-inner', props.successed ? 'success' : 'animated')}
          style={props.animationDuration}></span>
      </div>
    </div >
  );
}

function calculationEstimatedTime(duration: number) {
  return Math.ceil(Math.max(duration * 0.7, 60));
}

interface IVideoPlayerTemplateProps {
  successed?: boolean;
  renderedProgressBox?: boolean;
  duration?: number;
  videoPath?: string;
  height?: number | string;
  onClick?: React.MouseEventHandler;
}

const VideoPlayerTemplate = forwardRef<HTMLDivElement, React.PropsWithChildren<IVideoPlayerTemplateProps>>((props, ref) => {
  const { successed, renderedProgressBox, duration, children } = props;
  const estimatedTime = duration !== undefined ? calculationEstimatedTime(duration) : null;
  const animationDuration = props.successed ? undefined : { animationDuration: estimatedTime + "s" }

  return (
    <div ref={ref} className="video-player-template" >
      <div className="display-video-box" style={{ height: props.height }} >
        <VideoPlayer onClick={props.onClick} />
        {children}
      </div>
      {renderedProgressBox && (
        <ProgressBar successed={successed} animationDuration={animationDuration} />
      )}
    </div>
  );
})

export default VideoPlayerTemplate;
