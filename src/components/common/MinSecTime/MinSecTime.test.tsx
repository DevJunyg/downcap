import { render } from "@testing-library/react";
import { zeroPadding } from "lib/utils";
import MinSecTime from "./MinSecTime";

function setup() {
  const time = 67;
  const formattedTime = { min: Math.floor(time / 60), sec: Math.floor(time % 60) };
  const utils = render(<MinSecTime time={time} />);
  const findTimeText = async () => (await utils.findByTestId('time-label') as HTMLLabelElement).innerHTML;

  return {
    ...utils,
    time,
    formattedTime,
    findTimeText
  };
}

function changeTimeFormat(min: number, sec: number) {
  return `${zeroPadding(min, 2)}:${zeroPadding(sec, 2)}`
}

it('shows that it can be rendered and display the time correctly', async () => {
  const utils = setup();
  expect(await utils.findTimeText()).toEqual(changeTimeFormat(utils.formattedTime.min, utils.formattedTime.sec));
})