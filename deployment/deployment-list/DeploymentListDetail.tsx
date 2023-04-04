import React from 'react';
import { Component } from 'react';
import {
  AccordionItem,
  AccordionItemHeader,
  StatusTag,
  Table,
} from '@athena/forge';
import { Link } from 'react-router-dom';
import StringUtil from '../../../utils/StringUtil';
import { getDeployments } from '../../../services/CommonService';
import Labels from '../../../constants/Labels';

import Messages from '../../../constants/Messages';
import { addSuccessToast } from '../../../slices/ToastSlice';
import {
  rejectDeployment,
  completeDeployment,
} from '../../../services/CommonService';
import { connect } from 'react-redux';
import AppConstants from '../../../constants/AppConstants';
import RejectDeployment from '../deployment-actions/RejectDeployment';
import SignoffDeployment from '../deployment-actions/SignoffDeployment';
import { DeploymentDetails, DeploymentEnv } from '../../../types';
import { values } from 'lodash';

export interface DeploymentListDetailProps {
  deploymentDetails?: any;
  addSuccessToast?: any;
  updateDeploymentDetails: any;
  handleDeploymentInprogressValidation?: any;
}
export interface DeploymentListDetailState {
  isExpanded: boolean;
  deploymentId: number;
  deploymentDetails?: DeploymentDetails | null;
}
export class DeploymentListDetail extends Component<
  DeploymentListDetailProps,
  DeploymentListDetailState
> {
  state = {
    isExpanded: false,
    deploymentId: 0,
    deploymentDetails: null,
  };

  constructor(props: any) {
    super(props);
  }

  deploymentIdTemplateHandler = (id: string) => {
    return (
      <span className="deployment-id-field">
        <Link
          className="deployment-id-link"
          to={process.env.REACT_APP_BASE_CONTEXT_PATH + `deployments/${id}`}
        >
          {StringUtil.formatDeploymentID(id)}
        </Link>
      </span>
    );
  };

  statusTemplateHandler = (status: string, statusId: string) => {
    return (
      <span>
        <StatusTag
          className={` status_nowrap_no_transform ${StringUtil.getStatusClassName(
            statusId
          )}`}
          text={status}
        />
      </span>
    );
  };

  getLayoutDetails = (id: any, event: any): any => {
    this.setState({ isExpanded: event });
    this.setState({ deploymentId: id });
  };

  componentDidUpdate() {
    if (this.state.isExpanded && !this.state.deploymentDetails) {
      const payload = { id: this.state.deploymentId };
      getDeployments(payload).then((response: any) => {
        this.setState({ deploymentDetails: response });
      });
    }
  }
  componentDidMount() {
    if (
      this.props.deploymentDetails.statusId ===
      AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES.IN_PROGRESS
    ) {
      this.getLayoutDetails(this.props.deploymentDetails.id, true);
    }
  }
  taskIdTemplateHandler = (taskId: string) => {
    return (
      <span className="task-id-field">
        <Link
          className="task-id-link"
          to={process.env.REACT_APP_BASE_CONTEXT_PATH + `tasks/${taskId}`}
        >
          {StringUtil.formatTaskID(taskId)}
        </Link>
      </span>
    );
  };

  businessRequirementIdTemplateHandler = (businessRequirementId: string) => {
    return (
      <span className="text-nowrap">
        {StringUtil.formatBRID(businessRequirementId)}
      </span>
    );
  };

  getGridColumns = (): any => {
    const gridColumn = [
      {
        key: 'id',
        displayName: 'id',
        template: this.taskIdTemplateHandler,
      },
      {
        key: 'name',
        displayName: 'name',
      },
      {
        key: 'taskTypeName',
        displayName: 'tasktype',
      },

      {
        key: 'businessRequirementId',
        displayName: 'brid',
        template: this.businessRequirementIdTemplateHandler,
      },
      {
        key: 'legacyRuleId',
        displayName: 'ruleappid',
      },
    ];
    return gridColumn;
  };

  getTaskLayout = (tasks: any) => {
    return (
      <>
        {' '}
        <Table
          layout="medium"
          className="full-width"
          rows={tasks}
          rowKey="deploymentId"
          columns={this.getGridColumns()}
        />
      </>
    );
  };
  onReject = (values: any): void => {
    const notes = { ...values };
    const { id, version } = this.props.deploymentDetails || {};
    const payload = {
      notes: notes.reason,
      id,
      version,
    };
    const { HEADER, MESSAGE } = Messages.REJECT_TASK_SUCCESS;
    rejectDeployment(payload).then((data: any) => {
      this.props.handleDeploymentInprogressValidation();
      if (data.id) {
        this.props.addSuccessToast({
          message: MESSAGE,
          headerText: HEADER,
          params: {
            id: data.id,
          },
        });
        this.setState({ deploymentDetails: data }, () => {
          this.props.updateDeploymentDetails({});
        });
      }
    });
  };
  onSignoff = (values: any): void => {
    completeDeployment(values).then((data): any => {
      this.props.handleDeploymentInprogressValidation();
      if (data.status == Labels.DEPLOY.COMPLETE_STATUS) {
        this.props.addSuccessToast({
          headerText: Labels.DEPLOY.COMPLETED_HEADER,
          message: Labels.DEPLOY.COMPLETED_MESSAGE,
        });
        this.setState({ deploymentDetails: data }, () => {
          this.props.updateDeploymentDetails({});
        });
      }
    });
  };
  isAllEnvDeploymentSucessfull = (envs: DeploymentEnv[]): boolean => {
    const { SUCCESS } = AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES;
    return (
      envs.length ===
        values(AppConstants.SERVER_CONSTANTS.DEPLOY_ENV_NAMES).length &&
      envs.every((env) => env.statusId == SUCCESS)
    );
  };
  getEnvLayout = (envs: any) => {
    return envs.map((env: any) => {
      return (
        <li key={env.id} className="environment-section">
          <div className="environment-name">
            {Labels.DEPLOYMENT_GRID.ENVIRONMENT}: {env.name}
          </div>
          <div className="rule-app-version">
            {Labels.DEPLOYMENT_GRID.RULE_APP_VERSION}: {env.resultVersion}
          </div>
        </li>
      );
    });
  };

  getButtonContainer = (envs: any) => {
    const deploymentDetails = this.state.deploymentDetails;
    if (deploymentDetails) {
      const { statusId, envs } = deploymentDetails;
      return (
        <div id="button-container" className="button-container">
          {statusId === '3' && (
            <>
              <RejectDeployment onReject={this.onReject} />
            </>
          )}

          {statusId === '3' && this.isAllEnvDeploymentSucessfull(envs) && (
            <>
              <SignoffDeployment
                deployResponse={deploymentDetails}
                onSignoff={this.onSignoff}
              />
            </>
          )}
        </div>
      );
    }
  };

  getAccordianLayout = (): JSX.Element => {
    const deploymentDetails = this.state.deploymentDetails;
    let envs, tasks;
    if (deploymentDetails) {
      //@ts-ignore
      envs = deploymentDetails.envs;
      //@ts-ignore
      tasks = deploymentDetails.tasks;
    }
    return (
      <div className="fe_u_padding--large">
        <AccordionItem
          headingText={''}
          padded={false}
          defaultExpanded={this.props.deploymentDetails.statusId === '3'}
          onExpandedChange={(event: any) => {
            this.getLayoutDetails(this.props.deploymentDetails.id, event);
          }}
        >
          <AccordionItemHeader>
            <div className="custom-accordion-header">
              <div className="deployment-id">
                {this.deploymentIdTemplateHandler(
                  this.props.deploymentDetails.id
                )}
              </div>
              <div className="status">
                {this.statusTemplateHandler(
                  this.props.deploymentDetails.status,
                  this.props.deploymentDetails.statusId
                )}
              </div>
              <div className="release-version">
                {this.props.deploymentDetails.releaseVersion}
              </div>
              <div className="released-date">
                {this.props.deploymentDetails.created}
              </div>
              <div className="released-by">
                {this.props.deploymentDetails.createdBy}
              </div>
            </div>
          </AccordionItemHeader>
          <div className="deployment-content">
            <div className="environment-layout">
              <div>
                <ul className="environment-container">
                  {envs && this.getEnvLayout(envs)}
                </ul>
              </div>
              {envs && this.getButtonContainer(envs)}
            </div>

            <div className="task-content">
              <div className="task-layout">
                {tasks && this.getTaskLayout(tasks)}
              </div>
            </div>
          </div>
        </AccordionItem>
      </div>
    );
  };
  render() {
    return <>{this.getAccordianLayout()}</>;
  }
}

export default connect(null, { addSuccessToast })(DeploymentListDetail);
