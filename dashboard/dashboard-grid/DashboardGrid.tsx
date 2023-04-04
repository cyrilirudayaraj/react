import React, { useState, useEffect } from 'react';
import { Table, Heading, Multiselect, StatusTag, Button } from '@athena/forge';
import { Link } from 'react-router-dom';
import { Task } from '../../../types';
import './DashboardGrid.scss';
import StringUtil from '../../../utils/StringUtil';
import Labels from '../../../constants/Labels';
import Messages from '../../../constants/Messages';
import AppConstants from '../../../constants/AppConstants';
import { FormikProps, Formik } from 'formik';
import WarningIcon from '../../../components/warning-icon/WarningIcon';
import moment from 'moment';

interface DashboardGridProps {
  dataSource: Task[];
  searchResultEmptyMessage?: string;
  selectedTabIndex?: number;
  taskTypeFilter: string[];
  statusFilter: string[];
  workFlowStepFilter: string[];
  onFilter: any;
  onSort: any;
  isAdvancedSearch: any;
}

const DashBoardGrid = (props: DashboardGridProps): JSX.Element => {
  const ALL = Labels.DASHBOARD_GRID.ALL;
  const {
    ASSIGNED_TO_FILTER,
    TASK_TYPE_FILTER,
    STATUS_FILTER,
    WORK_FLOW_STEP_FILTER,
  } = Labels.DASHBOARD_GRID;

  const [filterDetails, setFilterDetails] = useState<any>({
    taskTypeFilter: [],
    statusFilter: [],
    workFlowStepFilter: [],
  });

  useEffect(() => {
    setFilterDetails({
      taskTypeFilter: props.taskTypeFilter,
      statusFilter: props.statusFilter,
      workFlowStepFilter: props.workFlowStepFilter,
    });
  }, [props.taskTypeFilter, props.statusFilter, props.workFlowStepFilter]);

  const [assignedToFilter, setAssignedToFilter] = useState<string[]>([
    Labels.DASHBOARD_GRID.ASSIGNED_TO_ME,
  ]);
  const [isAssignedToFilterOpen, setIsAssignedToFilterOpen] = useState<boolean>(
    false
  );
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState<boolean>(false);
  const [isTaskTypeFilterOpen, setIsTaskTypeFilterOpen] = useState<boolean>(
    false
  );
  const [isWorkFlowStepFilterOpen, setIsWorkFlowStepFilterOpen] = useState<
    boolean
  >(false);
  const [clearAllBtn, setClearAllBtn] = useState<boolean>(true);

  const getFilterDetailsObj = (key: string, value: any) => {
    const obj: any = { ...filterDetails };
    obj[key] = value;
    return obj;
  };

  const clearAllFilters = (formik: any) => {
    formik.resetForm();
    formik.submitForm();
    setFilterDetails({
      taskTypeFilter: props.taskTypeFilter,
      statusFilter: props.statusFilter,
      workFlowStepFilter: props.workFlowStepFilter,
    });
    setAssignedToFilter([Labels.DASHBOARD_GRID.ASSIGNED_TO_ME]);
    setClearAllBtn(true);
  };
  const constructPayloadObj = (filters: any): any => {
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
  const handleChange = (event: any, formik: any) => {
    const key = event.target.id;
    const values = constructPayloadObj(event.target.value);
    let filterObj: any = {};
    setClearAllBtn(false);
    if (
      values &&
      values.includes(ALL) &&
      filterDetails[key] &&
      !filterDetails[key].includes(ALL)
    ) {
      let filterSet: any[] = [];
      if (key.toUpperCase() === TASK_TYPE_FILTER) {
        filterSet = [...props.taskTypeFilter];
      } else if (key.toUpperCase() === STATUS_FILTER) {
        filterSet = [...props.statusFilter];
      } else if (key.toUpperCase() === WORK_FLOW_STEP_FILTER) {
        filterSet = [...props.workFlowStepFilter];
      }
      filterObj = getFilterDetailsObj(key, filterSet);
    } else if (
      values &&
      !values.includes(ALL) &&
      filterDetails[key] &&
      filterDetails[key].includes(ALL)
    ) {
      filterObj = getFilterDetailsObj(key, []);
    } else if (
      values &&
      values.includes(ALL) &&
      filterDetails[key] &&
      filterDetails[key].includes(ALL)
    ) {
      filterObj = getFilterDetailsObj(key, values.splice(1));
    } else {
      filterObj = getFilterDetailsObj(key, values);
    }
    setFilterDetails(filterObj);
    const forMValue = { ...formik.values };
    forMValue.taskTypeIds = filterObj.taskTypeFilter;
    forMValue.statusIds = filterObj.statusFilter;
    forMValue.workFlowStepIds = filterObj.workFlowStepFilter;
    formik.setValues(forMValue, true);
    formik.submitForm();
  };

  const handelFilterFocus = (filterName: string) => {
    switch (filterName.toUpperCase()) {
      case ASSIGNED_TO_FILTER:
        setIsAssignedToFilterOpen(true);
        break;
      case TASK_TYPE_FILTER:
        setIsTaskTypeFilterOpen(true);
        break;
      case STATUS_FILTER:
        setIsStatusFilterOpen(true);
        break;
      case WORK_FLOW_STEP_FILTER:
        setIsWorkFlowStepFilterOpen(true);
        break;
    }
  };

  const handelFilterBlur = (filterName: string) => {
    switch (filterName.toUpperCase()) {
      case ASSIGNED_TO_FILTER:
        setIsAssignedToFilterOpen(false);
        break;
      case TASK_TYPE_FILTER:
        setIsTaskTypeFilterOpen(false);
        break;
      case STATUS_FILTER:
        setIsStatusFilterOpen(false);
        break;
      case WORK_FLOW_STEP_FILTER:
        setIsWorkFlowStepFilterOpen(false);
        break;
    }
  };

  const getFilterTemplate = (): JSX.Element => {
    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          taskTypeIds: Labels.DASHBOARD_GRID.ALL,
          statusIds: Labels.DASHBOARD_GRID.ALL,
          workFlowStepIds: Labels.DASHBOARD_GRID.ALL,
          searchText: '',
        }}
        onSubmit={props.onFilter}
      >
        {(formik) => {
          return (
            <div className="fe_u_flex-container fe_u_margin--top-medium filter">
              <div className="filter-txt">
                <Heading
                  headingTag="h3"
                  variant="subsection"
                  text={`${Labels.DASHBOARD_GRID.FILTER_BY}: `}
                />
              </div>
              {props.selectedTabIndex ===
                AppConstants.UI_CONSTANTS.DASHBOARD_QUEUE_TAB_INDEX
                  .MY_TASK_INBOX && (
                <div className="fe_u_margin--right-medium">
                  <Multiselect
                    className="multi-select"
                    id="assignedToFilter"
                    {...{
                      menuIsOpen: isAssignedToFilterOpen,
                      onFocus: () => {
                        handelFilterFocus('assignedToFilter');
                      },
                      onBlur: () => {
                        handelFilterBlur('assignedToFilter');
                      },
                    }}
                    onChange={(event: any) =>
                      onUserRelatedOptionChange(event.target.value, formik)
                    }
                    value={assignedToFilter}
                    options={getUserRelatedOptions()}
                  />
                </div>
              )}
              <div className="fe_u_margin--right-medium display-flex">
                <span className="fe_u_padding--right-small fe_u_padding--top-xsmall">
                  {`${Labels.DASHBOARD_GRID.TASK_TYPE}: `}
                </span>
                <Multiselect
                  className="multi-select"
                  id="taskTypeFilter"
                  {...{
                    menuIsOpen: isTaskTypeFilterOpen,
                    onFocus: () => {
                      handelFilterFocus('taskTypeFilter');
                    },
                    onBlur: () => {
                      handelFilterBlur('taskTypeFilter');
                    },
                  }}
                  onChange={(event: any) => handleChange(event, formik)}
                  value={filterDetails.taskTypeFilter}
                  options={props.taskTypeFilter}
                />
              </div>
              <div className="fe_u_margin--right-medium display-flex">
                <span className="fe_u_padding--right-small fe_u_padding--top-xsmall">{`${Labels.DASHBOARD_GRID.STATUS}: `}</span>
                <Multiselect
                  className="multi-select"
                  id="statusFilter"
                  {...{
                    menuIsOpen: isStatusFilterOpen,
                    onFocus: () => {
                      handelFilterFocus('statusFilter');
                    },
                    onBlur: () => {
                      handelFilterBlur('statusFilter');
                    },
                  }}
                  onChange={(event: any) => handleChange(event, formik)}
                  value={filterDetails.statusFilter}
                  options={props.statusFilter}
                />
              </div>
              <div className="fe_u_margin--right-medium display-flex">
                <span className="fe_u_padding--right-small fe_u_padding--top-xsmall">
                  {`${Labels.DASHBOARD_GRID.WORKFLOW_STEP}: `}
                </span>
                <Multiselect
                  className="multi-select"
                  id="workFlowStepFilter"
                  {...{
                    menuIsOpen: isWorkFlowStepFilterOpen,
                    onFocus: () => {
                      handelFilterFocus('workFlowStepFilter');
                    },
                    onBlur: () => {
                      handelFilterBlur('workFlowStepFilter');
                    },
                  }}
                  onChange={(event: any) => handleChange(event, formik)}
                  value={filterDetails.workFlowStepFilter}
                  options={props.workFlowStepFilter}
                />
              </div>
              <div className="fe_u_margin--right-medium display-flex">
                <Button
                  text={Labels.DASHBOARD_GRID.CLEAR_ALL}
                  className="clear-all-btn"
                  disabled={clearAllBtn}
                  variant="tertiary"
                  onClick={() => {
                    clearAllFilters(formik);
                  }}
                />
              </div>
            </div>
          );
        }}
      </Formik>
    );
  };

  const assignedToTemplateHandler = (assignedTo: string) => {
    return assignedTo ? assignedTo : Labels.DASHBOARD_GRID.UNASSIGNED;
  };

  const getWorkFlowStepNameTemplate = (
    workflowStepName: string,
    { rowData }: any
  ) => {
    const labels = Labels.TASK_SIGNOFF_DETAILS;
    if (rowData.statusId === AppConstants.SERVER_CONSTANTS.STATUSES.REJECTED) {
      workflowStepName = labels.HYPHEN;
    }
    return workflowStepName ? workflowStepName : labels.HYPHEN;
  };

  const onUserRelatedOptionChange = (event: any, formik: FormikProps<any>) => {
    const lables = Labels.DASHBOARD_GRID;

    let createdByMe = 0;
    let signedOffByMe = 0;
    let assignedToMe = 0;
    let filterSet: any[] = [];
    if (
      event &&
      event.includes(ALL) &&
      assignedToFilter &&
      !assignedToFilter.includes(ALL)
    ) {
      filterSet = getUserRelatedOptions();
    } else if (
      event &&
      !event.includes(ALL) &&
      assignedToFilter &&
      assignedToFilter.includes(ALL)
    ) {
      filterSet = [];
    } else if (
      event &&
      event.includes(ALL) &&
      assignedToFilter &&
      assignedToFilter.includes(ALL)
    ) {
      filterSet = event.splice(1);
    } else {
      filterSet = [...event];
    }
    setAssignedToFilter(filterSet);
    if (filterSet.indexOf(ALL) > -1) {
      createdByMe = signedOffByMe = assignedToMe = 1;
    }
    if (filterSet.indexOf(lables.ASSIGNED_TO_ME) > -1) {
      assignedToMe = 1;
    }
    if (filterSet.indexOf(lables.CREATED_BY_ME) > -1) {
      createdByMe = 1;
    }
    if (filterSet.indexOf(lables.SIGNED_OFF_BY_ME) > -1) {
      signedOffByMe = 1;
    }

    formik.setValues(
      {
        ...formik.values,
        createdByMe,
        assignedToMe,
        signedOffByMe,
      },
      true
    );
    setClearAllBtn(false);
    formik.submitForm();
  };

  const getUserRelatedOptions = () => {
    const lables = Labels.DASHBOARD_GRID;
    const options = [
      lables.ALL,
      lables.ASSIGNED_TO_ME,
      lables.CREATED_BY_ME,
      lables.SIGNED_OFF_BY_ME,
    ];

    return options;
  };

  const businessRequirementIdTemplateHandler = (
    businessRequirementId: string
  ) => {
    return (
      <Link
        className="text-nowrap"
        to={
          process.env.REACT_APP_BASE_CONTEXT_PATH +
          `brs/${businessRequirementId}`
        }
      >
        {StringUtil.formatBRID(businessRequirementId)}
      </Link>
    );
  };

  const isEscalated = (taskId?: string): string => {
    let message = '';
    const task = props.dataSource.find((i) => i.taskId === taskId);
    if (
      task?.escalatedYn === 'Y' &&
      task?.priorityName === AppConstants.SERVER_CONSTANTS.PRIORITY_NAME_0
    ) {
      message = Messages.ESCALATED_P0_TASK;
    } else if (
      task?.escalatedYn !== 'Y' &&
      task?.priorityName === AppConstants.SERVER_CONSTANTS.PRIORITY_NAME_0
    ) {
      message = Messages.P0_TASK;
    } else if (
      task?.escalatedYn === 'Y' &&
      task?.priorityName !== AppConstants.SERVER_CONSTANTS.PRIORITY_NAME_0
    ) {
      message = Messages.ESCALATED_TASK;
    }
    return message;
  };

  const taskIdTemplateHandler = (taskId: string) => {
    const message = isEscalated(taskId);
    return (
      <span className="task-id-field">
        {message ? (
          <WarningIcon
            warning={true}
            label={Labels.DASHBOARD_GRID.TASK_ID}
            tooltip={message}
            height={20}
            width={20}
          />
        ) : (
          ''
        )}
        <Link
          className="task-id-link"
          to={process.env.REACT_APP_BASE_CONTEXT_PATH + `tasks/${taskId}`}
        >
          {AppConstants.UI_CONSTANTS.WHITE_SPACE +
            StringUtil.formatTaskID(taskId)}
        </Link>
      </span>
    );
  };

  const statusTemplateHandler = (statusName: string, { rowData }: any) => {
    return (
      <span>
        <StatusTag
          className={` status_nowrap_no_transform ${StringUtil.getStatusClassName(
            rowData.statusId
          )}`}
          text={statusName}
        />
      </span>
    );
  };

  const taskDependenciesTemplateHandler = (
    completedTaskDependencies: string,
    { rowData }: any
  ) => {
    const text =
      completedTaskDependencies +
      '/' +
      rowData.totalTaskDependencies +
      AppConstants.UI_CONSTANTS.WHITE_SPACE +
      AppConstants.UI_CONSTANTS.COMPLETE;
    const className =
      completedTaskDependencies === rowData.totalTaskDependencies
        ? 'dependencies-completed'
        : 'dependencies-incomplete';
    return (
      <span>
        <StatusTag
          className={` status_nowrap_no_transform ${className}`}
          text={text}
        />
      </span>
    );
  };

  const getGridColumns = (): any => {
    const gridColumn = [
      {
        key: 'taskId',
        displayName: Labels.DASHBOARD_GRID.TASK_ID,
        sortable: { reducer: (taskId: any) => parseInt(taskId) },
        template: taskIdTemplateHandler,
      },
      {
        key: 'taskName',
        displayName: Labels.DASHBOARD_GRID.TASK_NAME,
        sortable: true,
      },
      {
        key: 'taskTypeName',
        displayName: Labels.DASHBOARD_GRID.TASK_TYPE,
        sortable: true,
      },
      {
        key: 'workflowStepName',
        displayName: Labels.DASHBOARD_GRID.WORKFLOW_STEP,
        sortable: true,
        template: getWorkFlowStepNameTemplate,
      },
      {
        key: 'statusName',
        displayName: Labels.DASHBOARD_GRID.STATUS,
        sortable: true,
        template: statusTemplateHandler,
      },
      {
        key: 'assignedTo',
        displayName: Labels.DASHBOARD_GRID.ASSIGNED_TO,
        sortable: true,
        template: assignedToTemplateHandler,
      },
      {
        key: 'dueOn',
        displayName: Labels.DASHBOARD_GRID.DUE_DATE,
        sortable: { reducer: (dueOn: any) => moment(dueOn) },
      },
      {
        key: 'priorityName',
        displayName: Labels.DASHBOARD_GRID.PRIORITY,
        sortable: true,
      },
      {
        key: 'businessRequirementId',
        displayName: Labels.DASHBOARD_GRID.BR_ID,
        sortable: { reducer: (brId: any) => parseInt(brId) },
        template: businessRequirementIdTemplateHandler,
      },
      {
        key: 'legacyRuleId',
        displayName: Labels.DASHBOARD_GRID.LEGACY_RULE_ID,
        sortable: true,
      },
    ];
    if (props.isAdvancedSearch) {
      gridColumn.splice(6, 0, {
        key: 'deploymentDate',
        displayName: Labels.TASK_OVERVIEW.DEPLOYMENT_DATE,
        sortable: true,
      });
    } else {
      gridColumn.splice(10, 0, {
        key: 'lastModified',
        displayName: Labels.DASHBOARD_GRID.LAST_MODIFIED,
        sortable: { reducer: (lastModified: any) => moment(lastModified) },
      });
    }
    if (
      props.selectedTabIndex ===
      AppConstants.UI_CONSTANTS.DASHBOARD_QUEUE_TAB_INDEX.READY_FOR_DEPLOYMENT
    ) {
      gridColumn.splice(6, 1, {
        key: 'deploymentDate',
        displayName: Labels.TASK_OVERVIEW.DEPLOYMENT_DATE,
        sortable: true,
      });
      gridColumn.splice(10, 1);
      gridColumn.splice(7, 0, {
        key: 'completedTaskDependencies',
        displayName: Labels.TASK_OVERVIEW.DEPENDENCIES_RELATED_TASK,
        sortable: false,
        template: taskDependenciesTemplateHandler,
      });
    }
    return gridColumn;
  };

  let recordNotFoundContent;
  if (props.searchResultEmptyMessage) {
    recordNotFoundContent = (
      <div className="fe_u_flex-container">
        <span className="record-not-found">
          {props.searchResultEmptyMessage}
        </span>
      </div>
    );
  }
  return (
    <div className="dashboard-grid">
      {props.isAdvancedSearch ? '' : getFilterTemplate()}
      <div className="fe_u_flex-container">
        <div className="fe_u_margin--top-small full-width">
          <Table
            layout="compact"
            className="full-width"
            rows={props.dataSource}
            rowKey="taskId"
            onRow={(row, rowIndex) => {
              isEscalated(row.taskId)
                ? (rowIndex.className = 'escalated-row')
                : (rowIndex.className = '');
              return rowIndex;
            }}
            onSort={(event) => {
              props.onSort(event.column, event.direction);
            }}
            columns={getGridColumns()}
          />
        </div>
      </div>
      {recordNotFoundContent}
    </div>
  );
};

export default DashBoardGrid;
