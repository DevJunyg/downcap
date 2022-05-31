import React from "react";

const MultiLineList = React.memo<React.PropsWithChildren<{}>>(props => {
  const mulitLineTitleHeight = '40.8px';
  const multiLineListStyle: React.CSSProperties = {
    overflowY: 'auto',
    overscrollBehavior: 'contain',
    height: `calc(100% - ${mulitLineTitleHeight})`
  }
  return (
    <div className='subtitles-list' style={multiLineListStyle}>
      {props.children}
    </div>
  );
});

export default MultiLineList;