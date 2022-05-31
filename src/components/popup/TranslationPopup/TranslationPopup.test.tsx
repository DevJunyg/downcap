import { render, screen } from '@testing-library/react';
import TranslationPopup from './TranslationPopup';

it('Click on TranslationPopup, onCloseClick will work', async () => {
  const handleCloseClick = jest.fn();
  render(<TranslationPopup onCloseClick={handleCloseClick} />);
  const element = await screen.findByTestId('test-id-translation-popup-cancel') as HTMLDivElement;
  element.click();
  expect(handleCloseClick).toBeCalled();
});

it('Click on TranslationPopup, onAcceptClick will work', async () => {
  const handleAcceptClick = jest.fn();
  render(<TranslationPopup onAcceptClick={handleAcceptClick} />);
  const element = await screen.findByTestId('test-id-translation-popup-accept') as HTMLDivElement;
  element.click();
  expect(handleAcceptClick).toBeCalled();
});