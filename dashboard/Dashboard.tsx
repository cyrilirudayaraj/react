import React, { Component } from 'react';
import DashboardGrid from './dashboard-grid/DashboardGrid';
import { Button, Tabs, TabPane, GridRow, GridCol } from '@athena/forge';
import { getTaskList, getTaskCountByQueue } from '../../services/CommonService';
import Messages from '../../constants/Messages';
import CreateTask from '../task/create-task/CreateTask';
import { RouteComponentProps } from 'react-router-dom';
import Labels from '../../constants/Labels';
import AppConstants from '../../constants/AppConstants';
import './Dashboard.scss';
import DashboardPaginator from './DashboardPaginator';
import ReportDownload from '../report/GenerateReport';
import { cloneDeep, get, isEmpty } from 'lodash';
import { filter } from 'lodash';
import { WorkFlowFilterType, StatusFilterType, TaskType } from '../../types';
import StatusTag from '@athena/forge/StatusTag';
import WFEnableForPermission from '../../components/wf-enableforpermission/WFEnableForPermission';
import Acl from '../../constants/Acl';
import WFShowForPermission from '../../components/wf-showforpermission/WFShowForPermission';
import AdvancedSearch from './advanced-search/AdvancedSearch';
import { connect } from 'react-redux';
import {
  getWorkflowSteps,
  fetchWorkflowStepsOnce,
  getStatusList,
  fetchStatusListOnce,
  getTaskTypes,
  fetchTaskTypesOnce,
  getPriorities,
} from '../../slices/MasterDataSlice';

const reportContentClassName =
  'fe_u_flex-container  fe_u_margin--top-small fe_u_margin--right-small fe_u_margin--bottom-xsmall flex-direction';
const createTaskClassName =
  'fe_u_flex-container fe_u_margin--small flex-direction';
const ALL = Labels.DASHBOARD_GRID.ALL;
const {
  MY_TASK_INBOX,
  READY_FOR_REVIEW,
  READY_FOR_MODELING,
  READY_FOR_DEV,
  READY_FOR_TESTING,
  ALL_TASKS,
  READY_FOR_DEPLOYMENT,
} = AppConstants.UI_CONSTANTS.DASHBOARD_QUEUE_TAB_INDEX;

const { ASSIGNED_TO_ME, UNASSIGNED, PAGE_SIZE } = AppConstants.SERVER_CONSTANTS;

export interface DashboardProps extends RouteComponentProps {
  workflowSteps?: any;
  statusList?: any;
  taskTypes?: any;
  fetchWorkflowStepsOnce: any;
  fetchStatusListOnce: any;
  fetchTaskTypesOnce: any;
  priorities?: any;
}
export class Dashboard extends Component<DashboardProps, any> {
  state = {
    total: 0,
    currentPage: 0,
    filters: {},
    showCreateTaskDialog: false,
    showReportsDialog: false,
    className: 'dashboard-tab',
    selectedIndex: MY_TASK_INBOX,
    dataSource: [],
    isSearchResultEmpty: false,
    taskTypeFilter: [],
    statusFilter: [],
    workFlowStepFilter: [],
    taskCount: {},
    sortBy: null,
    sortOrder: null,
    isAdvancedSearch: false,
  };
  constructor(props: any) {
    super(props);
    this.getTaskCountByQueue();

    const { history } = props;
    const { location } = history;
    const { search } = location;
    if (search) {
      let { pathname } = location;
      pathname = pathname?.replace(/home.*$/, '');
      const newLocation = { ...location, search: '', pathname };
      this.state.selectedIndex = this.getActiveTabIndexByQueryParam(search);
      history.replace(newLocation);
    }
  }
  WorkFlowStepFilterDetails: WorkFlowFilterType[] = [];
  statusFilterDetails: StatusFilterType[] = [];
  taskTypeFilterDetails: TaskType[] = [];

  getActiveTabIndexByQueryParam(queryString: string): number {
    let selectedIndex = 0;
    const { DASHBOARD_QUEUE_TAB_INDEX } = AppConstants.UI_CONSTANTS;
    const queue =
      new URLSearchParams(queryString).get('queue')?.toUpperCase() || '';
    if (DASHBOARD_QUEUE_TAB_INDEX.hasOwnProperty(queue)) {
      selectedIndex = get(DASHBOARD_QUEUE_TAB_INDEX, queue);
    }
    return selectedIndex;
  }

  getSelectedFilterIds = (names: string[], objArray: any[]) => {
    const ids: number[] = [];
    if (names && names.length > 0) {
      objArray.forEach((obj: any) => {
        if (obj.name !== ALL && names.indexOf(obj.name) > -1) {
          ids.push(parseInt(obj.id));
        }
      });
    }
    return ids.length > 0 ? ids : null;
  };
  constructPayloadObj = (filters: any): any => {
    const ids: any = [];
    if (Array.isArray(filters)) {
      filters?.map((taskType: any) => {
        if (typeof taskType === 'object') {
          ids.push(taskType.text);
        } else {
          ids.push(taskType);
        }
      });
    }
    return ids;
  };
  onFilterChange = (values: any): void => {
    const filterData = {
      ...values,
      taskTypeIds: this.constructPayloadObj(values.taskTypeIds),
      statusIds: this.constructPayloadObj(values.statusIds),
      workFlowStepIds: this.constructPayloadObj(values.workFlowStepIds),
    };
    filterData.searchText = filterData.searchText.replace(/T-|t-/, '');
    this.setState({ filters: filterData, currentPage: 0 }, () => {
      this.getTasks(filterData);
    });
  };

  getAllOptionObj = (): any => {
    return {
      id: Labels.DASHBOARD_GRID.ALL,
      name: Labels.DASHBOARD_GRID.ALL,
      description: Labels.DASHBOARD_GRID.ALL,
    };
  };

  componentDidMount(): void {
    this.props.fetchWorkflowStepsOnce();
    this.props.fetchStatusListOnce();
    this.props.fetchTaskTypesOnce();
    if (this.state.selectedIndex === MY_TASK_INBOX) {
      this.getTasks();
    }
  }

  componentDidUpdate(prevProps: DashboardProps): void {
    if (
      !isEmpty(this.props.workflowSteps) &&
      isEmpty(this.state.workFlowStepFilter)
    ) {
      this.WorkFlowStepFilterDetails = this.props.workflowSteps;
      this.setWorkflowStepFilter(this.state.selectedIndex, () => {
        // This callback is used to load tasks if the queue is not my inbox
        if (
          isEmpty(prevProps.workflowSteps) &&
          this.state.selectedIndex !== MY_TASK_INBOX
        ) {
          this.getTasks();
        }
      });
    }

    if (!isEmpty(this.props.statusList) && isEmpty(this.state.statusFilter)) {
      const statusList = cloneDeep(this.props.statusList);
      statusList.forEach((status: any) => {
        if (status.workFlowStepQueueIds) {
          status.workFlowStepQueueIds = status.workFlowStepQueueIds.split(',');
        }
      });
      this.statusFilterDetails = statusList;
      this.setStatusFilter(this.state.selectedIndex);
    }

    if (!isEmpty(this.props.taskTypes) && isEmpty(this.state.taskTypeFilter)) {
      const taskTypes = cloneDeep(this.props.taskTypes);
      taskTypes.unshift(this.getAllOptionObj());
      this.taskTypeFilterDetails = taskTypes;
      const dataSource = taskTypes.map((obj: any) => obj.name);
      this.setState({ taskTypeFilter: dataSource });
    }
  }

  setCurrentPage = (pageIndex: number): void => {
    this.setState({ currentPage: pageIndex }, () => {
      this.getTasks(this.state.filters);
    });
  };

  getRequestPayload = (filterValues: any): any => {
    const offset = this.state.currentPage * PAGE_SIZE;
    const limit = PAGE_SIZE;
    let unassigned = null,
      allTask = null,
      assignedToMe = null,
      sortBy = null,
      sortOrder = null;
    if (
      isEmpty(filterValues) ||
      filterValues.workFlowStepIds === null ||
      filterValues.workFlowStepIds.indexOf(Labels.DASHBOARD_GRID.ALL) > -1
    ) {
      filterValues.workFlowStepIds = this.getSelectedFilterIds(
        [...this.state.workFlowStepFilter],
        [...this.WorkFlowStepFilterDetails]
      );
      if (
        this.state.selectedIndex === ALL_TASKS ||
        this.state.selectedIndex === MY_TASK_INBOX
      ) {
        filterValues.workFlowStepIds = null;
      }
    } else {
      filterValues.workFlowStepIds = this.getSelectedFilterIds(
        filterValues.workFlowStepIds,
        [...this.WorkFlowStepFilterDetails]
      );
      if (
        this.state.selectedIndex !== ALL_TASKS &&
        this.state.selectedIndex !== MY_TASK_INBOX
      ) {
        filterValues.workFlowStepIds = filterValues.workFlowStepIds
          ? filterValues.workFlowStepIds
          : this.getSelectedFilterIds(
              [...this.state.workFlowStepFilter],
              [...this.WorkFlowStepFilterDetails]
            );
      }
    }
    filterValues.statusIds = this.getSelectedFilterIds(filterValues.statusIds, [
      ...this.statusFilterDetails,
    ]);
    filterValues.priorityIds = this.getSelectedFilterIds(
      filterValues.priorityIds,
      [...this.props.priorities]
    );
    filterValues.taskTypeIds = this.getSelectedFilterIds(
      filterValues.taskTypeIds,
      [...this.taskTypeFilterDetails]
    );
    switch (this.state.selectedIndex) {
      case MY_TASK_INBOX:
        assignedToMe = ASSIGNED_TO_ME;
        break;
      case READY_FOR_REVIEW:
        unassigned = UNASSIGNED;
        break;
      case READY_FOR_MODELING:
        unassigned = UNASSIGNED;
        break;
      case READY_FOR_DEV:
        unassigned = UNASSIGNED;
        break;
      case READY_FOR_TESTING:
        unassigned = UNASSIGNED;
        break;
      case ALL_TASKS:
        allTask = 1;
        break;
      case READY_FOR_DEPLOYMENT:
        unassigned = UNASSIGNED;
        break;
    }
    if (
      this.state.selectedIndex === MY_TASK_INBOX &&
      filterValues.assignedToMe === 0 &&
      filterValues.createdByMe === 0 &&
      filterValues.signedOffByMe === 0
    ) {
      filterValues.assignedToMe = 1;
    }
    sortBy = this.state.sortBy;
    sortOrder = this.state.sortOrder;

    return {
      assignedToMe,
      unassigned,
      offset,
      limit,
      allTask,
      ...filterValues,
      sortBy,
      sortOrder,
    };
  };

  getTasks = (values: any = {}): void => {
    const payload = this.getRequestPayload({ ...values });
    this.setState({ isSearchResultEmpty: false });
    return getTaskList(payload).then((response: any) => {
      this.setState({ dataSource: response.result, total: response.total });
      if (!response.result || response.result.length <= 0) {
        this.setState({ isSearchResultEmpty: true });
      }
    });
  };

  sortTasks = (sortBy: string, sortOrder: string): void => {
    if (this.state.sortBy !== sortBy || this.state.sortOrder !== sortOrder) {
      this.setState({ currentPage: 0 });
    }
    this.setState({ sortBy: sortBy, sortOrder: sortOrder }, () => {
      this.getTasks(this.state.filters);
    });
  };

  getTaskCountByQueue = (): void => {
    getTaskCountByQueue().then((response: any) => {
      this.setState({ taskCount: response });
    });
  };

  tabChangeHandler = (event: any): void => {
    const clickedTabIndex = parseInt(event.target.value);
    if (this.state.selectedIndex === clickedTabIndex) {
      return;
    }
    this.setWorkflowStepFilter(clickedTabIndex);
    this.setStatusFilter(clickedTabIndex);
    this.setState(
      {
        selectedIndex: clickedTabIndex,
        filters: {},
        currentPage: 0,
        sortBy: null,
        sortOrder: null,
      },
      () => {
        this.getTasks();
      }
    );
  };

  setWorkflowStepFilter = (selectedIndex: number, callback?: any) => {
    this.setState(
      {
        workFlowStepFilter: this.getWorkflowStepFilterOptions(selectedIndex),
      },
      callback
    );
  };

  getAllWorkflowStepFilterOptions(): string[] {
    return this.getWorkflowStepFilterOptions(ALL_TASKS);
  }

  getWorkflowStepFilterOptions(selectedIndex: number): string[] {
    let datasource: any[] = [...this.WorkFlowStepFilterDetails];
    if (selectedIndex !== MY_TASK_INBOX && selectedIndex !== ALL_TASKS) {
      datasource = filter(this.WorkFlowStepFilterDetails, {
        workFlowStepQueueId: (selectedIndex + 1).toString(),
      });
    }
    datasource.unshift(this.getAllOptionObj());
    return datasource.map((obj) => obj.name);
  }

  setStatusFilter = (selectedIndex: number): void => {
    this.setState({
      statusFilter: this.getStatusFilterOptions(selectedIndex),
    });
  };

  getAllStatusFilterOptions(): string[] {
    return this.getStatusFilterOptions(ALL_TASKS);
  }

  getStatusFilterOptions(selectedIndex: number): string[] {
    let datasource: any[] = [...this.statusFilterDetails];
    if (selectedIndex !== ALL_TASKS) {
      datasource = datasource.filter(({ workFlowStepQueueIds }) => {
        if (workFlowStepQueueIds) {
          return workFlowStepQueueIds.some(
            (id: string) => parseInt(id.trim()) === selectedIndex + 1
          );
        }
      });
    }
    datasource.unshift(this.getAllOptionObj());
    return datasource.map((obj) => obj.name);
  }

  onCreateTask = (): void => {
    this.setState({ showCreateTaskDialog: true });
  };

  onCloseCreateTask = (): void => {
    this.setState({ showCreateTaskDialog: false });
  };

  renderCreateTaskDialog(): JSX.Element | undefined {
    if (this.state.showCreateTaskDialog) {
      return (
        <CreateTask
          onCloseCreateTask={this.onCloseCreateTask}
          history={this.props.history}
        />
      );
    }
  }

  onNewReport = (): void => {
    this.setState({ showReportsDialog: true });
  };

  onCloseReport = (): void => {
    this.setState({ showReportsDialog: false });
  };

  renderReportsDialog(): JSX.Element | undefined {
    if (this.state.showReportsDialog) {
      return (
        <ReportDownload
          onCloseReport={this.onCloseReport}
          history={this.props.history}
        />
      );
    }
  }

  getDashboardGridTemplate = (emptyMessage?: string): JSX.Element => {
    const message = this.state.isSearchResultEmpty
      ? emptyMessage || Messages.NO_RECORDS_FOUND
      : undefined;
    return (
      <DashboardGrid
        dataSource={this.state.dataSource}
        searchResultEmptyMessage={message}
        selectedTabIndex={this.state.selectedIndex}
        taskTypeFilter={this.state.taskTypeFilter}
        statusFilter={this.state.statusFilter}
        workFlowStepFilter={this.state.workFlowStepFilter}
        onFilter={this.onFilterChange}
        onSort={this.sortTasks}
        isAdvancedSearch={this.state.isAdvancedSearch}
      />
    );
  };

  getTabTemplate = (): JSX.Element => {
    const taskCount: any = this.state.taskCount;
    const template = (
      <WFShowForPermission permission={Acl.TASK_LIST}>
        <Tabs
          selectedIndex={this.state.selectedIndex}
          onTabsChange={this.tabChangeHandler}
        >
          <TabPane label={Labels.DASHBOARD.MY_TASK_INBOX} padded={false}>
            {this.getDashboardGridTemplate(Messages.EMPTY_TASK_INBOX)}
          </TabPane>
          <TabPane
            label={
              <React.Fragment>
                {Labels.DASHBOARD.READY_FOR_REVIEW}{' '}
                <StatusTag text={taskCount.readyForReview} />
              </React.Fragment>
            }
            padded={false}
          >
            {this.getDashboardGridTemplate()}
          </TabPane>
          <TabPane
            label={
              <React.Fragment>
                {Labels.DASHBOARD.READY_FOR_MODELING}{' '}
                <StatusTag text={taskCount.readyForModeling} />
              </React.Fragment>
            }
            padded={false}
          >
            {this.getDashboardGridTemplate()}
          </TabPane>
          <TabPane
            label={
              <React.Fragment>
                {Labels.DASHBOARD.READY_FOR_DEV}{' '}
                <StatusTag text={taskCount.readyForDev} />
              </React.Fragment>
            }
            padded={false}
          >
            {this.getDashboardGridTemplate()}
          </TabPane>
          <TabPane
            label={
              <React.Fragment>
                {Labels.DASHBOARD.READY_FOR_TESTING}{' '}
                <StatusTag text={taskCount.readyForTesting} />
              </React.Fragment>
            }
            padded={false}
          >
            {this.getDashboardGridTemplate()}
          </TabPane>
          <TabPane
            label={
              <React.Fragment>
                {Labels.DASHBOARD.READY_FOR_DEPLOYMENT}{' '}
                <StatusTag text={taskCount.readyForDeployment} />
              </React.Fragment>
            }
            padded={false}
          >
            {this.getDashboardGridTemplate()}
          </TabPane>
        </Tabs>
      </WFShowForPermission>
    );
    const advancedSearchResultTpl = (
      <div className="margin-top-medium">{this.getDashboardGridTemplate()}</div>
    );
    return this.state.isAdvancedSearch ? advancedSearchResultTpl : template;
  };

  getTopCreateOptionTemplate = (): JSX.Element => {
    const totalRecordsMsg = this.state.total + Messages.RECORDS_FOUND;
    return (
      <div>
        <GridRow removeGuttersSmall={true} className="header-row">
          <GridCol width={{ small: 6 }}>
            <WFEnableForPermission permission={Acl.TASK_SEARCH}>
              <AdvancedSearch
                onSearch={this.onAdvancedSearch}
                taskTypeFilter={this.state.taskTypeFilter}
                statusFilter={this.getAllStatusFilterOptions()}
                workFlowStepFilter={this.getAllWorkflowStepFilterOptions()}
                priorities={this.props.priorities}
              />
            </WFEnableForPermission>
          </GridCol>
          <GridCol width={{ small: 6 }}>
            <div className={createTaskClassName}>
              <WFEnableForPermission permission={Acl.TASK_CREATE}>
                <Button
                  text={Labels.DASHBOARD.CREATE_TASK}
                  variant="primary"
                  size="medium"
                  onClick={this.onCreateTask}
                />
              </WFEnableForPermission>
            </div>
          </GridCol>
        </GridRow>
        <GridRow removeGuttersSmall={true}>
          <GridCol width={{ small: 6 }}>
            {this.state.isAdvancedSearch && (
              <div className="total-records-msg">{totalRecordsMsg}</div>
            )}
          </GridCol>
          <GridCol width={{ small: 6 }}>
            <div className={reportContentClassName}>
              <div className="report-download">
                <WFEnableForPermission permission={Acl.REPORTS_READ}>
                  <Button
                    text={Labels.DASHBOARD.REPORTS}
                    variant="tertiary"
                    icon="Download"
                    onClick={this.onNewReport}
                  />
                </WFEnableForPermission>
              </div>
            </div>
          </GridCol>
        </GridRow>
      </div>
    );
  };

  renderPaginator(): any {
    const { total, currentPage } = this.state;
    if (this.state.dataSource.length > 0) {
      return (
        <WFShowForPermission permission={Acl.TASK_LIST}>
          <DashboardPaginator
            total={total}
            currentPage={currentPage}
            pageSize={PAGE_SIZE}
            onPageChange={this.setCurrentPage}
          />
        </WFShowForPermission>
      );
    }
  }

  onAdvancedSearch = (value: any) => {
    this.setState(
      {
        isAdvancedSearch: true,
        selectedIndex: ALL_TASKS,
        filters: {},
        currentPage: 0,
        sortBy: null,
        sortOrder: null,
      },
      () => {
        const payload = {
          ...value,
          priorityIds: this.constructPayloadObj(value.priorityIds),
        };
        this.onFilterChange(payload);
      }
    );
  };

  render(): JSX.Element {
    return (
      <div className="dashboard">
        {this.getTopCreateOptionTemplate()}
        <div className={this.state.className}>{this.getTabTemplate()}</div>
        {this.renderPaginator()}
        {this.renderCreateTaskDialog()}
        {this.renderReportsDialog()}
        <div id="toast-container"></div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    workflowSteps: getWorkflowSteps(state),
    statusList: getStatusList(state),
    taskTypes: getTaskTypes(state),
    priorities: getPriorities(state),
  };
};

const mapDispatchToProps = {
  fetchWorkflowStepsOnce,
  fetchStatusListOnce,
  fetchTaskTypesOnce,
};

export default connect(mapStateToProps, mapDispatchToProps)(Dashboard);
