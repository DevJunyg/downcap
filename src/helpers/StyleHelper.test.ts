import * as downcapStore from "storeV2";
import StyleHelper from "./StyleHelper";
import { loadJson } from "test/utility";

const styleCaptions = loadJson<downcapStore.ICaptionsParagraph[]>('./src/test/styleHelper.test/styleCaption.json');
const nonConfidenceCaptions = loadJson<downcapStore.ICaptionsParagraph[]>('./src/test/styleHelper.test/non_confidence_captions.json');
const removedStyleParagraphs = loadJson<downcapStore.ICaptionsParagraph[]>('./src/test/styleHelper.test/removedStyleParagraphs.json');
const confidenceStyleCaptions = loadJson<Pick<downcapStore.ICaptionsWord, "style" | "confidence">[]>('./src/test/styleHelper.test/confidence_style_captions.json');

describe('StyleHelper test', () => {
  test('StyleHelper styleDifference base test.', () => {
    expect(StyleHelper.styleDifference({ italic: true }, {})).toEqual({});
    expect(StyleHelper.styleDifference({}, { italic: true })).toEqual({});
    expect(StyleHelper.styleDifference({ italic: false }, { italic: true })).toEqual({});
    expect(StyleHelper.styleDifference({ italic: true }, { italic: true })).toEqual({ italic: true });
    expect(StyleHelper.styleDifference({ italic: false }, { italic: false })).toEqual({ italic: false });
    expect(StyleHelper.styleDifference({ italic: false, bold: true }, { italic: false })).toEqual({ italic: false });
    expect(StyleHelper.styleDifference({ italic: true, bold: true }, { italic: true, bold: true })).toEqual({ italic: true, bold: true });

  });

  test('to see if word properly extracted the confidence.', () => {
    let length = 0;
    styleCaptions.forEach(paragraph => paragraph.lines.forEach(line => length += line.words.length));

    expect(StyleHelper.getWordsProperty(styleCaptions)[3]).toEqual({ confidence: 0.66 });
    expect(StyleHelper.getWordsProperty(styleCaptions)).toHaveLength(length);
  })

  test('If word do not have confidence, add 1', () => {
    expect(StyleHelper.getWordsProperty(nonConfidenceCaptions)[3]).toEqual({ confidence: 1 });
  })

  test('Check if the setWordsProperty is working properly', () => {
    const self200Length = removedStyleParagraphs.length;
    expect(StyleHelper.setWordsProperty(removedStyleParagraphs, confidenceStyleCaptions)).toHaveLength(self200Length);
  })
})