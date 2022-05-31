import { rgbToString } from "lib/utils";
import lodash from "lodash";
import { IRGBA } from "models";
import OutlineType from "OutlineType";
import { ICaptionsLine, ICaptionsParagraph, ICaptionsStyle, ICaptionsWord } from "storeV2";

class StyleHelper {
  static getOutline(type: OutlineType, color: IRGBA, outlineColor: IRGBA) {
    let outline = undefined;
    const outColor = rgbToString(outlineColor);
    switch (type) {
      case OutlineType.exaltation:
        outline = `${outColor} 1px 1px, ${outColor} 2px 2px`
        break
      case OutlineType.lower:
        const inColor = {
          r: Math.round(color.r * 0.8),
          g: Math.round(color.g * 0.8),
          b: Math.round(color.b * 0.8),
        }

        outline = `${rgbToString(inColor)} 1px 1px, ${outColor} -1px -1px`
        break;
      case OutlineType.contourLine:
        const s = `${outColor} 0px 0px 2px`;
        outline = `${s}, ${s}, ${s}, ${s}, ${s}`
        break;
      case OutlineType.shadow:
        outline = `${outColor} 2px 2px 3px, ${outColor} 2px 2px 4px, ${outColor} 2px 2px 5px`
        break;
      default:
        break;
    }

    return outline;
  }

  static styleDifference(left: ICaptionsStyle, right: ICaptionsStyle) {
    let nextStyle = {
      ...left
    };

    (Object.keys(left) as (keyof ICaptionsStyle)[]).forEach(key => {
      if (left[key] !== right[key]) {
        delete nextStyle[key];
      }
    });

    return nextStyle;
  }

  static removeDuplicateWordStyleFromLine(left: ICaptionsStyle, right: ICaptionsStyle) {
    let nextStyle = {
      ...left
    };

    (Object.keys(left) as (keyof ICaptionsStyle)[]).forEach(key => {
      if (left[key] !== right[key] && (key !== "background" && key !== "font" && key !== "fontSize")) {
        delete nextStyle[key];
      }
    });

    return nextStyle;
  }

  static getWordsProperty(paragraphs: readonly ICaptionsParagraph[]): Pick<ICaptionsWord, "style" | "confidence">[] {

    const lineStyle: ICaptionsStyle[] = paragraphs.map(paragraph => {
      return {
        ...paragraph.lines.first().style
      }
    }).flat();

    const wordsStyleArray: Pick<ICaptionsWord, 'style' | 'confidence'>[] = paragraphs.map((paragraph, lineIndex) => {
      return paragraph.lines.first().words.map(word => {

        let wordOptions: Pick<ICaptionsWord, 'style' | 'confidence'> = {
          confidence: word.confidence ?? 1
        }

        let wordStyle: ICaptionsStyle;

        wordStyle = {
          ...lineStyle[lineIndex],
          ...word.style
        }

        if (Object.keys(wordStyle).length !== 0) {
          wordOptions.style = wordStyle;
        }

        return wordOptions;
      });
    }).flat();

    return wordsStyleArray;
  }

  static setWordsProperty(captions: ICaptionsParagraph[], wordsStyleArray: Pick<ICaptionsWord, "style" | "confidence">[]) {
    let wordIndex = 0;
    const resultCaptions: ICaptionsParagraph[] = captions.map(paragraph => {
      let lineStyle: ICaptionsStyle | undefined = {};
      const paragraphs = {
        lines: paragraph.lines.map(line => {
          let resultParagraph: ICaptionsLine = {
            words: line.words.map((word, index) => {
              let resultWord: ICaptionsWord = {
                start: word.start,
                end: word.end,
                text: word.text
              };

              if (index === 0) {
                lineStyle = wordsStyleArray[wordIndex].style;
              }

              resultWord.confidence = wordsStyleArray[wordIndex].confidence;
              resultWord.style = wordsStyleArray[wordIndex].style;

              if (wordsStyleArray[wordIndex].style !== undefined && lineStyle !== undefined) {
                lineStyle = StyleHelper.removeDuplicateWordStyleFromLine(lineStyle, wordsStyleArray[wordIndex].style ?? {});
              }

              wordIndex++;
              return resultWord;
            })
          };

          resultParagraph.words = resultParagraph.words.map(word => {
            word = {...word}
            if (!word.style ) {
              delete word.style;
              return word;
            }

            if(!lineStyle){
              return word;
            }

            let nextStyle = { ...word.style };
            (Object.keys(lineStyle) as (keyof ICaptionsStyle)[]).forEach(key => {
              delete nextStyle[key];
            });

            if (lodash.isEqual(nextStyle, {})) {
              delete word.style;
              return word
            }

            return {
              ...word,
              style: nextStyle
            }
          });

          if (lineStyle !== undefined) {
            resultParagraph.style = lineStyle;
          }

          return resultParagraph;
        }),
        // @TODO: 위치값 작업이 PR되면 추가로 위치값도 여기에 지정해 주어야합니다.

      }
      return paragraphs;
    });

    return resultCaptions;
  }
}

export default StyleHelper;