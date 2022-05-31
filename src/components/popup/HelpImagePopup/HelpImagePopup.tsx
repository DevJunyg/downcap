import './HelpImage.scss';
import { IPopupProps } from 'containers/PopupContainer';
import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import { useTranslation } from 'react-i18next';

function HelpImagePopup(props: IPopupProps) {
  const selected = ReactRedux.useSelector<store.RootState, store.EditType>(
    state => state.present.project.selectedEditType
  ) ?? 'origin';

  const { i18n } = useTranslation();

  return (
    <div
      className={`help-image ${i18n.language}-${selected}-help-image`}
      tabIndex={0}
      onClick={props.onCloseClick}
    />
  );
}

export default HelpImagePopup;
