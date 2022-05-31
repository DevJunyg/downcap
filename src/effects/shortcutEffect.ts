import * as Redux from 'redux';
import IpcSender from "lib/IpcSender";
import PopupManager from "managers/PopupManager";
import LoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import { default as rootStore } from "storeV2";
import * as store from 'storeV2';
import ProjectIOManagerV2 from "managers/ProjectIOManagerV2";
import * as projectControlActions from 'storeV2/modules/projectControl';
import LineLocationHelper from 'helpers/LineLocationHelper';

const logger = LoggerFactoryHelper.build('shortcutEffect');

export default function shortcutEffect(store: typeof rootStore) {
  shortcutIncrease();
  return shortcutDecrease;


  function savePropjectAsync(evt: KeyboardEvent): (() => Promise<void>) | null {
    const state = rootStore.getState();

    if (!evt.ctrlKey || isPopupOpened()) {
      return null;
    }

    if (!isOpendProject(state)) {
      return null;
    }

    return () => getSavePropjectHandler(ProjectIOManagerV2.saveAsync);
  }

  function saveAsPropjectAsync(evt: KeyboardEvent): (() => Promise<void>) | null {
    const state = rootStore.getState();

    if (!evt.ctrlKey || !evt.shiftKey || isPopupOpened()) {
      return null;
    }

    if (!isOpendProject(state)) {
      return null;
    }

    return () => getSavePropjectHandler(ProjectIOManagerV2.saveAsAsync);
  }

  function isPopupOpened() {
    const name = store.getState().present.popup.name as string | undefined;
    return name !== undefined;
  }

  function isOpendProject(state: store.RootState) {
    const existOrigin = state.present.originCaption.captions?.any() ?? false;
    const existTranslated = state.present.translatedCaption.captions?.any()
    const existMultiLine = state.present.multiline.captions?.any()
    const existTranslatedMultiLine = state.present.translatedMultiline.captions?.any()
    const opendVideo = state.present.project.videoPath !== undefined;
    return existOrigin || existTranslated || existMultiLine || existTranslatedMultiLine || opendVideo;
  }

  function openFileOpenPopupAsync(evt: KeyboardEvent): (() => Promise<void>) | null {
    if (!evt.ctrlKey || isPopupOpened()) {
      return null;
    }

    return async () => {
      IpcSender.sendProjectFileOpen();
    };
  }


  function openNewProjectPopupAsync(evt: KeyboardEvent): (() => Promise<void>) | null {
    if (!evt.ctrlKey || isPopupOpened()) {
      return null;
    }

    return async () => {
      PopupManager.openNewProjectPopup(store.dispatch);
    };
  }


  async function getSavePropjectHandler(saveActionAsync: (state: store.RootState) => Promise<string | null>) {
    try {
      const result = await saveActionAsync(store.getState());
      if (result) {
        PopupManager.openSaveSuccessPopup(store.dispatch);
      }
    } catch (err) {
      err instanceof Error && logger.logError(`SaveAs failed`, err);
    }
  }

  async function renderingCancel() {
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, rootStore.dispatch);
    ProjectControlActions.setVideoRendering(false);
    IpcSender.sendRenderingCancel();
    IpcSender.sendCancelVideoRemove();
  }

  function closePopup() {
    const state = rootStore.getState();
    const name = state.present.popup.name as string | undefined;
    if (name === undefined) {
      return null;
    }

    if (name === 'VideoExportPendingPopup') {
      renderingCancel();
    }

    return async () => {
      PopupManager.close(store.dispatch);
    };
  }

  function moveCaptionLocation(evt: KeyboardEvent) {
    const state = rootStore.getState();
    const focusedCaption = state.present.projectCotrol.focusParagraphMetas?.first();
    const selectedStyleEditType = state.present.projectCotrol.selectedStyleEditType;

    if (focusedCaption?.source === 'overlay' && selectedStyleEditType === 'line') {
      if (evt.shiftKey) {
        const name = (evt.key === 'ArrowUp') || (evt.key === 'ArrowDown') ? 'vertical' : 'horizontal';
        const value = (evt.key === 'ArrowUp') || (evt.key === 'ArrowRight') ? 0.01 : -0.01;
        LineLocationHelper.addLineLoaction(name, value, store);
      }
    }

    return null;
  }

  async function handleKeyDownAsync(evt: KeyboardEvent) {
    const shortcutActionsDictionary: { [key: string]: ((evt: KeyboardEvent) => ((() => Promise<void>) | null))[] } = {
      "Escape": [closePopup],
      "KeyS": [saveAsPropjectAsync, savePropjectAsync],
      "KeyN": [openNewProjectPopupAsync],
      "KeyO": [openFileOpenPopupAsync],
      "Digit1": [],
      "Digit2": [],
      "Digit3": [],
      "ArrowUp": [moveCaptionLocation],
      "ArrowDown": [moveCaptionLocation],
      "ArrowLeft": [moveCaptionLocation],
      "ArrowRight": [moveCaptionLocation]
    }

    const shortcutActions = shortcutActionsDictionary[evt.code];
    if (!shortcutActions) {
      return;
    }

    for (const shortcutAction of shortcutActions) {
      const canBeHandleAction = shortcutAction(evt);

      if (canBeHandleAction !== null) {
        await canBeHandleAction();
        return;
      }
    }
  }

  function shortcutIncrease() {
    document.body.addEventListener('keydown', handleKeyDownAsync);
  }

  function shortcutDecrease() {
    document.body.removeEventListener('keydown', handleKeyDownAsync);
  }
}