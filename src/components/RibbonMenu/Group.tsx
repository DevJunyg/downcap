import ImgUrls from 'ImgUrls';
import React from 'react';

interface IGroupProps {
  title?: React.ReactNode;
  selected?: boolean;
  "data-testid"?: string;
  onClick?: React.MouseEventHandler<HTMLDivElement>;
}

function Group(props: React.PropsWithChildren<IGroupProps>) {
  const content = props.selected && <div className="group-items">{props.children}</div>;

  return (
    <span className='group'>
      <div className='item-title'
        onClick={props.onClick}
        data-testid={props["data-testid"] ?? "test-id-ribbon-group"}
      >
        {props.title}
      </div>
      <img className='major-classification' src={ImgUrls.largeCategoryMenuDividingLine} alt="대분류 메뉴 구분선" />
      {content}
    </span>
  )
}

export default Group;
