import { PlayerSetTimeOptionType } from "downcapOptions";
import Player from "lib/player/Player";

export class VideoSetTimeHelper {
  private static setForceVideoTime = (player: Player, start: number) => {
    if (!player.isReady) {
      return;
    }
    player.currentTime = start;
    player.pause();
  }

  private static setSmoothVideoTime = (player: Player, start: number, end: number) => {
    if (!player?.isReady) {
      return;
    }

    const currentTime = player.currentTime;
    if (currentTime < start || currentTime >= end) {
      player.currentTime = start;
    }
  }

  static dictionaryOfSetVideoTime: { [name in PlayerSetTimeOptionType]: (player: Player, start: number, end: number) => void } = {
    "force": VideoSetTimeHelper.setForceVideoTime,
    "smooth": VideoSetTimeHelper.setSmoothVideoTime
  };
}
