import React from "react";
import "./PlayListTemplate.scss";
import PlayList from "components/PlayList/PlayList";
import YouTubeSearchBar from "./YouTubeSearchBar";
import FileOpenArea from "./FileOpenArea";

interface IPlayListTemplateProps {
  searchText?: string;
  searchInfo?: React.ReactNode;
  searchDisabled?: boolean;
  onSearchBoxTextChange?: React.ChangeEventHandler<HTMLInputElement>;
  onSearchBoxKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onSearchIconClick?: React.MouseEventHandler<SVGSVGElement>;
  onFileOpenClick?: React.MouseEventHandler<HTMLDivElement>;
}

const youTubeSerachBoxStyle = { width: "50%" };
const infoBoxStyle = { margin: "0 1rem", height: "3vh" };

function PlayListTemplate(props: React.PropsWithChildren<IPlayListTemplateProps>) {
  const BottomContent = props.children === undefined
    ? () => <FileOpenArea onClick={props.onFileOpenClick} />
    : () => <PlayList>{props.children}</PlayList>

  return (
    <div className="player-list-template">
      <YouTubeSearchBar
        disabled={props.searchDisabled}
        searchBoxStyle={youTubeSerachBoxStyle}
        value={props.searchText}
        onChange={props.onSearchBoxTextChange}
        onKeyDown={props.onSearchBoxKeyDown}
        onIconClick={props.onSearchIconClick}
      />
      <div style={infoBoxStyle}>
        {props.searchInfo}
      </div>
      <BottomContent />
    </div>
  )
}


export default PlayListTemplate;
