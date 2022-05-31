import IYouTubeThumbnail from "../IYouTubeThumbnail";

export default interface IYouTubeStoreSerachResultSnippet {
  title: string;
  kind: string;
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishedAt: string;
  thumbnails: {
    [key: string]: IYouTubeThumbnail
  }
}
