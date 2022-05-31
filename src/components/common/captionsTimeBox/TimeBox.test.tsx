import "test/testPreload";
import { act, render, screen } from "@testing-library/react";
import TimeBox from "./TimeBox";

it('handleClick fires when the timeBox input is clicked.', async () => {
  const handleClick = jest.fn();

  act(() => {
    render(<TimeBox onClick={handleClick} />);
  });

  let startInput = await screen.findByTestId('timebox-start-input') as HTMLInputElement;
  let endInput = await screen.findByTestId('timebox-end-input') as HTMLInputElement;

  startInput.click();
  expect(handleClick).toBeCalled();

  handleClick.mockClear();

  endInput.click();
  expect(handleClick).toBeCalled();
});