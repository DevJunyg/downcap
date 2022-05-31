//@ts-check

/**
 * @typedef {Object} DowncapEventWord
 * @property {string} text
 * @property {number} start
 * @property {number} end
 * @property {object} style
 * 
 * @typedef {object} DowncapEventLineStyle
 * @property {number} left
 * @property {number} bottom
 * @property {import('store').RGBA} background
 * 
 * DualCaption type definition
 * @typedef {{style: DowncapEventLineStyle, words: DowncapEventWord[]}} DowncapEvent
 */

export default DowncapEvent;
