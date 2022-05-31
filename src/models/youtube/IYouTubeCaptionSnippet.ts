import { Languages } from "lib/Languages";

export default interface IYoutubeCaptionSnippet {
  videoId: string;
  lastUpdated: string;
  tracKind: string;
  language: keyof typeof Languages;
  name: string;
  audioTrackType: string;
  isCC: boolean;
  isLarge: boolean;
  isEasyReader: boolean;
  isDraft: boolean;
  isAutoSynced: boolean;
  status: string;
  failureReason: string;
}
