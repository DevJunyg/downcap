import RedoIcon from "components/icons/RedoIcon";
import UndoIcon from "components/icons/UndoIcon";
import "JsExtensions";
import React from "react";
import * as ReactRedux from 'react-redux';
import { StateWithHistory } from "redux-undo";
import reduUndoCreatorActions from "storeV2/reduUndoCreatorActions";

function RedoUndoContainer<State = {}>() {
  const past = ReactRedux.useSelector<StateWithHistory<State>, StateWithHistory<State>['past']>(store => store.past);
  const future = ReactRedux.useSelector<StateWithHistory<State>, StateWithHistory<State>['future']>(store => store.future);
  const dispatch = ReactRedux.useDispatch();
  const RedoUndoActions = React.useMemo(() => reduUndoCreatorActions(dispatch), [dispatch]);

  return (
    <div className="d-flex justify-content-space-evenly redo-undo align-items-center">
      <UndoIcon className="icon undo-icon" disabled={past.length === 0} title="실행취소" onClick={() => RedoUndoActions.undo()} />
      <RedoIcon className="icon undo-redo" disabled={future.length === 0} title="다시실행" onClick={() => RedoUndoActions.redo()} />
    </div>
  )
}
export default React.memo(RedoUndoContainer);