import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import * as storeV2 from 'storeV2';

interface ITime {
  start: number,
  end: number
}

export default class ComparerHelper {
  private static getParagraphTime(paragraph: storeV2.ICaptionsParagraph) {
    const start = paragraph.lines!.first().words!.first().start;
    const end = paragraph.lines!.last().words!.last().end;
    return {
      start: start,
      end: end
    }
  }

  static compareTimeAndCurrentTime(time: ITime, currentTime: number) {
    if (currentTime < time.start) return -1;
    if (currentTime >= time.end) return 1;
    return 0;
  }

  static compareNumber(left: number, right: number) {
    // Need to use compare because subtraction will wrap
    // to positive for very large neg numbers, etc.
    if (left < right) return -1;
    if (right < left) return 1;
    return 0;
  }

  static compareTime(left: ITime, right: ITime) {
    let comValue = ComparerHelper.compareNumber(left.start ?? 0, right.start ?? 0);
    if (comValue !== 0) return comValue;
    return ComparerHelper.compareNumber(left.end ?? Infinity, right.end ?? Infinity);
  }

  static compareParagraph<T extends storeV2.ICaptionsParagraph>(left: T, right: T) {
    const leftTime = ComparerHelper.getParagraphTime(left);
    const rightTime = ComparerHelper.getParagraphTime(right);

    return ComparerHelper.compareTime(leftTime, rightTime);
  }


  static compareParagraphAndTime(paragraph: storeV2.ICaptionsParagraph, time: number) {
    const paragraphTime = ComparerHelper.getParagraphTime(paragraph);

    return ComparerHelper.compareTimeAndCurrentTime(paragraphTime, time);
  }

  static multitlieCompare(left: storeV2.ICaptionsParagraph, right: storeV2.ICaptionsParagraph) {
    const leftStart = ParagraphCaptionsHelper.getParagraphStartTime(left);
    const rightStart = ParagraphCaptionsHelper.getParagraphStartTime(right);

    if (leftStart < rightStart) return -1;
    if (leftStart > rightStart) return 1;

    const leftEnd = ParagraphCaptionsHelper.getParagraphEndTime(left);
    const rightEnd = ParagraphCaptionsHelper.getParagraphEndTime(right);

    if (leftEnd > rightEnd) return -1;
    if (leftEnd < rightEnd) return 1;

    return 0;
  }

  static compareEventParagraph(left: storeV2.IEventParagraph, right: storeV2.IEventParagraph) {
    const leftTime = {
      start: left.start,
      end: left.end
    };

    const rightTime = {
      start: right.start,
      end: right.end
    };
    
    return ComparerHelper.compareTime(leftTime, rightTime);
  }
}