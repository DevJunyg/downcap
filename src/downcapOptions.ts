export type PlayerSetTimeOptionType = "force" | "smooth";

// Forward is the direction in which the index increases in the array.
// Backward is the direction in which the index decreases in the array.
export type SameTimeSubtitleCreationRuleType = 'increases' | 'decreases';

interface DowncapOptionType {
  defaultFontSize: number;
  defaultSplitValue: {
    origin: number,
    translated: number
  };
  defaultLocation: {
    horizontal: number,
    vertical: number
  };
  setvideoTime: PlayerSetTimeOptionType;
  sameTimeSubtitleCreationRule: SameTimeSubtitleCreationRuleType;
  projectSaveVersion: '2.0.3';
  presetFontSizeApplyDisaled: boolean,
  editorPageLeftWidthMinSize: number;
  editorPageRightWidthMinSize: number;
  confidenceBoundaries: number[];
  playerEventLoopTime: number;
  realtimeTranslationDelayTime: number;
  itemRenderingQuantity: number;
}

const downcapOptions: DowncapOptionType = {
  defaultFontSize: 16,
  defaultSplitValue: {
    origin: 20,
    translated: 40
  },
  defaultLocation: {
    horizontal: 0.5,
    vertical: 0.05
  },
  setvideoTime: "force",
  sameTimeSubtitleCreationRule: 'increases',
  projectSaveVersion: '2.0.3',
  presetFontSizeApplyDisaled: false,
  editorPageLeftWidthMinSize: 0.385,
  editorPageRightWidthMinSize: 0.7,
  confidenceBoundaries: [0.5, 0.8],
  playerEventLoopTime: 150,
  realtimeTranslationDelayTime: 900,
  itemRenderingQuantity: 5
};

export default Object.freeze(downcapOptions);