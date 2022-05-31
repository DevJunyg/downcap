//@ts-check
import { json2xml } from 'xml-js';

import { zeroPadding } from "./utils";
import { SubtitlesToXmeml } from "./xmeml";
import { ProjectToFcpxml } from './fcpxml';

/**
 * @typedef {{ start: number, end: number, text: string, style: store.ICaptionsStyle, horizontal: number, vertical: number  }[]} captions 
 * @typedef {{title: string, format: string, duration: number, height?: number, width?:number}} meta 
 */

/** @param {number} sec */
export function ToSrtTimeFommat(sec) {
  const hour = Math.floor(sec / 3600)
  sec %= 3600
  const min = Math.floor(sec / 60)
  sec %= 60
  const mills = Math.round((sec % 1) * 1000)
  sec = Math.floor(sec);
  return `${zeroPadding(hour, 2)}:${zeroPadding(min, 2)}:${zeroPadding(sec, 2)},${zeroPadding(mills, 3)}`
}

/** @param {captions} captions */
export function ToSrt(captions) {
  let srt = captions.map((item, index) => {
    const { start, end, text } = item;
    return `${index + 1}\r\n${ToSrtTimeFommat(start)} --> ${ToSrtTimeFommat(end)}\r\n${text}\r\n\r\n`
  }).join('');
  // UTF-8-BOM
  srt = '\uFEFF' + srt
  return srt
}

/** @param {captions} captions */
export function ToText(captions) {
  return captions.map(item => item.text).join('\r\n');
}

/** 
 * @param {captions} captions
 * @param {meta} meta 
 */
export function ToXmeml(captions, meta) {
  //@ts-ignore
  return json2xml(SubtitlesToXmeml(captions, meta), { compact: true, spaces: 2 });
}

/**
 * @param {captions} captions
 * @param {meta} meta
 * @return {any}
 */
export function ToFcpxml(captions, meta) {
  //@ts-ignore
  return json2xml(ProjectToFcpxml(captions, meta), { compact: true, spaces: 2 });
}