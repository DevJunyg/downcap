import Player from "lib/player/Player";
import React from "react";

interface IPlayerContext {
  player: Player | null | undefined,
  setPlayer: (player: Player) => void
}

const PlayerContext = React.createContext<IPlayerContext>({
  player: null,
  setPlayer: (player: Player) => {
    throw new Error("Not implemented.");
  }
});

PlayerContext.displayName = 'PlayerContext'

export default PlayerContext;