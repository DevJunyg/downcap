import React from 'react';
import * as store from 'storeV2';
import { connect } from 'react-redux';
import PopupManager from 'managers/PopupManager';
import { IPopupProps } from 'containers/PopupContainer';
import CaptionsExportPopup from 'components/popup/captionsExportPopups/CaptionsExportPopup';
import CaptionsExportSuccessPopup from 'components/popup/captionsExportPopups/CaptionsExportSuccessPopup';
import "JsExtensions";
import PlayerContext from 'contexts/PlayerContext';
import ExportLanguage from 'ExportLanguage';
import DualCaptionHelper from 'helpers/DualCaptionHelper';
import * as CaptionsEncoder from 'lib/CaptionsEncoder';
import * as windows from 'lib/windows';
import { Filter } from 'lib/Filter';
import { IProjectStoreState } from 'storeV2/modules/project';
import ClientAnalysisService from 'services/ClientAnalysisService';
import { WithTranslation, withTranslation } from 'react-i18next';

interface ICaptionExportPopupContainerConnectState {
  selected: store.EditType;
  project: IProjectStoreState
  koCaptions?: store.ICaptionsParagraph[];
  enCaptions?: store.ICaptionTranslatedParagraphWithId[];
}

const popupActions = (dispatch: typeof store.default.dispatch) => ({
  close: () => PopupManager.close(dispatch)
});

interface ICaptionExportPopupContainerDispatchProps {
  PopupActions: ReturnType<typeof popupActions>
}

interface ICaptionExportPopupContainerProps extends ICaptionExportPopupContainerConnectState, ICaptionExportPopupContainerDispatchProps, IPopupProps, WithTranslation { }

interface ICaptionExportPopupContainerState {
  exportLanguage: string;
  format: string;
  xml: string;
  exportSuccess: boolean;
}

class CaptionsExportPopupContainer extends React.Component<ICaptionExportPopupContainerProps, ICaptionExportPopupContainerState> {
  static contextType = PlayerContext;

  handleExportLanguageChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setExportLanguage(evt.target.value)
  }

  handleFormatChange = (evt: React.ChangeEvent<HTMLInputElement>) => {
    this.setFormat(evt.target.value);
  }

  handleXmlTypeChange = (evt: React.ChangeEvent<HTMLSelectElement>) => {
    this.setXmlType(evt.target.value);
  }

  setExportLanguage = (value: string) => {
    this.setState(state => ({
      ...state,
      exportLanguage: value
    }));
  }

  setFormat = (value: string) => {
    this.setState(state => ({
      ...state,
      format: value
    }));
  }

  setXmlType = (value: string) => {
    this.setState(state => ({
      ...state,
      xml: value
    }));
  }

  setExportSuceess = (exportSuceess: boolean) => {
    this.setState(state => ({
      ...state,
      exportSuccess: exportSuceess
    }));
  }

  handleOkClickAsync: React.MouseEventHandler<HTMLButtonElement> = async (_evt: React.MouseEvent<HTMLButtonElement>) => {
    const { koCaptions, enCaptions } = this.props;
    const defaultStyle = this.props.project.projectDefaultStyle
    const title = this.props.project.projectName
    const videoMeta = this.props.project.videoMeta;
    const player = this.context.player;
    const { exportLanguage } = this.state;
    const lineEnd = '\r\n';

    if (koCaptions === null || koCaptions === undefined || title === undefined) {
      this.props.PopupActions.close();
      return;
    }

    const createCaptions = (captions: store.ICaptionsParagraph[]) => captions.map(caption => {
      const line = caption.lines;
      const words = line.first().words;
      const lineStyle = { ...defaultStyle, ...line.first().style };

      return ({
        start: words.first().start,
        end: words.last().end,
        text: words.map(word => word.text).join(' '),
        style: lineStyle,
        horizontal: caption.vertical ?? 0.05,
        vertical: caption.horizontal ?? 0.5
      })
    });

    const createDualCaptions = (koCaptions: store.ICaptionsParagraph[], enCaptions: store.ICaptionTranslatedParagraphWithId[] | undefined, reverse: boolean) => {
      const koLines = koCaptions;
      const enLines = enCaptions && enCaptions.map((item: any) => item.paragraphs).flat();
      if (enLines === undefined) {
        return
      }

      const dualOverlayCpation = !reverse
        ? DualCaptionHelper.createDualCaptions(koLines, enLines)
        : DualCaptionHelper.createDualCaptions(enLines, koLines)

      return dualOverlayCpation.map(item => {
        if (item.start === undefined || item.end === undefined) {
          throw new Error('Unable to create dual captions');
        }

        let texts = [];
        if (item.lines.first()) {
          texts.push(item.lines.first().words.map(word => word.text).join(" "));
        }

        if (item.lines[1]) {
          texts.push(item.lines[1].words.map(word => word.text).join(" "));
        }

        const lineStyle = { ...defaultStyle, ...item.lines.first().style }

        return {
          start: item.start,
          end: item.end,
          text: texts.join(lineEnd),
          style: lineStyle,
          horizontal: item.vertical ?? 0.05,
          vertical: item.horizontal ?? 0.5
        };
      });
    }

    let exportCaptions: { start: number, end: number, text: string, style: store.ICaptionsStyle, horizontal: number, vertical: number }[] | undefined;
    let reverse = false;
    switch (exportLanguage) {
      case ExportLanguage.origin:
        exportCaptions = createCaptions(koCaptions);
        break;
      case ExportLanguage.translated:
        exportCaptions = createCaptions(enCaptions!.map(item => item.paragraphs).flat());
        break;
      case ExportLanguage.dual:
        exportCaptions = createDualCaptions(koCaptions, enCaptions, reverse);
        break;
      case ExportLanguage.translated_Origin:
        reverse = true;
        exportCaptions = createDualCaptions(koCaptions, enCaptions, reverse);
        break;
      default:
        break;
    }

    if (exportCaptions === undefined || exportCaptions === null) {
      this.props.PopupActions.close();
      return;
    }

    const Parser: { [key in string]: (captions: CaptionsEncoder.captions, meta: CaptionsEncoder.meta) => {} } = {
      'Srt': CaptionsEncoder.ToSrt,
      'Text': CaptionsEncoder.ToText,
      'Xmeml': CaptionsEncoder.ToXmeml,
      'Fcpxml': CaptionsEncoder.ToFcpxml,
      'Resolve': CaptionsEncoder.ToFcpxml
    };

    const playerWidth = player?.isReady ? player.width : undefined;
    const playerHeight = player?.isReady ? player.height : undefined;
    const playerDuration = player?.isReady ? player.duration : 0;

    const width = videoMeta?.width ?? playerWidth ?? 1280;
    const height = videoMeta?.height ?? playerHeight ?? 720;

    const meta = {
      duration: playerDuration ?? exportCaptions.last().end,
      width: width,
      height: height
    };

    const format = this.state.format === 'Xml' ? this.state.xml : this.state.format;
    const exportSuceess = windows.handleCaptionExport(
      {
        title: this.props.t('exportSuceess_Title'),
        defaultPath: title,
        filters: [Filter[format]]
      },
      Parser[format](exportCaptions, ({
        ...meta,
        title: title,
        format: format
      }))
    );


    ClientAnalysisService.captionExportAcceptClick({
      captionType: exportLanguage as ExportLanguage,
      exportType: format as 'Srt' | 'Text' | 'Xmeml' | 'Fcpxml' | 'Resolve'
    });
    this.setExportSuceess(exportSuceess);
  }

  constructor(props: ICaptionExportPopupContainerProps) {
    super(props);
    const { selected } = props;

    this.state = {
      exportLanguage: selected,
      format: 'Srt',
      xml: 'Xmeml',
      exportSuccess: false
    };
  }

  componentDidMount() {
    const { selected } = this.props;

    this.setState(state => ({
      ...state,
      exportLanguage: selected
    }));
  }

  componentDidUpdate(prevProps: ICaptionExportPopupContainerProps) {
    const { selected } = this.props;
    if (selected !== prevProps.selected) {

      this.setState(state => ({
        ...state,
        exportLanguage: selected
      }));
    }
  }

  render() {
    return (
      this.state.exportSuccess
        ? <CaptionsExportSuccessPopup onCloseClick={this.props.onCloseClick} />
        : <CaptionsExportPopup
          exportLanguage={this.state.exportLanguage}
          format={this.state.format}
          xml={this.state.xml}
          enIsEmptyOrNull={!this.props.enCaptions?.any() || this.props.enCaptions?.length === 0}
          onXmlChange={this.handleXmlTypeChange}
          onFormatChange={this.handleFormatChange}
          onExportLanguageChange={this.handleExportLanguageChange}
          onAcceptClick={this.handleOkClickAsync}
          onCloseClick={this.props.onCloseClick} />
    );
  }
}

export default withTranslation("CaptionsExportPopupContainer_handleOkClickAsync")(connect<ICaptionExportPopupContainerConnectState, ICaptionExportPopupContainerDispatchProps, IPopupProps, store.RootState>(
  state => ({
    selected: state.present.project.selectedEditType,
    project: state.present.project,
    koCaptions: state.present.originCaption.captions,
    enCaptions: state.present.translatedCaption.captions,
  }),
  dispatch => ({
    PopupActions: popupActions(dispatch)
  })
)(CaptionsExportPopupContainer));
