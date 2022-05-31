//@ts-check

import IYouTubeVideo from "../IYouTubeVideo";
import IYouTubeStoreSerachResultSnippet from "./IYouTubeStoreSerachResultSnippet";

export default interface IYouTubeStoreSearchResult {
  id: IYouTubeVideo;
  kind: "youtube#searchResult";
  etag: string;
  snippet?: IYouTubeStoreSerachResultSnippet;
}
