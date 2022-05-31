import * as Redux from 'redux';
import storeV2, * as store from "storeV2";
import MathExtensions from 'MathExtensions';
import downcapOptions from 'downcapOptions';
import ClientAnalysisService from "services/ClientAnalysisService";
import * as originCaptionActions from 'storeV2/modules/originCaption';
import * as translatedCaptionActions from 'storeV2/modules/translatedCaption';
import * as mulitilineActions from 'storeV2/modules/multiline'
import * as translatedMultilineActions from 'storeV2/modules/translatedMultiline'

const locationActionsDictractory = ({
  "originCaption": originCaptionActions,
  "multiline": mulitilineActions,
  "translatedCaption": translatedCaptionActions,
  "translatedMultiline": translatedMultilineActions
});

export default class LineLocationHelper {
  static getParagraph(focusParagraphMeta: store.IFocusParagraphMeta, rootStore?: typeof storeV2) {
    if (focusParagraphMeta.type === "originCaption"
      || focusParagraphMeta.type === "multiline"
      || focusParagraphMeta.type === "translatedMultiline") {
      const captions = rootStore?.getState().present[focusParagraphMeta.type].captions;
      return captions && captions[focusParagraphMeta.path.paragraphIndex!];
    }
    else if (focusParagraphMeta.type === "translatedCaption") {
      const captions =  rootStore?.getState().present[focusParagraphMeta.type].captions;
      return captions && captions[focusParagraphMeta.path.captionIndex!]
        .paragraphs[focusParagraphMeta.path.paragraphIndex!];
    }
    return undefined;
  }

  static resetLocation(rootStore?: typeof storeV2) {
    ClientAnalysisService.resetLocationClick();

    const focusParagraphMeta = rootStore?.getState().present.projectCotrol.focusParagraphMetas?.first();
    const selectedStyleEditType = rootStore?.getState().present.projectCotrol.selectedStyleEditType;

    if (!focusParagraphMeta || !selectedStyleEditType) {
      return;
    }

    const { path } = focusParagraphMeta;
    const type = focusParagraphMeta.type;
    const LocationActions = Redux.bindActionCreators(
      locationActionsDictractory[type],
      rootStore.dispatch
    );

    let paragraph: Readonly<store.ICaptionsParagraph> | undefined = LineLocationHelper.getParagraph(focusParagraphMeta, rootStore);

    if (!paragraph) {
      return;
    }

    LocationActions.updateParagraph({
      path: { ...path },
      paragraph: {
        ...paragraph,
        vertical: downcapOptions.defaultLocation.vertical,
        horizontal: downcapOptions.defaultLocation.horizontal
      }
    });
  }

  static addLineLoaction(name: 'vertical' | 'horizontal', value: number, rootStore?: typeof storeV2) {
    ClientAnalysisService.locationClick();

    const focusParagraphMeta = rootStore?.getState().present.projectCotrol.focusParagraphMetas?.first();
    const selectedStyleEditType = rootStore?.getState().present.projectCotrol.selectedStyleEditType;
    
    if (!focusParagraphMeta || !selectedStyleEditType) {
      return;
    }

    const { path } = focusParagraphMeta;
    const type = focusParagraphMeta.type;
    const LocationActions = Redux.bindActionCreators(
      locationActionsDictractory[type],
      rootStore.dispatch
    );

    const delfaultLocation = rootStore?.getState().present[type].defaultLocation;
    const locationValue = (delfaultLocation && delfaultLocation[name]) ?? downcapOptions.defaultLocation[name];
    let paragraph: store.ICaptionsParagraph | undefined = LineLocationHelper.getParagraph(focusParagraphMeta, rootStore);

    if (!paragraph) {
      return;
    }

    paragraph = { ...paragraph };

    paragraph[name] = Math.max(0, Math.min(1, MathExtensions.round((paragraph[name] ?? locationValue) + value, 3)));

    LocationActions.updateParagraph({
      path: { ...path },
      paragraph: paragraph
    });
  }
}