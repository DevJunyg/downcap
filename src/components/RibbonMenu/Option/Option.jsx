//@ts-check
import React, { Component } from 'react'
import PopUp from 'components/common/PopUp';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/pro-solid-svg-icons';

/**
 * @param {React.ReactNode} children 
 * @param {React.MouseEventHandler} handleClose 
 */
function CreateDetailOption(children, handleClose) {
  return (
    <PopUp onCloseClick={handleClose}>
      {children}
    </PopUp>
  )
}
/**
 * @typedef {object} State
 * @property {boolean} activated
 * 
 * @typedef {object} Props
 *  
 * @extends {Component<Props, State>}
 */
class Option extends Component {
  /** @type {?} */
  escFunc = null;
  /** @type {State} */
  state = {
    activated: false
  }

  handleClose = () => this.setState({ ...this.state, activated: false });

  /**
   * @param {KeyboardEvent} e 
   */
  handleKeyDown = e => {
    if (e.key === "Escape") {
      if (this.state.activated) {
        this.handleClose()
      }
    }
  }

  /**
   * @param {State} prevState
   */
  componentDidUpdate(prevState) {
    if (prevState.activated !== this.state.activated) {
      if (this.state.activated) {
        document.addEventListener('keydown', this.handleKeyDown);
      } else {
        document.removeEventListener('keydown', this.handleKeyDown);
      }
    }
  }

  componentWillUnmount() {
    document.removeEventListener('keydown', this.handleKeyDown);
  }

  render() {
    const { children } = this.props;
    const { activated } = this.state;

    const detailOption = activated ? CreateDetailOption(children, this.handleClose) : null;

    return (
      <div className="content-option">
        <FontAwesomeIcon icon={faCog} onClick={() => this.setState({ activated: true })} />
        {detailOption}
      </div>
    )
  }
}

export default Option;
