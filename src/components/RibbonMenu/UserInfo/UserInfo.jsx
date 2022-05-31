//@ts-check
import React, { Component } from 'react';
import './UserInfo.scss';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCircle } from '@fortawesome/pro-solid-svg-icons';
import ClientAnalysisService from 'services/ClientAnalysisService';
import { withTranslation } from 'react-i18next';

/**
 * @typedef {object} Props
 * @property {React.MouseEventHandler} [onClick]
 * @property {React.MouseEventHandler} onLogoutClick
 * @property {React.MouseEventHandler} onUserInfoChangeClick
 * @property {React.MouseEventHandler} onLetterPurchaseClick
 * @property {string} [userName]
 * @property {number} [userLetter]
 * 
 * @typedef {Props & import('react-i18next').WithTranslation} IUserInfoProps
 * 
 * @typedef {object} State
 * @property {boolean} userInfoBoxFocus
 * @property {boolean} userInfoUpdate
 * 
 * @extends Component<IUserInfoProps,State>
 */
class UserInfo extends Component {
  /** @type {HTMLDivElement?} */
  userInfoBox = null

  /** @type {State} */
  state = {
    userInfoBoxFocus: false,
    userInfoUpdate: true
  }

  /**
   * 
   * @param {React.MouseEvent<HTMLDivElement>} evt 
   */
  handleProfileClick = evt => {
    ClientAnalysisService.profileClick();
    if (!this.state.userInfoBoxFocus) {
      this.setState(state => ({
        ...state,
        userInfoBoxFocus: true
      }))
    } else if (this.userInfoBox !== null) {
      this.userInfoBox.blur()
    }

    this.props.onClick && this.props.onClick(evt);
  }

  handleBlur = () => {
    this.setState(state => ({
      ...state,
      userInfoBoxFocus: false,
      userInfoUpdate: true
    }))
  }

  componentDidUpdate() {
    const { userInfoBoxFocus, userInfoUpdate } = this.state;

    if (userInfoBoxFocus && userInfoUpdate) {
      this.setState(state => ({
        ...state,
        userInfoUpdate: false
      }))
    }
  }

  render() {
    const {
      onLogoutClick,
      onUserInfoChangeClick,
      onLetterPurchaseClick,
      userName,
      userLetter
    } = this.props;

    return (
      <div
        className="user-info-box"
        tabIndex={0}
        ref={ref => this.userInfoBox = ref}
        onBlur={this.handleBlur}
      >
        <div className="user-info-icon" onClick={this.handleProfileClick}></div>
        <div className="user-info-content">
          <div className="user-info">
            <label className="user-name">
              {userName}
            </label>
          </div>
          <div className="user-info">
            <label className="user-letter">
              {userLetter} Letter
            </label>
          </div>
          <div className="user-select">
            <div onClick={onUserInfoChangeClick}>
              <FontAwesomeIcon icon={faCircle} size="xs" className="user-select-icon" />
              {this.props.t('userInfoChange')}
            </div>
            <div onClick={onLetterPurchaseClick}>
              <FontAwesomeIcon icon={faCircle} size="xs" className="user-select-icon" />
              <span style={{ fontWeight: 450 }}>Letter </span>{this.props.t('letterPurchase')}
            </div>
            <div onClick={onLogoutClick}>
              <FontAwesomeIcon icon={faCircle} size="xs" className="user-select-icon" />
              {this.props.t('logout')}
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default withTranslation('UserInfo')(UserInfo);
