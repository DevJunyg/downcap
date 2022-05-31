import React from 'react';

export interface ElementSelectorProperties {
  index: number
  children: JSX.Element | JSX.Element[]
}

function ElementSelector(props: ElementSelectorProperties) {
  const { index, children } = props;
  const nodes = (Array.isArray(children) ? children : [children]);
  if (nodes.length === 0) {
    throw new Error("The speaker item does not exist.");
  }

  if (index < 0 || index >= nodes.length) {
    throw new Error("Array out of range");
  }

  return nodes[index];
}

const defaultProps: ElementSelectorProperties = {
  index: 0,
  children: <div>Deafult Img</div>
}

ElementSelector.defaultProps = defaultProps;

export default ElementSelector;