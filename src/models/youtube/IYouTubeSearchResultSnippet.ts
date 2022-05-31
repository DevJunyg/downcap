import IYouTubeThumbnail from "./IYouTubeThumbnail";

export default interface IYouTubeSerachResultSnippet {
  title: string;
  kind: string;
  channelId: string;
  channelTitle: string;
  description: string;
  liveBroadcastContent: string;
  publishedAt: Date;
  thumbnails: {
    [key: string]: IYouTubeThumbnail
  }
}
