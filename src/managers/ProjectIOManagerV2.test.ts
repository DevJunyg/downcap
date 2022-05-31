import "test/testPreload";
import storeV2, * as downcapStore from 'storeV2';
import ProjectIOManagerV2 from './ProjectIOManagerV2'
import IpcSender from "lib/IpcSender";
import IProjectSaveMoldel from "./IProjectSaveModel";
import ProjectManager from "./ProjectManager";
import { loadJson } from "test/utility";
import { configureStore } from "storeV2/store";
import { cloneDeep } from "lodash";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import IProjectModel_V_2_0_3 from "./IProjectSaveModel/IProjectModel_V_2_0_3";

const haveAllProjectValuesState = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ProjectIOManagerV2.test/haveAllKindCaptionState.json'
);

const emptyCaptions = loadJson<downcapStore.RootState['present']>(
  './src/test/resources/ProjectIOManagerV2.test/emptyCaptions.json'
);

const store = configureStore({
  future: [],
  past: [],
  present: emptyCaptions
});

it('The srtLoadAsync of ProjectIOManagerV2 is srt loadable in empty project.', async () => {
  const path = './src/test/resources/ProjectIOManagerV2.test/testsrt.srt';
  const mockValue = `1\r\n00:00:00,120 --> 00:00:03,330\r\n안녕하세요 걸러 스케일의 볼로입니다`;

  IpcSender.invokeReadFileAsync = jest.fn().mockReturnValue(mockValue);
  await ProjectIOManagerV2.srtLoadAsync(path, store);

  const originCaption = store.getState().present.originCaption.captions;
  expect(originCaption?.any()).toBe(true);
});

it("logger import tobetruthy", () => {
  const logger = ReactLoggerFactoryHelper.build('ProjectIOManagerV2');
  expect(logger).toBeTruthy();
});

it("set projectModel in store by projectLoadAsync", async () => {
  IpcSender.invokeProjectSaveAsync = jest.fn((title: string): Promise<string | null> => {
    return Promise.resolve(title);
  })
  ProjectManager.clearAsync = jest.fn();

  const result = await ProjectIOManagerV2.saveAsync({
    past: [],
    present: haveAllProjectValuesState,
    future: []
  });

  const model: IProjectSaveMoldel = JSON.parse(result!);
  await ProjectIOManagerV2.projectLoadAsync(model);
});

describe("save test", () => {
  it("called invokeProjectSaveAsync when run saveAsync", () => {
    IpcSender.invokeProjectSaveAsync = jest.fn();

    ProjectIOManagerV2.saveAsync({
      past: [],
      present: haveAllProjectValuesState,
      future: []
    });

    expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
  })

  it("called invokeProjectSaveAsAsync when run saveAsync", () => {
    IpcSender.invokeProjectSaveAsAsync = jest.fn();

    const store = {
      past: [],
      present: haveAllProjectValuesState,
      future: []
    }
    ProjectIOManagerV2.saveAsAsync(store);

    expect(IpcSender.invokeProjectSaveAsAsync).toBeCalled();
  })
})

describe("saveAsAsync project name check", () => {
  it("title value is passed, the corresponding value is returned.", async () => {
    IpcSender.invokeProjectSaveAsAsync = jest.fn((title: string, _json: string): Promise<string | null> => {
      return Promise.resolve(title);
    })

    const result = ProjectIOManagerV2.saveAsAsync({
      past: [],
      present: haveAllProjectValuesState,
      future: []
    }, "test file name");

    expect.assertions(1);
    await expect(result).resolves.toEqual("test file name");
  })

  it("use the value from the json file when no file name is passed separately.", async () => {
    IpcSender.invokeProjectSaveAsAsync = jest.fn((title: string, json: string): Promise<string | null> => {
      return Promise.resolve(title);
    })

    const result = ProjectIOManagerV2.saveAsAsync({
      past: [],
      present: haveAllProjectValuesState,
      future: []
    }, undefined);

    expect.assertions(1);
    await expect(result).resolves.toEqual("무한도전 무야호_360p");
  })

  it("neither title nor projectName exist, 다운캡 is returned.", async () => {
    const copyState = cloneDeep(haveAllProjectValuesState);
    copyState.project.projectName = undefined;

    IpcSender.invokeProjectSaveAsAsync = jest.fn((title: string, json: string): Promise<string | null> => {
      return Promise.resolve(title);
    })

    const result = ProjectIOManagerV2.saveAsAsync({
      past: [],
      present: copyState,
      future: []
    }, undefined);

    expect.assertions(1);
    await expect(result).resolves.toEqual("다운캡");
  })
})

describe("_projectSaveModelBuild project model build test", () => {
  let rootStateCopy: downcapStore.RootState['present'] | null;

  beforeEach(() => {
    rootStateCopy = cloneDeep(haveAllProjectValuesState);
  });

  afterEach(() => {
    rootStateCopy = null;
  })

  IpcSender.invokeProjectSaveAsync = jest.fn();

  describe("translatedMultiline model build check", () => {
    it("skip set defaultLocation when translatedMultiline.defaultLocation is not exist", () => {
      const noneTranslatedMultilineDefulatLocationState = rootStateCopy;
      noneTranslatedMultilineDefulatLocationState!.translatedMultiline.defaultLocation = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneTranslatedMultilineDefulatLocationState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set defaultStyle when translatedMultiline.defaultStyle is not exist", () => {
      const noneTranslatedMultilineDefulatStyleState = rootStateCopy;
      noneTranslatedMultilineDefulatStyleState!.translatedMultiline.defaultStyle = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneTranslatedMultilineDefulatStyleState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set checkpoint when translatedMultiline.checkpoint is not exist", () => {
      const noneTranslatedMultilineCheckpointState = rootStateCopy;
      noneTranslatedMultilineCheckpointState!.translatedMultiline.checkpoint = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneTranslatedMultilineCheckpointState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set captions when translatedMultiline.captions is not exist", () => {
      const noneTranslatedMultilineCaptionsState = rootStateCopy;
      noneTranslatedMultilineCaptionsState!.translatedMultiline.captions = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneTranslatedMultilineCaptionsState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })
  })

  describe("multiline model build check", () => {
    it("skip set defaultLocation when multiline.defaultLocation is not exist", () => {
      const noneMultilineDefaultLocationState = rootStateCopy;
      noneMultilineDefaultLocationState!.multiline.defaultLocation = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneMultilineDefaultLocationState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set defaultStyle when multiline.defaultStyle is not exist", () => {
      const noneDefaultStyleMultilineState = rootStateCopy;
      noneDefaultStyleMultilineState!.multiline.defaultStyle = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneDefaultStyleMultilineState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set captions when multiline.captions is not exist", () => {
      const noneCaptinonMultilineState = rootStateCopy;
      noneCaptinonMultilineState!.multiline.captions = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneCaptinonMultilineState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })
  })

  describe("translatedCaption model build check", () => {
    it("skip set defaultLocation when translatedCaption.defaultLocation is not exist", () => {
      const noneDefulatLocationTranslatedCaptionState = rootStateCopy;
      noneDefulatLocationTranslatedCaptionState!.translatedCaption.defaultLocation = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneDefulatLocationTranslatedCaptionState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set defaultStyle when translatedCaption.defaultStyle is not exist", () => {
      const noneDefaultStyleTranslatedCaptionState = rootStateCopy;
      noneDefaultStyleTranslatedCaptionState!.translatedCaption.defaultStyle = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneDefaultStyleTranslatedCaptionState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set captions when translatedCaption.captions is not exist", () => {
      const noneCaptionsTranslatedCaptionState = rootStateCopy;
      noneCaptionsTranslatedCaptionState!.translatedCaption.captions = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneCaptionsTranslatedCaptionState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })
  })

  describe("originCaption model build check", () => {
    it("skip set defaultLocation when originCaption.defaultLocation is not exist", () => {
      const noneDefaultLocationOriginCaptionState = rootStateCopy;
      noneDefaultLocationOriginCaptionState!.originCaption.defaultLocation = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneDefaultLocationOriginCaptionState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set defaultStyle when originCaption.defaultStyle is not exist", () => {
      const noneDefaultStyleOriginCaptionState = rootStateCopy;
      noneDefaultStyleOriginCaptionState!.originCaption.defaultStyle = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneDefaultStyleOriginCaptionState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })

    it("skip set captions when originCaption.captions is not exist", () => {
      const noneCaptionOriginCaptionState = rootStateCopy;
      noneCaptionOriginCaptionState!.originCaption.captions = undefined;

      ProjectIOManagerV2.saveAsync({
        past: [],
        present: noneCaptionOriginCaptionState!,
        future: []
      });

      expect(IpcSender.invokeProjectSaveAsync).toBeCalled();
    })
  })
})

describe('translate task test', () => {
  const translateTaskProjectFile = loadJson<IProjectModel_V_2_0_3>('./src/test/resources/ProjectIOManagerV2.test/translateTaskTest.docp');
  const unFinishedTranslateTaskProjectFile = loadJson<IProjectModel_V_2_0_3>('./src/test/resources/ProjectIOManagerV2.test/unFinishedTranslateTaskTest.docp');

  it('When projectLoadAsync executed with finished translate task project file, translateTaskList has value.', async () => {
    await ProjectIOManagerV2.projectLoadAsync(translateTaskProjectFile);
    expect(storeV2.getState().present.translateTask.translateTaskList?.length).toBe(40);
  })

  it('When projectLoadAsync executed with unfinished translate task project file, translateCaptionsAsync of ProjectManager to be called.', async () => {
    ProjectManager.translateCaptionsAsync = jest.fn();
    await ProjectIOManagerV2.projectLoadAsync(unFinishedTranslateTaskProjectFile);
    expect(ProjectManager.translateCaptionsAsync).toBeCalled();
  })
})