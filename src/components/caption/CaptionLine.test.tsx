import "test/testPreload";
import { render, screen, fireEvent } from "@testing-library/react";
import CaptionLine from "./CaptionLine";
import { ICaptionEventMeta } from "./CaptionInput";

function renderCaptionLine(meta?: ICaptionEventMeta) {
  const line = { "words": [{ "confidence": 1, "text": "안녕하세요", "start": 0.09, "end": 1.002, "id": 0 }], "id": 0 };
  const focusMeta = { wordIndex: 0 };

  const _handleRemoveClick = jest.fn();
  const _handleLineKeyDown = jest.fn();
  const _handleLineClick = jest.fn();
  const _handleKeyDown = jest.fn();
  const _handleChange = jest.fn();
  const _handleWordClick = jest.fn();
  const _handleWordFocus = jest.fn();
  const _handleWordBlur = jest.fn();
  const _handleStartTimeTextBlur = jest.fn();
  const _handleEndTimeTextBlur = jest.fn();

  let renderedComponent = render(
    <CaptionLine
      line={line}
      meta={meta}
      focusMeta={focusMeta}
      onRemoveClick={_handleRemoveClick}
      onKeyDown={_handleKeyDown}
      onLineKeyDown={_handleLineKeyDown}
      onLineClick={_handleLineClick}
      onChange={_handleChange}
      onWordClick={_handleWordClick}
      onWordFocus={_handleWordFocus}
      onWordBlur={_handleWordBlur}
      onStartTimeTextBlur={_handleStartTimeTextBlur}
      onEndTimeTextBlur={_handleEndTimeTextBlur}
    />
  );

  return {
    renderedComponent,
    handleRemoveClick: _handleRemoveClick,
    handleKeyDown: _handleKeyDown,
    handleLineKeyDown: _handleLineKeyDown,
    handleLineClick: _handleLineClick,
    handleChange: _handleChange,
    handleWordClick: _handleWordClick,
    handleWordBlur: _handleWordBlur,
    handleWordFocus: _handleWordFocus,
    handleStartTimeTextBlur: _handleStartTimeTextBlur,
    handleEndTimetextBlur: _handleEndTimeTextBlur
  };
}

describe('Check event propagation according to meta.', () => {
  it("handleRemoveClick will not work without meta.", async () => {
    let { renderedComponent, handleRemoveClick } = renderCaptionLine();

    let removeButton = await renderedComponent.findByTestId('line-remove-btn');
    fireEvent.click(removeButton);
    expect(handleRemoveClick).toBeCalledTimes(0);
  });

  it("handleRemoveClick will not work without meta.paragraphIndex.", async () => {
    let { renderedComponent, handleRemoveClick } = renderCaptionLine({});

    let removeButton = await renderedComponent.findByTestId('line-remove-btn');
    fireEvent.click(removeButton);
    expect(handleRemoveClick).toBeCalledTimes(0);
  });

  it("handleRemoveClick will work with meta.paragraphIndex.", async () => {
    let { renderedComponent, handleRemoveClick } = renderCaptionLine({ paragraphIndex: 0 });

    let removeButton = await renderedComponent.findByTestId('line-remove-btn');
    fireEvent.click(removeButton);
    expect(handleRemoveClick).toBeCalledTimes(1);
  });

  it("handleLineKeyDowns will not work without meta", async () => {
    let { renderedComponent, handleLineKeyDown } = renderCaptionLine();

    let subtitle = await renderedComponent.findByTestId('subtitle');
    fireEvent.keyDown(subtitle, { code: 'ArrowDown' });
    expect(handleLineKeyDown).toBeCalledTimes(0);
  });

  it("handleLineKeyDown will not work without meta.paragraphIndex.", async () => {
    let { renderedComponent, handleLineKeyDown } = renderCaptionLine({});

    let subtitle = await renderedComponent.findByTestId('subtitle');
    fireEvent.keyDown(subtitle, { code: 'ArrowDown' });
    expect(handleLineKeyDown).toBeCalledTimes(0);
  });

  it("handleLineKeyDown will work with meta.paragraphIndex", async () => {
    let { renderedComponent, handleLineKeyDown } = renderCaptionLine({ paragraphIndex: 0 });

    let subtitle = await renderedComponent.findByTestId('subtitle');
    fireEvent.keyDown(subtitle, { code: 'ArrowDown' });
    expect(handleLineKeyDown).toBeCalledTimes(1);
  });

  it("handleLineClick will not work when meta is undefined", async () => {
    let { renderedComponent, handleLineClick } = renderCaptionLine();

    let subtitle = await renderedComponent.findByTestId('subtitle');
    fireEvent.click(subtitle);
    expect(handleLineClick).toBeCalledTimes(0);
  });

  it("handleLineClick will not work when meta is empty object", async () => {
    let { renderedComponent, handleLineClick } = renderCaptionLine({});

    let subtitle = await renderedComponent.findByTestId('subtitle');
    fireEvent.click(subtitle);
    expect(handleLineClick).toBeCalledTimes(0);
  });

  it("handleLineClick will work with meta.paragraphIndex", async () => {
    let { renderedComponent, handleLineClick } = renderCaptionLine({ paragraphIndex: 0 });

    let subtitle = await renderedComponent.findByTestId('subtitle');
    fireEvent.click(subtitle);
    expect(handleLineClick).toBeCalledTimes(1);
  });

  it("handleKeyDown will not work when meta is empty object", async () => {
    let { renderedComponent, handleKeyDown } = renderCaptionLine({});

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.keyDown(input, { code: 'ArrowDown' });
    expect(handleKeyDown).toBeCalledTimes(0);
  });

  it("handleKeyDown will work with meta.paragraphIndex", async () => {
    let { renderedComponent, handleKeyDown } = renderCaptionLine({ paragraphIndex: 0 });

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.keyDown(input, { code: 'ArrowDown' });
    expect(handleKeyDown).toBeCalledTimes(1);
  });

  it("handleChange will not work when meta is empty object", async () => {
    let { renderedComponent, handleChange } = renderCaptionLine({});

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.change(input, { target: { value: 'change,체인지1' } });
    expect(handleChange).toBeCalledTimes(0);
  });

  it("handleChange will work with meta.paragraphIndex", async () => {
    let { renderedComponent, handleChange } = renderCaptionLine({ paragraphIndex: 0 });

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.change(input, { target: { value: 'change,체인지1' } });
    expect(handleChange).toBeCalledTimes(1);
  });

  it("handleStartTimeTextBlur will not work when meta is undefined", async () => {
    let { handleStartTimeTextBlur } = renderCaptionLine();
    let timebox = await screen.findByTestId("timebox-start-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1' } });
    fireEvent.focusOut(timebox);
    expect(handleStartTimeTextBlur).toBeCalledTimes(0);
  });

  it("handleStartTimeTextBlur will not work when meta is empty object", async () => {
    let { renderedComponent, handleStartTimeTextBlur } = renderCaptionLine({});
    let timebox = await renderedComponent.findByTestId("timebox-start-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1' } });
    fireEvent.focusOut(timebox);
    expect(handleStartTimeTextBlur).toBeCalledTimes(0);
  });

  it("handleStartTimeTextBlur will work with meta.paragraphIndex", async () => {
    let { renderedComponent, handleStartTimeTextBlur } = renderCaptionLine({ paragraphIndex: 0 });
    let timebox = await renderedComponent.findByTestId("timebox-start-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1' } });
    fireEvent.focusOut(timebox);
    expect(handleStartTimeTextBlur).toBeCalledTimes(1);
  });

  it("handleEndTimetextBlur will not work when meta is undefined", async () => {
    let { renderedComponent, handleEndTimetextBlur } = renderCaptionLine();
    let timebox = await renderedComponent.findByTestId("timebox-end-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1' } });
    fireEvent.focusOut(timebox);
    expect(handleEndTimetextBlur).toBeCalledTimes(0);
  });

  it("handleEndTimetextBlur will not work when meta is empty object", async () => {
    let { renderedComponent, handleEndTimetextBlur } = renderCaptionLine({});
    let timebox = await renderedComponent.findByTestId("timebox-end-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1' } });
    fireEvent.focusOut(timebox);
    expect(handleEndTimetextBlur).toBeCalledTimes(0);
  });

  it("handleEndTimetextBlur will work with meta.paragraphIndex", async () => {
    let { renderedComponent, handleEndTimetextBlur } = renderCaptionLine({ paragraphIndex: 0 });
    let timebox = await renderedComponent.findByTestId("timebox-end-input") as HTMLInputElement;

    fireEvent.change(timebox, { target: { value: '1' } });
    fireEvent.focusOut(timebox);
    expect(handleEndTimetextBlur).toBeCalledTimes(1);
  });

  it('handleWordClick will not work when meta is undefined', async () => {
    let { renderedComponent, handleWordClick } = renderCaptionLine();

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.click(input);
    expect(handleWordClick).toBeCalledTimes(0);
  });

  it('handleWordClick will work with meta.paragraphIndex', async () => {
    let { renderedComponent, handleWordClick } = renderCaptionLine({ paragraphIndex: 0 });

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.click(input);

    expect(handleWordClick).toBeCalledTimes(1);
  });

  it('handleWordFocus will not work when meta is undefined', async () => {
    let { renderedComponent, handleWordFocus } = renderCaptionLine();

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.focus(input);
    expect(handleWordFocus).toBeCalledTimes(0);
  });

  it('handleWordFocus will work with meta.paragraphIndex', async () => {
    let { renderedComponent, handleWordFocus } = renderCaptionLine({ paragraphIndex: 0 });

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.focus(input);
    expect(handleWordFocus).toBeCalled();
  });

  it('handleWordBlur will not work when meta is undefined', async () => {
    let { renderedComponent, handleWordBlur } = renderCaptionLine();

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.focusOut(input);
    expect(handleWordBlur).toBeCalledTimes(0);
  });

  it('handleWordBlur will work with meta.paragraphIndex', async () => {
    let { renderedComponent, handleWordBlur } = renderCaptionLine({ paragraphIndex: 0 });

    let input = await renderedComponent.findByTestId('caption-input');
    fireEvent.focusOut(input);
    expect(handleWordBlur).toBeCalledTimes(1);
  });
})