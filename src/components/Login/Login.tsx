import React from "react";
import "./Login.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/pro-light-svg-icons";
import { useTranslation } from "react-i18next";
import LanguageSwitch from "../RibbonMenu/LanguageSelectButton";

interface ILoginProps {
  rememberMe?: boolean;
  email?: string;
  password?: string;
  errorMsg?: string;
  showPassword?: boolean;
  isCapsLock?: boolean;
  onEmailChange?: React.ChangeEventHandler;
  onPasswordChange?: React.ChangeEventHandler;
  onPasswordSubmitKeyDown?: React.KeyboardEventHandler;
  onSubmitClick?: React.MouseEventHandler;
  onRememberMeChange?: React.ChangeEventHandler;
  onEnterKeyDown?: React.KeyboardEventHandler;
  onRegisterClick?: React.MouseEventHandler;
  onForgotPasswordClick?: React.MouseEventHandler;
  onShowPasswordClick?: React.MouseEventHandler;
}

function Login(props: ILoginProps) {
  const { t } = useTranslation('Login');
  return (
    <div className="login-page">
      <div className="login-page-logo">
        <img
          src="https://downcap.net/client/img/downcap_logo.png"
          alt="open"
        />
      </div>
      <div className="login center">
        <div className="login-content">
          <div className="error-message">
            {props.errorMsg && `* ${props.errorMsg}`}
          </div>
          <div className="form-group">
            <input
              className="form-control"
              onChange={props.onEmailChange}
              type="email"
              id="Email"
              name="Email"
              maxLength={100}
              value={props.email}
              placeholder={t('email')}
              onKeyDown={props.onEnterKeyDown}
              data-testid="email-input"
            />
            <div className="form-control password">
              <input
                className="password-form"
                onChange={props.onPasswordChange}
                type={props.showPassword ? "text" : "password"}
                id="Password"
                name="Password"
                maxLength={100}
                value={props.password}
                placeholder={t('password')}
                onKeyDown={props.onPasswordSubmitKeyDown}
                data-testid="password-input"
              />
              <div
                className="password-eye-icon"
                onClick={props.onShowPasswordClick}
                data-testid="showPassword-div">
                <FontAwesomeIcon icon={props.showPassword ? faEye : faEyeSlash} />
              </div>
            </div>
            {props.isCapsLock && (
              <div className="capslock-error-message">
                {t('capslock_ErrorMessage')}
              </div>
            )}
          </div>
          <div className="account-group">
            <label className="signed-in-control">
              <input
                checked={props.rememberMe}
                onChange={props.onRememberMeChange}
                type="checkbox"
                data-testid="rememberMe-input"
              />
              <span className="checkmark" />
              {t('stayLogin')}
            </label>
          </div>
          <div className="btn-group">
            <div
              className="btn btn-block btn-violet"
              onClick={props.onSubmitClick}
              data-testid="submit-btn">
              {t('login')}
            </div>
            <div
              className="btn btn-block btn-clear"
              onClick={props.onRegisterClick}
              data-testid="register-btn"
            >
              {t('signup')}
            </div>
          </div>
          <div style={{ marginTop: '0.5rem' }}>
            <label
              className="float-right"
              onClick={props.onForgotPasswordClick}
              data-testid='forgot-password-label'
            >
              {t('forgotPassword')}
            </label>
          </div>
        </div>
      </div>
      <div className="languageSwitch">
        <LanguageSwitch className="login-tab"/>
      </div>
    </div>
  );
}

export default Login;
