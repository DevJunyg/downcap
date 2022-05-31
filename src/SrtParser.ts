import MathExtensions from "MathExtensions";
import { ICaptionsLine, ICaptionsParagraph, ICaptionsWord } from "storeV2";

export interface SrtType {
  no: string,
  text: string,
  start: string,
  end: string
}

function _lineParser(line: SrtType): ICaptionsLine {
  return {
    words: _srtToSubtitles(line)
  };
}

function _timeToSecond(text: string) {
  let t = text.split(":");
  let sec = t[2].split(',');

  return Number.parseInt(t[0]) * 3600 + Number.parseInt(t[1]) * 60 + Number.parseInt(sec[0]) + Number.parseInt(sec[1]) / 1000;
}

function _srtToSubtitles(srt: SrtType): ICaptionsWord[] {
  const preSrt = {
    ...srt,
    start: _timeToSecond(srt.start),
    end: _timeToSecond(srt.end)
  }
  const duration = preSrt.end - preSrt.start;
  let text = preSrt.text.replace(/\\r\\n/g, ' ');
  const lineTextLength = text.length + 1;
  const wordDuration = duration / lineTextLength;

  if (preSrt.text.length === 0) {
    return [{
      start: preSrt.start,
      end: preSrt.end,
      text: preSrt.text
    }];
  }

  let startT = preSrt.start;
  return text.split(' ').map(item => {
    const words = item.length + 1;
    const start = startT;
    const end = startT + (words * wordDuration);
    startT = end;

    return {
      start: MathExtensions.round(start, 3),
      end: MathExtensions.round(end, 3),
      text: item
    }
  });
}

export default class SrtParser {
  static parser(text: string | Uint8Array): ICaptionsParagraph[] {
    if (text instanceof Uint8Array) {
      text = new TextDecoder("utf-8").decode(text);
    }

    if (typeof text !== "string") {
      throw new TypeError("The text cannot be interpreted as a string type.");
    }

    const items = text.split('\r\n\r\n')
      .map(item => item.split('\r\r')).flat()
      .map(item => item.split('\n\n')).flat()
      .map(item => item.trim())
      .filter(item => item && item !== "");

    return items.map<ICaptionsParagraph>(item => {
      const fileds = item.split('\r\n')
        .map(filedItem => filedItem.split('\r')).flat()
        .map(filedItem => filedItem.split('\n')).flat()
      //@ts-ignore
      fileds[1] = fileds[1].split('-->')
        .map(filedItem => filedItem.trim());

      let textFiled = fileds.slice(2);
      let srtText = textFiled === null ? "" : textFiled.join("\r\n");
      const srt = {
        no: fileds[0],
        start: fileds[1][0],
        end: fileds[1][1],
        text: srtText
      }

      return {
        lines: [_lineParser(srt)]
      }
    });
  }
}