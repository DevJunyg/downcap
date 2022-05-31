import Player from "lib/player/Player";

class PlayerHelper {
  static getCurrentTime(player: Player) {
    try {
      return player.currentTime
    } catch (err) {
      return 0;
    }
  }
}