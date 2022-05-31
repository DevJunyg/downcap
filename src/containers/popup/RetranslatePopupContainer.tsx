import React from "react";
import * as ReactRedux from 'react-redux'
import * as store from "storeV2";
import RetranslationPopup from "components/popup/RetranslatePopup";
import { GetUserLetter } from "lib/utils";
import PopupManager from "managers/PopupManager";
import { IPopupProps } from "containers/PopupContainer";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import ParagraphCaptionsHelper from "helpers/ParagraphCaptionsHelper";
import { DowncapHelper } from "DowncapHelper";
import ProjectManager from "managers/ProjectManager";
import ClientAnalysisService from "services/ClientAnalysisService";

const logger = ReactLoggerFactoryHelper.build('RetranslationPopupContainer');

function RetranslatePopupContainer(props: IPopupProps) {
  const captions = ReactRedux.useSelector<
    store.RootState, store.ICaptionsParagraph[] | undefined
  >(state => state.present.originCaption.captions);

  const paymentLetter = captions
    ? DowncapHelper.guessPaidLetterOnTranslate(ParagraphCaptionsHelper.toAllTextLength(captions) * 2.5)
    : 0;

  const dispatch = ReactRedux.useDispatch();

  return (
    <RetranslationPopup
      onCloseClick={props.onCloseClick}
      onAcceptClick={_handleAcceptClickAsync}
      paymentLetter={paymentLetter}
    />
  );

  async function _handleAcceptClickAsync(evt: React.MouseEvent) {
    ClientAnalysisService.acceptTranslationClick();

    if (captions === undefined) {
      logger.variableIsUndefined('koCaptions', 'handleAcceptClickAsync');
      return;
    }

    const userLetter = await GetUserLetter();
    if (userLetter === undefined) {
      logger.variableIsUndefined('userLetter', 'handleAcceptClickAsync');
      return;
    }

    if (userLetter < paymentLetter) {
      PopupManager.openLackOfLetterPopup({ letter: Math.floor(paymentLetter - userLetter) }, dispatch);
      return;
    }

    await ProjectManager.clearTranslatedCaptionAsync();
    props.onCloseClick && props.onCloseClick(evt);
    ProjectManager.changeEditTab('translated');
  }
}

export default RetranslatePopupContainer;