import "JsExtensions";
import FormatControlPanel from "components/FomatControl/FormatControlPanel";
import StylesControl from "components/StylesControl";
import PresetContainer from "./styles/PresetContainer";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import * as Redux from 'redux';
import React from "react";
import IIdPreset from "IIdPreset";
import lodash from "lodash";
import captionActionsDictractory from "captionActionsDictractory";
import PopupManager from "managers/PopupManager"
import SequenceContainer from "./styles/SequenceContainer";
import ClientAnalysisService from "services/ClientAnalysisService";
import downcapOptions from "downcapOptions";

function styleExcept(first: store.ICaptionsStyle, second: store.ICaptionsStyle) {
  let style: store.ICaptionsStyle = {};
  (Object.keys(first) as Array<keyof store.ICaptionsStyle>).forEach(name => {
    if (!lodash.isEqual(first[name], second[name])) {
      //@ts-ignore
      style[name] = first[name]
    }
  })

  return Object.keys(style).length !== 0 ? style : null;
}

function StylesControlContainer() {
  const selectedEditType = ReactRedux.useSelector<
    store.RootState, store.EditType | undefined
  >(state => state.present.project.selectedEditType);

  const selectedStyleEditType = ReactRedux.useSelector<
    store.RootState, store.StyleEditType | undefined
  >(state => state.present.projectCotrol.selectedStyleEditType);

  const focusParagraphMetas = ReactRedux.useSelector<
    store.RootState, Readonly<store.IFocusParagraphMeta[]> | undefined
  >(state => state.present.projectCotrol.focusParagraphMetas);

  const defaultStyle = ReactRedux.useSelector<
    store.RootState,
    Readonly<store.ICaptionsStyle> | undefined
  >(state => (
    focusParagraphMetas?.first().type && state.present[focusParagraphMetas?.first().type].defaultStyle
  ) ?? state.present.project.projectDefaultStyle);

  const paragraph = ReactRedux.useSelector<
    store.RootState,
    Readonly<store.ICaptionsParagraph> | undefined
  >(state => focusParagraphMetas?.first() && getParagraph(state, focusParagraphMetas?.first()));

  const defaultLocation = ReactRedux.useSelector<
    store.RootState,
    store.ILocation | undefined
  >(state => state.present.originCaption.defaultLocation);

  const rootStore = ReactRedux.useStore<store.RootState>();

  const dispatch = ReactRedux.useDispatch();
  const handleChangeCallback = React.useCallback(_handleChange, [
    paragraph,
    selectedStyleEditType,
    defaultStyle,
    dispatch
  ]);

  const handlePresetClickCallback = React.useCallback(_handlePresetClick, [
    paragraph,
    selectedStyleEditType,
    defaultStyle,
    dispatch
  ]);

  const handleApplyAllStylesButtonClickCallback = React.useCallback(_handleApplyAllStylesButtonClick, [
    paragraph,
    defaultStyle,
    selectedStyleEditType
  ]);

  const memoStyle: store.ICaptionsStyle | undefined = React.useMemo(() => {
    if (!focusParagraphMetas?.any()) {
      return;
    }

    let style = { ...defaultStyle };
    if (selectedStyleEditType) {
      const { path } = focusParagraphMetas.first();
      if (path.lineIndex !== undefined) {
        const line = paragraph?.lines[path.lineIndex];

        if (line !== undefined) {
          style = {
            ...style,
            ...line.style
          }

          if (selectedStyleEditType === "word" && path.wordIndex !== undefined) {
            style = {
              ...style,
              ...line.words[path.wordIndex]?.style
            }
          }
        }
      }
    }

    return style;
  }, [selectedStyleEditType, focusParagraphMetas, defaultStyle, paragraph?.lines]);

  function renderDualCaptionsStylesCotrol() {
    return (
      <StylesControl
        sequence={<SequenceContainer />}
      />
    );
  }

  const styleEditDisabled = !focusParagraphMetas?.any() || !selectedStyleEditType;
  if (selectedEditType === 'dual') {
    return renderDualCaptionsStylesCotrol();
  }

  return (
    <StylesControl
      formatControls={
        <FormatControlPanel
          style={memoStyle}
          selectedStyleEditType={selectedStyleEditType}
          styleEditDisabled={styleEditDisabled}
          onStyleChange={handleChangeCallback}
          onApplyAllStylesButtonClick={handleApplyAllStylesButtonClickCallback}
        />
      }
      preset={
        <PresetContainer style={memoStyle}
          selectedStyleEditType={selectedStyleEditType}
          onPresetClick={handlePresetClickCallback}
        />
      }
    />
  )

  function _handlePresetClick(evt: React.MouseEvent<HTMLDivElement, MouseEvent>, idPreset: IIdPreset) {
    ClientAnalysisService.presetClick();

    const focusParagraphMeta = store.default.getState().present.projectCotrol.focusParagraphMetas?.first();
    if (!focusParagraphMeta || !selectedStyleEditType || !paragraph) {
      return;
    }

    const { path } = focusParagraphMeta;
    const type = focusParagraphMeta.type;
    const StyleActions = Redux.bindActionCreators(
      captionActionsDictractory[type],
      dispatch
    );

    const { id, ...preset } = idPreset;
    if (selectedStyleEditType === "word") {
      let lineStyle = paragraph.lines[path.lineIndex!].style;
      const superValue = { ...defaultStyle, ...lineStyle };
      let style = styleExcept(preset, superValue);
      StyleActions.setWordStyle({
        path: path,
        style: { ...style }
      });
    }
    else if (selectedStyleEditType === "line") {
      let nextParagraph = { ...paragraph };
      nextParagraph.lines = nextParagraph.lines.map(line => {
        let nextLine = { ...line }
        nextLine.style = { ...preset }
        nextLine.words = nextLine.words.map(word => {
          const { style, ...nextWord } = word;
          return nextWord;
        });

        return nextLine;
      });

      StyleActions.updateParagraph({
        path: path,
        paragraph: nextParagraph
      });
    }
  }

  function _handleChange<T extends keyof store.ICaptionsStyle>(name: T, value: store.ICaptionsStyle[T]) {
    const focusParagraphMeta = store.default.getState().present.projectCotrol.focusParagraphMetas?.first();
    if (!focusParagraphMeta || !paragraph || !selectedStyleEditType) {
      return;
    }

    const { path } = focusParagraphMeta;
    const type = focusParagraphMeta.type;
    const StyleActions = Redux.bindActionCreators(
      captionActionsDictractory[type],
      dispatch
    );

    if (selectedStyleEditType === "word") {
      let style: store.ICaptionsStyle | null = { ...paragraph.lines[path.lineIndex!].words[path.wordIndex!].style };
      let lineStyle = paragraph.lines[path.lineIndex!].style;
      const superValue = (lineStyle && lineStyle[name]) ?? (defaultStyle && defaultStyle[name]);
      if (lodash.isEqual(value, superValue)) {
        delete style[name];
        if (Object.keys(style).length === 0) {
          style = null
        }
      } else {
        style[name] = value;
      }

      const payload = { path: path, style: style };
      if (name === 'outlineColor' || name === 'color') {
        const setWordColorActionDic = ({
          'color': StyleActions.setWordColor,
          'outlineColor': StyleActions.setWordOutlineColor
        });

        setWordColorActionDic[name as 'outlineColor' | 'color'](payload);
      }
      else {
        StyleActions.setWordStyle(payload);
      }
    }
    else if (selectedStyleEditType === "line") {
      let style = { ...paragraph.lines[path.lineIndex!].style };
      style[name] = value;

      const payload = { path: path, style: !lodash.isEqual(style, defaultStyle) ? style : null };
      if (name === 'background' || name === 'outlineColor' || name === 'color') {
        const setLineColorActionDic = ({
          'background': StyleActions.setLineBackground,
          'color': StyleActions.setLineColor,
          'outlineColor': StyleActions.setLineOutlineColor
        });

        setLineColorActionDic[name as 'background' | 'outlineColor' | 'color'](payload);
      }
      else {
        StyleActions.setLineStyle(payload);
      }
    }
  }

  function _handleApplyAllStylesButtonClick() {
    ClientAnalysisService.acceptAllStylesClick();

    const focusParagraphMeta = focusParagraphMetas?.first();
    if (!focusParagraphMeta || !paragraph || !selectedStyleEditType) {
      return;
    }

    const { path } = focusParagraphMeta;
    const type = focusParagraphMeta.type;
    const baseStyle = rootStore.getState().present[type].defaultStyle ?? defaultStyle;
    let nextStyle = {
      ...baseStyle
    }

    const line = paragraph.lines[path.lineIndex!];
    const lineStyle = line?.style;
    if (lineStyle) {
      nextStyle = {
        ...nextStyle,
        ...lineStyle
      }
    }

    PopupManager.openApplyAllStylesWarningPopup({
      type: type,
      style: nextStyle,
      path: path,
      location: {
        vertical: paragraph.vertical ?? defaultLocation?.vertical ?? downcapOptions.defaultLocation.vertical,
        horizontal: paragraph.horizontal ?? defaultLocation?.horizontal ?? downcapOptions.defaultLocation.horizontal
      }
    }, dispatch);
  }
}

function getParagraph(
  state: store.RootState,
  focusParagraphMeta: store.IFocusParagraphMeta) {
  const meta = focusParagraphMeta;
  if (meta.type === "originCaption"
    || meta.type === "multiline"
    || meta.type === "translatedMultiline") {
    const captions = state.present[meta.type].captions;
    return captions && captions[meta.path.paragraphIndex!];
  }
  else {
    const captions = state.present[meta.type].captions;
    return captions && captions[meta.path.captionIndex!]
      .paragraphs[meta.path.paragraphIndex!];
  }
}

export default StylesControlContainer;