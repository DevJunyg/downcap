import "JsExtensions";
import ProjectModelUpManager from './ProjectModelUpManager';
import IProjectModel_V_2_0_1 from './IProjectModel_V_2_0_1';

export default interface IProjectModel_V_2_0_2 extends Omit<IProjectModel_V_2_0_1, 'projectModelVersion'>  {
  projectModelVersion: '2.0.2';
  translateGuideOpen?: boolean;
}

export class ProjectModelManagerV202 extends ProjectModelUpManager<IProjectModel_V_2_0_2, IProjectModel_V_2_0_1> {
  public Up(model: IProjectModel_V_2_0_1): IProjectModel_V_2_0_2 {
    return {
      ...model,
      projectModelVersion: '2.0.2'
    }
  }
}