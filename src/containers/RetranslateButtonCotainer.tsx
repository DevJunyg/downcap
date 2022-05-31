import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import RetranslateButton from 'components/common/RetranslateButton';
import PopupManager from 'managers/PopupManager';

function RetranslateButtonCotainer() {
  const captions = ReactRedux.useSelector<
    store.RootState, store.ICaptionsParagraph[] | undefined
  >(state => state.present.originCaption.captions);

  const translatedCaptions = ReactRedux.useSelector<
    store.RootState, store.ICaptionTranslatedParagraphWithId[] | undefined
  >(state => state.present.translatedCaption.captions);

  const dispatch = ReactRedux.useDispatch();

  if (translatedCaptions === undefined || !captions?.any()) {
    return null;
  }

  return (
    <RetranslateButton onClick={_handleClick} />
  )

  function _handleClick() {
    PopupManager.openRetranslatePopup(dispatch);
  }
}

export default RetranslateButtonCotainer;