import React, { Component } from 'react';
import Labels from '../../../../constants/Labels';
import {
  Multiselect,
  Card,
  GridRow,
  GridCol,
  StatusTag,
  Table,
} from '@athena/forge';
import ConversionUtil from '../../../../utils/ConversionUtil';
import './ViewAssociatedTask.scss';
import { isEmpty, cloneDeep } from 'lodash';
import WarningIcon from '../../../../components/warning-icon/WarningIcon';
import StringUtil from '../../../../utils/StringUtil';
import WFReadOnlyInput from '../../../../components/wf-readonlyinput/WFReadOnlyInput';
import AppConstants from '../../../../constants/AppConstants';
import Messages from '../../../../constants/Messages';
import { getBusinessRequirementDetail } from '../../../../slices/BusinessRequirementSlice';
import { connect } from 'react-redux';
import { Link } from 'react-router-dom';
interface ViewAssociatedTaskProps {
  associatedBRTasks: any;
}

export class ViewAssociatedTask extends Component<ViewAssociatedTaskProps> {
  state = {
    associatedTasks: [],
    filteredTasks: [],
    taskRelatedStatus: [],
    statusList: [],
    currentFilter: {
      statusFilter: [],
    },
    isStatusFilterOpen: false,
    escalatedMessage: '',
    isEscalated: false,
  };
  constructor(props: any) {
    super(props);
  }
  static getDerivedStateFromProps(prevProps: any, prevState: any) {
    if (isEmpty(prevState.associatedTasks)) {
      if (!isEmpty(prevProps.associatedBRTasks)) {
        const uniqueStatusList: any = [];
        const statusList = prevProps.associatedBRTasks?.map(
          (associatedTask: any) => {
            return {
              id: associatedTask.statusId,
              name: associatedTask.statusName,
            };
          }
        );
        statusList.forEach((x: any) => {
          if (
            !uniqueStatusList?.some(
              (y: any) => JSON.stringify(y) === JSON.stringify(x)
            )
          ) {
            uniqueStatusList?.push(x);
          }
        });
        let taskStatusList: any[] = [];
        taskStatusList = uniqueStatusList?.map((status: any) => status.name);
        const statusTypes = cloneDeep(taskStatusList);
        statusTypes.unshift('All');
        const returnState: any = {
          taskRelatedStatus: statusTypes,
          statusList: uniqueStatusList,
          currentFilter: { statusFilter: statusTypes },
          associatedTasks: prevProps.associatedBRTasks,
          filteredTasks: prevProps.associatedBRTasks,
        };
        return returnState;
      }
    }
  }

  handelFilterFocus = (filterName: string) => {
    switch (filterName.toUpperCase()) {
      case Labels.BUSINESS_REQUIREMENT_DETAILS.ASSOCIATED_TASK_DETAILS
        .STATUS_FILTER:
        this.setState({ isStatusFilterOpen: true });
        break;
    }
  };

  handelFilterBlur = (filterName: string) => {
    switch (filterName.toUpperCase()) {
      case Labels.BUSINESS_REQUIREMENT_DETAILS.ASSOCIATED_TASK_DETAILS
        .STATUS_FILTER:
        this.setState({ isStatusFilterOpen: false });
        break;
    }
  };
  getFilterDetailsObj = (key: string, value: any) => {
    const obj: any = { ...this.state.currentFilter };
    obj[key] = value;
    return obj;
  };
  handleChange = (event: any) => {
    const key = event.target.id;
    const values = ConversionUtil.constructPayloadObj(event.target.value);
    let filterObj: any = {};
    const filterDetails: any = this.state.currentFilter;
    if (
      values &&
      values.includes('All') &&
      filterDetails[key] &&
      !filterDetails[key].includes('All')
    ) {
      let filterSet: any[] = [];
      if (
        key.toUpperCase() ===
        Labels.BUSINESS_REQUIREMENT_DETAILS.ASSOCIATED_TASK_DETAILS
          .STATUS_FILTER
      ) {
        filterSet = [...this.state.taskRelatedStatus];
      }
      filterObj = this.getFilterDetailsObj(key, filterSet);
    } else if (
      values &&
      !values.includes('All') &&
      filterDetails[key] &&
      filterDetails[key].includes('All')
    ) {
      filterObj = this.getFilterDetailsObj(key, []);
    } else if (
      values &&
      values.includes('All') &&
      filterDetails[key] &&
      filterDetails[key].includes('All')
    ) {
      filterObj = this.getFilterDetailsObj(key, values.splice(1));
    } else {
      filterObj = this.getFilterDetailsObj(key, values);
    }
    this.setState({ currentFilter: filterObj }, () => {
      this.getStatusId();
    });
  };
  getStatusId = (): void => {
    const statusIds = this.getSelectedStatusIds(
      this.state.currentFilter.statusFilter,
      [...this.state.statusList]
    );
    const filteredBrTasks = this.state.associatedTasks.filter((task: any) =>
      statusIds?.includes(task.statusId)
    );
    this.setState({ filteredTasks: filteredBrTasks });
  };
  getSelectedStatusIds = (names: string[], objArray: any[]) => {
    const ids: string[] = [];
    if (names && names.length > 0) {
      objArray.forEach((obj: any) => {
        if (obj.name !== 'All' && names.indexOf(obj.name) > -1) {
          ids.push(obj.id);
        }
      });
    }
    return ids.length > 0 ? ids : null;
  };
  render(): JSX.Element {
    return (
      <div className="associated-tasks">
        <div className="heading">
          <h1 className="content">
            {
              Labels.BUSINESS_REQUIREMENT_DETAILS.ASSOCIATED_TASK_DETAILS
                .HEATER_TEXT
            }
          </h1>
        </div>
        <div className="fe_u_flex-container fe_u_margin--top-medium filter">
          <div className="fe_u_margin--right-medium display-flex">
            <span className="fe_u_padding--right-small fe_u_padding--top-xsmall">{`${Labels.BUSINESS_REQUIREMENT_DETAILS.ASSOCIATED_TASK_DETAILS.STATUS}: `}</span>
            <Multiselect
              className="multi-select"
              id="statusFilter"
              {...{
                menuIsOpen: this.state.isStatusFilterOpen,
                onFocus: () => {
                  this.handelFilterFocus('statusFilter');
                },
                onBlur: () => {
                  this.handelFilterBlur('statusFilter');
                },
              }}
              onChange={(event: any) => this.handleChange(event)}
              value={this.state.currentFilter.statusFilter}
              options={this.state.taskRelatedStatus}
            />
          </div>
          <div className="fe_u_margin--right-medium display-flex">
            <>
              <Table
                layout="medium"
                className="full-width"
                rows={[]}
                onSort={(event) => {
                  this.onSort(event.direction);
                }}
                columns={[
                  {
                    key: '',
                    displayName:
                      Labels.BUSINESS_REQUIREMENT_DETAILS
                        .ASSOCIATED_TASK_DETAILS.DEPLOYMENT_DATE,
                    sortable: true,
                  },
                ]}
              />
            </>
          </div>
        </div>
        <ul className="associated-task-layout">
          {this.state.filteredTasks &&
            Object.entries(this.state.filteredTasks).map(([key, value]) => (
              <Card mediaSlot={this.getHeader(value)} padded={true} key={key}>
                {this.getContent(value)}
              </Card>
            ))}
        </ul>
      </div>
    );
  }
  onSort(direction: any) {
    let sortedTaskList: any;
    if (
      direction ==
      Labels.BUSINESS_REQUIREMENT_DETAILS.ASSOCIATED_TASK_DETAILS.SORTASC
    ) {
      sortedTaskList = [...this.state.filteredTasks].sort(
        (tasbobj1: any, tasbobj2: any) => {
          const datea: any = new Date(tasbobj1.deploymentDate),
            dateb: any = new Date(tasbobj2.deploymentDate);
          return datea - dateb;
        }
      );
    }
    if (
      direction ==
      Labels.BUSINESS_REQUIREMENT_DETAILS.ASSOCIATED_TASK_DETAILS.SORTDESC
    ) {
      sortedTaskList = [...this.state.filteredTasks].sort(
        (tasbobj1: any, tasbobj2: any) => {
          const datea: any = new Date(tasbobj1.deploymentDate),
            dateb: any = new Date(tasbobj2.deploymentDate);
          return dateb - datea;
        }
      );
    }
    this.setState({ filteredTasks: sortedTaskList });
  }
  getContent(value: any): React.ReactNode {
    return <div className="br-task-name">{value.taskName}</div>;
  }
  isEscalated = (task?: any): boolean => {
    if (this.state.isEscalated && task?.escalatedYn === 'N') {
      if (task?.priorityId !== AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1) {
        this.setState({ isEscalated: false });
      } else if (this.state.escalatedMessage !== Messages.P0_TASK) {
        this.setState({ escalatedMessage: Messages.P0_TASK });
      }
    }
    if (!this.state.isEscalated) {
      if (
        task?.escalatedYn === 'Y' &&
        task?.priorityId === AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
      ) {
        this.setState({
          isEscalated: true,
          escalatedMessage: Messages.ESCALATED_P0_TASK,
        });
      } else if (
        task?.escalatedYn !== 'Y' &&
        task?.priorityId === AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
      ) {
        this.setState({
          isEscalated: true,
          escalatedMessage: Messages.P0_TASK,
        });
      } else if (
        task?.escalatedYn === 'Y' &&
        task?.priorityId !== AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
      ) {
        this.setState({
          isEscalated: true,
          escalatedMessage: Messages.ESCALATED_TASK,
        });
      }
    } else if (
      this.state.escalatedMessage === Messages.P0_TASK &&
      task?.escalatedYn === 'Y' &&
      task?.priorityId === AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
    ) {
      this.setState({
        isEscalated: true,
        escalatedMessage: Messages.ESCALATED_P0_TASK,
      });
    }
    return this.state.isEscalated;
  };

  getHeader(associatedTask: any): React.ReactNode {
    return (
      <div className="brtask-header">
        <GridRow className="fe_u_padding--top-small">
          <GridCol className="taskidfield">
            <div className="fe_c_read-only-input fe_c_form-field__input">
              <p className="fe_c_read-only-input__text">
                {this.isEscalated(associatedTask) ? (
                  <WarningIcon
                    warning={true}
                    label={'Task ID' + ' '}
                    tooltip={this.state.escalatedMessage}
                    height={22}
                    width={25}
                  />
                ) : (
                  ''
                )}
                <Link
                  className="task-id-link"
                  to={
                    process.env.REACT_APP_BASE_CONTEXT_PATH +
                    `tasks/${associatedTask.id}`
                  }
                >
                  {StringUtil.formatTaskID(associatedTask?.id)}{' '}
                </Link>
              </p>
            </div>
            <StatusTag
              className={` status_nowrap_no_transform ${StringUtil.getStatusClassName(
                associatedTask?.statusId
              )}`}
              text={associatedTask.statusName}
            />
          </GridCol>
          <GridCol>
            <WFReadOnlyInput
              labelText={Labels.TASK_OVERVIEW.DEPLOYMENT_DATE}
              text={associatedTask?.deploymentDate}
            />
          </GridCol>
        </GridRow>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    associatedBRTasks: getBusinessRequirementDetail(state).associatedBRTasks,
  };
};

export default connect(mapStateToProps)(ViewAssociatedTask);
