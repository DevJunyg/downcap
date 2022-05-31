import { IEventParagraph } from 'storeV2';
import DualCaptionHelper from './DualCaptionHelper';
import originDummy from 'test/originDummy';
import dualDummy from 'test/dualDummy';
import translatedDummy from 'test/translatedDummy';

describe('unusual case', () => {
  it('will come in empty.', () => {
    expect(DualCaptionHelper.createDualCaptions([], [])).toEqual([])
  });

  it('Only the origin first will have subtitles', () => {
    const onlyFirst = DualCaptionHelper.createDualCaptions(originDummy[0], [])
    expect(onlyFirst).toEqual<IEventParagraph[]>(dualDummy["KoSingle"]);
  });

  it('Only the origin second will have subtitles', () => {
    const onlySecond = DualCaptionHelper.createDualCaptions([], originDummy[0])
    expect(onlySecond).toEqual<IEventParagraph[]>(dualDummy["KoSingle"]);
  });

  it('Only the translated first will have subtitles', () => {
    let translated = translatedDummy[0].map(item => item.paragraphs).flat();
    const onlyFirst = DualCaptionHelper.createDualCaptions(translated, [])
    expect(onlyFirst).toEqual<IEventParagraph[]>(dualDummy["EnSingle"]);
  });

  it('Only the translated second will have subtitles', () => {
    let translated = translatedDummy[0].map(item => item.paragraphs).flat();
    const onlySecond = DualCaptionHelper.createDualCaptions([], translated)
    expect(onlySecond).toEqual<IEventParagraph[]>(dualDummy["EnSingle"]);
  });
})


describe('dual none style will have subtitles', () => {
  it('Subtitles at the same time will come in.', () => {
    let translated = translatedDummy[0].map(item => item.paragraphs).flat();
    const onlySecond = DualCaptionHelper.createDualCaptions(originDummy[0], translated)
    expect(onlySecond).toEqual<IEventParagraph[]>(dualDummy["KoSingle-EnSingle"]);
  });
})

describe('real caption', () => {
  it('real caption', () => {
    let translated = translatedDummy[1].map(item => item.paragraphs).flat();
    const onlySecond = DualCaptionHelper.createDualCaptions(originDummy[1], translated)
    expect(onlySecond).toEqual<IEventParagraph[]>(dualDummy["Real"]);
  });
});
