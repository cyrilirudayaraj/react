import React, { Component } from 'react';
import AppConstants from '../../../constants/AppConstants';

import './DeploymentTaskList.scss';
import { getTaskList } from '../../../services/CommonService';
import * as Yup from 'yup';
import DeploymentTaskListGrid from './deployment-task-grid/DeploymentTaskListGrid';
import { TaskDTDetails } from '../../../types';
import { getConfigInfo } from '../../../slices/MasterDataSlice';
import { deploy } from '../../../services/CommonService';
import { connect } from 'react-redux';
import WFShowForPermission from '../../../components/wf-showforpermission/WFShowForPermission';
import Acl from '../../../constants/Acl';
import NewDeployment from '../deployment-actions/NewDeployment';

interface DeploymentTaskListProps {
  isDeploymentInprogress: boolean;
  decisionServiceInfo?: any;
  handleDeploymentInprogressValidation?: any;
  handelDeploymentSuccessEvent?: any;
}

interface DeploymentTaskListState {
  dataSource: TaskDTDetails[];
  selectedTasks: string[];
  showDeploymentTaskListDialog: boolean;
  decisionServiceName: string;
}

class DeploymentTaskList extends Component<
  DeploymentTaskListProps,
  DeploymentTaskListState
> {
  state = {
    dataSource: [],
    selectedTasks: [],
    showDeploymentTaskListDialog: false,
    decisionServiceName: this.props.decisionServiceInfo?.textValue,
    username: '',
    password: '',
    isDeployed: false,
    deployment: undefined,
  };

  validationSchema = Yup.object().shape({
    username: Yup.string().required('Required!'),
    password: Yup.string().required('Required!'),
  });

  constructor(props: any) {
    super(props);
    this.getDeployTaskList();
  }

  getDeployTaskList = () => {
    getTaskList({
      statusIds: [AppConstants.SERVER_CONSTANTS.STATUSES.READY_TO_DEPLOY],
    }).then((response: any) => {
      if (response && response.result && response.result.length > 0) {
        this.setState({
          dataSource: response.result,
        });
      }
    });
  };

  componentDidUpdate(prevProps: DeploymentTaskListProps): void {
    if (
      prevProps.decisionServiceInfo?.textValue !==
      this.props.decisionServiceInfo?.textValue
    ) {
      this.setState({
        decisionServiceName: this.props.decisionServiceInfo?.textValue,
      });
    }
  }

  onSubmit = (payload: any): void => {
    payload['taskIds'] = [...this.state.selectedTasks];
    deploy(payload).then((response: any) => {
      this.props.handelDeploymentSuccessEvent({
        username: payload.username,
        password: payload.password,
        deployment: response,
        decisionServiceName: this.state.decisionServiceName,
      });
    });
  };

  handleCheckBoxEvent = (element: any, rowData: any) => {
    const selectedTasks: string[] = [...this.state.selectedTasks];
    const rows = document.getElementsByTagName('tr');
    let rowClassName = 'selected-row-color';
    if (element.target.checked) {
      selectedTasks.push(element.target.id);
    } else {
      const index = selectedTasks.indexOf(element.target.id);
      selectedTasks.splice(index, 1);
      rowClassName = '';
      const checkAllElement: any = document.getElementById(
        'select-all-checkbox'
      );
      if (checkAllElement) checkAllElement.checked = false;
    }
    rows[rowData.rowIndex + 1].className = rowClassName;
    this.setState((state: any) => {
      return { selectedTasks: [...selectedTasks] };
    });
  };

  handleSelectAllCheckBoxEvent = (element: any) => {
    const rows = document.getElementsByTagName('tr');
    let rowClassName = 'selected-row-color';
    const allInputElement = document.getElementsByTagName('input');
    for (let i = 0; i < allInputElement.length; i++) {
      if (allInputElement[i].type === 'checkbox') {
        allInputElement[i].checked = element.target.checked;
      }
    }
    if (element.target.checked) {
      const taskIds = this.state.dataSource.map((task: any) => task.taskId);
      this.setState({
        selectedTasks: [...taskIds],
      });
    } else {
      this.setState({
        selectedTasks: [],
      });
      rowClassName = '';
    }
    for (let i = 1; i < rows.length; i++) {
      rows[i].className = rowClassName;
    }
  };

  getComponentTemplate = () => {
    return (
      <div className="deployment-task-list">
        <React.Fragment>
          <div>
            <WFShowForPermission permission={Acl.TASK_DEPLOY}>
              <NewDeployment
                disabled={
                  this.props.isDeploymentInprogress ||
                  this.state.selectedTasks.length <= 0
                }
                onDeploy={this.onSubmit}
                selectedTasks={this.state.selectedTasks}
                decisionServiceName={this.state.decisionServiceName}
              />
            </WFShowForPermission>
          </div>
          <div className="table-style">
            <DeploymentTaskListGrid
              dataSource={this.state.dataSource}
              onSelectAllCheckbox={this.handleSelectAllCheckBoxEvent}
              onSelectCheckbox={this.handleCheckBoxEvent}
            />
          </div>
        </React.Fragment>
      </div>
    );
  };

  render() {
    return <React.Fragment>{this.getComponentTemplate()}</React.Fragment>;
  }
}

const mapStateToProps = (state: any) => {
  return {
    decisionServiceInfo: getConfigInfo(
      state,
      AppConstants.SERVER_CONSTANTS.CONFIG_KEYS.ODM_DC_DECISIONSERVICE_NAME
    ),
  };
};

export default connect(mapStateToProps)(DeploymentTaskList);
