import ClassNameHelper from 'ClassNameHelper';
import './ProgressBar.scss';

interface IProgressBarProps {
  className?: string;
  translationPercentage?: number;
  innerText?: string
}

function ProgressBar(props: IProgressBarProps) {
  return (
    <div className={ClassNameHelper.concat('trans-progress-bar background-bar', props.className)}>
      <div className='trans-progress-bar loading-bar' style={{ width: `${(props.translationPercentage ?? 0) * 100}%` }}>
        <div className='loading-bar-text'>
          <span />
          <label>{props.innerText}</label>
        </div>
      </div>
    </div>
  );
}

export default ProgressBar;