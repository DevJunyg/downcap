import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import PopUp from "components/common/PopUp";
import { IPopupProps } from "containers/PopupContainer";
import "./LetterCheckPopup.scss";
import { ILackOfLetterPayload } from 'managers/PopupManager';
import { useTranslation } from 'react-i18next';

function LetterCheckPopup(props: IPopupProps) {
  //TODO: undeinfed 처리 해야함
  const letter = ReactRedux.useSelector<store.RootState, number | undefined>(
    state => (state.present.popup.payload as ILackOfLetterPayload)?.letter
  );
  const { t } = useTranslation('LetterCheckPopup')

  return (
    <PopUp
      title={t('title')}
      CloseStopper={true}
    >
      <div className="letter-check">
        <div className="letter-check-contents center">
          <img src='https://downcap.net/client/img/warning.png' className="letter-check-icon" alt='warning' />
        </div>
        <div className="letter-check-popup-message center">
          <div>{t('letter_Lack_title')}
            <div className='letter-check-unit-content'>
              <div className='letter-check-unit'>{t('letter_Lack_About')}</div>
              <div className='letter-check-letter'>{letter}</div>
              <div className='letter-check-unit'>Letter{t('letter_Lack')}</div>
            </div>
          </div>
        </div>
        <div className='center'>
          <button className="btn letter-check-close-btn" onClick={props.onCloseClick}>
          {t('closeButton_Text')}
          </button>
        </div>
      </div>
    </PopUp>
  );
}

export default LetterCheckPopup;