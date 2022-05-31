import { render, screen } from '@testing-library/react';
import HelpMenu from './HelpMenu';

it('Click on Tilte, onTitleClick will work, regardless of selected', async () => {
  const handleTitleClick = jest.fn();
  const { rerender } = render(<HelpMenu selected onTitleClick={handleTitleClick} />);

  let element = await screen.findByTestId('test-id-help-title') as HTMLDivElement;
  element.click();

  expect(handleTitleClick).toBeCalled();

  handleTitleClick.mockClear();

  rerender(<HelpMenu onTitleClick={handleTitleClick} />);

  element = await screen.findByTestId('test-id-help-title') as HTMLDivElement;
  element.click();

  expect(handleTitleClick).toBeCalled();
});

it('Click on Info, onInfoClick will work', async () => {
  const handleInfoClick = jest.fn();
  render(<HelpMenu selected onInfoClick={handleInfoClick} />);

  const element = await screen.findByTestId('test-id-help-info') as HTMLDivElement;
  element.click();

  expect(handleInfoClick).toBeCalled();
});

it('Click on shortcut, onShourtClick will work', async () => {
  const handleShortcutClick = jest.fn();
  render(<HelpMenu selected onShortcutClick={handleShortcutClick} />);

  const element = await screen.findByTestId('test-id-help-shortcut') as HTMLDivElement;
  element.click();

  expect(handleShortcutClick).toBeCalled();
});

it('Click on notice, onNoticeClick will work', async () => {
  const handleNoticeClick = jest.fn();
  render(<HelpMenu selected onNoticeClick={handleNoticeClick} />);

  const element = await screen.findByTestId('test-id-help-notice') as HTMLDivElement;
  element.click();

  expect(handleNoticeClick).toBeCalled();
});

it('Click on inquiry, onInquiryClick will work', async () => {
  const handleInqueryClick = jest.fn();
  render(<HelpMenu selected onInquiryClick={handleInqueryClick} />);

  const element = await screen.findByTestId('test-id-help-inquiry') as HTMLDivElement;
  element.click();

  expect(handleInqueryClick).toBeCalled();
});

it('Click on helpImg, onhelpImagelick will work', async () => {
  const handleHelPImageClick = jest.fn();
  render(<HelpMenu selected onHelpImageClick={handleHelPImageClick} />);

  const element = await screen.findByTestId('test-id-help-help-img') as HTMLDivElement;
  element.click();

  expect(handleHelPImageClick).toBeCalled();
});