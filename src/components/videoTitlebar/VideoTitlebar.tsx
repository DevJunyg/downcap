import React from "react";

const titleBarStyle = { height: '34px', paddingTop: '0.7rem' }

function VideoTitlebar(props: React.PropsWithChildren<{}>) {
  return (
    <div className='d-flex justify-content-space-between' style={titleBarStyle}>
      {props.children}
    </div>
  )
}

export default React.memo(VideoTitlebar);