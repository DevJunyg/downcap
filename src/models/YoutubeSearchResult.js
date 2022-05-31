//@ts-check

/**
 * @typedef {object} ID
 * @property {string} videoId
 * @property {string} kind
 * 
 * @typedef {object} Snippet
 * @property {string} title
 * @property {string} kind
 * @property {string} channelId
 * @property {string} channelTitle
 * @property {string} description
 * @property {string} liveBroadcastContent
 * @property {Date} publishedAt
 * @property {string} title
 * @property {object} thumbnails
 * @property {object} thumbnails.medium
 * @property {string} thumbnails.medium.url
 * 
 * YoutubeSearchResult type definition
 * @typedef {Object} YoutubeSearchResult
 * 
 * @property {ID} id
 * @property {string} kind
 * @property {string} etag
 * @property {Snippet} snippet
 * 
 * 
 * @property {string} text
 */

export default YoutubeSearchResult;
