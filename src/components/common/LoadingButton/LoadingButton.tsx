import './LoadingButton.scss';
import CycleSpin from 'components/common/CycleSpin';

interface ILoadingButtonProps {
  loading?: boolean;
  buttonIconSrc?: string;
  buttonLabel?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function LoadingButton(props: ILoadingButtonProps) {
  return (
    <div
      className="downcap-loadingButton-container"
      data-testid={'test-id-loading-button'}
      onClick={props.loading ? undefined : props.onClick}>
      {props.loading
        ? <CycleSpin fontSize={"2rem"} />
        : (
          <>
            <img
              className="downcap-loadingButton-icon"
              src={props.buttonIconSrc}
              alt="buttonIcon" />
            <label className="downcap-loadingButton-label">{props.buttonLabel}</label>
          </>
        )
      }
    </div>
  );
}

export default LoadingButton;