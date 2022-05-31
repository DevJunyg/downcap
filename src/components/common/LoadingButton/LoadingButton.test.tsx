import { render, screen } from '@testing-library/react';
import LoadingButton from './LoadingButton';

it('Click on LoadingButton, onClick will work', async () => {
  const handleClick = jest.fn();
  const { rerender } = render(<LoadingButton loading={true} onClick={handleClick} />);

  let element = await screen.findByTestId('test-id-loading-button') as HTMLDivElement;
  element.click();

  expect(handleClick).toBeDefined();

  handleClick.mockClear();

  rerender(<LoadingButton loading={false} onClick={handleClick} />);

  element = await screen.findByTestId('test-id-loading-button') as HTMLDivElement;
  element.click();

  expect(handleClick).toBeCalled();
});