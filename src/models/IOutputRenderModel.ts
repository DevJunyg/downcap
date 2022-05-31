import IAudioInfo from "./IAudioInfo";

export interface IOutputRenderModel {
  origin: IAudioInfo
  assPath?: string
  outputPath: string
  tempPath: string;
}