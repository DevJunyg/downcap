import "test/testPreload";
import { configureStore } from 'storeV2/store';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "@testing-library/react";
import { Provider } from 'react-redux'
import EditorPage from "pages/EditorPage";
import ProjectManager from "./ProjectManager";
import storeV2, * as downcapStore from "storeV2";
import { loadJson } from "test/utility";
import { ITranslateTask } from "storeV2/modules/translateTask";
import { ITimeText } from "models";
import IpcSender from "lib/IpcSender";

let container: HTMLDivElement | null = null;
let store: ReturnType<typeof configureStore> | null = null;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
  store = configureStore();
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
  store = null;
});

it('When the edit tab is changed, the state index is initialized.', () => {
  act(() => {
    render((
      <Provider store={store!} >
        <EditorPage />
      </Provider>
    ), container);
  });

  act(() => {
    ProjectManager.changeEditTab('translated', store!);
  });

  expect(store?.getState().present.project.selectedEditType).toEqual('translated');
  expect(store!.getState().index! <= 1).toEqual(true);
});


it('same style editing tab, no change appears.', () => {
  act(() => {
    render((
      <Provider store={store!} >
        <EditorPage />
      </Provider>
    ), container);
  });

  let prevStore = store?.getState().present;
  act(() => {
    ProjectManager.changeEditTab('origin', store!);
  });

  expect(store!.getState().present).toEqual(prevStore);
});

describe('ProjectManager: translated guid functions', () => {
  it('When openTranslatedGuide is executed, translateGuideView is true.', () => {
    ProjectManager.openTranslatedGuide();
    expect(storeV2.getState().present.project.translateGuideOpen).toBe(true);
  })

  it('When closeTranslatedGuide is executed, translateGuideView is false.', () => {
    ProjectManager.closeTranslatedGuide();
    expect(storeV2.getState().present.project.translateGuideOpen).toBe(false);
  })
})

describe('ProjectManager: translate task', () => {
  const originCaptionState = loadJson<downcapStore.ICaptionsParagraph[]>('./src/test/resources/ProjectManager.test/originCaptionDummy.json');
  const unFinishedtranslateTaskState = loadJson<ITranslateTask[]>('./src/test/resources/ProjectManager.test/unFinishedTranslateTaskDummy.json');
  const setenceTimeTextsDummy = loadJson<ITimeText[][]>('./src/test/resources/ProjectManager.test/setenceTimeTextsDummy.json');
  // const setenceTimeText = loadJson<ITimeText[]>('./src/test/resources/ProjectManager.test/setenceTimeTextDummy.json');

  it('When clearAsync is executed, translate task reset.', async () => {
    await ProjectManager.clearAsync();
    expect(storeV2.getState().present.translateTask.translateTaskList).toStrictEqual([]);
  });

  it('When translateCaptionsInternalAsync is executed, add translate task value. expect last translate task translated value is true.', async () => {
    IpcSender.analyzeSentenceAsync = jest.fn().mockReturnValueOnce(setenceTimeTextsDummy);
    await ProjectManager.translateCaptionsAsync(originCaptionState);
    expect(storeV2.getState().present.translateTask.translateTaskList?.last().translated).toBe(true);
  });
  
  it('When translateCaptionsInternalAsync is executed with unfinished translate task, update translate task value. expect last translate task translated value is true.', async () => {
    IpcSender.analyzeSentenceAsync = jest.fn().mockReturnValueOnce(setenceTimeTextsDummy);
    await ProjectManager.translateCaptionsAsync(originCaptionState, undefined, unFinishedtranslateTaskState);
    expect(storeV2.getState().present.translateTask.translateTaskList?.last().translated).toBe(true);
  });
})
