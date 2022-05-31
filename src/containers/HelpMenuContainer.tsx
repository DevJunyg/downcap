import React from 'react';
import * as store from 'storeV2';
import * as windows from 'lib/windows';
import * as ReactRedux from 'react-redux'
import PopupManager from 'managers/PopupManager';
import HelpMenu from 'components/RibbonMenu/HelpMenu';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import ClientAnalysisService from 'services/ClientAnalysisService';
interface IHelpMenuContainerProps {
  selected: boolean;
  onTitlteClick: React.MouseEventHandler;
}

const logger = ReactLoggerFactoryHelper.build('HelpMenuContainer');

function HelpMenuContainer(props: IHelpMenuContainerProps) {
  const selectedTab = ReactRedux.useSelector<store.RootState, store.EditType | undefined>(
    state => state.present.project.selectedEditType as store.EditType | undefined
  );

  const dispatch = ReactRedux.useDispatch();

  return (
    <HelpMenu
      selected={props.selected}
      onTitleClick={props.onTitlteClick}
      onInquiryClick={() => {
        ClientAnalysisService.inquiryClick();
        PopupManager.openInquiryPopup(dispatch);
      }}
      onInfoClick={() => {
        ClientAnalysisService.infoClick();
        PopupManager.openInfoPopup(dispatch);
      }}
      onShortcutClick={() => {
        ClientAnalysisService.shortcutClick();
        PopupManager.openShortcutPopup(dispatch);
      }}
      onNoticeClick={() => {
        ClientAnalysisService.notifiactionClick();
        windows.notice();
      }}
      onHelpImageClick={_handleHelpImageClick}
    />
  );

  function _handleHelpImageClick(evt: React.MouseEvent) {
    if (!selectedTab) {
      logger.variableIsUndefined('selectedTab', '_handleHelpImageClick');
      return;
    }

    PopupManager.openHelpImagePopup({ domain: selectedTab, imageState: true }, dispatch);
  }
}


function propsAreEqual(prevProps: IHelpMenuContainerProps, nextProps: IHelpMenuContainerProps) {
  return prevProps.selected === nextProps.selected && prevProps.onTitlteClick === nextProps.onTitlteClick;
}

export default React.memo(HelpMenuContainer, propsAreEqual);