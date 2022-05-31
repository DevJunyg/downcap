import downcapOptions from "downcapOptions";

const confidenceClassNames = [
  'confidence-high',
  'confidence-middle',
  'confidence-low',
]

export class DowncapHelper {
  static guessTimeTakeOnSTC(duration: number) {
    // t = duration / 60 * 0.8
    //   = duration / 75
    return Math.ceil(duration / 75);
  }

  static guessPaidLetterOnSTC(duration: number) {
    return Math.ceil(duration / 15) * 2;
  }

  static guessPaidLetterOnTranslate(length: number): number;
  static guessPaidLetterOnTranslate(text: string): number;
  static guessPaidLetterOnTranslate(value: number | string) {
    let length: number;
    if (typeof value === "number") {
      length = value
    } else {
      length = value.length
    }
    return Math.ceil(length / 100);
  }

  static getConfidenceClassName = (confidence: number | undefined) => {
    if (confidence === undefined) {
      return;
    }

    let index = 0;

    for (const confidenceBoundary of downcapOptions.confidenceBoundaries) {
      if (confidence > confidenceBoundary) {
        break;
      }

      index += 1;
    }

    return confidenceClassNames[index];
  }
}