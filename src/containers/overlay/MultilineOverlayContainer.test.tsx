import MultilineOverlayContainer from './MultilineOverlayContainer';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import { Provider } from 'react-redux'
import { loadJson } from 'test/utility';
import { configureStore } from 'storeV2/store';
import * as downcapStore from 'storeV2';

const multilineInitialState = loadJson<downcapStore.RootState['present']>('./src/test/resources/multiline.json');

let container: HTMLDivElement | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

describe("caption rendering check", () => {
  let store: ReturnType<typeof configureStore> | null;

  beforeEach(() => {
    store = configureStore({
      future: [],
      present: multilineInitialState,
      past: []
    });
  });

  afterEach(() => {
    store = null;
  })

  it("caption overlay is not randered when caption is not exist", () => {
    act(() => {
      render((
        <Provider store={store!}>
          <MultilineOverlayContainer />
        </Provider>
      ), container);
    });

    expect(container?.querySelector('.caption-ovleray')).toBeNull();
  })

  it("multiline overlay contianer, render multi-line caption", () => {
    const caption = multilineInitialState.multiline.captions![2] as downcapStore.ICaptionsParagraph;

    act(() => {
      render((
        <Provider store={store!}>
          <MultilineOverlayContainer caption={caption} />
        </Provider>
      ), container);
    });

    expect(container).toContainHTML('새로 생성한 줄입니다');
  })
})
