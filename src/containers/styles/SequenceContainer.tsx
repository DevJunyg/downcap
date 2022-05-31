import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import { bindActionCreators } from "redux";
import * as projectActions from 'storeV2/modules/project';

import DualSubtitleSequence from 'components/DualSubtitleSequence';

const exam = {
  origin: '영어 자막 맛집은 다운캡',
  translated: 'Downcap is must-go restaurant to English subtitle'
};

const dispatch = store.default.dispatch;

function SequenceContainer() {
  const sequence = ReactRedux.useSelector<
    store.RootState,
    store.SequenceType[]
  >(state => state.present.project.sequence);

  return (
    <DualSubtitleSequence
      first={exam[sequence[0]]}
      second={exam[sequence[1]]}
      onClick={_handleClick} />
  );

  function _handleClick() {
    const ProjectActions = bindActionCreators(projectActions, dispatch);
    ProjectActions.setSequence([sequence[1], sequence[0]]);
  }
}

export default SequenceContainer;
