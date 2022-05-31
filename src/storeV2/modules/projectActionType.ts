const projectActionType = Object.freeze({
  setProjectName: 'project/SET_PROJECT_NAME',
  setVideoPath: 'project/SET_VIDEO_PATH',
  removeVideoPath: 'project/REMOVE_VIDEO_PATH',
  setSequence: 'project/SET_SEQUENCE',
  setSelectedEditType: 'project/SET_SELECTED_EDIT_TYPE',
  setSelectedPreviewName: 'project/SET_SELECTED_PREIVEW_TYPE',
  setProjectDefaultStlye: 'project/SET_PROJECT_DEFAULT_STYLE',
  setWordSplitValue: 'project/SET_WORD_SPLIT_VALUE',
  setTotalTranlsateTaskLength: 'project/SET_TOTAL_TRANLSLATE_TASK_LENGTH',
  setNowTranslateTaskLength: 'project/SET_NOW_TRANLSLATE_TASK_LENGTH',
  reset: 'project/RESET',
  closeTranslatedGuide: 'project/CLOSE_TRANSLATED_GUIDE',
  openTranslatedGuide: 'project/OPEN_TRANSLATED_GUIDE',
  setYoutubeVideoId: 'project/SET_YOUTUBE_VIDEO_ID',
  setVideoMeta: 'project/SET_VIDEO_META',
  increaseNowTranslateTaskLength: 'project/INCREASE_NOW_TRANLSLATE_TASK_LENGTH'
});

export default projectActionType;
