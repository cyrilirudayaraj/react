import React, { Component } from 'react';
import { Root, Button, Icon } from '@athena/forge/';
import AuthUtil from '../../utils/AuthUtil';
import './UserInfo.scss';
import Constants from '../../constants/AppConstants';
const winObj: any = window;

class UserInfo extends Component {
  state = {
    showMenu: false,
    userName: AuthUtil.getLoggedInUsername(),
  };

  showMenuHandler = (): void => {
    const currentStatus = this.state.showMenu;
    this.setState({ showMenu: !currentStatus });
  };

  hideMenu = (): void => {
    this.setState({ showMenu: false });
  };

  logout = (): void => {
    localStorage.clear();
    this.hideMenu();
    window.location.href = process.env.REACT_APP_BASE_CONTEXT_PATH || '/';
  };

  getUserInfoTemplate = (): JSX.Element => {
    let headerColor = 'user-info-header_color';
    const env = winObj.globalVars ? winObj.globalVars.environment : null;
    if (env?.toUpperCase() === Constants.UI_CONSTANTS.STAGE_ENV) {
      headerColor = 'stage_env_user-info-header_color';
    }
    return (
      <header
        className={
          'fe_u_padding--top-medium fe_u_padding--bottom-medium user-info-header' +
          headerColor
        }
      >
        <div className="flex-1"></div>
        <div className="fe_c_dropdown">
          <Button
            className="fe_c_dropdown__toggle"
            variant={'tertiary'}
            icon="Expand"
            onClick={this.showMenuHandler}
          >
            <Icon icon="Patient" />
            <span className="fe_c_dropdown__label">{this.state.userName}</span>
          </Button>
          <div
            className={`fe_c_dropdown__menu ${
              this.state.showMenu ? 'fe_is_open' : ''
            }`}
          >
            <button className="fe_c_dropdown__menu-item" onClick={this.logout}>
              Log Out
            </button>
          </div>
        </div>
      </header>
    );
  };
  render(): JSX.Element {
    return <Root className="ds_c_app">{this.getUserInfoTemplate()}</Root>;
  }
}

export default UserInfo;
