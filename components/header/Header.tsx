import { Heading } from '@athena/forge';
import React, { Component } from 'react';
import Constants from '../../constants/AppConstants';
import UserInfo from '../userinfo/UserInfo';
import './Header.scss';
const winObj: any = window;

class Header extends Component {
  render(): JSX.Element {
    let headerColor = 'header_color';
    let env = winObj.globalVars ? winObj.globalVars.environment : null;
    if (env?.toUpperCase() === Constants.UI_CONSTANTS.STAGE_ENV) {
      env = Constants.UI_CONSTANTS.STAGE_ENV_MSG;
      headerColor = 'stage_env_header_color';
    }
    return (
      <div
        className={
          'fe_u_flex-container fe_u_flex-justify-content--space-between header ' +
          headerColor
        }
      >
        <div className="fe_u_flex-container">
          <img
            alt="logo"
            className="fe_u_margin--left-large fe_u_margin--top-small logo"
            width="28"
            height="28"
          />
          <Heading
            className="app-name"
            headingTag="h2"
            variant="subsection"
            text="Atlas"
          />
          <Heading
            className="app-env"
            headingTag="h3"
            variant="subsection"
            text={env}
          />
        </div>
        <div className="fe_u_flex-container">
          <UserInfo />
        </div>
      </div>
    );
  }
}

export default Header;
