import React from "react";

export interface ICanvasContext {
  canvas: React.RefObject<HTMLCanvasElement> | null,
}

const CanvasContext = React.createContext<ICanvasContext>({
  canvas: null
});

CanvasContext.displayName = 'CanvasContext'

export default CanvasContext;