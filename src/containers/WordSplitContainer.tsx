import WordSplit from 'components/FomatControl/WordSplit';
import React, { useState } from 'react';
import * as store from 'storeV2';
import { connect } from "react-redux";
import * as projectActions from 'storeV2/modules/project';
import * as projectControlActions from 'storeV2/modules/projectControl';
import * as originCaptionActions from 'storeV2/modules/originCaption';
import * as translatedCaptionActions from 'storeV2/modules/translatedCaption';
import downcapOptions from 'downcapOptions';
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import IpcSender from 'lib/IpcSender';
import StyleHelper from 'helpers/StyleHelper';
import { bindActionCreators } from "redux";


interface ICancelTokens {
  [id: string]: { canceled: boolean }
}

interface IWordSplitContainerDispatch {
  ProjectActions: typeof projectActions;
  ProjectControlActions: typeof projectControlActions;
  OriginCaptionActions: typeof originCaptionActions;
  TranslatedCaptionActions: typeof translatedCaptionActions;
}

interface IWordSplitContainerConnect {
  originCaption: store.ICaptionsParagraph[] | undefined
  translatedCaption: store.ICaptionTranslatedParagraphWithId[] | undefined;
  selectedEditType: store.EditType;
  wordSplitValue: {
    origin: number;
    translated: number;
  }
}

interface IWordSplitContainerProps extends IWordSplitContainerConnect, IWordSplitContainerDispatch {
  disabled?: boolean;
}

function WordSplitContainer(props: IWordSplitContainerProps) {
  const taksIdRef = React.useRef(0);
  const cancelTokensRef = React.useRef<ICancelTokens>({});

  const selectedEditType = props.selectedEditType;
  const selectedDual = selectedEditType === 'dual';
  const wordSplitValue = !selectedDual ? props.wordSplitValue[selectedEditType] : undefined;

  const [originParagraphs, setOriginParagraphs] = useState(props.originCaption);
  const [translatedCaption, setTranslatedCaptions] = useState(props.translatedCaption);
  const [value, setValue] = React.useState<string | number | undefined>(wordSplitValue)

  const splitWordInOriginCallbackAsync = React.useCallback(_splitWordInOriginAsync, [props.OriginCaptionActions])
  const splitWordInTranslatedCallback = React.useCallback(_splitWordInTranslated, [props.TranslatedCaptionActions]);
  const setWordSplitValueCallback = React.useCallback(
    _setWordSplitValue,
    [selectedEditType, originParagraphs, translatedCaption, props.ProjectActions, props.ProjectControlActions, splitWordInOriginCallbackAsync, splitWordInTranslatedCallback]
  );
  const handleChangeCallback = React.useCallback(_handleChange, [setWordSplitValueCallback]);

  const handleDownButtonClickCallback = React.useCallback(
    _handleDownButtonClick,
    [setWordSplitValueCallback, selectedEditType, wordSplitValue, value]
  );

  const handleUpButtonClickCallback = React.useCallback(
    _handleUpButtonClick,
    [setWordSplitValueCallback, selectedEditType, wordSplitValue, value]
  );

  React.useEffect(_changeEffect, [wordSplitValue]);
  React.useEffect(_taskClearEffect, [selectedEditType]);
  React.useEffect(() => setOriginParagraphs(props.originCaption), [selectedEditType, wordSplitValue, value, props.originCaption]);
  React.useEffect(() => setTranslatedCaptions(props.translatedCaption), [selectedEditType, wordSplitValue, value, props.translatedCaption]);

  return (
    <WordSplit
      value={value}
      disabled={props.disabled || selectedDual}
      onChange={handleChangeCallback}
      onBlur={_handleBlur}
      onDownButtonClick={handleDownButtonClickCallback}
      onUpButtonClick={handleUpButtonClickCallback}
    />
  )

  function _taskClearEffect() {
    const tokenDict = cancelTokensRef.current;
    return () => {
      Object.keys(tokenDict).forEach(key => {
        tokenDict[key].canceled = true;
      })
    }
  }

  function _changeEffect() {
    setValue(wordSplitValue);
  }

  function _setWordSplitValue(value: number) {
    if (selectedEditType === 'dual') {
      return;
    }

    value = Math.max(1, value);
    props.ProjectActions.setWordSplitValue({
      type: selectedEditType,
      value: value
    });

    const taskId = (taksIdRef.current++).toString();
    cancelTokensRef.current[taskId] = { canceled: false };

    selectedEditType === 'origin' ? splitWordInOriginCallbackAsync(value, taskId, originParagraphs) : splitWordInTranslatedCallback(value, translatedCaption);

    props.ProjectControlActions.setFocusParagraphMetas(null);
  }

  function _handleBlur(evt: React.FocusEvent<HTMLInputElement>) {
    if (wordSplitValue !== value) {
      setValue(wordSplitValue);
    }
  }

  function _handleUpButtonClick(evt: React.MouseEvent<SVGSVGElement>) {
    let v = wordSplitValue;
    if (v === undefined && typeof value === 'number') {
      v = value;
    }
    v = v ?? downcapOptions.defaultSplitValue[selectedEditType as Exclude<store.EditType, 'dual'>];

    setWordSplitValueCallback(v + 1);
  }

  function _handleDownButtonClick(evt: React.MouseEvent<SVGSVGElement>) {
    let v = wordSplitValue;
    if (v === undefined && typeof value === 'number') {
      v = value;
    }

    v = v ?? downcapOptions.defaultSplitValue[selectedEditType as Exclude<store.EditType, 'dual'>];
    if (v <= 0) {
      return;
    }

    setWordSplitValueCallback(v - 1);
  }


  function _handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    setValue(evt.target.value);

    if (!Number.isInteger(evt.target.valueAsNumber)) {
      return;
    }

    setWordSplitValueCallback(evt.target.valueAsNumber);
  }

  async function _splitWordInOriginAsync(length: number, taskId: string, paragraphs: store.ICaptionsParagraph[] | undefined) {
    if (!paragraphs?.any()) {
      return;
    }

    const wordsStyleArray = StyleHelper.getWordsProperty(paragraphs);
    const timeTexts = ParagraphCaptionsHelper.toTimeTexts(paragraphs);
    const setenceTimeLines = await IpcSender.analyzeSentenceAsync(timeTexts);
    const captions = setenceTimeLines.map(setenceTimeLine => {
      return ParagraphCaptionsHelper.textToParagrahsCaption(setenceTimeLine, length);
    }).flat();

    const resultCaptions = StyleHelper.setWordsProperty(captions, wordsStyleArray)
    if (!cancelTokensRef.current[taskId].canceled) {
      props.OriginCaptionActions.setCaptions(resultCaptions);
    }

    delete cancelTokensRef.current[taskId];
  }

  function _splitWordInTranslated(length: number, translatedCaptions: store.ICaptionTranslatedParagraphWithId[] | undefined) {
    if (!translatedCaptions?.any()) {
      return;
    }

    const nextCaptions = translatedCaptions.map(caption => {
      const translatedParagraphs = caption.paragraphs;
      const wordsStyleArray = StyleHelper.getWordsProperty(translatedParagraphs);
      const timeTexts = ParagraphCaptionsHelper.toTimeTexts(translatedParagraphs);
      const paragraphs = ParagraphCaptionsHelper.textToParagrahsCaption(timeTexts, length);

      const resultParagraphs = StyleHelper.setWordsProperty(paragraphs, wordsStyleArray);

      return {
        ...caption,
        paragraphs: resultParagraphs
      }
    })

    props.TranslatedCaptionActions.setCaptions(nextCaptions);
  }
}



export default connect<IWordSplitContainerConnect, IWordSplitContainerDispatch, {}, store.RootState>(
  state => ({
    originCaption: state.present.originCaption.captions,
    translatedCaption: state.present.translatedCaption.captions,
    selectedEditType: state.present.project.selectedEditType,
    wordSplitValue: state.present.project.wordSplits
  }),
  dispatch => ({
    ProjectActions: bindActionCreators(projectActions, dispatch),
    ProjectControlActions: bindActionCreators(projectControlActions, dispatch),
    OriginCaptionActions: bindActionCreators(originCaptionActions, dispatch),
    TranslatedCaptionActions: bindActionCreators(translatedCaptionActions, dispatch)
  })
)(WordSplitContainer);