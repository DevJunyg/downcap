//@ts-check

/**
 * @typedef { import("Point").Point } Point
 */

import React, { Component } from "react";
import PropTypes from "prop-types";
import { SketchPicker } from "react-color";

import { rgbaToString } from "lib/utils";
import ImagesManager from "lib/ImagesManager";

/** @type {React.CSSProperties} */
const defualtBoxDivStyle = {
  textAlign: "right",
  float: "right",
  width: "1rem",
  height: "1rem",
  border: "1px solid black",
  backgroundImage: ImagesManager.Transparent,
};

/**
 * @param {string} backgroundColor
 */
function DefualtBox(backgroundColor) {
  return (
    <div style={defualtBoxDivStyle}>
      <div
        style={{
          width: "1rem",
          height: "1rem",
          backgroundColor: backgroundColor,
        }}
      />
    </div>
  );
}

/**
 * @param { object } props
 * @param { Point } props.point
 * @param { import('react-color').Color } props.color
 * @param { boolean } [props.disableAlpha] 
 * @param { React.MouseEventHandler } props.onMouseEnter
 * @param { React.MouseEventHandler } props.onMouseLeave
 * @param { import('react-color').ColorChangeHandler } [props.onChange]
 */
function Picker(props) {
  return (
    <div
      onMouseEnter={props.onMouseEnter}
      onMouseLeave={props.onMouseLeave}
      style={{
        position: "fixed",
        zIndex: 6000,
        left: props.point.x,
        top: props.point.y,
      }}
    >
      <SketchPicker color={props.color} disableAlpha={props.disableAlpha} onChange={props.onChange} />
    </div>
  );
}

/**
 * @typedef {object} ColorPaltteProps
 * @property {import('models').IRGBA | undefined} [color]
 * @property {import('react-color').ColorChangeHandler} [onChange]
 * @property {object} [value]
 * @property { boolean } [props.disableAlpha] 
 * 
 * @typedef {object} ColorPaltteStates
 * @property {boolean} displayed
 * @property {Point} point
 *
 * @extends {Component<ColorPaltteProps, ColorPaltteStates, any>}
 */
class ColorPalette extends Component {
  pickerCheck = true;
  paletteRef = React.createRef();

  state = {
    displayed: false,
    point: { x: 0, y: 0 },
  };

  componentDidMount() {
    document.addEventListener("mousedown", this.handleClickOutside);
  }

  componentWillUnmount() {
    document.removeEventListener("mousedown", this.handleClickOutside);
  }

  /** @type { React.MouseEventHandler } */
  handlePickerMouseEnter = () => {
    this.pickerCheck = !this.pickerCheck;
  };

  /** @type { React.MouseEventHandler } */
  handlePickerMouseLeave = () => {
    this.pickerCheck = !this.pickerCheck;
  };

  /** @type { (evt : MouseEvent) => void } */
  handleClickOutside = event => {
    if (this.pickerCheck === true && this.state.displayed) {
      if (!this.paletteRef.current.contains(event.target)) {
        this.setState({
          displayed: false,
        });
      }
    }
  };

  /**
   *
   * @param {import('models').IRGBA | string}  color
   * @param {boolean}  [disableAlpha]
   */
  getPicker = (color, disableAlpha) => {
    return (
      <Picker
        point={this.state.point}
        color={color}
        disableAlpha={disableAlpha}
        onChange={this.props.onChange}
        onMouseEnter={this.handlePickerMouseEnter}
        onMouseLeave={this.handlePickerMouseLeave}
      />
    );
  };

  /**
   *
   * @param {React.MouseEvent<HTMLDivElement, MouseEvent>} e
   */
  handleColorBoxClick = e => {
    const { clientX, clientY } = e;
    let pX = clientX;
    let endPX = window.innerWidth - (clientX + 220);
    if (endPX < 0) {
      pX += endPX;
    }

    let pY = clientY;
    let endPY = window.innerHeight - (clientY + 300);
    if (endPY < 0) {
      pY += endPY;
    }

    this.setState({
      point: { x: pX, y: pY },
      displayed: true,
    });
  };

  render() {
    const rgba = this.props.color;
    return (
      <>
        <div
          style={{ padding: "0", margin: "0" }}
          onClick={this.handleColorBoxClick}
          ref={this.paletteRef}
        >
          {this.props.children
            ? this.props.children
            : DefualtBox(rgbaToString(rgba ?? { r: 0, g: 0, b: 0, a: 1 }))}
        </div>
        {this.state.displayed
          ? this.getPicker(rgba ?? { r: 0, g: 0, b: 0, a: 1 }, this.props.disableAlpha)
          : null}
      </>
    );
  }
}

ColorPalette.propTypes = {
  color: PropTypes.any,
  onChange: PropTypes.func,
};

ColorPalette.defaultProps = {
  color: rgbaToString({ r: 0xf0, g: 0xf0, b: 0xf0, a: 0.5 }),
};

export default ColorPalette;
