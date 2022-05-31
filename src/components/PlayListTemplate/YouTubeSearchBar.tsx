import React from 'react';
import FontAwesomeProIcon from "FontAwesomeProIcon";
import YouTubeLogLight from "./YouTubeLogLight";
import YouTubeSearchBox from "./YouTubeSearchBox";
import * as FortAwesomeProSolid from "@fortawesome/pro-solid-svg-icons";

interface IYouTubeSearchBarProps {
  disabled?: boolean;
  value?: string;
  searchBoxStyle?: React.CSSProperties;
  onChange?: React.ChangeEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onIconClick?: React.MouseEventHandler<SVGSVGElement>;
}

export default function YouTubeSearchBar(props: IYouTubeSearchBarProps) {
  return (
    <div className="search-box text-center">
      <YouTubeLogLight />
      <YouTubeSearchBox
        disabled={props.disabled}
        readOnly={props.disabled}
        value={props.value}
        style={props.searchBoxStyle}
        onChange={props.onChange}
        onKeyDown={props.onKeyDown}
      />
      <div className="search-icon">
        <FontAwesomeProIcon fixedWidth
          icon={FortAwesomeProSolid.faSearch}
          onClick={props.onIconClick}
        />
      </div>
    </div>
  )
}