import React from 'react';
import './tabBound/multiLineTabBound.scss';

const LayoutBound = React.forwardRef<HTMLHRElement, React.HTMLAttributes<HTMLHRElement>>((props, ref) => {
  return <div ref={ref}  {...props} className='row-resize layoutBound'>
    <div className="subtitle-tab"></div>
  </div>
});

export default LayoutBound;