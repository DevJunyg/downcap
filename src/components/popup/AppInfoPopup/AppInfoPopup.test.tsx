import "test/testPreload";
import { act } from "react-dom/test-utils";
import { render, unmountComponentAtNode } from 'react-dom';
import AppInfoPopup from "./AppInfoPopup";
import IpcSender from "lib/IpcSender";
import i18n from 'i18n';
import ko from 'i18n/ko';
import { I18nextProvider } from "react-i18next";

let container: HTMLDivElement | null = null;

const sendDowncapPrivacyPolicyPopup = IpcSender.sendDowncapPrivacyPolicyPopup;
const sendGooglePrivacyPolicyPopup = IpcSender.sendGooglePrivacyPolicyPopup;
const sendYoutubeTermsOfServicePopup = IpcSender.sendYoutubeTermsOfServicePopup;
const invokeGetVersion = IpcSender.invokeGetVersion;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);

  IpcSender.sendDowncapPrivacyPolicyPopup = jest.fn();
  IpcSender.sendGooglePrivacyPolicyPopup = jest.fn();
  IpcSender.sendYoutubeTermsOfServicePopup = jest.fn();
  IpcSender.invokeGetVersion = async () => { return '' };

  jest.mock('react-i18next', () => ({
    useTranslation: () => {
      return {
        t: (str: string): string => str,
      };
    },
    init: () => jest.fn(),
  }));
});

afterEach(() => {
  unmountComponentAtNode(container!);
  container!.remove();
  container = null;

  IpcSender.sendDowncapPrivacyPolicyPopup = sendDowncapPrivacyPolicyPopup;
  IpcSender.sendGooglePrivacyPolicyPopup = sendGooglePrivacyPolicyPopup;
  IpcSender.sendYoutubeTermsOfServicePopup = sendYoutubeTermsOfServicePopup;
  IpcSender.invokeGetVersion = invokeGetVersion;
});


function fireClickEventInPolicyByText(text: string) {
  act(() => {
    render((
      <I18nextProvider i18n={i18n}>
        <AppInfoPopup />
      </I18nextProvider>
    ), container);
  });
  let policy = container!.getElementsByClassName('policy')[0];
  expect(policy).not.toBeEmptyDOMElement();

  let policyItems = Array.from(policy.children);

  let target = policyItems[policyItems.findIndex(item => item.textContent === text)] as HTMLElement;
  expect(target).not.toBeUndefined()
  target.click();
}

describe("Click event is propagated to the correct event.", () => {
  it("sendDowncapPrivacyPolicyPopup event is executed when a component with the contents of INFO_PRIVACY_POLICY is clicked.", () => {
    act(() => {
      render(
        <AppInfoPopup />
        , container);
    });

    fireClickEventInPolicyByText(ko.AppInfoPopup.Info_Privacy_Policy);
    expect(IpcSender.sendDowncapPrivacyPolicyPopup).toBeCalled();
  });

  it("sendGooglePrivacyPolicyPopup event is executed when a component with the contents of INFO_GOOGLE_PRIVACY_POLICY is clicked.", () => {
    act(() => {
      render(
        <AppInfoPopup />
        , container);
    });

    fireClickEventInPolicyByText(ko.AppInfoPopup.Info_Google_Privacy_Policy);
    expect(IpcSender.sendGooglePrivacyPolicyPopup).toBeCalled();
  });


  it("sendYoutubeTermsOfServicePopup event is executed when a component with the contents of INFO_YOUTUBE_TERMS_OF_SERVICE is clicked.", () => {
    act(() => {
      render(
        <AppInfoPopup />
        , container);
    });

    fireClickEventInPolicyByText(ko.AppInfoPopup.Info_Youtube_Terms_Of_Service);
    expect(IpcSender.sendYoutubeTermsOfServicePopup).toBeCalled();
  });
});
