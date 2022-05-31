import LocationButtonsContainer from './LocationButtonsContainer';
import downcapOptions from 'downcapOptions';
import * as downcapStore from 'storeV2';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from '@testing-library/react';
import { Provider } from 'react-redux';
import { fireEvent } from '@testing-library/react'
import { loadJson } from 'test/utility';
import { configureStore } from 'storeV2/store';
import { cloneDeep } from 'lodash';

const allCaptionsHaveLocationValueState = loadJson<downcapStore.RootState['present']>('./src/test/resources/LocationButtonsContainer.test/locationChagedLine.json');

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  store = configureStore({
    past: [],
    present: allCaptionsHaveLocationValueState,
    future: []
  });
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
  store = null;
});

describe("location button click", () => {
  it("line location up button click, the vertical value increases by 0.01", () => {
    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const locationButtons = container!.querySelectorAll(".line-location-button");
    const increasedValue = Math.floor((allCaptionsHaveLocationValueState.originCaption.captions!.first().vertical! + 0.01) * 100) / 100;

    fireEvent(locationButtons[0],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    expect(store!.getState().present.originCaption.captions!.first().vertical).toBe(increasedValue)
  })

  it("line location down button click, the vertical value decrease by 0.01", () => {
    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const locationButtons = container!.querySelectorAll(".line-location-button");
    const decreaseValue = Math.floor((allCaptionsHaveLocationValueState.originCaption.captions!.first().vertical! - 0.01) * 100) / 100;

    fireEvent(locationButtons[1],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    expect(store!.getState().present.originCaption.captions!.first().vertical).toBe(decreaseValue)
  })

  it("line location left button click, the horizontal value decrease by 0.01", () => {
    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const locationButtons = container!.querySelectorAll(".line-location-button");
    const decreaseValue = Math.floor((allCaptionsHaveLocationValueState.originCaption.captions!.first().horizontal! - 0.01) * 100) / 100;

    fireEvent(locationButtons[2],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    expect(store!.getState().present.originCaption.captions!.first().horizontal).toBe(decreaseValue)
  })

  it("line location right button click, the horizontal value increases by 0.01", () => {
    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const locationButtons = container!.querySelectorAll(".line-location-button");
    const increasedValue = Math.floor((allCaptionsHaveLocationValueState.originCaption.captions!.first().horizontal! + 0.01) * 100) / 100;

    fireEvent(locationButtons[3],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    expect(store!.getState().present.originCaption.captions!.first().horizontal).toBe(increasedValue)
  })
})

describe("get defalut location value", () => {
  it("there is no vertical value, get default vertical value", () => {
    const noneVerticalOriginCaptionState = cloneDeep(allCaptionsHaveLocationValueState);
    delete noneVerticalOriginCaptionState.originCaption.captions!.first().vertical;
    const store = configureStore({
      past: [],
      present: noneVerticalOriginCaptionState,
      future: []
    });

    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const locationButtons = container!.querySelectorAll(".line-location-button");
    const increasedValue = Math.floor((downcapOptions.defaultLocation.vertical + 0.01) * 100) / 100;

    fireEvent(locationButtons[0],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    expect(store.getState().present.originCaption.captions!.first().vertical).toBe(increasedValue);
  })


  it("there is no hroizental value, get default hroizental value", () => {
    const noneHorizontalOriginCaptionState = cloneDeep(allCaptionsHaveLocationValueState);
    noneHorizontalOriginCaptionState.originCaption.captions!.first().horizontal = undefined;
    const store = configureStore({
      past: [],
      present: noneHorizontalOriginCaptionState,
      future: []
    });

    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const locationButtons = container!.querySelectorAll(".line-location-button");
    const increasedValue = Math.floor((downcapOptions.defaultLocation.horizontal + 0.01) * 100) / 100;

    fireEvent(locationButtons[3],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    expect(store.getState().present.originCaption.captions!.first().horizontal).toBe(increasedValue);
  })
})

describe("reset location button click", () => {
  it("default loaction value to downcapOption.defaultLocation in originCaption", () => {
    const locatedOriginCaptionState = cloneDeep(allCaptionsHaveLocationValueState);
    locatedOriginCaptionState.originCaption.captions!.first().horizontal = 0.5;
    locatedOriginCaptionState.originCaption.captions!.first().vertical = 0.1;
    locatedOriginCaptionState.originCaption.defaultLocation = {
      horizontal: 1,
      vertical: 0
    };

    const store = configureStore({
      past: [],
      present: locatedOriginCaptionState,
      future: []
    });

    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const resetLocationButton = container!.querySelectorAll(".captions-location-button");
    console.log(store.getState().present.projectCotrol.focusParagraphMetas!.first());
    
    fireEvent(resetLocationButton[0],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    const caption = store.getState().present.originCaption.captions!.first();
    expect(caption.horizontal).toBe(downcapOptions.defaultLocation.horizontal);
    expect(caption.vertical).toBe(downcapOptions.defaultLocation.vertical);
  })

  it("default loaction value to downcapOption.defaultLocation in translatedCaption", () => {
    const locatedTranslatedCaptionState = cloneDeep(allCaptionsHaveLocationValueState)
    locatedTranslatedCaptionState.translatedCaption.captions!.first().paragraphs.first().horizontal = 0.5;
    locatedTranslatedCaptionState.translatedCaption.captions!.first().paragraphs.first().vertical = 0.1;
    locatedTranslatedCaptionState.translatedCaption.defaultLocation = {
      horizontal: 1,
      vertical: 0
    }
    locatedTranslatedCaptionState.projectCotrol.focusParagraphMetas = [{
      "path": {
        "captionIndex": 0,
        "paragraphIndex": 0
      },
      "source": "list",
      "type": "translatedCaption"
    }]

    const store = configureStore({
      past: [],
      present: locatedTranslatedCaptionState,
      future: []
    });

    act(() => {
      render((
        <Provider store={store!}>
          <LocationButtonsContainer />
        </Provider>
      ), container);
    })

    const resetLocationButton = container!.querySelectorAll(".captions-location-button");

    fireEvent(resetLocationButton[0],
      new MouseEvent('click', {
        bubbles: true,
        cancelable: true,
      }))

    const caption = store.getState().present.translatedCaption.captions!.first().paragraphs.first();
    expect(caption.horizontal).toBe(downcapOptions.defaultLocation.horizontal);
    expect(caption.vertical).toBe(downcapOptions.defaultLocation.vertical);
  })
})