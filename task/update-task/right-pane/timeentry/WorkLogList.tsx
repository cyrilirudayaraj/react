import React, { Component } from 'react';
import { TaskDetail, TimeEntry } from '../../../../../types';
import { Accordion, AccordionItem, Icon, Tooltip } from '@athena/forge';
import { connect } from 'react-redux';
import {
  createTimeEntryLog,
  updateTimeEntryLog,
  deleteTimeEntryLog,
  getWorkLogs,
} from '../../../../../slices/TimeEntrySlice';
import AlertBtn from '../../../../../components/alert-button/AlertBtn';
import AddTimeEntry from './AddTimeEntry';
import Labels from '../../../../../constants/Labels';
import moment from 'moment';
import SortingGrouping from '../../../../../utils/SortingGrouping';
import { getActiveTaskStep, isTaskEditable } from '../../UpdateTask';
import AppConstants from '../../../../../constants/AppConstants';
import {
  fetchTaskDetails,
  getTaskDetail,
  refreshTaskList,
} from '../../../../../slices/TaskSlice';
import {
  getFormValidity,
  updateFormValidation,
} from '../../../../../slices/ValidationSlice';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import { getTaskStepsWithoutWorkLog } from '../../../../../../src/containers/task/update-task/UpdateTask';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import Acl from '../../../../../constants/Acl';

interface WorkLogListProps {
  workLogs: TimeEntry[];
  createTimeEntryLog: (values: any) => void;
  updateTimeEntryLog: (values: any) => void;
  deleteTimeEntryLog: (values: any) => void;
  fetchTaskDetails: (value: any) => any;
  refreshTaskList: (values: any) => void;
  taskdetails: TaskDetail;
  rightPaneFormvalidity: any;
  updateFormValidation: (values: any) => void;
}

function getTotalStepTime(timeentries: any): string {
  let initialTimeSpent = 0;
  timeentries.map((timeentry: any) => {
    initialTimeSpent += parseInt(timeentry.spentTimeInMins);
  });
  return ConversionUtil.convertMinsToHm(initialTimeSpent.toString());
}

export const Warning = (props: any): JSX.Element => {
  return (
    <>
      {!props.warning ? props.label : ''}
      {props.warning && (
        <Tooltip
          text={props.tooltip}
          id={props.label}
          placement="top"
          className="requirement-tip"
        >
          <Icon icon="Attention" className="requirement-icon" />
        </Tooltip>
      )}
    </>
  );
};

export class WorkLogList extends Component<WorkLogListProps> {
  constructor(props: WorkLogListProps) {
    super(props);
  }

  deleteWorkLog = (
    id?: string,
    versionNumber?: string,
    timeEntry?: any
  ): any => {
    const payload = {
      id: id,
      taskId: this.props.taskdetails.id,
      deleted: moment()
        .clone()
        .startOf('day')
        .format(AppConstants.UI_CONSTANTS.DATE_FORMAT_WORKLOG),
      version: versionNumber,
    };
    this.props.deleteTimeEntryLog(payload);
    this.refreshTaskSlice(timeEntry, false);
  };

  refreshTaskSlice = (payload: any, operation: boolean): void => {
    const taskSteps = this.props.taskdetails.taskSteps;
    const updatedTaskSteps = taskSteps.map((taskStep: any) => {
      if (payload.workflowStepId === taskStep.workflowStepId) {
        if (taskStep.totalWorkLog && parseInt(taskStep.totalWorkLog) > 0) {
          return operation === true
            ? {
                ...taskStep,
                totalWorkLog:
                  parseInt(taskStep.totalWorkLog) + payload.spentTimeInMins,
              }
            : {
                ...taskStep,
                totalWorkLog:
                  parseInt(taskStep.totalWorkLog) - payload.spentTimeInMins,
              };
        } else {
          return {
            ...taskStep,
            totalWorkLog: payload.spentTimeInMins,
          };
        }
      } else {
        return { ...taskStep };
      }
    });
    const updatedTaskDetails = {
      ...this.props.taskdetails,
      taskSteps: updatedTaskSteps,
    };
    this.props.refreshTaskList(updatedTaskDetails);
  };

  addWorkLog = (payload: any): void => {
    this.props.createTimeEntryLog({
      ...payload,
      taskId: this.props.taskdetails.id,
      taskStepId: getActiveTaskStep(this.props.taskdetails)?.id,
    });
    this.refreshTaskSlice(payload, true);
    if (getActiveTaskStep(this.props.taskdetails)?.totalWorkLog) {
      this.props?.updateFormValidation({
        isWorkLogFormValid: false,
      });
    }
  };

  updateWorkLog = (payload: any): void => {
    delete payload.workflowStepName;
    this.props.updateTimeEntryLog({
      ...payload,
      taskId: this.props.taskdetails.id,
      taskStepId: getActiveTaskStep(this.props.taskdetails)?.id,
    });
    this.refreshTaskSlice(payload, true);
  };

  getListOfTimeEntries = (timeentries: any) => {
    const canEdit = isTaskEditable(this.props.taskdetails);
    return timeentries.map((timeentry: any) => {
      return (
        <li className="worklog-container" key={timeentry.id}>
          <div className="worklog-created-container">
            <div className="created-by">
              {timeentry.spentOn} - {timeentry.createdBy}
            </div>
          </div>
          <div className="worklog-spenttime-container">
            <span className="spent-time">
              {ConversionUtil.convertMinsToHm(timeentry.spentTimeInMins)}
            </span>
          </div>
          <WFEnableForPermission permission={Acl.WORKLOG_UPDATE}>
            <AddTimeEntry
              className="edit-button"
              id="edit-button"
              headerText={Labels.WORKLOG.HEADER_TEXT_EDIT}
              context={Labels.WORKLOG.CONTEXT_EDIT}
              icon={Labels.WORKLOG.ICON_EDIT}
              variant="tertiary"
              disabled={!canEdit}
              onConfirm={this.updateWorkLog}
              timeentry={timeentry}
              activeWorkflowStepId={
                getActiveTaskStep(this.props.taskdetails)?.workflowStepId
              }
            />
          </WFEnableForPermission>
          <WFEnableForPermission permission={Acl.WORKLOG_DELETE}>
            <AlertBtn
              className="delete-button"
              primaryModalText={Labels.WORKLOG.PRIMARY_MODAL_TEXT_DELETE}
              messageText={Labels.WORKLOG.MESSAGE_TEXT_DELETE}
              headerText={
                Labels.WORKLOG.HEADER_TEXT_DELETE +
                moment(timeentry.spentOn).format('M/DD') +
                '?'
              }
              action={this.deleteWorkLog}
              variant="tertiary"
              disabled={!canEdit}
              icon={Labels.WORKLOG.ICON_DELETE}
              attachmentid={timeentry.id}
              version={timeentry.version}
              timeentry={timeentry}
            />
          </WFEnableForPermission>
        </li>
      );
    });
  };
  render(): JSX.Element {
    const activeTaskStep = getActiveTaskStep(this.props.taskdetails);
    const taskStepsWithoutWorkLog = getTaskStepsWithoutWorkLog(
      this.props.taskdetails
    );
    const canEdit = isTaskEditable(this.props.taskdetails);
    const worklogList = Object.entries(
      SortingGrouping.sortAndGroupByWorkflowStepId(this.props.workLogs)
    );
    taskStepsWithoutWorkLog.map((taskStep: any) =>
      worklogList.push([taskStep.name, []])
    );
    const workflowStepsList: any = [];
    this.props.taskdetails.taskSteps.map((task) =>
      workflowStepsList.push(task.name)
    );

    return (
      <>
        <div className="worklog-header">
          <WFEnableForPermission permission={Acl.WORKLOG_CREATE}>
            <AddTimeEntry
              className="add-button"
              id="add-button"
              headerText={Labels.WORKLOG.HEADER_TEXT_ADD}
              context={Labels.WORKLOG.CONTEXT_ADD}
              icon={Labels.WORKLOG.ICON_ADD}
              text={Labels.WORKLOG.TEXT_ADD}
              variant="tertiary"
              disabled={!canEdit}
              onConfirm={this.addWorkLog}
              activeWorkflowStepId={activeTaskStep?.workflowStepId}
            />
          </WFEnableForPermission>
          <div className="worklog-time-container">
            <span className="time-label">{Labels.WORKLOG.TOTAL_TIME}</span>
            <span className="document-type">
              {this.props.workLogs && getTotalStepTime(this.props.workLogs)}
            </span>
          </div>
        </div>

        <div className="worklog-list-container">
          <ul className="worklog-list-group">
            {SortingGrouping.sortWorkLogEntriesByWorkflowStep(
              worklogList,
              workflowStepsList
            ).map(([key, value]: any) => (
              <Accordion key={key}>
                {value.length > 0 ? (
                  <AccordionItem
                    headingText={key}
                    defaultExpanded={activeTaskStep?.name === key}
                    headerSlot={getTotalStepTime(value)}
                  >
                    {this.getListOfTimeEntries(value)}
                  </AccordionItem>
                ) : (
                  <AccordionItem
                    headingText={key}
                    headerSlot={
                      <Warning
                        warning={
                          this.props.rightPaneFormvalidity.isWorkLogFormValid
                        }
                        label={Labels.WORKLOG.DEFAULT_ACCORDIAN_TAG}
                        tooltip={Labels.WORKLOG.WORK_LOG_REQUIRED}
                      />
                    }
                    defaultExpanded={true}
                  >
                    <p>{Labels.WORKLOG.DEFAULLT_ACCORDIAN_MESSAGE}</p>
                  </AccordionItem>
                )}
              </Accordion>
            ))}
          </ul>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    workLogs: getWorkLogs(state),
    taskdetails: getTaskDetail(state),
    rightPaneFormvalidity: getFormValidity(state),
  };
};

export default connect(mapStateToProps, {
  refreshTaskList,
  createTimeEntryLog,
  updateTimeEntryLog,
  deleteTimeEntryLog,
  fetchTaskDetails,
  updateFormValidation,
})(WorkLogList);
