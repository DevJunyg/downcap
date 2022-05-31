import YouTubeFontStyles from "lib/YouTubeFontStyles";
import { fontSizeToWebFontSize, rgbaToString } from "lib/utils";
import React from "react";
import { ICaptionsStyle, PreviewType } from "storeV2";
import { Color } from "components/Color";
import StyleHelper from "helpers/StyleHelper";
import { IRGBA } from "models";
import { isInteger } from "lodash";

type youtubeFont = 1 | 2 | 4 | 5 | 6 | 7;
class StyleParser {
  public static fontToCssFont(font: string | number | undefined): string | undefined {
    if (typeof font === "number") {
      font = YouTubeFontStyles[font];
    }

    return font;
  }

  private static _fontSizeToIosFontSize = (fontSizePercent: number) => {
    return fontSizePercent > 200 ? (100 * 0.0025) + 1 : ((fontSizePercent - 100) * 0.0025) + 1;
  }

  private static _fontSizeToAndroidFontSize = () => {
    const percentDifference = 170;
    return (percentDifference * 0.0025) + 1;
  }

  private static _webWordStyleParse(style: Readonly<ICaptionsStyle>) {
    let wordStyle: React.CSSProperties = {
      fontFamily: StyleParser.fontToCssFont(style.font),
      fontSize: `${fontSizeToWebFontSize(style.fontSize ?? 100)}em`
    }

    if (style.bold) {
      wordStyle.fontWeight = 'bold';
    }

    if (style.color) {
      wordStyle.color = rgbaToString(style.color);
    }

    if (style.italic) {
      wordStyle.fontStyle = 'italic';
    }

    if (style.outline) {
      wordStyle.textShadow = StyleHelper.getOutline(
        style.outline,
        style.color ?? Color.black,
        style.outlineColor ?? Color.black
      )
    }

    if (style.underline) {
      wordStyle.textDecoration = 'underline';
    }

    if (style.font === 7) {
      wordStyle.fontVariant = 'small-caps';
    }

    return wordStyle;
  }

  private static _iosWordStyleParse(style: Readonly<ICaptionsStyle>, word?: string) {
    let wordStyle: React.CSSProperties = {
      fontSize: `${StyleParser._fontSizeToIosFontSize(style.fontSize ?? 100)}em`
    }

    if (word && StyleParser._isKoWord(word)) {
      wordStyle.fontFamily = StyleParser.fontToCssFont(YouTubeFontStyles[4]);
    } else {
      wordStyle.fontFamily = StyleParser._iosWordYoutubeFontParse(style.font as youtubeFont);
    }

    if (style.color) {
      wordStyle.color = rgbaToString(style.color);
    }

    if (style.italic) {
      wordStyle.fontStyle = 'italic';
    }

    if (style.underline) {
      wordStyle.textDecoration = 'underline';
    }

    if (style.font === 6) {
      wordStyle.fontVariant = 'small-caps';
    }

    return wordStyle;
  }

  private static _androidWordStyleParse(style: Readonly<ICaptionsStyle>) {
    let wordStyle: React.CSSProperties = {
      fontFamily: isInteger(style.font) ?
        StyleParser.fontToCssFont(YouTubeFontStyles[4]) :
        StyleParser.fontToCssFont(style.font),
      fontSize: `${StyleParser._fontSizeToAndroidFontSize()}em`
    }

    if (style.color) {
      wordStyle.color = rgbaToString(style.color);
    }

    if (style.italic) {
      wordStyle.fontStyle = 'italic';
    }

    if (style.font === 7) {
      wordStyle.fontVariant = 'small-caps';
    }

    return wordStyle;
  }

  private static _parserDictionary = {
    'web': StyleParser._webWordStyleParse,
    'android': StyleParser._androidWordStyleParse,
    'ios': StyleParser._iosWordStyleParse,
  }

  private static _iosFonDictionary = {
    1: 2,
    2: 3,
    3: 3,
    4: 4,
    5: 2, 
    6: 7,
    7: 4,
  }

  private static _iosWordYoutubeFontParse(font: youtubeFont) {
    return StyleParser.fontToCssFont(StyleParser._iosFonDictionary[font]);
  }

  static wordStyleParse(captionStyle: ICaptionsStyle, type: PreviewType = 'web', word?: string) {
    return StyleParser._parserDictionary[type]({ ...captionStyle }, word);
  }

  private static _webBackgroundParse(color: IRGBA | undefined) {
    return color;
  }

  private static _iosBackgroundParse() {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 0.4
    };
  }

  private static _androidBackgroundParse() {
    return {
      r: 0,
      g: 0,
      b: 0,
      a: 1
    };
  }


  private static _parserDictionaryLine = {
    'web': StyleParser._webBackgroundParse,
    'android': StyleParser._androidBackgroundParse,
    'ios': StyleParser._iosBackgroundParse,
  }

  static backgroundParse(color: IRGBA | undefined, type: PreviewType = "web") {
    return StyleParser._parserDictionaryLine[type](color);
  }

  private static _isKoWord(word: string): boolean {
    const koWord = /[ㄱ-ㅎ|ㅏ-ㅣ|가-힣]/
    return koWord.test(word) ? true : false;
  }
}

export default StyleParser;