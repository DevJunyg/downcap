//@ts-check
import React from "react";
import VariableLengthBinaryHorizontalLayout from "layouts/VariableLengthBinaryHorizontalLayout";
import TabBound from 'layouts/tabBound';
import './EditorTemplate.scss';

/**
 * @typedef {object} Props
 * @property {(percentage: number) => void } [onPercentageChange]
 * @property {JSX.Element} left
 * @property {JSX.Element} right
 * @property {number} percentage
 *
 * @extends {React.PureComponent<Props>}
 */
class EditorTemplate extends React.PureComponent {
  render() {
    const { left, right } = this.props;

    return (
      <VariableLengthBinaryHorizontalLayout
        className="page-content"
        Bound={<TabBound />}
        percentage={this.props.percentage}
        onPercentageChange={this.props.onPercentageChange}
      >
        {left}
        {right}
      </VariableLengthBinaryHorizontalLayout>
    );
  }
}

export default EditorTemplate;
