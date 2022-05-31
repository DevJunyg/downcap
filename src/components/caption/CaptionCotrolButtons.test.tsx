import React from "react";
import { render, unmountComponentAtNode } from "react-dom";
import { act } from "react-dom/test-utils";

import CaptionButtons from './CaptionCotrolButtons';

let container: HTMLDivElement | null = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;
});

it("renders without button render flags", () => {
  act(() => {
    render(<CaptionButtons />, container);
  });

  expect(container!.childElementCount).toBe(1);
  expect(container!.children[0]).toBeInstanceOf(HTMLDivElement);

  let captionButtonsDom = container!.children[0] as HTMLDivElement;
  expect(captionButtonsDom).toHaveClass('subtitles-control-buttons')
  expect(captionButtonsDom.childElementCount).toBe(0);
});

it("render with render addCaptionButtonRendered flag", () => {
  act(() => {
    render(<CaptionButtons addCaptionButtonRendered />, container);
  });

  let captionButtonsDom = container!.children[0] as HTMLDivElement;

  expect(captionButtonsDom.childElementCount).toBe(1);
  expect(captionButtonsDom.children[0]).toBeInstanceOf(HTMLButtonElement);
  expect(captionButtonsDom.children[0]).toHaveClass('add-caption-button');
});

it("render with combineButtonRendered flag", () => {
  act(() => {
    render(<CaptionButtons combineButtonRendered />, container);
  });

  let captionButtonsDom = container!.children[0] as HTMLDivElement;

  expect(captionButtonsDom.childElementCount).toBe(1);
  expect(captionButtonsDom.children[0]).toBeInstanceOf(HTMLButtonElement);
  expect(captionButtonsDom.children[0]).toHaveClass('combine-button');
});

it("render with render addCaptionButtonRendered and combineButtonRendered flag", () => {
  act(() => {
    render(<CaptionButtons addCaptionButtonRendered combineButtonRendered />, container);
  });

  let captionButtonsDom = container!.children[0] as HTMLDivElement;

  expect(captionButtonsDom.childElementCount).toBe(2);

  expect(captionButtonsDom.children[0]).toBeInstanceOf(HTMLButtonElement);
  expect(captionButtonsDom.children[0]).toHaveClass('add-caption-button');

  expect(captionButtonsDom.children[1]).toBeInstanceOf(HTMLButtonElement);
  expect(captionButtonsDom.children[1]).toHaveClass('combine-button');
});

it("reverse attribute will rotateX the combine-button 180 degrees", () => {
  act(() => {
    render(<CaptionButtons combineButtonRendered reverse />, container);
  });

  let captionButtonsDom = container!.children[0] as HTMLDivElement;
  expect(captionButtonsDom.children[0]).toHaveStyle("transform: rotateX(180deg)");
});

it("onClick Event will be propagated.", () => {
  const handleCaptionAddClick = jest.fn();
  const handleCombineButtonClick = jest.fn();
  act(() => {
    render(
      <CaptionButtons addCaptionButtonRendered combineButtonRendered
        onCaptionAddClick={handleCaptionAddClick}
        onCombineButtonClick={handleCombineButtonClick}
      />, container);
  });

  let captionButtonsDom = container!.children[0] as HTMLDivElement;

  (captionButtonsDom.children[0] as HTMLButtonElement).click();
  expect(handleCaptionAddClick).toBeCalled();
  expect(handleCombineButtonClick).not.toBeCalled();

  handleCaptionAddClick.mockClear();
  handleCombineButtonClick.mockClear();

  (captionButtonsDom.children[1] as HTMLButtonElement).click();
  expect(handleCombineButtonClick).toBeCalled();
  expect(handleCaptionAddClick).not.toBeCalled();
});

