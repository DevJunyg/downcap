//@ts-check
import ClassNameHelper from 'ClassNameHelper';
import React, { Component } from 'react';

/**
 * @typedef {object} Props
 * @property {boolean} [reverse]
 * @property {string} [className]
 * @property {React.MouseEventHandler} [onClick]
 * 
 * @extends {Component<Props>}
 */
class CombineButton extends Component {
  render() {
    const { className, reverse, ...rest } = this.props;

    const style = reverse ? {
      transform: 'rotateX(180deg)'
    } : undefined;
    return (
      <button
        className={ClassNameHelper.concat('icon-button', 'combine-button', className)}
        style={style}
        {...rest}
      />
    )
  }
}

export default CombineButton;
