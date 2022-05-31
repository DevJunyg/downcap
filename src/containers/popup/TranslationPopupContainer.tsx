import React from "react";
import * as ReactRedux from 'react-redux';
import TranslationPopup from "components/popup/TranslationPopup";

import PopupManager from "managers/PopupManager";
import ProjectManager from "managers/ProjectManager";
import * as store from 'storeV2';
import ParagraphCaptionsHelper from "helpers/ParagraphCaptionsHelper";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import { IPopupProps } from "containers/PopupContainer";
import { DowncapHelper } from "DowncapHelper";
import { GetUserLetter } from "lib/utils";
import ClientAnalysisService from "services/ClientAnalysisService";

const logger = ReactLoggerFactoryHelper.build('TranslationPopupContainer');

function TranslationPopupContainer(props: IPopupProps) {
  const originCaptions = ReactRedux.useSelector<store.RootState, store.ICaptionsParagraph[] | undefined>(
    state => state.present.originCaption.captions
  );

  const multilineCaptions = ReactRedux.useSelector<store.RootState, store.ICaptionsParagraph[] | undefined>(
    state => state.present.multiline.captions
  );

  const originCaptionsPaymentLetter = originCaptions
    ? DowncapHelper.guessPaidLetterOnTranslate(ParagraphCaptionsHelper.toAllTextLength(originCaptions) * 2.5)
    : 0;

  const multilineCaptionsPaymentLetter = multilineCaptions
    ? DowncapHelper.guessPaidLetterOnTranslate(ParagraphCaptionsHelper.toAllTextLength(multilineCaptions) * 2.5)
    : 0;

  const paymentLetter = originCaptionsPaymentLetter + multilineCaptionsPaymentLetter
  const dispatch = ReactRedux.useDispatch();

  return (
    <TranslationPopup
      onCloseClick={props.onCloseClick}
      onAcceptClick={_handleTranslationClickAsync}
      paymentLetter={paymentLetter}
    />
  );

  async function _handleTranslationClickAsync(evt: React.MouseEvent) {
    ClientAnalysisService.acceptTranslationClick();
    props.onCloseClick && props.onCloseClick(evt);

    const userLetter = await GetUserLetter();
    if (userLetter === undefined) {
      logger.variableIsUndefined('userLetter', '_handleTranslationClickAsync');
      return;
    }

    if (userLetter < paymentLetter) {
      PopupManager.openLackOfLetterPopup({ letter: Math.floor(paymentLetter - userLetter) }, dispatch);
      return;
    }

    ProjectManager.changeEditTab('translated');
  };

}

export default TranslationPopupContainer;