import { GridCol, GridRow, StatusTag } from '@athena/forge';
import { Accordion, AccordionItem, Button, Heading } from '@athena/forge';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  completeDeployment,
  deploy,
  getDeployments,
  rejectDeployment,
} from '../../../services/CommonService';
import { DeploymentDetails } from '../../../types';
import StringUtil from '../../../utils/StringUtil';
import './DeploymentDetails.scss';
import { addSuccessToast, addAttentionToast } from '../../../slices/ToastSlice';
import AppConstants from '../../../constants/AppConstants';
import Messages from '../../../constants/Messages';
import Labels from '../../../constants/Labels';
import { last, values } from 'lodash';
import SignoffDeployment from '../deployment-actions/SignoffDeployment';
import DeploymentLog from './deployment-log/DeploymentLog';
import RejectDeployment from '../deployment-actions/RejectDeployment';
import WFShowForPermission from '../../../components/wf-showforpermission/WFShowForPermission';
import Acl from '../../../constants/Acl';

interface DeploymentDetailsProps {
  decisionServiceName?: string;
  username?: string;
  password?: string;
  deployment?: DeploymentDetails;
  match?: any;
  onBack?: any;
  addSuccessToast?: any;
  addAttentionToast?: any;
}

interface DeploymentDetailsState {
  deployment: DeploymentDetails | null;
  id?: string;
}
export class DeploymentDetailsComponent extends Component<
  DeploymentDetailsProps,
  DeploymentDetailsState
> {
  constructor(props: any) {
    super(props);
    let id = null;
    if (this.props.match) {
      id = this.props.match.params.id;
    } else {
      id = this.props.deployment?.id;
    }

    this.state = {
      deployment: null,
      id,
    };
  }

  componentDidMount(): void {
    const { id } = this.state;
    if (!this.state.deployment && id) {
      getDeployments({ id }).then((deployment: DeploymentDetails) => {
        this.setState({ deployment });
      });
    }
  }

  onReject = (values: any): void => {
    const notes = { ...values };
    const { id, version } = this.state.deployment || {};
    const payload = {
      notes: notes.reason,
      id,
      version,
    };
    const { HEADER, MESSAGE } = Messages.REJECT_TASK_SUCCESS;
    rejectDeployment(payload).then((data: any) => {
      this.setState({ deployment: data });
      this.props.addSuccessToast({
        message: MESSAGE,
        headerText: HEADER,
        params: {
          id: data.id,
        },
      });
    });
  };

  onSignoff = (values: any): void => {
    completeDeployment(values).then((data): any => {
      this.setState({ deployment: data });
      this.props.addSuccessToast({
        headerText: Labels.DEPLOY.COMPLETED_HEADER,
        message: Labels.DEPLOY.COMPLETED_MESSAGE,
      });
    });
  };

  nextDeploy = (envName?: string): void => {
    this.onRedeploy(envName ? envName.split(',') : []);
  };

  onRedeploy = (envNames?: string[]): void => {
    const { id } = this.state.deployment || {};
    const { username, password, decisionServiceName } = this.props;
    const payload = {
      username,
      password,
      decisionServiceName,
      id,
      envNames,
    };
    deploy(payload).then((data: DeploymentDetails) => {
      this.setState({ deployment: data });

      const { SUCCESS } = AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES;

      if (data.envs.every((env) => env.statusId == SUCCESS)) {
        const { HEADER, MESSAGE } = Messages.DEPLOYMENT_SUCCESS;
        this.props.addSuccessToast({
          headerText: HEADER,
          message: MESSAGE,
          params: {
            id: data.id,
            envname: last(data.envs)?.name,
          },
        });
      } else {
        const { HEADER, MESSAGE } = Messages.DEPLOYMENT_FAILURE;
        this.props.addAttentionToast({
          headerText: HEADER,
          message: MESSAGE,
          params: {
            id: data.id,
            envname: last(data.envs)?.name,
          },
        });
      }
    });
  };

  validCredentials = (): boolean => {
    const { username, password } = this.props;
    return username && password ? true : false;
  };

  findNextDeployment = (deployment: DeploymentDetails): string | null => {
    const allEnvs = Object.values(
      AppConstants.SERVER_CONSTANTS.DEPLOY_ENV_NAMES
    );
    for (const index in allEnvs) {
      const envName = allEnvs[index];
      const actualDeployedEnv = deployment.envs.find(
        (env) => env.name === envName
      );

      if (actualDeployedEnv == null) {
        return envName;
      }
    }
    return null;
  };

  renderAvailableActions(): JSX.Element[] {
    const actions: JSX.Element[] = [];

    const { deployment } = this.state;
    const {
      SUCCESS,
      FAILURE,
      IN_PROGRESS,
    } = AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES;
    if (deployment && deployment.statusId == IN_PROGRESS) {
      const { envs, logs } = deployment;

      // Reject action is enabled if the task is IN_PROGRESS
      actions.push(<RejectDeployment onReject={this.onReject} />);

      const nextEnvName = this.findNextDeployment(deployment);
      if (
        nextEnvName &&
        this.validCredentials() &&
        envs.every((env) => env.statusId == SUCCESS)
      ) {
        actions.push(
          <Button
            id="nextDeploy"
            text={'Deploy to ' + nextEnvName}
            onClick={() => {
              this.nextDeploy(nextEnvName || '');
            }}
          />
        );
      }

      // Verify action is enabled if status is IN-PROGRESS and deployment success for all env
      if (
        envs.length ===
          values(AppConstants.SERVER_CONSTANTS.DEPLOY_ENV_NAMES).length &&
        envs.every((env) => env.statusId == SUCCESS)
      ) {
        actions.push(
          <SignoffDeployment
            deployResponse={deployment}
            onSignoff={this.onSignoff}
          />
        );
      }

      /*  Redeploy action is enabled if 
        status is IN_PROGRESS &
        first 4 deployment log steps are SUCCESS &
        any one of Env is FAILURE
      */
      if (
        this.validCredentials() &&
        logs.every(
          (log) => parseInt(log.ordering) > 4 || log.statusId == SUCCESS
        ) &&
        envs.some((env) => env.statusId == FAILURE)
      ) {
        actions.push(
          <Button
            id="redeploy"
            text={Labels.DEPLOY.REDEPLOY}
            onClick={this.onRedeploy}
          />
        );
      }
    }

    return actions;
  }

  renderDeployments(): JSX.Element[] {
    const response: JSX.Element[] = [];

    const { deployment } = this.state;
    if (deployment) {
      [this.state.deployment].forEach((deployment, index) => {
        if (deployment) {
          response.push(
            <AccordionItem
              key={deployment.id}
              headingText={'Deployment D-' + deployment.id}
              expanded
            >
              <DeploymentLog response={deployment} />
            </AccordionItem>
          );
        }
      });
    }
    return response;
  }

  renderDeploymentTaskIds(): JSX.Element[] {
    const taskIds: JSX.Element[] = [];
    const { deployment } = this.state;
    if (deployment) {
      deployment.tasks?.forEach((task, index) => {
        const lastIndex = deployment.tasks ? deployment.tasks.length - 1 : 0;
        taskIds.push(
          <>
            <Link
              className="task-id-link"
              to={
                process.env.REACT_APP_BASE_CONTEXT_PATH +
                `tasks/${task.id.trim()}`
              }
            >
              {StringUtil.formatTaskID(task.id)}
              {index !== lastIndex && <span>, </span>}
            </Link>
          </>
        );
      });
    }
    return taskIds;
  }

  render(): JSX.Element {
    const status = this.state.deployment?.status;
    return (
      <div className="deployment-details">
        <div>
          <Link
            className="back-link"
            to={process.env.REACT_APP_BASE_CONTEXT_PATH + 'deployment'}
          >
            <Button
              text="Back to Deployment WorkLists"
              icon="Left"
              variant="tertiary"
              className="back-btn"
              onClick={this.props.onBack}
            />
          </Link>
        </div>

        <div className="content">
          <Heading
            headingTag="h3"
            variant="subsection"
            text="Deployment Logs"
          />
          {status && <StatusTag className={`status_${status}`} text={status} />}
          <GridRow removeGuttersSmall>
            <GridCol width={{ small: 7 }}>
              <div className="deployment-task-ids">
                {this.renderDeploymentTaskIds()}
              </div>
            </GridCol>
            <GridCol width={{ small: 5 }}>
              <WFShowForPermission permission={Acl.TASK_DEPLOY}>
                <div className="fe_u_flex-container fe_u_margin--bottom-small fe_u_flex-justify-content--flex-end">
                  {this.renderAvailableActions()}
                </div>
              </WFShowForPermission>
            </GridCol>
          </GridRow>

          <Accordion>{this.renderDeployments()}</Accordion>
        </div>
      </div>
    );
  }
}

export default connect(null, { addSuccessToast, addAttentionToast })(
  DeploymentDetailsComponent
);
