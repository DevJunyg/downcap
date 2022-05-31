//@ts-check

import IYouTubeSerachResultSnippet from "./IYouTubeSearchResultSnippet";
import IYouTubeVideo from "./IYouTubeVideo";

export default interface IYouTubeSearchResult {
  id: IYouTubeVideo;
  kind: "youtube#searchResult";
  etag: string;
  snippet?: IYouTubeSerachResultSnippet;
}
