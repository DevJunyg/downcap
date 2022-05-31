import StyleParser from "StyleParser";
import YouTubeFontStyles from "lib/YouTubeFontStyles";

const defaultStyle = {
  id: 1,
  background: { r: 255, g: 255, b: 255, a: 0 },
  color: { r: 255, g: 255, b: 255, a: 1 },
  outline: 3,
  outlineColor: { r: 0, g: 0, b: 0, a: 1 },
  bold: true,
  underline: false,
  italic: false,
  font: 4,
  fontSize: 100
}

it("typeof font is number, return match css font.", () => {
  for (let index = 1; index <= 7; index++) {
    const result = StyleParser.fontToCssFont(index);
    expect(result).toEqual(YouTubeFontStyles[index]);
  }
})

it("typeof font is string, return the font as is.", () => {
  const testFontName = 'Test font input';
  const font = StyleParser.fontToCssFont(testFontName);
  expect(font).toBe(testFontName);
})

it("selected youtube-font, preview-ios, only en text - return the matched youtube font", () => {
  const iosFonDictionary = {
    1: 2,
    2: 3,
    3: 3,
    4: 4,
    5: 2, 
    6: 7,
    7: 4,
  }

  for (let index = 1; index <= 7; index++) {
    const element = iosFonDictionary[index as 1 | 2 | 3 | 4 | 5 | 6 | 7];

    const style = {
      ...defaultStyle,
      font: index
    }

    const font = StyleParser.wordStyleParse(style, 'ios', 'EnText');
    expect(font.fontFamily).toEqual(YouTubeFontStyles[element]);
  }
})

it("wordStyleParse set font when word include koText in preview ios", () => {
  const style = {
    ...defaultStyle,
    font: 5
  }

  const font = StyleParser.wordStyleParse(style, 'ios', 'including 한글');

  expect(font.fontFamily).not.toEqual(YouTubeFontStyles[5]);
  expect(font.fontFamily).toEqual(YouTubeFontStyles[4]);
})

it("Fixed font to YouTubeFont 4 when youtubefont is selected in android preview", () => {
  const style = {
    ...defaultStyle,
    font: 1
  }

  const font = StyleParser.wordStyleParse(style, 'android', 'including 한글');

  expect(font.fontFamily).toEqual(YouTubeFontStyles[4]);
})

it("return same font as it was passed in android preview state", () => {
  const style = {
    ...defaultStyle,
    font: "ko"
  }

  const font = StyleParser.wordStyleParse(style, 'android');

  expect(font.fontFamily).toEqual('ko');
})