import { Banner, BannerItem, TabPane, Tabs } from '@athena/forge';
import React, { useEffect, useState } from 'react';
import Labels from '../../constants/Labels';
import DeploymentList from './deployment-list/DeploymentList';
import {
  getDeploymentStatuses,
  fetchDeploymentStatusesOnce,
} from '../../slices/DeploymentSlice';
import { connect } from 'react-redux';
import { fetchUsersOnce, getUsers } from '../../slices/MasterDataSlice';
import { cloneDeep, isEmpty } from 'lodash';
import ConversionUtil from '../../utils/ConversionUtil';

import DeploymentTaskList from './deployment-task-list/DeploymentTaskList';
import AppConstants from '../../constants/AppConstants';
import { getDeployments } from '../../services/CommonService';
import './Deployment.scss';
import StringUtil from '../../utils/StringUtil';
import { Link } from 'react-router-dom';
import { Deployment as DeploymentType } from '../../types';
import DeploymentDetailsComponent from './deployment-details/DeploymentDetails';

interface DeploymentDetailsType {
  decisionServiceName: string;
  username: string;
  password: string;
  deployment: any;
}

function Deployment(props: any): JSX.Element {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tabIndexVal, setTabIndexVal] = useState(0);
  const [releasedByFilter, setReleasedByFilter] = useState<any>([]);
  const [statusFilter, setStatusFilter] = useState<any>([]);
  const delay = 5 * 1000 * 60;
  useEffect(() => {
    setSelectedIndex(tabIndexVal);
    props.fetchUsersOnce();
    props.fetchDeploymentStatusesOnce();
    getDeploymentInprogress();
    const interval = setInterval(() => {
      getDeploymentInprogress(AppConstants.UI_CONSTANTS.DEPLOY_CONFIG);
    }, delay);
    return () => clearInterval(interval);
  }, []);
  const getAllOptionObj = (): any => {
    return {
      userName: Labels.DEPLOYMENT_GRID.ALL,
    };
  };
  useEffect(() => {
    setSelectedIndex(tabIndexVal);
    if (!isEmpty(props.userList) && isEmpty(releasedByFilter)) {
      const userList = cloneDeep(props.userList);
      userList.unshift(getAllOptionObj());
      const userName = ConversionUtil.convertMapToDropDownList(
        userList,
        'userName'
      );
      setReleasedByFilter(userName);
    }

    if (!isEmpty(props.deploymentStatuses) && isEmpty(statusFilter)) {
      let deploymentStatusList: any[] = [];
      deploymentStatusList = props.deploymentStatuses?.map(
        (status: any) => status.name
      );
      const statusTypes = cloneDeep(deploymentStatusList);
      statusTypes.unshift('All');
      setStatusFilter(statusTypes);
    }
  });

  const [deploymentDetails, setDeploymentDetails] = useState<
    DeploymentDetailsType | undefined
  >({
    decisionServiceName: '',
    username: '',
    password: '',
    deployment: undefined,
  });

  const [isDeployed, setIsDeployed] = useState(false);
  const [deploymentInprogress, setdeploymentInprogress] = useState<
    DeploymentType[]
  >([]);

  const handleTabsChange = (e: any) => {
    const value = e.target.value;
    setTabIndex(parseInt(value));
    getDeploymentInprogress();
  };

  const setTabIndex = (index: number) => {
    setSelectedIndex(index);
    setTabIndexVal(index);
  };

  const getDeploymentInprogress = (config?: any) => {
    getDeployments(
      {
        statusIds: [
          AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES.IN_PROGRESS,
        ],
      },
      config
    ).then((response: any) => {
      setdeploymentInprogress(response);
    });
  };

  const getDeploymentInprogressIds = () => {
    let formatDeploymentId = '';
    const ids: string[] = [];
    if (deploymentInprogress && deploymentInprogress.length > 0) {
      deploymentInprogress.forEach((deployment: any, index: number) => {
        ids[index] = StringUtil.formatDeploymentID(deployment.id);
      });
      formatDeploymentId = ids.join(', ');
    }
    return formatDeploymentId;
  };

  const handelDeploymentSuccessEvent = (
    deploymentDetails: DeploymentDetailsType
  ) => {
    setDeploymentDetails(deploymentDetails);
    setIsDeployed(true);
  };

  const handelBackButton = () => {
    getDeploymentInprogress();
    setDeploymentDetails(undefined);
    setIsDeployed(false);
  };

  const getBannerTemplate = () => {
    return deploymentInprogress.length < 1 ? (
      <React.Fragment></React.Fragment>
    ) : (
      <div className="deployment-inprogress-banner">
        <Banner>
          <BannerItem
            headerText={
              Labels.DEPLOYMENT_GRID.DEPLOYMENT +
              AppConstants.UI_CONSTANTS.WHITE_SPACE +
              getDeploymentInprogressIds() +
              AppConstants.UI_CONSTANTS.WHITE_SPACE +
              Labels.DEPLOY.IN_PROGRESS
            }
            {...{ className: 'banner-header' }}
          >
            <Link
              className="deployment-id-link"
              to={
                process.env.REACT_APP_BASE_CONTEXT_PATH +
                `deployments/${deploymentInprogress[0].id}`
              }
            >
              {Labels.DEPLOY.VIEW}
            </Link>
          </BannerItem>
        </Banner>
      </div>
    );
  };

  const getComponentTemplate = () => {
    return isDeployed ? (
      <DeploymentDetailsComponent
        decisionServiceName={deploymentDetails?.decisionServiceName}
        username={deploymentDetails?.username}
        password={deploymentDetails?.password}
        deployment={deploymentDetails?.deployment}
        onBack={handelBackButton}
      />
    ) : (
      <div className="fe_u_padding--top-large deployment">
        <div className="deployment-header">
          <span>{Labels.DEPLOY.DEPLOYMENT_WORKLIST}</span>
        </div>
        {getBannerTemplate()}
        <Tabs selectedIndex={selectedIndex} onTabsChange={handleTabsChange}>
          <TabPane label={Labels.DEPLOY.TASKS_AVAILABLE_TO_DEPLOY} padded>
            <DeploymentTaskList
              isDeploymentInprogress={deploymentInprogress.length > 0}
              handleDeploymentInprogressValidation={getDeploymentInprogress}
              handelDeploymentSuccessEvent={handelDeploymentSuccessEvent}
            />
          </TabPane>
          <TabPane label={Labels.DEPLOY.DEPLOYMENTS} padded>
            <DeploymentList
              statusFilter={statusFilter}
              releasedByFilter={releasedByFilter}
              deploymentStatuses={props.deploymentStatuses}
              handleDeploymentInprogressValidation={getDeploymentInprogress}
            />
          </TabPane>
        </Tabs>
      </div>
    );
  };
  return <React.Fragment>{getComponentTemplate()}</React.Fragment>;
}
const mapDispatchToProps = {
  fetchUsersOnce,
  fetchDeploymentStatusesOnce,
};
const mapStateToProps = (state: any) => {
  return {
    deploymentStatuses: getDeploymentStatuses(state),
    userList: getUsers(state),
  };
};
export default connect(mapStateToProps, mapDispatchToProps)(Deployment);
