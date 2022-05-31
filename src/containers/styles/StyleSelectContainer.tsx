import StyleEditSelector from 'components/FomatControl/StyleEditSelector';
import React from 'react';
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as Redux from 'redux';
import * as projectControlActions from 'storeV2/modules/projectControl';

interface IStyleSelectContainerProps {
  disabled?: boolean
}

const StyleSelectContainer = (props: IStyleSelectContainerProps) => {
  const selectedStyleEditType = ReactRedux.useSelector<
    store.RootState, store.StyleEditType | undefined
  >(state => state.present.projectCotrol.selectedStyleEditType);

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, store.IFocusParagraphMeta[] | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);


  const focusParagraphMeta = focusParagraphMetas?.first();
  const dispatch = ReactRedux.useDispatch();

  return (
    <StyleEditSelector
      value={selectedStyleEditType}
      disabled={focusParagraphMeta === undefined}
      wordSelectDisabled={
        focusParagraphMeta?.type === "multiline"
        || focusParagraphMeta?.type === "translatedMultiline"
        || focusParagraphMeta?.path.wordIndex === undefined
      }
      onChange={_handleChange}
    />
  )

  function _handleChange(
    event: React.MouseEvent<HTMLElement>,
    value: store.StyleEditType | null
  ): void {

    if (value === null) {
      return;
    }

    if (selectedStyleEditType !== value) {
      const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);
      ProjectControlActions.setSelectedStyleEditType(value);
    }
  }
}

export default React.memo<IStyleSelectContainerProps>(StyleSelectContainer, (prevProps, nextProps) => {
  return prevProps.disabled !== nextProps.disabled;
});