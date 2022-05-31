const multilineActionType = Object.freeze({
  setCaptions: 'multiLine/SET_CAPTIONS',
  addParagraph: 'multiLine/ADD_CAPTION',
  clearCaptions: 'multiLine/CLEAR_CAPTIONS',
  removeParagraph: 'multiLine/REMOVE_CAPTION',
  updateParagraph: 'multiLine/UPDATE_PARAGRAPH',
  setText: 'multiLine/SET_TEXT',
  setStartTime: 'multiLine/SET_START_TIME',
  setEndTime: 'multiLine/SET_END_TIME',
  setWordStyle: 'multiLine/SET_WORD_STYLE',
  setLineStyle: 'multiLine/SET_LINE_STYLE',
  setDefaultStyle: 'multiLine/SET_DEFAULT_STYLE',
  setDefaultLocation: 'multiLine/SET_DEFULAT_LOCATION',
  clearDefaultStyle: 'multiLine/CLEAR_DEFAULT_STYLE',
  clearDefaultLocation: 'multiLine/CLEAR_DEFAULT_LOCATION',
  setWordColor: 'multiLine/SET_WORD_COLOR',
  setWordOutlineColor: 'multiLine/SET_WORD_OUTLINECOLOR',
  setLineBackground: 'multiLine/SET_LINE_BACKGROUND',
  setLineColor : 'multiLine/SET_LINE_COLOR',
  setLineOutlineColor: 'multiLine/SET_LINE_OUTLINECOLOR'
});

export default multilineActionType;
