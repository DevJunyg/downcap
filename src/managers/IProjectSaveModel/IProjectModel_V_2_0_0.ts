import * as store from './storeV2_0_0';
import { IdFieldDictionary } from 'storeV2/IdGenerator';
import { IProjectStoreState } from 'storeV2/modules/project';
import ProjectModelUpManager from './ProjectModelUpManager';
import IProjectModel_V_1_0_4 from './IProjectModel_V_1_0_4';
import "JsExtensions";
import MathExtensions from 'MathExtensions';
import StyleHelper from 'helpers/StyleHelper';

type PenderStatusType = 'pending' | 'success' | 'error' | 'failure' | 'cancel';
export default interface IProjectModel_V_2_0_0 {
  projectModelVersion: '2.0.0';
  project: IProjectStoreState;
  captionIds: IdFieldDictionary;
  originCaption?: store.ICaptionsParagraph[];
  originStyle?: store.ICaptionsStyle;
  translatedCaption?: store.ICaptionTranslatedParagraphWithId[];
  translatedStyle?: store.ICaptionsStyle;
  multiline?: store.ICaptionsParagraph[];
  multilineStyle?: store.ICaptionsStyle;
  translatedMultiline?: store.ITranslatedMultilineCaption[];
  translatedMultilineStyle?: store.ICaptionsStyle;
  translatedMultilineCheckPoint?: number;
}

export class ProjectModelManagerV200 extends ProjectModelUpManager<IProjectModel_V_2_0_0, IProjectModel_V_1_0_4> {
  public Up(model: IProjectModel_V_1_0_4): IProjectModel_V_2_0_0 {
    const penderStatusToTransStatusDict: { [status in PenderStatusType]: store.TranlsateStatusType } = {
      "cancel": 'Cancel',
      "error": 'Failed',
      "failure": 'Failed',
      "pending": "Pending",
      "success": "Successed"
    }

    let originStyle: store.ICaptionsStyle | undefined = model.ko?.style;

    let originParagrapId = 1;
    let originLineId = 1;
    let originWordId = 1;
    let originCaption = model.ko?.captions?.map<store.ICaptionsParagraph>((caption, captionIndex) => {
      let vertical = caption.lineStyle?.bottom;
      let horizontal = caption.lineStyle?.left;
      let lineStyle: store.ICaptionsStyle | undefined;
      if (!caption.styleChangeable) {
        lineStyle = caption.style
      }

      if (caption.words === undefined) {
        throw new Error(`Invalid Subtitle Status, caption[${captionIndex}].words not found`);
      }

      let wordGlobalStyle = caption.words.first().style ?? {};
      let words = caption.words.map<store.ICaptionsWord>(word => {
        let captionWord: store.ICaptionsWord = {
          id: originWordId++,
          end: word.end,
          start: word.start,
          text: word.text,
        };

        if (word.confidence) {
          captionWord.confidence = word.confidence
        }

        wordGlobalStyle = StyleHelper.styleDifference(wordGlobalStyle, word.style ?? {});
        if (word.style) {
          captionWord.style = word.style;
        }

        return captionWord;
      });

      if (wordGlobalStyle !== {}) {
        words = words.map(word => {
          if (!word.style) {
            return word;
          }

          let nextStyle = { ...word.style };
          (Object.keys(wordGlobalStyle) as (keyof store.ICaptionsStyle)[]).forEach(key => {
            delete nextStyle[key]
          });

          return {
            ...word,
            style: nextStyle
          }
        });
      }


      let line: store.ICaptionsLine = {
        words: words,
        id: originLineId++,
      };

      if (lineStyle || caption.lineStyle?.background) {
        line.style = {
          ...lineStyle,
          background: caption.lineStyle?.background,
          ...wordGlobalStyle
        };
      }

      let paragraph: store.ICaptionsParagraph = {
        id: originParagrapId++,
        lines: [line],
      };

      if (horizontal !== undefined) {
        paragraph.horizontal = MathExtensions.round(horizontal / 100, 3);
      }

      if (vertical !== undefined) {
        paragraph.vertical = MathExtensions.round(vertical / 100, 3);
      }

      return paragraph;
    });

    let translatedCaptionId = 1;
    let translatedParagrapId = 1;
    let translatedLineId = 1;
    let translatedWordId = 1;

    let translatedCaption = model.en?.captions?.map<store.ICaptionTranslatedParagraphWithId>((translatedCaption, index) => {
      let origin = translatedCaption.ko;
      if (origin === undefined) {
        throw new Error(`Invalid Subtitle Status, caption[${index}].ko not found`)
      }

      let revers = translatedCaption.revers;
      let paragraphs = translatedCaption.en?.map((caption, captionIndex) => {
        let vertical = caption.lineStyle?.bottom;
        let horizontal = caption.lineStyle?.left;
        let lineStyle: store.ICaptionsStyle | undefined;
        if (!caption.styleChangeable) {
          lineStyle = caption.style
        }

        if (caption.words === undefined) {
          throw new Error(`Invalid Subtitle Status, caption[${index}].parpagarhs[${captionIndex}].words not found`);
        }

        let words = caption.words.map<store.ICaptionsWord>(word => {
          let captionWord: store.ICaptionsWord = {
            id: translatedWordId++,
            end: word.end,
            start: word.start,
            text: word.text,
          };

          if (word.confidence) {
            captionWord.confidence = word.confidence
          }

          if (word.style) {
            captionWord.style = word.style;
          }

          return word;
        });

        let line: store.ICaptionsLine = {
          words: words,
          id: translatedLineId++,
        };

        if (lineStyle) {
          line.style = lineStyle;
        }

        let paragraph: store.ICaptionsParagraph = {
          id: translatedParagrapId++,
          lines: [line],
        };

        if (horizontal !== undefined) {
          paragraph.horizontal = MathExtensions.round(horizontal / 100, 3);
        }

        if (vertical !== undefined) {
          paragraph.vertical = MathExtensions.round(vertical / 100, 3);
        }

        return paragraph;
      });

      return {
        id: translatedCaptionId++,
        origin: origin,
        revers: revers,
        meta: {
          reversTranslateStatus: revers ? 'Successed' : 'Cancel',
          translatStatus: paragraphs?.any() ? 'Successed' : 'Cancel'
        },
        paragraphs: paragraphs ?? []
      }
    });

    let trnaslatedStyle = model.en?.style;

    let multilineWordId = 0;
    let multilineLineId = 0;

    let multilines = model.multiLine?.map<store.ICaptionsParagraph>((caption, captionIndex) => {
      let vertical = caption.vertical;
      let horizontal = caption.horizontal;
      let lineStyle = caption.style;

      if (caption.words === undefined) {
        throw new Error(`Invalid Subtitle Status, caption[${captionIndex}].words not found`);
      }

      let words = caption.words.map<store.ICaptionsWord>(word => {
        let captionWord: store.ICaptionsWord = {
          id: multilineWordId++,
          end: word.end,
          start: word.start,
          text: word.text,
        };

        if (word.confidence) {
          captionWord.confidence = word.confidence;
        }

        if (word.style) {
          captionWord.style = word.style;
        }

        return word;
      });

      let line: store.ICaptionsLine = {
        words: words,
        id: multilineLineId++,
      };

      if (lineStyle) {
        line.style = lineStyle;
      }

      let paragraph: store.ICaptionsParagraph = {
        id: caption.id,
        lines: [line],
      };

      if (horizontal !== undefined) {
        paragraph.horizontal = horizontal;
      }

      if (vertical !== undefined) {
        paragraph.vertical = vertical;
      }

      return paragraph;
    });


    let translatedMultilineWordId = 0;
    let translatedMultilineLineId = 0;

    let translatedMultiline = model.translatedMultiLine?.map<store.ITranslatedMultilineCaption>((caption, captionIndex) => {
      let vertical = caption.vertical;
      let horizontal = caption.horizontal;
      let lineStyle = caption.style;

      if (caption.words === undefined) {
        throw new Error(`Invalid Subtitle Status, caption[${captionIndex}].words not found`);
      }

      let words = caption.words.map<store.ICaptionsWord>(word => {
        let captionWord: store.ICaptionsWord = {
          id: translatedMultilineWordId++,
          end: word.end,
          start: word.start,
          text: word.text,
        };

        if (word.confidence) {
          captionWord.confidence = word.confidence;
        }

        if (word.style) {
          captionWord.style = word.style;
        }

        return word;
      });

      let line: store.ICaptionsLine = {
        words: words,
        id: translatedMultilineLineId++,
      };

      if (lineStyle) {
        line.style = lineStyle;
      }

      let paragraph: store.ITranslatedMultilineCaption = {
        id: caption.id,
        lines: [line],
      };

      if (horizontal !== undefined) {
        paragraph.horizontal = horizontal;
      }

      if (vertical !== undefined) {
        paragraph.vertical = vertical;
      }


      paragraph.meta = {
        sourceId: caption.meta.sourceId,
        status: caption.meta.status && penderStatusToTransStatusDict[caption.meta.status],
        sourceText: caption.meta.sourceText,
        translatedText: caption.meta.translatedText
      }
      return paragraph;
    })


    return {
      projectModelVersion: '2.0.0',
      captionIds: {
        multiline: {
          caption: 0,
          line: multilineLineId,
          paragraph: model.reduxStoreIds ? model.reduxStoreIds['oringMultiline-line'] : multilineLineId,
          word: multilineWordId
        },
        origin: {
          caption: 0,
          line: originLineId,
          paragraph: originParagrapId,
          word: originWordId
        },
        translated: {
          caption: translatedCaptionId,
          line: translatedLineId,
          paragraph: translatedParagrapId,
          word: translatedWordId
        },
        translatedMultiline: {
          caption: 0,
          line: translatedMultilineWordId,
          paragraph: model.reduxStoreIds ? model.reduxStoreIds['translatedMultiline-line'] : multilineLineId,
          word: translatedMultilineWordId
        }
      },
      project: {
        selectedEditType: "origin",
        selectedPreviewType: "web",
        wordSplits: {
          origin: 20,
          translated: 40
        },
        sequence: ['origin', 'translated'],
        videoPath: model.path,
        projectName: model.project?.projectName,
        nowTranslateTaskLength: translatedCaption ? 1 : undefined,
        totalTranslateTaskLength: translatedCaption ? 1 : undefined
      },
      originStyle: originStyle,
      originCaption: originCaption,
      translatedCaption: translatedCaption,
      translatedStyle: trnaslatedStyle,
      multiline: multilines,
      translatedMultiline: translatedMultiline,
      translatedMultilineCheckPoint: model.translatedMultiLineCheckpoint
    }
  }
}