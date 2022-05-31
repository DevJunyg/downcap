import * as store from 'storeV2';
import { IdFieldDictionary } from 'storeV2/IdGenerator';
import { IProjectStoreState } from 'storeV2/modules/project';
import ProjectModelUpManager from './ProjectModelUpManager';
import "JsExtensions";
import IProjectModel_V_2_0_0 from './IProjectModel_V_2_0_0';

export default interface IProjectModel_V_2_0_1 {
  projectModelVersion: '2.0.1';
  project: IProjectStoreState;
  captionIds: IdFieldDictionary;
  originCaption?: store.ICaptionsParagraph[];
  originStyle?: store.ICaptionsStyle;
  originLocation?: store.ILocation;
  translatedCaption?: store.ICaptionTranslatedParagraphWithId[];
  translatedStyle?: store.ICaptionsStyle;
  translatedLocation?: store.ILocation;
  multiline?: store.ICaptionsParagraph[];
  multilineStyle?: store.ICaptionsStyle;
  multilineLocation?: store.ILocation;
  translatedMultiline?: store.ITranslatedMultilineCaption[];
  translatedMultilineStyle?: store.ICaptionsStyle;
  translatedMultilineLocation?: store.ILocation;
  translatedMultilineCheckPoint?: number;
}

export class ProjectModelManagerV201 extends ProjectModelUpManager<IProjectModel_V_2_0_1, IProjectModel_V_2_0_0> {
  public Up(model: IProjectModel_V_2_0_0): IProjectModel_V_2_0_1 {
    return {
      ...model,
      projectModelVersion: '2.0.1'
    }
  }
}