import React from 'react';
import './tabBound.scss';

const tabBoundRootStyle = { width: '1rem', height: '100%', backgroundColor: '#e6e6e6', display: 'flex', justifyContent: 'center', alignItems: 'center' };

export default class TabBound extends React.Component {
  rootRef = React.createRef<HTMLDivElement>();

  handleRootMouseDonw: React.MouseEventHandler<HTMLDivElement> = e => {
    if (e.target !== this.rootRef.current) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
  }

  render() {
    return (
      <div ref={this.rootRef} style={tabBoundRootStyle} onMouseDown={this.handleRootMouseDonw}>
        <div style={{ display: "block", width: '1rem' }}>
          <div className='col-resize tab-menu-item' >
            <div className="tab-menu-item-content subtitle-tab-clicked"> </div>
          </div>
        </div>
      </div >
    )
  }
}