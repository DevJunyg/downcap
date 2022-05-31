import ClassNameHelper from 'ClassNameHelper';
import IFrameDisplayControl from 'IFrameDisplayControl';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import MouseButton from 'MouseButton';
import React from 'react';

const logger = ReactLoggerFactoryHelper.build('BinaryHorizontalLayout');

export interface IBinaryHorizontalLayoutPropreties {
  className?: string;
  style?: React.CSSProperties;
  Bound: JSX.Element;
  percentage?: number;
  onPercentageChange?: (percentage: number) => void;
}

interface IBinaryHorizontalLayoutState {
  dragged?: boolean,
  dragStartX?: number,
  dragStartY?: number
}

export default class VariableLengthBinaryHorizontalLayout extends React.Component<IBinaryHorizontalLayoutPropreties, IBinaryHorizontalLayoutState> {
  mouseMoveAbleTimer?: NodeJS.Timeout;
  iFrameDisplayControl = new IFrameDisplayControl();

  state: IBinaryHorizontalLayoutState = {}

  stopHtmlEvent = (evt: Event) => {
    evt.stopPropagation();
    evt.preventDefault();
    return false;
  }

  setDragged = (dragged: boolean | undefined) => this.setState(state => {
    if (dragged === state.dragged) {
      logger.logWarning('The dragged value has been entered.');
      return state;
    }

    return { ...state, dragged };
  });

  setDragStartX = (dragStartX: number | undefined) => this.setState(state => {
    if (state.dragStartX === dragStartX) {
      logger.logWarning('The dragged value has been entered.');
      return state;
    }

    return { ...state, dragStartX };
  });

  setDragStartY = (dragStartY: number | undefined) => this.setState(state => {
    if (state.dragStartY === dragStartY) {
      logger.logWarning('The dragStartX value has been entered.');
      return state;
    }

    return { ...state, dragStartY };
  });

  handleDrag = (evt: MouseEvent) => {
    const { dragStartX } = this.state;
    const { clientX } = evt;

    if (dragStartX === undefined) {
      logger.variableIsUndefined('dragStartY', 'handleDrag');
      return;
    }

    const percentage = Math.round(clientX / window.innerWidth * 1000) / 1000;
    if (this.props.percentage !== percentage) {
      this.props.onPercentageChange && this.props.onPercentageChange(percentage);
    }
  }


  handleBoundMouseDown = (evt: React.MouseEvent<HTMLDivElement>) => {
    if (evt.button === MouseButton.Main && !this.state.dragged) {
      this.dragStart(evt);
    }
  }

  handleDomMouseMove = (evt: MouseEvent) => {
    if (!this.state.dragged) {
      return;
    }

    this.handleDrag(evt);
  }

  handleDomMouseUp = (evt: MouseEvent) => {
    if (evt.button === MouseButton.Main) {
      this.dragEnd();
    }
  }

  handleDomDocmenutMouseEnter = (evt: FocusEvent) => {
    // It does not occur during dragging.
    this.dragEnd();
  }

  documentSubscribe = () => {
    document.body.style.userSelect = "none";
    document.addEventListener("mousemove", this.handleDomMouseMove);
    document.addEventListener("mouseup", this.handleDomMouseUp, false);
    document.addEventListener('mouseenter', this.handleDomDocmenutMouseEnter);
  }

  documentUnsubscribe = () => {
    //@ts-ignore
    document.body.style = null;
    document.removeEventListener("mousemove", this.handleDomMouseMove);
    document.removeEventListener("mouseup", this.handleDomMouseUp, false);
    document.removeEventListener('mouseenter', this.handleDomDocmenutMouseEnter);
  }

  subscribe = () => {
    this.documentSubscribe();
    if (this.state.dragged) this.iFrameDisplayControl.disable();
  }

  unsubscribe = () => {
    this.documentUnsubscribe();
    this.iFrameDisplayControl.enable();
  }

  dragStart = (evt: React.MouseEvent<HTMLDivElement>) => {
    this.setDragged(true);
    this.setDragStartX(evt.clientX);
    this.setDragStartY(evt.clientY);
    this.subscribe();
  }

  dragEnd = () => {
    this.unsubscribe();
    this.setDragged(undefined);
    this.setDragStartX(undefined);
    this.setDragStartY(undefined);
  }

  componentWillUnmount() {
    this.unsubscribe();
  }

  render() {
    let leftContent = this.props.children;
    let rightContent = null;

    if (Array.isArray(this.props.children)) {
      leftContent = this.props.children[0];
      rightContent = this.props.children[1];
    }

    const percentage = this.props.percentage ?? 0.5;
    const leftPercentage = percentage;
    const rightPercentage = 1 - percentage;
    return (
      <div className={ClassNameHelper.concat(this.props.className, "d-flex")}
        style={this.props.style}
      >
        <div style={{ width: `calc(${leftPercentage * 100}% - 0.5rem)` }}>
          {leftContent}
        </div>
        <div onMouseDown={this.handleBoundMouseDown}>
          {this.props.Bound}
        </div>
        <div className='editor-template' style={{ width: `calc(${rightPercentage * 100}% - 0.5rem)` }}>
          {rightContent}
        </div>
      </div >
    );
  }
}