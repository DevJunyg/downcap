import "test/testPreload";
import { Provider } from 'react-redux';
import { loadJson } from "test/utility";
import * as downcapStore from 'storeV2';
import { act } from "react-dom/test-utils";
import { configureStore } from 'storeV2/store';
import { fireEvent } from "@testing-library/dom";
import { render, unmountComponentAtNode } from 'react-dom';
import YoutubeVideoUploadPopupContainer from './YoutubeVideoUploadPopupContainer';
import IpcSender from "lib/IpcSender";
import FontCheckHelper from "FontCheckHelper";

const noneCaptionsState = loadJson<downcapStore.RootState['present']>('./src/test/resources/YoutubeVideoUploadPopupContainer.test/noneCaptionsStateDummy.json');
const existCaptionsState = loadJson<downcapStore.RootState['present']>('./src/test/resources/YoutubeVideoUploadPopupContainer.test/existCaptionsYoutubeVideoUploadStateDummy.json');
const youtubeVideoCCUploadInvalidFontState = loadJson<downcapStore.RootState['present']>('./src/test/resources/YoutubeVideoUploadPopupContainer.test/youtubeVideoCCUploadInvalidFontDummy.json');

function renderYoutubeVideoUploadPopupContainer(storeState: downcapStore.RootState['present']) {
  const store = configureStore({
    future: [],
    past: [],
    present: storeState
  });
  
  act(() => {
    render((
      <Provider store={store}>
        <YoutubeVideoUploadPopupContainer />
      </Provider>
    ), container);
  });

  return store;
}

function renderYoutubeVideoUploadPopupContainerToNoneCaptionsState() {
  return renderYoutubeVideoUploadPopupContainer(noneCaptionsState);
}

function renderYoutubeVideoUploadPopupContainerToExistCaptionsState() {
  return renderYoutubeVideoUploadPopupContainer(existCaptionsState);
}

function renderYoutubeVideoUploadPopupContainerToYoutubeVideoCCUploadInvalidFontState() {
  return renderYoutubeVideoUploadPopupContainer(youtubeVideoCCUploadInvalidFontState);
}

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof renderYoutubeVideoUploadPopupContainer> | null = null;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

describe('YoutubeVideoUploadPopupContainer: captions upload option', () => {
  beforeEach(() => {
    store = renderYoutubeVideoUploadPopupContainerToExistCaptionsState();
  });

  afterEach(() => {
    store = null;
  })

  it('When YoutubeVideoUploadPopupContainer is rendering, captions upload option checkbox is exist.', () => {
    expect(container?.getElementsByClassName('captions-contents')).not.toBe(null);
  })

  it('When YoutubeVideoUploadPopupContainer is rendering, none caption upload option is true.', () => {
    expect((container?.getElementsByClassName('none-caption-upload').item(0) as HTMLInputElement).checked).toBe(true);
  })

  it('When YoutubeVideoUploadPopup class origin-caption-upload has checked, origin caption upload option is true.', () => {
    const originCheckbox = container?.getElementsByClassName('origin-caption-upload').item(0) as HTMLInputElement;

    act(() => {
      originCheckbox.click();
    })

    expect(originCheckbox.checked).toBe(true);
  })

  it('When YoutubeVideoUploadPopup class translated-caption-upload has checked, translated caption upload option is true.', () => {
    const translatedCheckbox = container?.getElementsByClassName('translated-caption-upload').item(0) as HTMLInputElement;

    act(() => {
      translatedCheckbox.click();
    })

    expect(translatedCheckbox.checked).toBe(true);
  })
})

describe('YoutubeVideoUploadPopupContainer: captions upload option disabled', () => {
  beforeEach(() => {
    store = renderYoutubeVideoUploadPopupContainerToNoneCaptionsState();
  });

  afterEach(() => {
    store = null;
  })

  it('When there are no origin caption and multiline, disabled the origin caption upload checkbox.', () => {
    expect((container?.getElementsByClassName('origin-caption-upload').item(0) as HTMLInputElement).disabled).toBe(true);
  })

  it('When there are no translated caption and translated multiline, disabled the translated caption upload checkbox.', () => {
    expect((container?.getElementsByClassName('translated-caption-upload').item(0) as HTMLInputElement).disabled).toBe(true);
  })
})

describe('YoutubeVideoUploadPopupContainer: invalid font check', () => {
  beforeEach(() => {
    store = renderYoutubeVideoUploadPopupContainerToYoutubeVideoCCUploadInvalidFontState();
  });

  afterEach(() => {
    store = null;
  })
  it('When origin caption upload, check the invalid font of the origin caption and multiline caption.', () => {
    FontCheckHelper.originCaptionInvalidFontCheck = jest.fn().mockReturnValue([FontCheckHelper.focusMetaParser('originCaption', store!.getState().present.originCaption.captions![2], 2)]);

    const inputEvt = new InputEvent("input", { bubbles: true });
    const videoTitle = container?.getElementsByClassName('video-title-content').item(0)?.getElementsByTagName('input').item(0) as HTMLInputElement;

    act(() => {
      fireEvent(videoTitle, inputEvt)
      const emailValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;

      emailValueSetter.call(videoTitle, 'test title');

      videoTitle.dispatchEvent(inputEvt);
    });

    (container?.getElementsByClassName('origin-caption-upload').item(0) as HTMLInputElement).click();
    (container?.getElementsByClassName('btn popup-btn ok-btn').item(0) as HTMLDivElement).click();
    expect(store!.getState().present.popup.name).toBe('InvalidFontCheckPopup');
  })
})

describe('YoutubeVideoUploadPopupContainer: send youtube video upload', () => {
  beforeEach(() => {
    store = renderYoutubeVideoUploadPopupContainerToExistCaptionsState();
    IpcSender.sendYoutubeVideoUpload = jest.fn();
  });

  afterEach(() => {
    store = null;
  })

  it('When uploading youTube video without any captions, IpcSender.sendYoutubeVideoUpload to be called.', () => {
    const inputEvt = new InputEvent("input", { bubbles: true });
    const videoTitle = container?.getElementsByClassName('video-title-content').item(0)?.getElementsByTagName('input').item(0) as HTMLInputElement;

    act(() => {
      fireEvent(videoTitle, inputEvt)
      const emailValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;

      emailValueSetter.call(videoTitle, 'test title');

      videoTitle.dispatchEvent(inputEvt);
    });

    (container?.getElementsByClassName('btn popup-btn ok-btn').item(0) as HTMLDivElement).click();
    expect(IpcSender.sendYoutubeVideoUpload).toBeCalled();
  })

  it('When uploading youTube video and origin captions, IpcSender.sendYoutubeVideoUpload to be called.', () => {
    FontCheckHelper.originCaptionInvalidFontCheck = jest.fn().mockReturnValue([]);

    const inputEvt = new InputEvent("input", { bubbles: true });
    const videoTitle = container?.getElementsByClassName('video-title-content').item(0)?.getElementsByTagName('input').item(0) as HTMLInputElement;

    act(() => {
      fireEvent(videoTitle, inputEvt)
      const emailValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;

      emailValueSetter.call(videoTitle, 'test title');

      videoTitle.dispatchEvent(inputEvt);
    });

    (container?.getElementsByClassName('origin-caption-upload').item(0) as HTMLInputElement).click();
    (container?.getElementsByClassName('btn popup-btn ok-btn').item(0) as HTMLDivElement).click();
    expect(IpcSender.sendYoutubeVideoUpload).toBeCalled();
  })

  it('When uploading youTube video and translated captions, IpcSender.sendYoutubeVideoUpload to be called.', () => {
    const inputEvt = new InputEvent("input", { bubbles: true });
    const videoTitle = container?.getElementsByClassName('video-title-content').item(0)?.getElementsByTagName('input').item(0) as HTMLInputElement;

    act(() => {
      fireEvent(videoTitle, inputEvt)
      const emailValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;

      emailValueSetter.call(videoTitle, 'test title');

      videoTitle.dispatchEvent(inputEvt);
    });

    (container?.getElementsByClassName('translated-caption-upload').item(0) as HTMLInputElement).click();
    (container?.getElementsByClassName('btn popup-btn ok-btn').item(0) as HTMLDivElement).click();
    expect(IpcSender.sendYoutubeVideoUpload).toBeCalled();
  })

  it('When uploading youTube video and origin with translated captions, IpcSender.sendYoutubeVideoUpload to be called.', () => {
    FontCheckHelper.originCaptionInvalidFontCheck = jest.fn().mockReturnValue([]);

    const inputEvt = new InputEvent("input", { bubbles: true });
    const videoTitle = container?.getElementsByClassName('video-title-content').item(0)?.getElementsByTagName('input').item(0) as HTMLInputElement;

    act(() => {
      fireEvent(videoTitle, inputEvt)
      const emailValueSetter = Object.getOwnPropertyDescriptor(
        window.HTMLInputElement.prototype,
        "value"
      )!.set!;

      emailValueSetter.call(videoTitle, 'test title');

      videoTitle.dispatchEvent(inputEvt);
    });

    (container?.getElementsByClassName('origin-caption-upload').item(0) as HTMLInputElement).click();
    (container?.getElementsByClassName('translated-caption-upload').item(0) as HTMLInputElement).click();
    (container?.getElementsByClassName('btn popup-btn ok-btn').item(0) as HTMLDivElement).click();
    expect(IpcSender.sendYoutubeVideoUpload).toBeCalled();
  })
})