import ClassNameHelper from 'ClassNameHelper';
import React, { Component, TextareaHTMLAttributes } from 'react';


const textAreaDefaultStlye: React.CSSProperties = {
  padding: "0",
  resize: "none",
  overflowY: "hidden",
  outline: 0,
};

class AutoResizeTextarea extends Component<TextareaHTMLAttributes<HTMLTextAreaElement>> {
  textareaRef: HTMLTextAreaElement | null = null;

  autoResize() {
    if (this.textareaRef !== null && this.textareaRef !== undefined) {
      this.textareaRef.style.height = '1px';
      this.textareaRef.style.height = this.textareaRef.scrollHeight + 'px';
    }
  }

  componentDidMount() {
    this.autoResize();
  }

  shouldComponentUpdate(nextProps: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    return this.props.value !== nextProps.value
      || this.props.onFocus !== nextProps.onFocus
      || this.props.onKeyDown !== nextProps.onKeyDown;
  }

  componentDidUpdate(prevProps: TextareaHTMLAttributes<HTMLTextAreaElement>) {
    if (this.props.value !== prevProps.value) {
      this.autoResize();
    }
  }

  render() {
    const { style, className, ...rest } = this.props;

    return (
      <textarea className={ClassNameHelper.concat('outline-none', className)}
        ref={ref => this.textareaRef = ref}
        onKeyDown={this.props.onKeyDown}
        style={{ ...textAreaDefaultStlye, ...style }}
        data-testid="test-id-auto-resize-textarea"
        {...rest} />
    );
  }
}

export default AutoResizeTextarea;
