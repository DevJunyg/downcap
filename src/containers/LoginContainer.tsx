import React, { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";

import Login from "components/Login";
import * as windows from "lib/windows";
import { History } from "history";

import "JsExtensions";
import ReactLoggerFactoryHelper from "logging/ReactLoggerFactoryHelper";
import ClientAnalysisService from "services/ClientAnalysisService";

const logger = ReactLoggerFactoryHelper.build("LoginContainer");
interface ILoginContainerProps {
  history: History;
}

function LoginContainer(props: ILoginContainerProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isCapsLock, setIsCapsLock] = useState(false);
  const { t } = useTranslation('LoginContainer');

  const handleSubmitClick = () => {
    ClientAnalysisService.loginClick();

    if (email.length <= 0) {
      setErrorMessage(t('ErrorDescription_EmaliEmpty'));
      return;
    }

    if (password.length <= 0) {
      setErrorMessage(t('ErrorDescription_PasswordEmpty'));
      return;
    }

    windows
      .login(email, password, rememberMe)
      .then(result => {
        switch (result) {
          case true:
            props.history.replace("/editor");
            return;
          case "ServerError":
            setErrorMessage(t('ErrorDescription_Server'));
            throw new Error("ServerError");
          default:
            setErrorMessage(t('ErrorDescription_LoginFailed'));
            throw new Error("LoginFailedError");
        }
      })
      .catch(err => {
        switch (err?.message) {
          case "ServerError":
            setErrorMessage(t('ErrorDescription_Server'));
            break;
          case "LoginFailedError":
            setErrorMessage(t('ErrorDescription_LoginFailed'));
            break;
          default:
            setErrorMessage(t('ErrorDescription_Unkown'));
            break;
        }
        setPassword("");
      });
  };

  const handleRegisterClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    ClientAnalysisService.registerClick();
    windows.register();
  };

  const handleForgotPasswordClick = (evt: React.MouseEvent<HTMLLabelElement>) => {
    windows.forgotPassword();
  };

  const handleShowPasswordClick = (evt: React.MouseEvent<HTMLDivElement>) => {
    setShowPassword(!showPassword);
  };

  const handleEmailChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setEmail(evt.target.value);

  const handlePasswordChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setPassword(evt.target.value);

  const handleRememberMeChange = (evt: React.ChangeEvent<HTMLInputElement>) =>
    setRememberMe(evt.target.checked);

  const handleEnterKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    if (evt.code === "Enter") {
      handleSubmitClick();
    }
  };

  const handlePasswordSubmitKeyDown = (evt: React.KeyboardEvent<HTMLInputElement>) => {
    evt.persist();
    if (evt.code === "Enter") {
      handleEnterKeyDown(evt);
    }
    setIsCapsLock(evt.getModifierState("CapsLock"));
  }

  useEffect(() => {
    windows.autoLogin()
      .then(result => {
        if (result) {
          props.history.replace('/editor');
        }
      })
      .catch(logger.logError);
  }, [props.history]);

  return (
    <Login
      rememberMe={rememberMe}
      email={email}
      password={password}
      errorMsg={errorMessage}
      showPassword={showPassword}
      isCapsLock={isCapsLock}
      onShowPasswordClick={handleShowPasswordClick}
      onPasswordSubmitKeyDown={handlePasswordSubmitKeyDown}
      onEmailChange={handleEmailChange}
      onPasswordChange={handlePasswordChange}
      onSubmitClick={handleSubmitClick}
      onRememberMeChange={handleRememberMeChange}
      onEnterKeyDown={handleEnterKeyDown}
      onRegisterClick={handleRegisterClick}
      onForgotPasswordClick={handleForgotPasswordClick}
    />
  );
}

export default LoginContainer;
