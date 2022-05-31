import { render, screen } from '@testing-library/react';
import Titlebar from './Titlebar';

it('Click on unmaximize button, onUnMaximizeClick will work', async () => {
  const handleUnMaximizeClick = jest.fn();
  const maximized = true; 
  render(<Titlebar 
    maximized={maximized}
    onUnMaximizeClick={handleUnMaximizeClick} />);

  let element = await screen.findByTestId('test-id-titlebar-unmaximize-button') as HTMLButtonElement;
  element.click();

  expect(handleUnMaximizeClick).toBeCalled();
});

it('Click on maximize button, onMaximizeClick will work', async () => {
  const handleMaximizeClick = jest.fn();
  const maximized = false; 
  render(<Titlebar 
    maximized={maximized}
    onMaximizeClick={handleMaximizeClick} />);

  let element = await screen.findByTestId('test-id-titlebar-maximize-button') as HTMLButtonElement;
  element.click();

  expect(handleMaximizeClick).toBeCalled();
});

it('Click on minimize button, onMinimizeClick will work', async () => {
  const handleMinimizeClick = jest.fn();
  render(<Titlebar onMinimizeClick={handleMinimizeClick} />);

  let element = await screen.findByTestId('test-id-titlebar-minimize-button') as HTMLButtonElement;
  element.click();

  expect(handleMinimizeClick).toBeCalled();
});

it('Click on exit button, onExitClick will work', async () => {
  const handleExitClick = jest.fn();
  render(<Titlebar onExitClick={handleExitClick} />);

  let element = await screen.findByTestId('test-id-titlebar-exit-button') as HTMLButtonElement;
  element.click();

  expect(handleExitClick).toBeCalled();
});