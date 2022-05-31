import { loadJson } from 'test/utility';
import * as utils from './utils';

const translatedState = loadJson('./src/test/resources/utils.test/translatedCaptionState.json');

const haveLocationDualState = loadJson('./src/test/resources/utils.test/dualState.json')

describe('test createDowncapScript', () => {
  it('"vertical": 0.58, "horizontal": 0.49 first dual caption pass to createDowncapScript, received event vertical and horizontal is equal with passed value', () => {
    const script = utils.createDowncapScript({ captions: haveLocationDualState.dualCaption.captions, exportLanguage: 'dual' });
    const vertical = haveLocationDualState.dualCaption.captions[1].vertical;
    const horizontal = haveLocationDualState.dualCaption.captions[1].horizontal;
    const eventVertical = Math.round(script.events[1].bottom) / 100;
    const eventHorizental = Math.round(script.events[1].left) / 100;

    expect(eventVertical).toBe(vertical);
    expect(eventHorizental).toBe(horizontal);
  });

  it('"vertical": 0.58, "horizontal": 0.49 first translated caption pass to createDowncapScript, received event vertical and horizontal is equal with passed value', () => {
    const script = utils.createDowncapScript({ captions: translatedState.translatedCaption.captions.first().paragraphs, exportLanguage: 'translated' });
    const vertical = translatedState.translatedCaption.captions.first().paragraphs[0].vertical * 100;
    const horizontal = translatedState.translatedCaption.captions.first().paragraphs[0].horizontal * 100;

    expect(script.events[0].bottom).toBe(vertical);
    expect(script.events[0].left).toBe(horizontal);
  });
})