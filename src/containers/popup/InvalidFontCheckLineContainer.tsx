import React from 'react';
import * as Redux from 'redux'
import * as store from 'storeV2';
import * as ReactRedux from 'react-redux';
import { zeroPadding } from 'lib/utils';
import InvalidFontCheckLine from 'components/InvalidFontCheckLine';
import ParagraphCaptionsHelper from 'helpers/ParagraphCaptionsHelper';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import PopupManager from 'managers/PopupManager';
import * as projectActions from 'storeV2/modules/project';
import * as projectControlActions from 'storeV2/modules/projectControl';

interface InvalidFontCheckLineContainerProps {
  focusLineMetaData: store.IFocusLineMeta;
}

const logger = ReactLoggerFactoryHelper.build('InvalidFontCheckLineContainer');

export default function InvalidFontCheckLineContainer(props: InvalidFontCheckLineContainerProps) {
  const selectedStyleEditType = ReactRedux.useSelector<
    store.RootState,
    store.RootState['present']['projectCotrol']['selectedStyleEditType']
  >(state => state.present.projectCotrol.selectedStyleEditType)

  const dispatch = ReactRedux.useDispatch();


  const convertTime = (time: number) => {
    const t = time ?? 0;
    const min = Math.floor(t / 60);
    const sec = Math.floor(t % 60);
    const convertTime = `${zeroPadding(min, 2)}:${zeroPadding(sec, 2)}`;

    return convertTime;
  }

  const paragraph = props.focusLineMetaData.paragraph;
  const handleMoveClickCallback = React.useCallback(handleMoveClick, [selectedStyleEditType, dispatch]);

  if (!paragraph) {
    logger.variableIsUndefined('paragraph', 'render');
    return null;
  }
  const line = props.focusLineMetaData;
  const startTime = ParagraphCaptionsHelper.getParagraphStartTime(paragraph);
  const lineText = ParagraphCaptionsHelper.toText([paragraph]);

  return (
    <InvalidFontCheckLine
      meta={props.focusLineMetaData}
      lineText={lineText}
      lineTime={convertTime(startTime ?? 0)}
      lineLang={line.kind === 'originCaption' || line.kind === 'multiline' ? 'ko' : 'en'}
      lineType={line.kind === 'originCaption' || line.kind === 'translatedCaption' ? 'line' : 'multi'}
      onMoveClick={handleMoveClickCallback} />
  );

  function handleMoveClick(_evt: React.MouseEvent, meta: store.IFocusLineMeta) {
    PopupManager.close(dispatch);
    const ProjectActions = Redux.bindActionCreators(projectActions, dispatch);
    const ProjectControlActions = Redux.bindActionCreators(projectControlActions, dispatch);

    const kind = meta.kind;
    ProjectActions.setSelectedEditType((kind === 'originCaption' || kind === 'multiline') ? 'origin' : 'translated');
    ProjectControlActions.setFocusParagraphMetas([{
      path: {
        paragraphIndex: meta.paragraphIndex,
        captionIndex: meta.captionIndex,
        lineIndex: meta.lineIndex,
        wordIndex: meta.wordIndex
      },
      source: 'list',
      type: kind
    }]);

    if (selectedStyleEditType)
      ProjectControlActions.setSelectedStyleEditType('line');
  }
}