import React, { HTMLAttributes, useContext } from 'react';
import PlayerContext from 'contexts/PlayerContext';
import ClassNameHelper from 'ClassNameHelper';

export interface IActivableMenuProps extends HTMLAttributes<HTMLDivElement> {
  activationIndex?: number;
  itemClassName?: string;
  onTabIndexChange?: (index: number) => void;
}

const ActivableMenuItem = React.forwardRef<HTMLDivElement, HTMLAttributes<HTMLDivElement>>((props, ref) => {
  const { children, ...rest } = props;

  return (
    <div {...rest} ref={ref}>{children}</div>
  );
})

const activeClassName = "active";
function ActivableMenu(props: IActivableMenuProps) {
  const context = useContext(PlayerContext);
  const { children, onTabIndexChange, activationIndex, itemClassName, ...rest } = props;
  const childrens = Array.isArray(children) ? children : [children];

  const [nowActiveId, setActiveIndex] = React.useState(activationIndex ?? 0);
  const refs: Array<HTMLDivElement | null> = [];

  function handleItemClick(evt: React.MouseEvent<HTMLDivElement>, index: number) {
    if (nowActiveId === index) {
      return;
    }

    const prevRef = refs[nowActiveId];
    prevRef?.classList.remove(activeClassName);

    const targetRef = refs[index];
    targetRef?.classList.add(activeClassName);

    setActiveIndex(index);
    onTabIndexChange && onTabIndexChange(index);
  }

  const items = childrens.map((item, index) => {
    return (
      <ActivableMenuItem key={index}
        ref={ref => refs[index] = ref}
        onClick={evt => handleItemClick(evt, index)}
        className={ClassNameHelper.concat("tab-item", activationIndex === index ? activeClassName : undefined)}
      >
        {item}
      </ActivableMenuItem >
    );
  });

  return <div {...rest}>{context.player !== null ? items : items[0]}</div >
}

const defaultProps: IActivableMenuProps = {
  itemClassName: "menu-item"
};

ActivableMenu.defaultProps = defaultProps;

export default ActivableMenu;
