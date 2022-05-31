import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import IpcSender from 'lib/IpcSender';
import * as store from 'storeV2';

class TranslateManagerSingleTone {
  private static _this: TranslateManagerSingleTone | null;

  static create(): TranslateManagerSingleTone {
    if (TranslateManagerSingleTone._this === null) {
      TranslateManagerSingleTone._this = new TranslateManagerSingleTone();
    }

    return TranslateManagerSingleTone._this;
  }

  private updateReverseTranslationInternalAsync(caption: store.ICaptionTranslatedParagraphWithId) {
    caption = { ...caption };
    delete caption.revers;

    const translatedText = ParagraphCaptionsHelper.toText(caption.paragraphs)
    return IpcSender.invokeTranslateEnToKo(translatedText)
      .then((reversText: string): store.ICaptionTranslatedParagraphWithId => ({
        ...caption,
        revers: reversText,
        meta: {
          ...caption.meta,
          reversTranslateStatus: 'Successed',
        }
      })
      ).catch((err: any): store.ICaptionTranslatedParagraphWithId => ({
        ...caption,
        meta: {
          ...caption.meta,
          reversTranslateStatus: 'Failed',
        }
      }));
  }

  updateReverseTranslationAsync(caption: store.ICaptionTranslatedParagraphWithId) {
    return this.updateReverseTranslationInternalAsync(caption);
  }
}

const TranslateManager = TranslateManagerSingleTone.create();
export default TranslateManager;