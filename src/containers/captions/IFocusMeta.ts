import { ISelection } from 'models/ISelection';
import * as store from 'storeV2';

export default interface IFocusMeta extends store.IIndexPath {
  selection?: ISelection;
}