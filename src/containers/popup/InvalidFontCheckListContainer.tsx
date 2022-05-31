import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import { IPopupProps } from 'containers/PopupContainer';
import { InvalidFontCheckPopup } from 'components/popup';
import { InvalidFontCheckLineContainer } from '.';
import { IFontCheckPayload } from 'managers/PopupManager';

function createInvalidList(invalidCaptions: store.IFocusLineMeta[]) {
  const invalidList = invalidCaptions.map(
    (caption: store.IFocusLineMeta, key: number) => (
      <InvalidFontCheckLineContainer
        key={key}
        focusLineMetaData={caption}
      />
    )
  );

  return invalidList;
}

function InvalidFontCheckListContainer(props: IPopupProps) {
  const payload = ReactRedux.useSelector<store.RootState, IFontCheckPayload | undefined>(state => state.present.popup.payload as IFontCheckPayload | undefined);

  return (payload && (
    <InvalidFontCheckPopup
      font={payload.invalidFont}
      fontCheckList={createInvalidList(payload.invalidCaptions)}
      onCloseClick={props.onCloseClick}
    />
  )) ?? null;
}

export default InvalidFontCheckListContainer;