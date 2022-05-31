import React from "react";
import { bindActionCreators } from "redux";
import IpcSender from "lib/IpcSender";
import PlayListTemplate from "components/PlayListTemplate/PlayListTemplate";
import IYouTubeSearchResult from "models/youtube/IYouTubeSearchResult";
import PopupManager from "managers/PopupManager";
import YouTubeSearchItem from "components/PlayList/YouTubeSearchItem";
import * as youtubesearchActions from "storeV2/modules/youtubeSearch";
import * as ReactRedux from 'react-redux';
import * as store from 'storeV2';
import YouTubeSearchHelper from "helpers/YouTubeSearchHelper";
import IYouTubeStoreSearchResult from "models/youtube/store/IYouTubeStoreSearchResult";
import ClientAnalysisService from "services/ClientAnalysisService";

function YouTubeSearchListContainer() {
  const useSelector = ReactRedux.useSelector;
  const searchText = useSelector(_getSearchText);
  const lastSearchRequesText = useSelector(_getLastSearchRequesText);
  const lastSearchRequesTimeText = useSelector(_getLastSearchRequesTimeText);
  const lastSearchRequestTime = lastSearchRequesTimeText ? new Date(lastSearchRequesTimeText) : undefined;
  const searchResultStore = useSelector<store.RootState, IYouTubeStoreSearchResult[] | undefined>(state => state.present.youtubeSearch.searchItems);
  const searchResultList = searchResultStore && YouTubeSearchHelper.youtubeStoreSearchResultToObject(
    searchResultStore
  );

  const dispatch = ReactRedux.useDispatch();
  const YouTubeSearchActions = bindActionCreators(youtubesearchActions, dispatch);

  const searchItems = searchResultList?.map(item => (
    <YouTubeSearchItem key={item.id.videoId}
      meta={item}
      onClick={_handleSerachResultItemClick}
    />
  ));

  const searchInfo = searchResultList !== undefined
    ? `검색결과: ${searchResultList.length}`
    : undefined;

  return (
    <div className="editor-template-cotent left-content">
      <PlayListTemplate
        searchText={searchText}
        searchInfo={searchInfo}
        onSearchBoxTextChange={_handleSearchBoxTextChange}
        onSearchBoxKeyDown={_handleSearchBoxKeyDown}
        onSearchIconClick={_handleSearchIconClickAsync}
        onFileOpenClick={_handleFileOpenClick}
      >
        {searchItems}
      </PlayListTemplate>
    </div>
  )


  function _getSearchText(state: store.RootState) {
    // If the case of undefined, since the input is not updated, it is initialized to ''.
    return state.present.youtubeSearch.serachText as string | undefined ?? '';
  }

  function _getLastSearchRequesText(state: store.RootState) {
    return state.present.youtubeSearch.lastSearchRequesText;
  }

  function _getLastSearchRequesTimeText(state: store.RootState) {
    return state.present.youtubeSearch.lastSearchRequesTime;
  }

  function _handleSearchBoxTextChange(evt: React.ChangeEvent<HTMLInputElement>) {
    YouTubeSearchActions.setSearchText(evt.target.value);
  }

  function _handleSearchBoxKeyDown(evt: React.KeyboardEvent<HTMLInputElement>) {
    // Warning: This function is Proimse? 
    if (evt.code === "Enter") {
      _youTubeSearchSubmitAsync();
    }
  }

  function _handleSearchIconClickAsync(evt: React.MouseEvent<SVGSVGElement>) {
    return _youTubeSearchSubmitAsync();
  }

  function _handleFileOpenClick(evt: React.MouseEvent<HTMLDivElement>) {
    ClientAnalysisService.fileOpenAreaClick();
    IpcSender.sendProjectFileOpen();
  }

  async function _youTubeSearchSubmitAsync() {
    ClientAnalysisService.youTubeSearchClick();
    if (!searchText) {
      return;
    }

    const now = new Date().getTime();
    const lastSerachTime = lastSearchRequestTime?.getTime();
    if (searchText === lastSearchRequesText
      && lastSerachTime && now - lastSerachTime < 24 * 60 * 60 * 1000) {
      return;
    }

    const searchTime = new Date();
    const serachResult = await IpcSender.invokeYouTubeVideoSearch(searchText);
    YouTubeSearchActions.setSearchItems(serachResult);
    YouTubeSearchActions.setLastSearchRequesText(searchText);
    YouTubeSearchActions.setLastSearchRequesTime(searchTime);
  }

  function _handleSerachResultItemClick(evt: React.MouseEvent<HTMLDivElement>, item: IYouTubeSearchResult) {
    ClientAnalysisService.youTubeSearchItemClick();
    PopupManager.openYouTubeVideoOpenPopup({
      ...item,
      snippet: item.snippet && {
        ...item.snippet,
        publishedAt: item.snippet.publishedAt.toString()
      }
    }, dispatch);
  }
}

export default YouTubeSearchListContainer;