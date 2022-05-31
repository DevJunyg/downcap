import { ProjectModelManagerV200 } from "./IProjectSaveModel/IProjectModel_V_2_0_0";
import { ProjectModelManagerV201 } from "./IProjectSaveModel/IProjectModel_V_2_0_1";
import { ProjectModelManagerV202 } from "./IProjectSaveModel/IProjectModel_V_2_0_2";
import IProjectModel_V_2_0_3, { ProjectModelManagerV203 } from "./IProjectSaveModel/IProjectModel_V_2_0_3";
import ProjectModelUpManager from "./IProjectSaveModel/ProjectModelUpManager";

type ProjectLastSaveModel = IProjectModel_V_2_0_3;

const lastVersion = '2.0.3';

const projectModelManagerDictionary: { [key: string]: ProjectModelUpManager<any, any> } = {
  '1.0.4': new ProjectModelManagerV200(),
  '2.0.0': new ProjectModelManagerV201(),
  '2.0.1': new ProjectModelManagerV202(),
  '2.0.2': new ProjectModelManagerV203()
};

export class ProjectModelManager {
  static Up(model: any): ProjectLastSaveModel {
    let prevModel = model;
    let lastModel: ProjectLastSaveModel;
    let version = model.version ?? model.projectModelVersion;

    while (version !== lastVersion) {
      const modelManager = projectModelManagerDictionary[version] ?? new ProjectModelManagerV200();
      prevModel = modelManager.Up(prevModel);
      version = prevModel.projectModelVersion;
    }
    lastModel = prevModel;

    return lastModel;
  }
}