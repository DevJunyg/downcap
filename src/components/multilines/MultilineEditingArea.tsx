import React from 'react';
import MultilineListContainer from 'containers/multiline/MultilineListContainer';
import MultilineTitleBarContainer from 'containers/multiline/MultilineTitleBarContainer';
import TranslatedMultilineListContainer from 'containers/multiline/TranslatedMultilineListContainer';
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import DualMultilineListContainer from 'containers/multiline/DualMultilineListContainer';

const MultilineListDictonary = {
  "dual": () => <DualMultilineListContainer />,
  "origin": () => <MultilineListContainer />,
  "translated": () => <TranslatedMultilineListContainer />,
}

function MultilineListProvider(props: { selectedEditType?: store.EditType }) {
  const MultilineList = MultilineListDictonary[props.selectedEditType ?? 'origin'];

  return <MultilineList />;
}

const MultiLineEditingArea = React.memo(() => {
  const areaStyle = { height: '100%', overscrollBehavior: 'contain', marginLeft: '1rem' };
  const selectedEditType = ReactRedux.useSelector<
    store.RootState, store.EditType
  >(state => state.present.project.selectedEditType) ?? 'origin';

  return (
    <div style={areaStyle}>
      <MultilineTitleBarContainer selectedEditType={selectedEditType} />
      <MultilineListProvider selectedEditType={selectedEditType} />
    </div >
  )
});

export default MultiLineEditingArea;