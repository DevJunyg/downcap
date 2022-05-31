import * as downcapStore from 'storeV2';
import { loadJson } from 'test/utility';
import FontCheckHelper from "FontCheckHelper";
import { configureStore } from 'storeV2/store';

describe('FontCheckHelper: Checked captions with valid font for function.', () => {
  const youtubeInvalidFontCheck = (font: string | number) => !FontCheckHelper.isValidYouTubeFont(font);
  const youtubeFontCaptionsState = loadJson<downcapStore.RootState['present']>('./src/test/resources/FontCheckHelper.test/youtubeFontCaptionsState.json');
  const store = configureStore({
    future: [],
    present: youtubeFontCaptionsState,
    past: []
  });

  it('When originCaptionInvalidFontCheck get youtube font captions parameter, return empty array.', () => {
    expect(FontCheckHelper.originCaptionInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([]);
  })

  it('When translatedCaptionInvalidFontCheck get youtube font captions parameter, return empty array.', () => {
    expect(FontCheckHelper.translatedCaptionInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([]);
  })

  it('When multilineInvalidFontCheck get youtube font captions parameter, return empty array.', () => {
    expect(FontCheckHelper.multilineInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([]);
  })

  it('When translatedMultilineInvalidFontCheck get youtube font captions parameter, return empty array.', () => {
    expect(FontCheckHelper.translatedMultilineInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([]);
  })
})

describe('FontCheckHelper: Checked captions with invalid font for function.', () => {
  const youtubeInvalidFontCheck = (font: string | number) => !FontCheckHelper.isValidYouTubeFont(font);
  const youtubeInvalidFontCaptionsState = loadJson<downcapStore.RootState['present']>('./src/test/resources/FontCheckHelper.test/youtubeInvalidFontCaptionsState.json');
  const store = configureStore({
    future: [],
    present: youtubeInvalidFontCaptionsState,
    past: []
  });

  it('originCaptionInvalidFontCheck return invalid captions.', () => {
    const originCaption = store.getState().present.originCaption.captions![2];
    expect(FontCheckHelper.originCaptionInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([FontCheckHelper.focusMetaParser('originCaption', originCaption, 2)]);
  })

  it('translatedCaptionInvalidFontCheck return invalid captions.', () => {
    const translatedCaption = store.getState().present.translatedCaption.captions![2].paragraphs[0];
    expect(FontCheckHelper.translatedCaptionInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([FontCheckHelper.focusMetaParser('translatedCaption', translatedCaption, 0, 2)]);
  })

  it('multilineInvalidFontCheck return invalid captions.', () => {
    const multiline = store.getState().present.multiline.captions![1];
    expect(FontCheckHelper.multilineInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([FontCheckHelper.focusMetaParser('multiline', multiline, 1)]);
  })
  
  it('translatedMultilineInvalidFontCheck return invalid captions.', () => {
    const translatedMultiline = store.getState().present.translatedMultiline.captions![1];
    expect(FontCheckHelper.translatedMultilineInvalidFontCheck(youtubeInvalidFontCheck, store)).toStrictEqual([FontCheckHelper.focusMetaParser('translatedMultiline', translatedMultiline, 1)]);
  })
})