
const domain = "youtubeSearch";

const CLEAR = `${domain}/CLEAR`;
const SET_SEARCH_TEXT = `${domain}/SET_SEARCH_TEXT`;
const SET_LAST_SEARCH_REQUEST_TEXT = `${domain}/SET_LAST_SEARCH_REQUEST_TEXT`;
const SET_LAST_SEARCH_REQUEST_TIME = `${domain}/SET_LAST_SEARCH_REQUEST_TIME`;
const SET_SEARCH_ITEMS = `${domain}/SET_SEARCH_ITEMS`;

const youtubeSearchActionType = Object.freeze({
  clear: CLEAR,
  setSearchText: SET_SEARCH_TEXT,
  setLastSearchRequesText: SET_LAST_SEARCH_REQUEST_TEXT,
  setLastSearchRequesTime: SET_LAST_SEARCH_REQUEST_TIME,
  setSearchItems: SET_SEARCH_ITEMS
});

export default youtubeSearchActionType;