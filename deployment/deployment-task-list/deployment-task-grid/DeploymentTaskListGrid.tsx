import { Checkbox, FormField, StatusTag, Table } from '@athena/forge';
import React from 'react';
import { Link } from 'react-router-dom';
import AppConstants from '../../../../constants/AppConstants';
import Labels from '../../../../constants/Labels';
import { Task } from '../../../../types';
import StringUtil from '../../../../utils/StringUtil';

interface DeploymentTaskListGridProps {
  dataSource: Task[];
  onSelectAllCheckbox: any;
  onSelectCheckbox: any;
}

const DeploymentTaskListGrid = (
  props: DeploymentTaskListGridProps
): JSX.Element => {
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

  const taskNameTemplateHandler = (taskName: string) => {
    return (
      <div className="task-name-column-width">
        <span>{taskName}</span>
      </div>
    );
  };

  const getWorkFlowStepNameTemplate = (
    workflowStepName: string,
    { rowData }: any
  ) => {
    const labels = Labels.TASK_SIGNOFF_DETAILS;
    return workflowStepName ? workflowStepName : labels.HYPHEN;
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
    return <span>{text}</span>;
  };

  const taskIdTemplateHandler = (taskId: string, rowData: any) => {
    return (
      <div className="task-checkbox">
        <FormField
          id={taskId}
          inputAs={Checkbox}
          labelText={''}
          description={''}
          onClick={(taskId: any) => props.onSelectCheckbox(taskId, rowData)}
        />
        <span className="checkbox-description">
          <Link
            className="task-id-link"
            to={process.env.REACT_APP_BASE_CONTEXT_PATH + `tasks/${taskId}`}
          >
            {StringUtil.formatTaskID(taskId)}
          </Link>
        </span>
      </div>
    );
  };

  const businessRequirementIdTemplateHandler = (
    businessRequirementId: string
  ) => {
    return (
      <span className="text-nowrap">
        {StringUtil.formatBRID(businessRequirementId)}
      </span>
    );
  };

  return (
    <React.Fragment>
      <Table
        layout="compact"
        className="full-width"
        rows={props.dataSource}
        rowKey="taskId"
        columns={[
          {
            key: 'taskId',
            displayName: Labels.DASHBOARD_GRID.TASK_ID,
            template: taskIdTemplateHandler,
            header: {
              formatters: [
                (taskId: any) => (
                  <div className="select-all-checkbox">
                    <FormField
                      id="select-all-checkbox"
                      className="font-bold"
                      inputAs={Checkbox}
                      labelText={''}
                      description={taskId}
                      onClick={(e: any) => props.onSelectAllCheckbox(e)}
                    />
                  </div>
                ),
              ],
            },
          },
          {
            key: 'taskName',
            displayName: Labels.DASHBOARD_GRID.TASK_NAME,
            template: taskNameTemplateHandler,
          },
          {
            key: 'taskTypeName',
            displayName: Labels.DASHBOARD_GRID.TASK_TYPE,
          },
          {
            key: 'statusName',
            displayName: Labels.DASHBOARD_GRID.STATUS,
            template: statusTemplateHandler,
          },
          {
            key: 'workflowStepName',
            displayName: Labels.DASHBOARD_GRID.WORKFLOW_STEP,
            template: getWorkFlowStepNameTemplate,
          },
          {
            key: 'deploymentDate',
            displayName: Labels.TASK_OVERVIEW.DEPLOYMENT_DATE,
          },
          {
            key: 'completedTaskDependencies',
            displayName: Labels.TASK_OVERVIEW.DEPENDENCIES_RELATED_TASK,
            template: taskDependenciesTemplateHandler,
          },
          {
            key: 'businessRequirementId',
            displayName: Labels.DASHBOARD_GRID.BR_ID,
            template: businessRequirementIdTemplateHandler,
          },
          {
            key: 'legacyRuleId',
            displayName: Labels.DASHBOARD_GRID.LEGACY_RULE_ID,
          },
        ]}
      />
    </React.Fragment>
  );
};

export default DeploymentTaskListGrid;
