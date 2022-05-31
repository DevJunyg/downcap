import * as Redux from 'redux'

const projectHistoryActions = (dispatch: Redux.Dispatch) => ({
  open: () => dispatch({
    type: "@@project-open"
  }),
  runStc: () => dispatch({
    type: "@@project-run-stc"
  }),
  changeTab: () => dispatch({
    type: "@@project-change-tab"
  }),
  projectLoad: () => dispatch({
    type: "@@project-load"
  }),
  commit: () => dispatch({
    type: "@@project-commit"
  })
})

export default projectHistoryActions;