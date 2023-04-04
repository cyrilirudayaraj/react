import React, { Component } from 'react';
import { Icon } from '@athena/forge';
import './SideNav.css';
import DynamicLink from '../dynamic-link/DynamicLink';
import WFShowForPermission from '../wf-showforpermission/WFShowForPermission';
import Acl from '../../constants/Acl';

class SideNav extends Component {
  state = {
    menus: [
      {
        name: 'Home',
        icon: 'Team',
        link: process.env.REACT_APP_BASE_CONTEXT_PATH,
      },
      {
        name: 'Deployment Tool',
        icon: 'Settings',
        link: process.env.REACT_APP_BASE_CONTEXT_PATH + 'deployment',
        permission: Acl.TASK_DEPLOY,
      },
      {
        name: 'athenaNet',
        icon: 'Vitals',
        link: process.env.REACT_APP_ATHENA_NET_URL,
        permission: Acl.TOOLBAR_ANET_READ,
      },
      {
        name: 'Btest',
        icon: 'Vitals',
        link: process.env.REACT_APP_ATHENA_NET_BTEST_URL,
        permission: Acl.TOOLBAR_BTEST_READ,
      },
      {
        name: 'Models',
        icon: 'ModalPopup',
        link: process.env.REACT_APP_MODELS_URL,
        permission: Acl.TOOLBAR_DFM_READ,
      },
      {
        name: 'ODM',
        icon: 'Flowsheet',
        link: process.env.REACT_APP_DTS_URL,
        permission: Acl.TOOLBAR_ODM_READ,
      },
      {
        name: 'Migration Report',
        icon: 'Chart',
        link: process.env.REACT_APP_BASE_CONTEXT_PATH + 'rulesmigration',
        permission: Acl.TOOLBAR_RULES_MIGR_READ,
      },
      {
        name: 'Global Documents',
        icon: 'Document',
        link: process.env.REACT_APP_DOCUMENTS_GLOBAL_URL,
        permission: Acl.TOOLBAR_GLOBAL_DOCS_READ,
      },
      {
        name: 'Local Documents',
        icon: 'Document',
        link: process.env.REACT_APP_DOCUMENTS_LOCAL_URL,
        permission: Acl.TOOLBAR_LOCAL_DOCS_READ,
      },
      {
        name: 'Jira',
        icon: 'Settings',
        link: process.env.REACT_APP_JIRA_URL,
        permission: Acl.TOOLBAR_JIRA_READ,
      },
    ],
  };

  render(): JSX.Element {
    const menuList = (
      <div className="left-menu-width side-nav">
        {this.state.menus.map((menu) => {
          return (
            <WFShowForPermission key={menu.name} permission={menu.permission}>
              <div className="menu-link-width">
                <DynamicLink to={menu.link || ''}>
                  <Icon icon={menu.icon} />
                  <span className="menu-link">{menu.name}</span>
                </DynamicLink>
              </div>
            </WFShowForPermission>
          );
        })}
      </div>
    );
    return (
      <div className="fe_u_flex-container fe_u_flex-justify-content--space-between">
        <div className="left-menu-width fe_u_fill--height">{menuList}</div>
      </div>
    );
  }
}

export default SideNav;
