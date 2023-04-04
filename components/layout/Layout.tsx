import React, { Component } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { GridRow } from '@athena/forge';
import Header from '../header/Header';
import SideNav from '../sidenav/SideNav';
import Dashboard from '../../containers/dashboard/Dashboard';
import UpdateTask from '../../containers/task/update-task/UpdateTask';
import { fetchConfigsOnce } from '../../slices/MasterDataSlice';
import {
  getPermissions,
  fetchPermissions,
} from '../../slices/UserPermissionSlice';
import { connect } from 'react-redux';
import Deployment from '../../containers/deployment/Deployment';
import DeploymentDetails from '../../containers/deployment/deployment-details/DeploymentDetails';
import RuleMigration from '../../containers/rules-migration/RuleMigration';
import BusinessRequirementDetail from '../../containers/business-requirement/view-business-requirement-details/ViewBusinessRequirementDetail';

interface LayoutProps {
  userPermissions?: any;
  fetchPermissions: () => void;
  fetchConfigsOnce: () => void;
}

class Layout extends Component<LayoutProps> {
  constructor(props: LayoutProps) {
    super(props);
  }

  componentDidMount(): void {
    this.props.fetchPermissions();
    this.props.fetchConfigsOnce();
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <Header />
        <GridRow>
          <Router>
            <SideNav />
            <Switch>
              <Route path="*/tasks/:id?" component={UpdateTask} />
              <Route path="*/deployments/:id" component={DeploymentDetails} />
              <Route path="*/deployment" component={Deployment} />
              <Route path="*/rulesmigration" component={RuleMigration} />
              <Route path="*/brs/:id?" component={BusinessRequirementDetail} />
              <Route path="/" component={Dashboard} />
            </Switch>
          </Router>
        </GridRow>
      </React.Fragment>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { userPermissions: getPermissions(state) };
};

export default connect(mapStateToProps, { fetchPermissions, fetchConfigsOnce })(
  Layout
);
