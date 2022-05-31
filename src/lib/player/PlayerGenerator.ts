import UnsupportedException from "UnsupportedException";
import FilePlayer from "./FilePlayer";
import { IPlayerProps } from "./Player";
import YouTubePlayer from "./YouTubePlayer";

const ProtocolSchema = Object.freeze({
  File: "file:",
  Http: "http:",
  Https: "https:"
});

export default class PlayerGenerator {
  static open(elementId: string, url: string, options: IPlayerProps) {
    let myUrl = new URL(url.replace(/#/g, "%23"));

    switch (myUrl.protocol) {
      case ProtocolSchema.File:
        return new FilePlayer(elementId, myUrl, options)
      case ProtocolSchema.Https:
        return new YouTubePlayer(elementId, myUrl, options)
      case ProtocolSchema.Http:
        throw new UnsupportedException(`Http is unsupport`)
      default:
        throw new UnsupportedException(`Unsupport protcol schema.`)
    }
  }
}