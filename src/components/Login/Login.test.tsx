import "test/testPreload";
import { render, screen } from "@testing-library/react";
import React from "react";
import Login from "./Login";

it("The onEmailChange will pass the input event as is.", async () => {
  const handleEmailChangeJest = jest.fn<void, [string]>();

  render(<Login onEmailChange={handleEmailChange} />);

  const emailInputElement = (await screen.findByTestId(
    "email-input"
  )) as HTMLInputElement;
  const emailValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )!.set!;
  emailValueSetter.call(emailInputElement, "test@dowcap.net");

  const inputEvt = new InputEvent("input", { bubbles: true });
  emailInputElement.dispatchEvent(inputEvt);

  expect(handleEmailChangeJest).toBeCalledWith<[string]>("test@dowcap.net");

  return;

  function handleEmailChange(evt: React.ChangeEvent<HTMLInputElement>) {
    handleEmailChangeJest(evt.target.value);
  }
});

it("The onPasswordChange will pass the input event as is.", async () => {
  const handlePasswordChangeJest = jest.fn<void, [string]>();
  render(<Login onPasswordChange={handlePasswordChange} />);

  const passwordInputElement = (await screen.findByTestId(
    "password-input"
  )) as HTMLInputElement;

  const passwordValueSetter = Object.getOwnPropertyDescriptor(
    window.HTMLInputElement.prototype,
    "value"
  )!.set!;
  passwordValueSetter.call(passwordInputElement, "haha!@123");

  const inputEvt = new InputEvent("input", { bubbles: true });
  passwordInputElement.dispatchEvent(inputEvt);

  expect(handlePasswordChangeJest).toBeCalledWith<[string]>("haha!@123");

  return;

  function handlePasswordChange(evt: React.ChangeEvent<HTMLInputElement>) {
    handlePasswordChangeJest(evt.target.value);
  }
});

it("The password is displayed according to the showPassword value", async () => {
  const keyValuePairs = [
    { key: true, value: "text" },
    { key: false, value: "password" },
  ];

  const { rerender } = render(<Login />);

  for (const testCase of keyValuePairs) {
    rerender(<Login showPassword={testCase.key} />);
    const passwordInputElement = (await screen.findByTestId(
      "password-input"
    )) as HTMLInputElement;

    expect(passwordInputElement.type).toEqual(testCase.value);
  }
});

it("Submit password, onPasswordSubmission will work", async () => {
  const handlePasswordSubmission = jest.fn();
  render(<Login onPasswordSubmitKeyDown={handlePasswordSubmission} />);

  const element = (await screen.findByTestId(
    "password-input"
  )) as HTMLInputElement;
  element.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
  );

  expect(handlePasswordSubmission).toBeCalled();
});

it("Click on submit button, onSubmitClick will work", async () => {
  const handleSubmitClick = jest.fn();
  render(<Login onSubmitClick={handleSubmitClick} />);

  const element = (await screen.findByTestId("submit-btn")) as HTMLDivElement;
  element.click();

  expect(handleSubmitClick).toBeCalled();
});

it("", async () => {
  const handleRememberMeChange = jest.fn();

  render(<Login onRememberMeChange={handleRememberMeChange} />);

  const rememberMeInputElement = (await screen.findByTestId(
    "rememberMe-input"
  )) as HTMLInputElement;
  rememberMeInputElement.click();

  expect(handleRememberMeChange).toBeCalled();
});

it("Press the enter key, OnEnterKeyDown will work", async () => {
  const handleOnEnterKeyDown = jest.fn();
  render(<Login onEnterKeyDown={handleOnEnterKeyDown} />);

  const element = (await screen.findByTestId(
    "email-input"
  )) as HTMLInputElement;
  element.dispatchEvent(
    new KeyboardEvent("keydown", { key: "Enter", bubbles: true })
  );

  expect(handleOnEnterKeyDown).toBeCalled();
});

it("Click on Register, onRegisterClick will work", async () => {
  const handleRegisterClick = jest.fn();
  render(<Login onRegisterClick={handleRegisterClick} />);

  const element = (await screen.findByTestId("register-btn")) as HTMLDivElement;
  element.click();

  expect(handleRegisterClick).toBeCalled();
});

it("Click on Forgot password, onForgotPasswordClick will work", async () => {
  const handleForgotPasswordClick = jest.fn();
  render(<Login onForgotPasswordClick={handleForgotPasswordClick} />);

  const element = (await screen.findByTestId(
    "forgot-password-label"
  )) as HTMLLabelElement;
  element.click();

  expect(handleForgotPasswordClick).toBeCalled();
});
