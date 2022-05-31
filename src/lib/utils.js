import "JsExtensions";
import downcapOptions from "downcapOptions";
import IpcSender from "./IpcSender";

/**
 * @param {number} n 
 * @param {number} length 
 */
export function zeroPadding(n, length) {
  return String(n).padStart(length, '0');
}

/**
 * @param {number} t
 * @returns {string}
 */
export function DateFormat(t) {
  let milis = Number.parseInt(`${(t * 1000) % 1000}`);
  t = Number.parseInt(`${t}`);
  let sec = t % 60;
  t = parseInt(`${t / 60}`);
  let min = t % 60;
  let hour = parseInt(`${t / 60}`);
  return `${zeroPadding(hour, 2)}:${zeroPadding(min, 2)}:${zeroPadding(sec, 2)},${zeroPadding(milis, 3)}`
}

/**
 * @param {import("models").ITimeText[]} words 
 * @param {number} length 
 * @returns {import("models").ITimeText[][]}
 */
export function WordSplit(words, length) {
  if (!(words instanceof Array)) {
    throw new Error();
  }
  if (!Number.isInteger(length)) {
    throw new Error("The length must be an integer.")
  }
  if (length <= 0) { length = 1 }

  let count = 0;
  let output = []
  let line = []
  for (const word of words) {
    if (count >= length) {
      output.push(line);
      count = 0;
      line = [];
    }
    line.push(word);
    count += word.text.length;
  }

  if (line.length > 0) {
    output.push(line)
  }

  return output;
}

/** 
 * @param {import("models").IRGBA | string} rgba
 * 
 * @returns {string}
 */

export const rgbaToString = (rgba) => {
  if (typeof rgba === "string") return rgba;
  return `rgba(${rgba.r}, ${rgba.g}, ${rgba.b}, ${rgba.a})`
}

/** 
  * @param {{ r: number, g:number, b:number}} rgb
 * 
 * @returns {string}
 */
export const rgbToString = (rgb) => {
  return `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`
}

/** @param {number} fontSizePercent */
export const fontSizeToWebFontSize = (fontSizePercent) => {
  const percentDifference = fontSizePercent - 100;
  return (percentDifference * 0.0025) + 1;
}

/**
 * @returns {Promise<number | undefined>}
 */
export async function GetUserLetter() {
  const result = await IpcSender.invokeGetUserInfoAsync();
  return result?.letter;
}

/**
 * @param {number} time
 * @returns {string}
 */
export function timeToTimestamp(time) {
  let timestamp = DateFormat(time);
  timestamp = timestamp.replace(/[,]/g, '.');

  if (timestamp.slice(0, 2) === '00') {
    return timestamp.slice(3);
  }
  return timestamp;
}

/**
 * @param {string} timestamp
 * @returns {number | undefined}
 */
export function timestampToTime(timestamp) {
  const times = timestamp.split(':');
  let time = 0;

  for (const t of times) {
    time *= 60;
    if (!isFloat(t)) {
      return;
    }
    time += Number.parseFloat(t);
  }

  return time;
}

/**
 * 
 * @param {import("storeV2").ICaptionsParagraph[]} caption 
 */
function createEvents(caption) {
  return caption?.filter(line => line !== undefined)?.map(paragraph => {
    return paragraph.lines.map(line => {
      const lineData = {
        style: {
          background: line.style?.background,
          font: line.style?.font
        },
        words: line.words.map(word => ({
          text: word.text,
          style: {
            ...line.style,
            ...word.style,
          }
        })
        )
      };
      return {
        start: line.words[0].start,
        end: line.words?.last().end,
        bottom: (paragraph.vertical ?? downcapOptions.defaultLocation.vertical) * 100,
        left: (paragraph.horizontal ?? downcapOptions.defaultLocation.horizontal) * 100,
        lines: [lineData]
      }
    })
  }).flat() ?? Array.empty();
}

/**
 * 
 * @param {import("storeV2").IEventParagraph[]} caption 
 * @returns 
 */
function createDualEvents(caption) {
  return caption.filter(line => line !== undefined).map(paragraph => {
    const firstLineStyle = paragraph.lines[0]?.style;

    const firstLineData = paragraph.lines[0] ? {
      style: {
        background: firstLineStyle?.background,
        font: firstLineStyle?.font
      },
      words: paragraph.lines[0].words.map(word => ({
        text: word.text,
        style: {
          ...firstLineStyle,
          ...word.style,
        }
      })
      )
    } : undefined;

    const secondLineStyle = paragraph.lines[1]?.style;
    const secondLineData = paragraph.lines[1] ? {
      style: {
        background: secondLineStyle?.background,
        font: secondLineStyle?.font
      },
      words: paragraph.lines[1].words.map(word => ({
        text: word.text,
        style: {
          ...secondLineStyle,
          ...word.style,
        }
      })
      )
    } : undefined;

    let lineData = [];
    if (firstLineData && secondLineData) {
      lineData = [firstLineData, secondLineData];
    } else if (firstLineData && !secondLineData) {
      lineData = [firstLineData];
    } else if (!firstLineData && secondLineData) {
      lineData = [secondLineData];
    }

    return {
      start: paragraph.start,
      end: paragraph.end,
      bottom: (paragraph.vertical ?? downcapOptions.defaultLocation.vertical) * 100,
      left: (paragraph.horizontal ?? downcapOptions.defaultLocation.horizontal) * 100,
      lines: lineData
    };
  }).flat() ?? Array.empty();
}

/**
 * 
 * @param {object} input
 * @param {import("storeV2").ICaptionsParagraph[] | store.IEventParagraph[]} input.captions
 * @param {string} input.exportLanguage
 * @param {{meta: {height: number, width: number}}?} input.video 
 * @param {import("storeV2").ICaptionsStyle} defaultStyle 
 */
export function createDowncapScript(input) {

  /** @type {import("models/Format/Downcap/DowncapMeta").DowncapMeta?} */
  const videoMeta = input.video ? {
    Height: input.video.meta.height,
    Width: input.video.meta.width
  } : null;

  let captions = input.captions;
  let events;

  if (input.exportLanguage === 'origin' || input.exportLanguage === 'translated') {
    events = createEvents(captions);
  } else {
    events = createDualEvents(captions);
  }

  /** @type {import("models/Format/Downcap/DowncapScript").DowncapScript} */
  const script = {
    events: events,
    meta: videoMeta
  };

  return script;
}

/**
 * 
 * @param {string} s 
 */
export function IsNumber(s) {
  return /^(-|\+)?([0-9]+|Infinity)$/.test(s)
}

export function isFloat(s) {
  return /^(-|\+)?([0-9]+)(.?)([0-9]*)$/.test(s)
}