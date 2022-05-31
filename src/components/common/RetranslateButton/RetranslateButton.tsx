import ImgUrls from 'ImgUrls';
import { useTranslation } from 'react-i18next';
import './RetranslateButton.scss';

interface IRetranslateButtonProps {
  onClick?: React.MouseEventHandler<HTMLButtonElement>;
}

function RetranslateButton(props: IRetranslateButtonProps) {
  const { t } = useTranslation();
  return (
    <div className="downcap-reTranslateButton-container" >
      <button className="downcap-reTranslateButton-button"
        onClick={props.onClick}>
        <img className='ReTranslate-icon'
          src={ImgUrls.translateByKo}
          alt="Retranslate">
        </img>
        <div>{t('Retranslate_Button_Text')}</div>
      </button>
    </div>
  );
}

export default RetranslateButton;