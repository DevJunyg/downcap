//@ts-check
import React, { Component } from 'react';

/**
 * @typedef {object} Props
 * @property {React.MouseEventHandler} [onClick]
 * 
 * @extends {Component<Props>}
 */
class AddCaptionButton extends Component {
  render() {
    const { ...rest } = this.props;
    return (
      <button className='icon-button add-caption-button' {...rest} />
    )
  }
}

export default AddCaptionButton;
