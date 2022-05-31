import IpcSender from "lib/IpcSender";

export interface ClientAnalysisEvent {
  kind: 'downcap#ClientAnalysisEvent',
  type: 'click',
  snippet: ClientAnalysisClickEvent
}

export interface ClientAnalysisClickEvent {
  kind: 'downcap#ClientAnalysisClickEvent',
  target: string,
  snippet?: string | object
}

type CaptionType = 'origin' | 'translated' | 'dual';

class ClientAnalysisService {
  static event(type: ClientAnalysisEvent['type'], snippet: ClientAnalysisEvent['snippet']) {
    IpcSender.sendClientAnalysisLog({
      kind: 'downcap#ClientAnalysisEvent',
      snippet: snippet,
      type: type
    })
  }

  static click(target: string, snippet?: ClientAnalysisClickEvent['snippet']) {
    let log: ClientAnalysisClickEvent = {
      kind: 'downcap#ClientAnalysisClickEvent',
      target: target,
    }

    if (snippet !== undefined) {
      log.snippet = snippet
    }

    ClientAnalysisService.event('click', log);
  }

  static loginClick() {
    ClientAnalysisService.click('login');
  }

  static registerClick() {
    ClientAnalysisService.click('register');
  }

  static youTubeSearchClick() {
    ClientAnalysisService.click('youTubeSearchClick');
  }

  static youTubeSearchItemClick() {
    ClientAnalysisService.click('youTubeSearchItem');
  }

  static fileOpenAreaClick() {
    ClientAnalysisService.click('fileOpenArea');
  }

  static profileClick() {
    ClientAnalysisService.click('profile');
  }

  static speechAnalysisClick(origin: 'local' | 'youTube') {
    ClientAnalysisService.click('speechAnalysis', {
      kind: 'downcap#SpeechAnalysisClickEvent',
      origin: origin
    });
  }

  static localSpeechAnalysisClick() {
    ClientAnalysisService.speechAnalysisClick('local');
  }

  static youTubeSpeechAnalysisClick() {
    ClientAnalysisService.speechAnalysisClick('youTube');
  }

  static localCaptionLoadInYouTubeClick() {
    ClientAnalysisService.click('localCaptionLoadInYouTube');
  }

  static youTubeCaptionLoadClick() {
    ClientAnalysisService.click('youTubeCaptionLoad');
  }

  static youTubeVideoLoadClick() {
    ClientAnalysisService.click('youTubeVideoLoad');
  }

  static srtLoadClick() {
    ClientAnalysisService.click('srtLoad');
  }

  static videoOpenClick() {
    ClientAnalysisService.click('videoOpen');
  }

  static acceptTranslationClick() {
    ClientAnalysisService.click('acceptTranslation');
  }

  static translationClick() {
    ClientAnalysisService.click('translation');
  }

  static reversTranslationClick() {
    ClientAnalysisService.click('reversTranslation');
  }

  static acceptRetranslationClick() {
    ClientAnalysisService.click('acceptRetranslation');
  }

  static realtimeTranslationClick(value: boolean) {
    ClientAnalysisService.click('realtimeTranslation', {
      value: value
    });
  }

  static editorTabClick(value: CaptionType) {
    ClientAnalysisService.click('editorTab', {
      kind: 'downcap#EditorTabClickEvent',
      value: value
    });
  }

  static acceptAllStylesClick() {
    ClientAnalysisService.click('acceptAllStyles');
  }

  static saveMyStyleClick() {
    ClientAnalysisService.click('saveMyStyle');
  }

  static presetClick() {
    ClientAnalysisService.click('preset');
  }

  static locationClick() {
    ClientAnalysisService.click('location');
  }

  static resetLocationClick() {
    ClientAnalysisService.click('resetLocation');
  }

  static previewClick(value: 'web' | 'android' | 'ios') {
    ClientAnalysisService.click('preview', {
      kind: 'downcap#PreviewClickEvent',
      value: value
    });
  }

  static videoExportClick(value: CaptionType) {
    ClientAnalysisService.click('videoExport', {
      kind: 'downcap#VideoExportClickEvent',
      value: value
    });
  }

  static captionExportAcceptClick(sinnpet: {
    captionType: CaptionType | 'translated-origin';
    exportType: 'Srt' | 'Text' | 'Xmeml' | 'Fcpxml' | 'Resolve'
  }) {
    ClientAnalysisService.click('captionExport', {
      kind: 'downcap#CaptionExportClickEvent',
      ...sinnpet
    });
  }

  static videoUploadAcceptClick() {
    ClientAnalysisService.click('videoUploadAccept');
  }

  static captionUploadAcceptClick(sinnpet: {
    captionType: 'origin' | 'translated' | 'dual'
    language: 'ko' | 'en',
    overwrite: boolean
  }) {
    ClientAnalysisService.click('captionUploadAccept', {
      kind: 'downcap#CaptionUploadAcceptClickEvent',
      ...sinnpet
    });
  }

  static projectSaveClick() {
    ClientAnalysisService.click('projectSave');
  }

  static projectSaveAsClick() {
    ClientAnalysisService.click('projectSaveAs');
  }

  static fileOpenClick() {
    ClientAnalysisService.click('fileOpen');
  }

  static newProjectClick() {
    ClientAnalysisService.click('newProject');
  }

  static inquiryClick() {
    ClientAnalysisService.click('inquiry');
  }

  static infoClick() {
    ClientAnalysisService.click('info');
  }

  static shortcutClick() {
    ClientAnalysisService.click('shortcut');
  }

  static notifiactionClick() {
    ClientAnalysisService.click('notification');
  }

  static createMultilineClick(value: CaptionType) {
    ClientAnalysisService.click('createMultiline', {
      kind: 'downcap#CreateMultilineClickEvent',
      value: value
    });

  }
}

export default ClientAnalysisService;