import IYouTubeSearchResult from "models/youtube/IYouTubeSearchResult";
import IYouTubeStoreSearchResult from "models/youtube/store/IYouTubeStoreSearchResult";

export default class YouTubeSearchHelper {
  static youtubeSearchResultToStore(youtubeSearchItems?: IYouTubeSearchResult[]) {
    return youtubeSearchItems?.map(item => ({
      ...item,
      snippet: item.snippet && {
        ...item.snippet,
        publishedAt: item.snippet.publishedAt.toString()
      }
    } as IYouTubeStoreSearchResult));
  }

  static youtubeStoreSearchResultToObject(youtubeSearchItems?: IYouTubeStoreSearchResult[]) {
    return youtubeSearchItems?.map(item => ({
      ...item,
      snippet: item.snippet && {
        ...item.snippet,
        publishedAt: new Date(item.snippet.publishedAt)
      }
    } as IYouTubeSearchResult));
  }
}