import React from 'react';
import ClassNameHelper from 'ClassNameHelper';
import ImgUrls from 'ImgUrls';


interface ItemProps extends React.HTMLAttributes<HTMLDivElement> {
  disabled?: boolean;
  "data-testid"?: string;
}

function Item(props: ItemProps) {
  const { className, onClick, children, ...rest } = props;
  return (
    <div
      className={ClassNameHelper.concat('item', className, props.disabled ? 'disabled' : undefined)}
      onClick={!props.disabled ? onClick : undefined}
      data-testid={props["data-testid"] ?? "test-id-item"}
      {...rest}
    >
      {children}
      <img src={ImgUrls.subCategoryMenuDividingLine} alt='소분류 메뉴 구분선' />
    </div >
  );
}

export default Item;
