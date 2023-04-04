import React from 'react';
import { connect } from 'react-redux';
import { Link, useHistory, useLocation } from 'react-router-dom';
import {
  getLeftSectionActive,
  getRightSectionActive,
  getRightFormAction,
  getLeftFormAction,
  setLeftFormAction,
  setRightFormAction,
  setNextUrlAction,
  resetcancelBtnAction,
  getCancelBtnAction,
} from '../../slices/TaskSlice';

interface DynamicLinkProps {
  to: string;
  history?: any;
  children: string | JSX.Element | JSX.Element[];
  leftSectionActive?: boolean;
  rightSectionActive?: boolean;
  setLeftFormAction?: any;
  setRightFormAction?: any;
  cancelBtnAction?: any;
  resetcancelBtnAction?: any;
  setNextUrlAction?: any;
}

function DynamicLink(props: DynamicLinkProps): JSX.Element {
  const history = useHistory();
  const location = useLocation();
  const homeClick = (e: any) => {
    e.preventDefault();
    const homeUrl = process.env.REACT_APP_BASE_CONTEXT_PATH || '/home';
    if (props.leftSectionActive) {
      props.setLeftFormAction(true);
      props.setNextUrlAction(homeUrl);
    } else if (props.rightSectionActive) {
      props.setRightFormAction(true);
      props.setNextUrlAction(homeUrl);
    } else {
      history.push(homeUrl);
      if (location.pathname && location.pathname.endsWith('/')) {
        window.location.reload();
      }
    }
  };

  const deploymentClick = (e: any) => {
    e.preventDefault();
    const deploymentUrl =
      process.env.REACT_APP_BASE_CONTEXT_PATH + 'deployment';
    if (props.leftSectionActive) {
      props.setLeftFormAction(true);
      props.setNextUrlAction(deploymentUrl);
    } else if (props.rightSectionActive) {
      props.setRightFormAction(true);
      props.setNextUrlAction(deploymentUrl);
    } else {
      history.push(deploymentUrl);
      if (location.pathname && location.pathname.indexOf('deployment') != -1) {
        window.location.reload();
      }
    }
  };

  const ruleMigrationClick = (e: any) => {
    e.preventDefault();
    const ruleMigrationUrl =
      process.env.REACT_APP_BASE_CONTEXT_PATH + 'rulesmigration';
    if (props.leftSectionActive) {
      props.setLeftFormAction(true);
      props.setNextUrlAction(ruleMigrationUrl);
    } else if (props.rightSectionActive) {
      props.setRightFormAction(true);
      props.setNextUrlAction(ruleMigrationUrl);
    } else {
      history.push(ruleMigrationUrl);
      if (
        location.pathname &&
        location.pathname.indexOf('rulesmigration') != -1
      ) {
        window.location.reload();
      }
    }
  };
  const regex = /^http[s]?:\/\//;
  if (regex.test(props.to)) {
    return (
      <a href={props.to} target="_blank" rel="noopener noreferrer">
        {props.children}
      </a>
    );
  } else if (props.to == process.env.REACT_APP_BASE_CONTEXT_PATH) {
    return (
      <Link to={props.to} onClick={(e) => homeClick(e)}>
        {props.children}
      </Link>
    );
  } else if (
    props.to ==
    process.env.REACT_APP_BASE_CONTEXT_PATH + 'deployment'
  ) {
    return (
      <Link to={props.to} onClick={(e) => deploymentClick(e)}>
        {props.children}
      </Link>
    );
  } else if (
    props.to ==
    process.env.REACT_APP_BASE_CONTEXT_PATH + 'rulesmigration'
  ) {
    return (
      <Link to={props.to} onClick={(e) => ruleMigrationClick(e)}>
        {props.children}
      </Link>
    );
  } else {
    return <Link to={props.to}>{props.children}</Link>;
  }
}

const mapStateToProps = (state: any) => ({
  leftSectionActive: getLeftSectionActive(state),
  rightSectionActive: getRightSectionActive(state),
  leftFormFlag: getLeftFormAction(state),
  rightFormFlag: getRightFormAction(state),
  CancelBtnAction: getCancelBtnAction(state),
});

const mapDispatchToProps = {
  setLeftFormAction,
  setRightFormAction,
  setNextUrlAction,
  resetcancelBtnAction,
};

export default connect(mapStateToProps, mapDispatchToProps)(DynamicLink);
