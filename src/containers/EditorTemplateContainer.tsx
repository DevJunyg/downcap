import React from 'react';
import EditorTemplate from 'components/editor/EditorTemplate';
import EditingTemplateMultiLineVersionContainer from './EditingTemplateMultiLineVersionContainer';
import PlayListContainer from 'containers/YouTubeSearchListContainer';
import downcapOptions from 'downcapOptions';
import OriginCaptionListContainer from './captions/OriginCaptionListContainer';
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import ProjectOpenedTemplate from 'components/ProjectOpenedTemplate';
import TranslatedCaptionListConatiner from './captions/TranslatedCaptionListContainer';
import DualCaptionListContainer from './captions/DualCaptionListContainer';

interface IEditorTemplateContainerProps { }

const captionList: { [name in store.EditType]: any } = {
  origin: OriginCaptionListContainer,
  translated: TranslatedCaptionListConatiner,
  dual: DualCaptionListContainer
}

function EditorTemplateContainer(props: IEditorTemplateContainerProps) {
  const [percentage, setPercentage] = React.useState<number>(0.5);

  const videoPath = ReactRedux.useSelector<store.RootState, string | store.ICaptionsParagraph[] | undefined>(
    state => state.present.project.videoPath
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

  const existAnyCaption = existOriginCaptions || existTranslatedCaptions
    || existMultilineCaptions || existTranslatedMultilineCaptions;

  const projectOpened = videoPath || existAnyCaption;

  const selectedEditType = ReactRedux.useSelector<store.RootState, store.EditType | undefined>(
    state => state.present.project.selectedEditType
  ) ?? 'origin';

  const SelectedSubtitleListContainer = captionList[selectedEditType];

  const LeftComponent = projectOpened
    ? <ProjectOpenedTemplate videoAreaHeight={`calc(calc(${percentage * 100}vw - 2.4rem) * 0.5625)`} />
    : <PlayListContainer />;

  const RightComponent = (
    <div className="editor-template-cotent" style={{ paddingTop: '1rem' }}>
      <EditingTemplateMultiLineVersionContainer
        Content={<SelectedSubtitleListContainer />}
      />
    </div>
  );

  return (
    <EditorTemplate
      left={LeftComponent}
      right={RightComponent}
      percentage={percentage}
      onPercentageChange={_handlePercentageChange}
    />
  )

  function _handlePercentageChange(nextPercentage: number) {
    nextPercentage = Math.max(downcapOptions.editorPageLeftWidthMinSize, nextPercentage);
    nextPercentage = Math.min(downcapOptions.editorPageRightWidthMinSize, nextPercentage);
    if (percentage !== nextPercentage) {
      setPercentage(nextPercentage);
    }
  }
}

export default EditorTemplateContainer;
