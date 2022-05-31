import React from 'react';
import RibbonMenu from 'components/RibbonMenu';
import FileMenuContainer from './FileMenuContainer';
import YouTubeMenuContainer from './YouTubeMenuContainer';
import ExportMenuContainer from './ExportMenuContainer';
import HelpMenuContainer from './HelpMenuContainer';
import * as windows from 'lib/windows';
import IpcSender from 'lib/IpcSender';
import { History } from "history";
import UserInfo from 'components/RibbonMenu/UserInfo';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import LanguageSelectButton from 'components/RibbonMenu/LanguageSelectButton';

interface IRibbonMenuContainerProps {
  history?: History;
}

interface IUserInfo {
  email?: string;
  nickname?: string;
  letter?: number;
}

export interface IRinbbonMenuItemProps {
  selected?: boolean;
  onTitleClick?: React.MouseEventHandler<HTMLDivElement>
}

type MenuName = 'file' | 'export' | 'youtube' | 'help';

const logger = ReactLoggerFactoryHelper.build('RibbonMenuContainer');

function RibbonMenuContainer(props: IRibbonMenuContainerProps) {
  const isReceivingUserInfoAsync = React.useRef<Promise<void> | null>(null);
  const [selectedMenu, setSelectMenu] = React.useState<MenuName>();
  const [userInfo, setUserInfo] = React.useState<IUserInfo>();

  React.useEffect(() => {
    return () => { isReceivingUserInfoAsync.current = null; };
  }, []);

  return (
    <RibbonMenu>
      <FileMenuContainer
        selected={selectedMenu === "file"}
        onTitleClick={_handleFileMenuTitleClick}
      />
      <ExportMenuContainer
        selected={selectedMenu === "export"}
        onTitleClick={_handleExportMenuTitleClick}
      />
      <YouTubeMenuContainer
        selected={selectedMenu === "youtube"}
        onTitleClick={_handleYouTubeMenuTitleClick}
      />
      <HelpMenuContainer
        selected={selectedMenu === "help"}
        onTitlteClick={_handlHelpMenuTitleClick}
      />
      <LanguageSelectButton 
        className="tab-button"  
      />
      <UserInfo
        userName={userInfo?.nickname ?? userInfo?.email}
        userLetter={userInfo?.letter ?? 0}
        onClick={_handleUserInfoClick}
        onLogoutClick={_handleLogoutClickAsync}
        onUserInfoChangeClick={_handleUserInfoChangeClick}
        onLetterPurchaseClick={_handleLetterPurchaseClick}
      />
    </RibbonMenu>
  )

  function _handleUserInfoClick() {
    if (isReceivingUserInfoAsync.current !== null) {
      return;
    }

    isReceivingUserInfoAsync.current = IpcSender.invokeGetUserInfoAsync()
      .then(userInfoData => {
        if (userInfoData === null) {
          props.history?.replace("/login");
          return;
        }

        if (isReceivingUserInfoAsync.current === null) {
          return;
        }

        setUserInfo({
          email: userInfoData.email,
          nickname: userInfoData.nickname,
          letter: Math.floor(userInfoData.letter ?? 0)
        });
      })
      .catch(err => {
        logger.logWarning('Receiving userInfo data failed', err);
      })
      .finally(() => {
        isReceivingUserInfoAsync.current = null
      });
  }

  async function _handleLogoutClickAsync(evt: React.MouseEvent<HTMLDivElement>) {
    try {
      const result = await windows.logout();
      if (result) {
        props.history?.replace("/login");
      }
      else {
        logger.logWarning('logout failed');
      }

    } catch (err) {
      err instanceof Error && logger.logError('logout err', err);
    }
  }

  function _handleUserInfoChangeClick(evt: React.MouseEvent<HTMLDivElement>) {
    windows.changeUserInfo();
  }

  function _handleLetterPurchaseClick(evt: React.MouseEvent<HTMLDivElement>) {
    IpcSender.sendLetterPurchase();
  }

  function _handleFileMenuTitleClick(evt: React.MouseEvent<HTMLDivElement>) {
    setSelectMenu(selectedMenu === 'file' ? undefined : 'file');
  }

  function _handleExportMenuTitleClick(evt: React.MouseEvent<HTMLDivElement>) {
    setSelectMenu(selectedMenu === 'export' ? undefined : 'export');
  }

  function _handleYouTubeMenuTitleClick(evt: React.MouseEvent<HTMLDivElement>) {
    setSelectMenu(selectedMenu === 'youtube' ? undefined : 'youtube');
  }

  function _handlHelpMenuTitleClick(evt: React.MouseEvent<HTMLDivElement>) {
    setSelectMenu(selectedMenu === 'help' ? undefined : 'help');
  }
}

export default RibbonMenuContainer;