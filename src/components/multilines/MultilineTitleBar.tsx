import React from "react";

function MultiLineTitleBar(props: React.PropsWithChildren<{}>) {
  return (
    <div style={{ position: "sticky", top: 0, zIndex: 10, backgroundColor: "white" }}>
      <div className="d-flex justify-content-space-between" style={{ paddingBottom: '0.3rem' }}>
        {props.children}
      </div>
      <hr style={{ paddingTop: '0', margin: '0' }} />
    </div>
  )
}

export default React.memo(MultiLineTitleBar);