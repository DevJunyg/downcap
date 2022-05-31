import YouTubeSearchHelper from "helpers/YouTubeSearchHelper";
import IYouTubeSearchResult from "models/youtube/IYouTubeSearchResult";
import IYouTubeStoreSearchResult from "models/youtube/store/IYouTubeStoreSearchResult";
import { handleActions, createAction, Action, ActionFunction1, ActionFunction0 } from "redux-actions";
import youtubeSearchActionType from './youtubeSearchActionType';

interface IYouTubeSearchStoreState {
  serachText?: string;
  lastSearchRequesText?: string;
  lastSearchRequesTime?: string;
  searchItems?: IYouTubeStoreSearchResult[];
}

function setTimeMiddleware(): undefined;
function setTimeMiddleware(payload: string): string;
function setTimeMiddleware(payload: Date): string;
function setTimeMiddleware(payload?: string | Date): string | undefined {
  if (typeof payload === "string") {
    return payload;
  }

  return payload?.toString();
}

export const clear = createAction(youtubeSearchActionType.clear, () => initialState)
export const setSearchText = createAction<string | void>(youtubeSearchActionType.setSearchText);
export const setLastSearchRequesText = createAction<string | void>(youtubeSearchActionType.setLastSearchRequesText);

export const setLastSearchRequesTime = createAction<string | Date | void>(
  youtubeSearchActionType.setLastSearchRequesTime,
  setTimeMiddleware
) as ActionFunction0<void> | ActionFunction1<string | Date, string>;

export const setSearchItems = createAction(youtubeSearchActionType.setSearchItems, YouTubeSearchHelper.youtubeSearchResultToStore) as ActionFunction0<void> | ActionFunction1<IYouTubeSearchResult[], IYouTubeStoreSearchResult[]>;

const initialState: IYouTubeSearchStoreState = {};

const reducer = handleActions<IYouTubeSearchStoreState, any>({
  [youtubeSearchActionType.clear]: (state, action: Action<IYouTubeSearchStoreState>) => {
    return action.payload;
  },
  [youtubeSearchActionType.setSearchText]: (state, action: Action<string | void>) => {
    if (action.payload === undefined) {
      const { serachText, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      serachText: action.payload
    }
  },
  [youtubeSearchActionType.setLastSearchRequesText]: (state, action: Action<string | void>) => {
    if (action.payload === undefined) {
      const { lastSearchRequesText, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      lastSearchRequesText: action.payload
    }
  },
  [youtubeSearchActionType.setLastSearchRequesTime]: (state, action: Action<string | void>) => {
    if (action.payload === undefined) {
      const { lastSearchRequesTime, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      lastSearchRequesTime: action.payload
    }
  },
  [youtubeSearchActionType.setSearchItems]: (state, action: Action<IYouTubeStoreSearchResult[] | void>) => {
    if (action.payload === undefined) {
      const { searchItems, ...nextState } = state;
      return nextState;
    }

    return {
      ...state,
      searchItems: [...action.payload]
    }
  }
}, initialState);

export default reducer;