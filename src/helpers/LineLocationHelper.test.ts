import downcapOptions from 'downcapOptions';
import * as store from 'storeV2';
import { configureStore } from 'storeV2/store';
import { loadJson } from 'test/utility';
import LineLocationHelper from './LineLocationHelper';

const originCaptionFocusedState = loadJson<store.RootState['present']>(
  './src/test/resources/LineLocationHelper.test/originCaptionFocusedState.json'
);
const translatedCaptionFocusedState = loadJson<store.RootState['present']>(
  './src/test/resources/LineLocationHelper.test/translatedCaptionFocusedState.json'
);

const originCaptionFocusedStateStore = configureStore({
  future: [],
  present: originCaptionFocusedState,
  past: []
});

it('LineLocationHelper resetLocation', () => {
  LineLocationHelper.resetLocation(originCaptionFocusedStateStore);
  const origin = originCaptionFocusedStateStore.getState().present.originCaption.captions![1];
  expect(origin.vertical).toBe(downcapOptions.defaultLocation.vertical);
  expect(origin.horizontal).toBe(downcapOptions.defaultLocation.horizontal);
})

const translatedCaptionFocusedStateStore = configureStore({
  future: [],
  present: translatedCaptionFocusedState,
  past: []
});

describe("LineLocationHelper addLineLoaction", ()=>{
  beforeEach(()=>{
    LineLocationHelper.resetLocation(translatedCaptionFocusedStateStore);
  })

  it('add location-vertical 0.01, location-vertical increase 0.01, finally location-vertical 0.06', () => {
    LineLocationHelper.addLineLoaction('vertical', 0.01, translatedCaptionFocusedStateStore);
    const translated = translatedCaptionFocusedStateStore.getState().present.translatedCaption.captions![0].paragraphs[0];
    expect(translated.vertical).toBe(0.06);
  })
  
  it('add location-vertical -0.01, location-vertical decrease 0.01, finally location-vertical 0.04', () => {
    LineLocationHelper.addLineLoaction('vertical', -0.01, translatedCaptionFocusedStateStore);
    const translated = translatedCaptionFocusedStateStore.getState().present.translatedCaption.captions![0].paragraphs[0];
    expect(translated.vertical).toBe(0.04);
  })
  
  it('add location-horizontal 0.01, location-horizontal increase 0.01, finally location-horizontal 0.51', () => {
    LineLocationHelper.addLineLoaction('horizontal', 0.01, translatedCaptionFocusedStateStore);
    const translated = translatedCaptionFocusedStateStore.getState().present.translatedCaption.captions![0].paragraphs[0];
    expect(translated.horizontal).toBe(0.51);
  })
  
  it('add location-horizontal -0.01, location-horizontal decrease 0.01, finally location-horizontal 0.49', () => {
    LineLocationHelper.addLineLoaction('horizontal', -0.01, translatedCaptionFocusedStateStore);
    const translated = translatedCaptionFocusedStateStore.getState().present.translatedCaption.captions![0].paragraphs[0];
    expect(translated.horizontal).toBe(0.49);
  })
})