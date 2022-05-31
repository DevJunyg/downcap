import { createAction } from "redux-actions";
import * as segaActionTypes from "./sagaActionTypes";
import * as store from "storeV2";
import { ITranslateMultilineUpdatePayload } from "./sagas";

export const addTranslatedMultilineByOriginMultiline = createAction<store.ICaptionsParagraph>(
  segaActionTypes.ADD_TRANSLATE_MULTILINE
);

export const createTranslatedMultilineByOriginMultiline = createAction<store.ICaptionsParagraph>(
  segaActionTypes.CREATE_TRANSLATE_MULTILINE
);

export const updateTranslatedMultiline = createAction<ITranslateMultilineUpdatePayload>(
  segaActionTypes.UPDATE_TRANSLATE_MULTILINE
);
