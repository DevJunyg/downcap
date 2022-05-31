import "JsExtensions";
import ProjectModelUpManager from './ProjectModelUpManager';
import IProjectModel_V_2_0_2 from './IProjectModel_V_2_0_2';
import { ITranslateTask } from "storeV2/modules/translateTask";

export default interface IProjectModel_V_2_0_3 extends Omit<IProjectModel_V_2_0_2, 'projectModelVersion'>  {
  projectModelVersion: '2.0.3';
  translateTaskList?: ITranslateTask[];
}

export class ProjectModelManagerV203 extends ProjectModelUpManager<IProjectModel_V_2_0_3, IProjectModel_V_2_0_2> {
  public Up(model: IProjectModel_V_2_0_2): IProjectModel_V_2_0_3 {
    return {
      ...model,
      projectModelVersion: '2.0.3'
    }
  }
}