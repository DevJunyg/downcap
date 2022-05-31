import * as projectControlActions from 'storeV2/modules/projectControl';
import { default as rootStore } from 'storeV2';
import * as store from 'storeV2';
import * as Redux from 'redux'

class ProjectControlManager {
  static changeStyleEditType(store: typeof rootStore, type: store.StyleEditType | null) {

    const selectedStyleEditType = store.getState().present.projectCotrol.selectedStyleEditType;
    if (type === selectedStyleEditType) {
      return;
    }

    const dispatch = store.dispatch;
    const ProjectCotronlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectCotronlActions.setSelectedStyleEditType(type);
  }

  static clearFocusMeta(store: typeof rootStore) {
    const dispatch = store.dispatch;
    const ProjectCotronlActions = Redux.bindActionCreators(projectControlActions, dispatch);
    ProjectCotronlActions.setFocusParagraphMetas(null);
  }
}

export default ProjectControlManager;