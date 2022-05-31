import * as store from 'storeV2';
import ParagraphCaptionsHelper from './ParagraphCaptionsHelper';
import "JsExtensions";
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import ComparerHelper from 'lib/ComparerHelper';

interface IDualMultilineSnippet {
  origin?: store.ICaptionsParagraph,
  translated?: store.ICaptionsParagraph,
}


function captionWordToEventWord(word: store.ICaptionsWord): store.IEventWord {
  let eventWord: store.IEventWord = {
    text: word.text,
  }

  if (word.style) {
    eventWord.style = word.style
  }

  return eventWord;
}

function _captionLineToEventLine(line: store.ICaptionsLine): store.IEventLine {
  let eventLine: store.IEventLine = {
    words: line.words.map(captionWordToEventWord)
  };

  if (line.style) {
    eventLine.style = line.style;
  }

  return eventLine
}

function _LineStartTimeArray(captions: readonly store.ICaptionsParagraph[]) {
  let startTimeArray: number[] = [];
  captions.forEach(caption =>
    startTimeArray.push(ParagraphCaptionsHelper.getParagraphStartTime(caption))
  );

  return startTimeArray;
}

function dualLineStartTimeArrayFunc(
  koCaptions: readonly store.ICaptionsParagraph[],
  enCaptions: readonly store.ICaptionsParagraph[]
): number[] {

  const koLineStartTimeArray = _LineStartTimeArray(koCaptions)
  const enLineStartTimeArray = _LineStartTimeArray(enCaptions)

  const koStartAddEnStart = koLineStartTimeArray.reduce((acc: number[], startTime) => {
    if (acc.last() !== startTime) {
      let koDuplicateCnt = 0;
      koLineStartTimeArray.forEach(koStart => {
        if (startTime === koStart) {
          koDuplicateCnt++;
        }
      });

      let enDuplicateCnt = 0;
      enLineStartTimeArray.forEach(enStart => {
        if (startTime === enStart) {
          enDuplicateCnt++;
        }
      });

      const duplicateCnt = koDuplicateCnt >= enDuplicateCnt ? koDuplicateCnt : enDuplicateCnt
      for (let index = 0; index < duplicateCnt; index++) {
        acc.push(startTime);
      }
    }

    return acc;
  }, []);

  const addEnSoloStart = enLineStartTimeArray.filter(enSoloStart => !koLineStartTimeArray.includes(enSoloStart));
  const dualLineStartTimeArray = koStartAddEnStart.concat(addEnSoloStart);
  const dualLineStartTimeArraySort = dualLineStartTimeArray.sort(ComparerHelper.compareNumber);

  return dualLineStartTimeArraySort;
}

function secondEventCaption(enLine: store.ICaptionsParagraph, dualStart: number, dualEnd: number): store.IEventParagraph {
  let event: store.IEventParagraph = {
    lines: [
      _captionLineToEventLine(enLine.lines.first())
    ],
    start: dualStart,
    end: dualEnd,
  }

  if (enLine.vertical) {
    event.vertical = enLine.vertical;
  }

  if (enLine.horizontal) {
    event.horizontal = enLine.horizontal;
  }

  return event;
}

function firstSecondEventCaption(
  koLine: store.ICaptionsParagraph,
  enLine: store.ICaptionsParagraph,
  dualStart: number,
  dualEnd: number
): store.IEventParagraph {
  let event: store.IEventParagraph = {
    lines: [
      _captionLineToEventLine(koLine.lines.first()),
      _captionLineToEventLine(enLine.lines.first())
    ],
    start: dualStart,
    end: dualEnd,
  }

  if (koLine.vertical) {
    event.vertical = koLine.vertical;
  }

  if (koLine.horizontal) {
    event.horizontal = koLine.horizontal;
  }

  return event;
}

function firstEventCaption(koLine: store.ICaptionsParagraph, dualStart: number, dualEnd: number): store.IEventParagraph {
  let event: store.IEventParagraph = {
    lines: [
      _captionLineToEventLine(koLine.lines.first())
    ],
    start: dualStart,
    end: dualEnd,
  }

  if (koLine.vertical) {
    event.vertical = koLine.vertical;
  }

  if (koLine.horizontal) {
    event.horizontal = koLine.horizontal;
  }

  return event;
}

function createMultilineDualCaptionSnippets(
  origin: store.ICaptionsParagraph[],
  translated: store.ITranslatedMultilineCaption[]
): IDualMultilineSnippet[] {
  let originIdSet = new Set(origin.map(caption => caption.id));
  let translatedExistOriginal = translated.filter(item => {
    let sourceId = item.meta?.sourceId;
    return sourceId && originIdSet.has(sourceId);
  });

  let translatedExistOriginalIdSet = new Set(translatedExistOriginal.map(item => item.id));
  let onlyTranslatedCaption = translated.reduce<store.ITranslatedMultilineCaption[]>((acc, caption) => {
    if (!translatedExistOriginalIdSet.has(caption.id)) {
      acc.push(caption);
    }
    return acc;
  }, []);

  let multilineSet = new Set(translatedExistOriginal.map(item => item.meta?.sourceId!));
  let onlyMultilineCaption = origin.reduce<store.ICaptionsParagraph[]>((acc, caption) => {
    if (!multilineSet.has(caption.id!)) {
      acc.push(caption);
    }
    return acc;
  }, []);


  let output: IDualMultilineSnippet[] = [];

  onlyTranslatedCaption.forEach(item => {
    output.push({
      translated: item
    })
  });

  onlyMultilineCaption.forEach(item => {
    output.push({
      origin: item
    })
  });

  let originIdCaption = origin.reduce<{ [id: number]: store.ICaptionsParagraph }>((acc, current) => {
    acc[current.id!] = current
    return acc;
  }, {});


  translatedExistOriginal.forEach(caption => {
    output.push(({
      origin: originIdCaption[caption.meta!.sourceId!],
      translated: caption
    }))
  });

  return output;
}

export default class DualCaptionHelper {
  private static _logger = ReactLoggerFactoryHelper.build('DualCaptionHelper');

  static createDualCaptions(
    first: readonly store.ICaptionsParagraph[],
    second: readonly store.ICaptionsParagraph[]
  ): store.IEventParagraph[] {
    const firstCaptions = first;
    const secondCaptions = second;

    const dualLineStartTimeArray = dualLineStartTimeArrayFunc(firstCaptions, secondCaptions);
    let dualCaptions: store.IEventParagraph[] = [];
    let firstIndex = 0;
    let secondIndex = 0;

    dualLineStartTimeArray.forEach(dualLineStartTime => {
      const firstCapion = firstCaptions[firstIndex];
      const secondCaption = secondCaptions[secondIndex];

      const firstLine = firstCapion?.lines.first();
      const secondLine = secondCaption?.lines.first();

      if (firstLine?.words === undefined && secondLine?.words === undefined) {
        return;
      }

      if (firstLine === undefined && secondLine?.words !== undefined) {
        dualCaptions.push(secondEventCaption(secondCaption, dualLineStartTime, secondLine.words.last().end));
        secondIndex++;
        return;
      }

      if (secondLine === undefined && firstLine?.words !== undefined) {
        dualCaptions.push(firstEventCaption(firstCapion, dualLineStartTime, firstLine.words.last().end));
        firstIndex++;
        return;
      }

      const firstStart = firstLine.words.first().start;
      const firstEnd = firstLine.words.last().end;
      const secondStart = secondLine.words.first().start;
      const secondEnd = secondLine.words.last().end;

      if (dualLineStartTime === secondStart && dualLineStartTime === firstStart) {
        if (firstEnd < secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, firstEnd));
          firstIndex++;
          const nextFirstStart = firstCaptions[firstIndex]?.lines?.first().words.first().start;
          if (nextFirstStart === undefined || nextFirstStart !== firstEnd) {
            const nextSecondEnd = (nextFirstStart && nextFirstStart < secondEnd) ? nextFirstStart : secondEnd;
            dualCaptions.push(secondEventCaption(secondCaption, firstEnd, nextSecondEnd));
            if (nextSecondEnd === secondEnd) {
              secondIndex++;
            }
          }
        } else if (firstEnd === secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, firstEnd));
          firstIndex++;
          secondIndex++;
        } else if (firstEnd > secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, secondEnd));
          secondIndex++;
          const nextSecondStart = secondCaptions[secondIndex]?.lines?.first().words?.first().start;
          if (nextSecondStart === undefined || nextSecondStart !== secondEnd) {
            const firstSoloLineEnd = (nextSecondStart && nextSecondStart < firstEnd) ? nextSecondStart : firstEnd;
            dualCaptions.push(firstEventCaption(firstCapion, secondEnd, firstSoloLineEnd));
            if (firstSoloLineEnd === firstEnd) {
              firstIndex++;
            }
          }
        }
      } else if (dualLineStartTime === secondStart && dualLineStartTime > firstStart) {
        if (firstEnd < secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, firstEnd));
          firstIndex++;
          const nextFirstStart = firstCaptions[firstIndex]?.lines?.first().words.first().start;
          if (nextFirstStart === undefined || nextFirstStart !== firstEnd) {
            const secondSoloLineEnd = (nextFirstStart && nextFirstStart < secondEnd) ? nextFirstStart : secondEnd;
            dualCaptions.push(secondEventCaption(secondCaption, firstEnd, secondSoloLineEnd));
            if (secondSoloLineEnd === secondEnd) {
              secondIndex++;
            }
          }
        } else if (firstEnd === secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, firstEnd));
          firstIndex++;
          secondIndex++;
        } else if (firstEnd > secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, secondEnd));
          secondIndex++;
          const nextSecondStart = secondCaptions[secondIndex]?.lines?.first().words.first().start;
          if (nextSecondStart === undefined || nextSecondStart !== secondEnd) {
            const firstSoloLineEnd = nextSecondStart && nextSecondStart < firstEnd ? nextSecondStart : firstEnd;
            dualCaptions.push(firstEventCaption(firstCapion, secondEnd, firstSoloLineEnd));
            if (firstSoloLineEnd === firstEnd) {
              firstIndex++;
            }
          }
        }
      } else if (dualLineStartTime === secondStart && dualLineStartTime < firstStart) {
        if (firstStart < secondEnd) {
          dualCaptions.push(secondEventCaption(secondCaption, dualLineStartTime, firstStart));
        } else if (firstStart >= secondEnd) {
          dualCaptions.push(secondEventCaption(secondCaption, dualLineStartTime, secondEnd));
          secondIndex++;
        }
      } else if (dualLineStartTime === firstStart && dualLineStartTime > secondStart) {
        if (firstEnd < secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, firstEnd));
          firstIndex++;
          const nextFirstStart = firstCaptions[firstIndex]?.lines?.first().words.first().start;
          if (nextFirstStart === undefined || nextFirstStart !== firstEnd) {
            const secondSoloLineEnd = nextFirstStart && nextFirstStart < secondEnd ? nextFirstStart : secondEnd;
            dualCaptions.push(secondEventCaption(secondCaption, firstEnd, secondSoloLineEnd));
            if (secondSoloLineEnd === secondEnd) {
              secondIndex++;
            }
          }
        } else if (firstEnd === secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, firstEnd));
          firstIndex++;
          secondIndex++;
        } else if (firstEnd > secondEnd) {
          dualCaptions.push(firstSecondEventCaption(firstCapion, secondCaption, dualLineStartTime, secondEnd));
          secondIndex++;
          const nextSecondStart = secondCaptions[secondIndex]?.lines?.first().words.first().start;
          if (nextSecondStart === undefined || nextSecondStart !== secondEnd) {
            const firstSoloLineEnd = secondCaptions[secondIndex] && nextSecondStart < firstEnd ? nextSecondStart : firstEnd;
            dualCaptions.push(firstEventCaption(firstCapion, secondEnd, firstSoloLineEnd));
            if (firstSoloLineEnd === firstEnd) {
              firstIndex++;
            }
          }
        }
      } else if (dualLineStartTime === firstStart && dualLineStartTime < secondStart) {
        if (firstEnd <= secondStart) {
          dualCaptions.push(firstEventCaption(firstCapion, dualLineStartTime, firstEnd));
          firstIndex++;
        } else if (firstEnd > secondStart) {
          dualCaptions.push(firstEventCaption(firstCapion, dualLineStartTime, secondStart));
        }
      } else {
        DualCaptionHelper._logger.logError(new Error("Problem with DualCaptionHelper"));
      }
    });

    return dualCaptions.filter(line => line.start !== line.end);
  }

  static createDualMultiline(origin: store.ICaptionsParagraph[],
    translated: store.ITranslatedMultilineCaption[],
    sequence: store.SequenceType[]
  ): store.IEventParagraph[] {
    const dualMultilineSnippets = createMultilineDualCaptionSnippets(origin, translated);
    return dualMultilineSnippets.map<store.IEventParagraph>(item => {
      const captions = {
        'origin': item.origin,
        'translated': item.translated
      };

      const firstCaption = captions[sequence[0]];
      const secondCaption = captions[sequence[1]];

      let lines: store.IEventLine[] = [];
      const first = firstCaption?.lines?.first();
      if (first) {
        lines.push(first);
      }

      const second = secondCaption?.lines?.first();

      if (second) {
        lines.push(second);
      }

      let caption: store.IEventParagraph = {
        end: ParagraphCaptionsHelper.getParagraphEndTime(firstCaption ?? secondCaption!),
        start: ParagraphCaptionsHelper.getParagraphStartTime(firstCaption ?? secondCaption!),
        lines: lines
      }

      
      let vertical = firstCaption ? firstCaption.vertical : secondCaption?.vertical;
      if (vertical !== undefined) {
        caption.vertical = vertical;
      }

      let horizontal = firstCaption ? firstCaption.horizontal : secondCaption?.horizontal;
      if (horizontal !== undefined) {
        caption.horizontal = horizontal;
      }

      return caption;
    });
  }

  static captionLineToEventLine(line: store.ICaptionsLine): store.IEventLine {
    return _captionLineToEventLine(line);
  }
}