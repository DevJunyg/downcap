import React from 'react';
import './PlayList.scss';


function PlayList(props: React.HTMLAttributes<HTMLDivElement>) {
  const { children, ...rest } = props;
  return (
    <div className="play-list" {...rest}>
      {children}
    </div>
  )
}

export default PlayList;
