import { IsNumber } from 'lib/utils';
import storeV2, * as downcapStore from 'storeV2';

export default class FontCheckHelper {
  static isValidYouTubeFont(font: string | number) {
    let fontNo: number;
    if (typeof font === "number") {
      if (!Number.isInteger(font)) {
        return false;
      }

      fontNo = font;
    }
    else {
      if (!IsNumber(font)) {
        return false;
      }

      fontNo = Number.parseInt(font);
    }

    return 0 < fontNo && fontNo < 8;
  }

  static originCaptionInvalidFontCheck(invalidFontCheck: (font: string | number) => boolean, store: typeof storeV2 = storeV2) {
    const rootState = store.getState();
    const originCaption = rootState.present.originCaption.captions ?? [];
    const originStyle = rootState.present.originCaption.defaultStyle ?? rootState.present.project.projectDefaultStyle;

    return originCaption.reduce<downcapStore.IFocusLineMeta[]>((acc: downcapStore.IFocusLineMeta[], caption: downcapStore.ICaptionsParagraph, paragraphIndex: number) => {
      caption.lines.forEach(line => {
        const style = { ...originStyle, ...line.style };
        if (style === undefined || style.font === undefined || invalidFontCheck(style.font)) {
          acc.push(FontCheckHelper.focusMetaParser('originCaption', caption, paragraphIndex));
        }
      });
      return acc;
    }, []);
  }

  static translatedCaptionInvalidFontCheck(invalidFontCheck: (font: string | number) => boolean, store: typeof storeV2 = storeV2) {
    const rootState = store.getState();
    const translatedCaption = rootState.present.translatedCaption.captions ?? [];
    const translatedStyle = rootState.present.translatedCaption.defaultStyle ?? rootState.present.project.projectDefaultStyle;

    return translatedCaption.reduce<downcapStore.IFocusLineMeta[]>((acc: downcapStore.IFocusLineMeta[], caption: downcapStore.ICaptionTranslatedParagraphWithId, captionIndex: number) => {
      const paragraphs = caption.paragraphs;
      if (paragraphs !== undefined) {
        paragraphs.forEach((paragraph: downcapStore.ICaptionsParagraph, paragraphIndex) => {
          paragraph.lines.forEach(line => {
            const style = { ...translatedStyle, ...line.style };
            if (style === undefined || style.font === undefined || invalidFontCheck(style.font)) {
              acc.push(FontCheckHelper.focusMetaParser('translatedCaption', paragraph, paragraphIndex, captionIndex));
            }
          });
        });
      }
      return acc;
    }, []);
  }

  static multilineInvalidFontCheck(invalidFontCheck: (font: string | number) => boolean, store: typeof storeV2 = storeV2) {
    const rootState = store.getState();
    const multiline = rootState.present.multiline.captions ?? [];
    const multilineStyle = rootState.present.multiline.defaultStyle ?? rootState.present.project.projectDefaultStyle;

    return multiline.reduce<downcapStore.IFocusLineMeta[]>((acc: downcapStore.IFocusLineMeta[], caption: downcapStore.ICaptionsParagraph, paragraphIndex: number) => {
      caption.lines.forEach(line => {
        const style = { ...multilineStyle, ...line.style };
        if (style === undefined || style.font === undefined || invalidFontCheck(style.font)) {
          acc.push(FontCheckHelper.focusMetaParser('multiline', caption, paragraphIndex));
        }
      });
      return acc;
    }, []);
  }

  static translatedMultilineInvalidFontCheck(invalidFontCheck: (font: string | number) => boolean, store: typeof storeV2 = storeV2) {
    const rootState = store.getState();
    const translatedMultiline = rootState.present.translatedMultiline.captions ?? [];
    const translatedMultilineStyle = rootState.present.translatedMultiline.defaultStyle ?? rootState.present.project.projectDefaultStyle;

    return translatedMultiline.reduce<downcapStore.IFocusLineMeta[]>((acc: downcapStore.IFocusLineMeta[], caption: downcapStore.ITranslatedMultilineCaption, paragraphIndex: number) => {
      caption.lines.forEach(line => {
        const style = { ...translatedMultilineStyle, ...line.style };
        if (style === undefined || style.font === undefined || invalidFontCheck(style.font)) {
          acc.push(FontCheckHelper.focusMetaParser('translatedMultiline', caption, paragraphIndex));
        }
      });
      return acc;
    }, []);
  }

  static focusMetaParser = (kind: downcapStore.KineCaptionType, paragraph: downcapStore.ICaptionsParagraph, paragraphIndex: number, captionIndex?: number) => {
    return ({
      kind: kind,
      paragraph: paragraph,
      paragraphIndex: paragraphIndex,
      captionIndex: captionIndex,
      lineIndex: 0,
      wordIndex: 0
    });
  }

  static captionsFontChecker(
    captionFontCheckActions: ((invalidFontCheck: (font: string | number) => boolean, store: typeof storeV2) => downcapStore.IFocusLineMeta[])[],
    invalidFontCheck: (font: string | number) => boolean,
    store: typeof storeV2
  ) {
    let invalidCaptions: downcapStore.IFocusLineMeta[] = [];

    captionFontCheckActions.forEach(action => {
      invalidCaptions = [
        ...invalidCaptions,
        ...action(invalidFontCheck, store)
      ];
    });

    return invalidCaptions;
  }

  static originCaptionsFontCheckActions(invalidFontCheck: (font: string | number) => boolean, store: typeof storeV2) {
    const originActions = [FontCheckHelper.originCaptionInvalidFontCheck, FontCheckHelper.multilineInvalidFontCheck];
    return FontCheckHelper.captionsFontChecker(originActions, invalidFontCheck, store);
  }

  static translatedCaptionsFontCheckActions(invalidFontCheck: (font: string | number) => boolean, store: typeof storeV2) {
    const translatedActions = [FontCheckHelper.translatedCaptionInvalidFontCheck, FontCheckHelper.translatedMultilineInvalidFontCheck];
    return FontCheckHelper.captionsFontChecker(translatedActions, invalidFontCheck, store);
  }
}