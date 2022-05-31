import "JsExtensions";
import * as store from "storeV2";
import ParagraphCaptionsHelper from "helpers/ParagraphCaptionsHelper";

interface ICaptionObj {
  originCaption?: store.ICaptionsParagraph[],
  translatedCaption?: store.ICaptionTranslatedParagraphWithId[],
  multiline?: store.ICaptionsParagraph[],
  translatedMultiline?: store.ITranslatedMultilineCaption[]
}
export default class OverlayHelper {
  static getStartTimeByfocusedParagraph(
    captions: ICaptionObj,
    focusType?: store.KineCaptionType,
    focusPath?: store.IIndexPath
  ) {
    if (focusType === undefined || focusPath === undefined) {
      return;
    }

    let focusedParagraph: store.ICaptionsParagraph | undefined;

    if (focusType === 'translatedCaption'
      && focusPath.captionIndex !== undefined
      && focusPath.paragraphIndex !== undefined) {
      const translatedCaptions = captions[focusType];
      focusedParagraph = translatedCaptions && translatedCaptions[focusPath.captionIndex].paragraphs[focusPath.paragraphIndex];
    } else if (focusType !== 'translatedCaption'
      && focusPath.paragraphIndex !== undefined) {
      const focusCaptions = captions[focusType];
      focusedParagraph = focusCaptions && focusCaptions[focusPath.paragraphIndex];
    }

    return focusedParagraph && ParagraphCaptionsHelper.getParagraphStartTime(focusedParagraph);
  }
}