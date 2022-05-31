//@ts-check
import React, { Component } from 'react';
import LoginContainer from 'containers/LoginContainer';

/**
 * @typedef {object} Props
 * @property {import ("history").History} history
 * 
 * @extends {Component<Props>}
 */
class LoginPage extends Component {
  render() {
    const { ...rest } = this.props;
    return <LoginContainer {...rest} />
  }
}

export default LoginPage;
