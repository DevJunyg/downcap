import ReactRedux from "react-redux";
import { ActionCreators as UndoActionCreators } from 'redux-undo'

export default (dispatch: ReturnType<typeof ReactRedux.useDispatch>) => ({
  undo: () => dispatch(UndoActionCreators.undo()),
  redo: () => dispatch(UndoActionCreators.redo())
})
