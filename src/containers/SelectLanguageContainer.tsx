import React from 'react';
import SelectLanguage from 'components/SelectLanguage';
import PopupManager from 'managers/PopupManager';
import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import ProjectManager, { StcStatusChangeEvent, StcStatusType } from 'managers/ProjectManager';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import ClientAnalysisService from 'services/ClientAnalysisService';

const logger = ReactLoggerFactoryHelper.build('SelectLanguageContainer');

function SelectLanguageContainer() {
  const selectedEditType = ReactRedux.useSelector<store.RootState, store.EditType | undefined>(
    state => state.present.project.selectedEditType
  );

  const existOriginCaptions = ReactRedux.useSelector<store.RootState, store.ICaptionsParagraph[] | undefined>(
    state => state.present.originCaption.captions
  )?.any() ?? false;

  const existTranslatedCaptions = ReactRedux.useSelector<store.RootState, store.ICaptionTranslatedParagraphWithId[] | undefined>(
    state => state.present.translatedCaption.captions
  )?.any() ?? false;

  const existMultilineCaptions = ReactRedux.useSelector<store.RootState, store.ICaptionsParagraph[] | undefined>(
    state => state.present.multiline.captions
  )?.any() ?? false;

  const existTranslatedMultilineCaptions = ReactRedux.useSelector<store.RootState, store.ICaptionsParagraph[] | undefined>(
    state => state.present.translatedMultiline.captions
  )?.any() ?? false;

  const translatedTaskLength = ReactRedux.useSelector<store.RootState, number | undefined>(
    state => state.present.project.totalTranslateTaskLength
  );

  const [stcStatus, setStcStatus] = React.useState<StcStatusType>(ProjectManager.stcStatus);

  const dispatch = ReactRedux.useDispatch();

  React.useEffect(() => {
    ProjectManager.onStcStatusChange(_handleStcState)

    return () => {
      ProjectManager.removeStcStatusChange(_handleStcState);
    }
  });

  // @TODO: ProjectManager.stcStatus을 체크할 이유가 없지만, ProjectManager.stcStatus를 이용하지 않으면 정상적으로 돌아가지 않는 버그가 있음.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setStcStatus(ProjectManager.stcStatus), [ProjectManager.stcStatus]);

  const selected = React.useMemo(() => [
    selectedEditType === "origin",
    selectedEditType === "translated",
    selectedEditType === "dual"
  ], [selectedEditType])

  const anyOrigin = existOriginCaptions || existMultilineCaptions;
  const anyTranslated = existTranslatedCaptions || existTranslatedMultilineCaptions;

  const disabled = React.useMemo(() => [
    selected[0],
    selected[1] || (!anyOrigin && !anyTranslated) || stcStatus === 'Pending',
    selected[2] || !anyOrigin || !anyTranslated
  ], [selected, stcStatus, anyOrigin, anyTranslated]);

  return (
    <SelectLanguage
      selected={selected}
      disabled={disabled}
      onChange={_handleSelectChange}
      onHelpImageClick={_handleHelpImageOpen}
    />
  );


  function _handleSelectChange(evt: React.MouseEvent, value: store.EditType) {
    if (value === "translated"
      && existOriginCaptions
      && !existTranslatedCaptions
      && translatedTaskLength === undefined
    ) {
      PopupManager.openTranslationPopup(dispatch);
      return;
    }    

    ClientAnalysisService.editorTabClick(value)
    ProjectManager.changeEditTab(value);
  }

  function _handleHelpImageOpen(evt: React.MouseEvent<SVGSVGElement>) {
    if (!selectedEditType) {
      logger.variableIsUndefined('selectedEditType', '_handleHelpImageOpen');
      return;
    }

    PopupManager.openHelpImagePopup({ domain: selectedEditType, imageState: true }, dispatch);
  }

  function _handleStcState(evt: StcStatusChangeEvent) {
    setStcStatus(evt.status);
  }
}

export default React.memo(SelectLanguageContainer);