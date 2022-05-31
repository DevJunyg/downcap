import IFrameDisplayControl from 'IFrameDisplayControl';
import ReactLoggerFactoryHelper from 'logging/ReactLoggerFactoryHelper';
import MouseButton from 'MouseButton';
import React from 'react';
import * as CSS from 'csstype';

const logger = ReactLoggerFactoryHelper.build('VariableLengthVerticalLayout');

export type HTMLElementForwardRefType<T extends HTMLElement> = React.ForwardRefExoticComponent<React.HTMLAttributes<T> & React.RefAttributes<T>>;

interface IVariableLengthVerticalLayoutProperties<T extends HTMLElement> {
  heigth: CSS.Property.Height<string | number> | undefined,
  Bound: HTMLElementForwardRefType<T>,
  boundProperties?: React.HTMLAttributes<T>
  boundHeigth?: number;
  contentHeights: number[];
}

interface IVariableLengthVerticalLayoutState {
  dragged?: boolean,
  dragIndex?: number,
  dragStartX?: number,
  dragStartY?: number,
  dragTopConentHeight?: number,
  dragBottomConentHeight?: number,
  heights?: Array<number>
}

export default class VariableLengthVerticalLayout<T extends HTMLElement> extends React.Component<IVariableLengthVerticalLayoutProperties<T>, IVariableLengthVerticalLayoutState> {
  static createRefObjects<R>(refs: Array<React.RefObject<R>> | undefined, length: number) {
    return Array.from({ length }).map((_, index) => {
      return (refs && refs[index]) || React.createRef<R>()
    });
  }

  boundRefs: Array<React.RefObject<T>> | undefined = undefined;
  contentRefs: Array<React.RefObject<HTMLDivElement>> | undefined = undefined;
  iFrameDisplayControl = new IFrameDisplayControl();

  state: IVariableLengthVerticalLayoutState = {};

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

  setDragIndex = (dragIndex: number | undefined) => this.setState(state => {
    if (state.dragIndex === dragIndex) {
      logger.logWarning('The dragIndex value has been entered.');
      return state;
    }

    return { ...state, dragIndex };
  });

  setHeights = (heights: Array<number> | undefined) => this.setState(state => {
    if (state.heights === heights) {
      logger.logWarning('The heights value has been entered.');
      return state;
    }

    return { ...state, heights };
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

  setDragTopConentHeight = (dragTopConentHeight: number | undefined) => this.setState(state => {
    if (state.dragTopConentHeight === dragTopConentHeight) {
      logger.logWarning('The dragTopConentHeight value has been entered.');
      return state;
    }

    return { ...state, dragTopConentHeight };

  });

  setDragBottomConentHeight = (dragBottomConentHeight: number | undefined) => this.setState(state => {
    if (state.dragBottomConentHeight === dragBottomConentHeight) {
      logger.logWarning('The dragBottomConentHeight value has been entered.');
      return state;
    }

    return { ...state, dragBottomConentHeight };
  });

  getBoundRefs = (length: number) => VariableLengthVerticalLayout.createRefObjects<T>(this.boundRefs, length);
  getContentRefs = (length: number) => VariableLengthVerticalLayout.createRefObjects<HTMLDivElement>(this.contentRefs, length);

  getBoundComponentFowaredRefProperteis = (index: number, ref: React.RefObject<T>): React.HTMLAttributes<T> & React.RefAttributes<T> => {
    return {
      key: index * 2 + 1,
      ref: ref,
      onMouseDown: e => this.handleBoundMouseDown(e, index)
    }
  }

  handleDrag = (evt: MouseEvent) => {
    const { dragIndex, dragStartY } = this.state;
    const { clientY } = evt;

    if (dragIndex === undefined) {
      logger.variableIsUndefined('dragIndex', 'handleDrag');
      return;
    }

    if (dragStartY === undefined) {
      logger.variableIsUndefined('dragStartY', 'handleDrag');
      return;
    }
    const clientMouseY = Math.min(Math.max(0, clientY), window.innerHeight);
    const difference = (dragStartY - clientMouseY) / window.innerHeight;

    if (!this.contentRefs) {
      logger.variableIsUndefined('contentRefs', 'handleDrag');
      return;
    }

    const contentTop = this.contentRefs[dragIndex].current;
    if (!contentTop) {
      logger.variableIsUndefined('contentTop', 'handleDrag');
      return;
    }

    const contentBotton = this.contentRefs[dragIndex + 1].current;
    if (!contentBotton) {
      logger.variableIsUndefined('contentBotton', 'handleDrag');
      return;
    }

    if (this.state.dragTopConentHeight === undefined) {
      return;
    }

    if (this.state.dragBottomConentHeight === undefined) {
      return;
    }

    const topConentHeight = this.state.dragTopConentHeight;
    const bottomConentHeight = this.state.dragBottomConentHeight;
    let diff = topConentHeight - difference;

    if (0.05 < diff && diff < 0.92) {
      contentTop.style.height = `${(topConentHeight - difference) * 100}%`;
      contentBotton.style.height = `${(bottomConentHeight + difference) * 100}%`;
    }
  }

  handleBoundMouseDown = (evt: React.MouseEvent<T>, index: number) => {
    if (evt.button === MouseButton.Main && !this.state.dragged) {
      this.dragStart(evt, index);
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
    document.addEventListener("mouseenter", this.handleDomDocmenutMouseEnter);
  }

  documentUnsubscribe = () => {
    //@ts-ignore
    document.body.style.userSelect = null;
    document.removeEventListener("mousemove", this.handleDomMouseMove);
    document.removeEventListener("mouseup", this.handleDomMouseUp, false);
    document.removeEventListener("mouseenter", this.handleDomDocmenutMouseEnter);
  }

  subscribe = () => {
    this.documentSubscribe();
    if (this.state.dragged) this.iFrameDisplayControl.disable();
  }

  unsubscribe = () => {
    this.documentUnsubscribe();
    this.iFrameDisplayControl.enable();
  }

  dragStart = (evt: React.MouseEvent<T>, index: number) => {
    if (!this.contentRefs) {
      return;
    }

    this.setDragged(true);
    this.setDragIndex(index);
    this.setDragStartX(evt.clientX);
    this.setDragStartY(evt.clientY);
    const boundRef = this.boundRefs && this.boundRefs[index]?.current;
    if (boundRef) {
      boundRef.ondragstart = this.stopHtmlEvent;
    }

    const contentTop = this.contentRefs[index].current;
    if (!contentTop) {
      logger.variableIsUndefined('contentTop', 'handleDrag');
      return;
    }

    const contentBotton = this.contentRefs[index + 1].current;
    if (!contentBotton) {
      logger.variableIsUndefined('contentBotton', 'handleDrag');
      return;
    }

    this.setDragTopConentHeight(contentTop.offsetHeight / contentTop.parentElement!.offsetHeight);
    this.setDragBottomConentHeight(contentBotton.offsetHeight / contentBotton.parentElement!.offsetHeight);
    this.subscribe();
  }

  dragEnd = () => {
    const dragIndex = this.state.dragIndex;
    if (dragIndex !== undefined) {
      const boundRef = this.boundRefs && this.boundRefs[dragIndex]?.current;
      if (boundRef) {
        boundRef.ondragstart = null;
      }
    }
    else {
      logger.variableIsUndefined('dragIndex', 'dragEnd');
    }

    this.unsubscribe();
    this.setDragIndex(undefined);
    this.setDragged(undefined);
    this.setDragStartX(undefined);
    this.setDragStartY(undefined);
    this.setDragTopConentHeight(undefined);
    this.setDragBottomConentHeight(undefined);
  }

  renderContent(
    nodes: React.ReactNode,
    BoundComponentFowaredRef: HTMLElementForwardRefType<T>)
    : React.ReactNode {
    if (!nodes || typeof (nodes) === 'boolean') {
      return [null, undefined, undefined];
    }

    if (!Array.isArray(nodes)) {
      return [nodes, undefined, undefined];
    }

    const length = nodes.length;
    if (length === 0 || this.props.contentHeights.length !== length ) {
      return null;
    }

    this.boundRefs = this.getBoundRefs(length - 1);
    this.contentRefs = this.getContentRefs(length);

    let contentStyle: React.CSSProperties = {
      height: `calc(${this.props.contentHeights[0] * 100}% - ${((length - 1) / length) * (this.props.boundHeigth ?? 1)}px)`,
      overflowY: 'hidden'
    };

    const content = [<div key={0} ref={this.contentRefs[0]} style={contentStyle}>{nodes[0]}</div>]
    for (let index = 1; index < nodes.length; index++) {
      contentStyle = {
        height: `calc(${this.props.contentHeights[index] * 100}% - ${((length - 1) / length) * (this.props.boundHeigth ?? 1)}px)`,
        overflowY: 'auto'
      };

      content.push(<BoundComponentFowaredRef {...this.getBoundComponentFowaredRefProperteis(index - 1, this.boundRefs[index - 1])} />);
      content.push(<div key={index * 2} ref={this.contentRefs[index]} style={contentStyle}>{nodes[index]}</div>);
    }

    return content;
  }

  render() {
    const content = this.renderContent(this.props.children, this.props.Bound);
    return (
      <div style={{ position: 'sticky', height: this.props.heigth }}>
        {content}
      </div>
    )
  }
}