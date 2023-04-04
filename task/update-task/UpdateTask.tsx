import { GridCol, GridRow } from '@athena/forge';
import React, { Component } from 'react';
import { TaskDetail, TaskStep } from '../../../types';
import UpdateTaskLeftPane from './left-pane/UpdateTaskLeftPane';
import UpdateTaskRightPane from './right-pane/UpdateTaskRightPane';
import './UpdateTask.scss';
import { fetchTaskDetails, resetTaskDetails } from '../../../slices/TaskSlice';
import { connect } from 'react-redux';
import AppConstants from '../../../constants/AppConstants';

export function getAssignedTo(task?: TaskDetail): string {
  const taskStep = getActiveTaskStep(task);
  if (taskStep) {
    return taskStep.assignedTo || '';
  }
  return '';
}

export function getTaskStepByWorkflowStepId(
  workflowStepId: string,
  task?: TaskDetail
): TaskStep | undefined {
  const taskStep = task?.taskSteps?.find(
    (ts: TaskStep) => ts.workflowStepId === workflowStepId
  );
  return taskStep;
}

export function getActiveTaskStep(task?: TaskDetail): TaskStep | undefined {
  const activeTaskStep = task?.taskSteps?.find(
    (taskStep: TaskStep) => taskStep.id === task?.activeTaskStepId
  );
  return activeTaskStep;
}

export const getTaskStepsWithoutWorkLog = (
  taskDetail: TaskDetail | undefined
): TaskStep[] => {
  const taskStepsWithoutWorkLog: TaskStep[] = [];
  const taskSteps = taskDetail?.taskSteps || [];
  const activeTaskStepId = taskDetail?.activeTaskStepId;
  for (const taskStep of taskSteps) {
    if (!taskStep.totalWorkLog) {
      taskStepsWithoutWorkLog.push(taskStep);
    }
    if (taskStep.id === activeTaskStepId) {
      break;
    }
  }
  return taskStepsWithoutWorkLog;
};

export function getNextTaskStep(task?: TaskDetail): TaskStep | undefined {
  const activeTaskStep = getActiveTaskStep(task);
  const activeTaskStepOrder = activeTaskStep?.ordering
    ? parseInt(activeTaskStep.ordering)
    : -1;
  const taskStep = task?.taskSteps?.find(
    (ts: TaskStep) => parseInt(ts.ordering) === activeTaskStepOrder + 1
  );
  return taskStep;
}

export function getActiveTaskStepVersion(task?: TaskDetail): string {
  const taskStep = getActiveTaskStep(task);
  if (taskStep) {
    return taskStep.version;
  }
  return '';
}

export function isTaskEditable(task?: TaskDetail): boolean {
  return (
    task?.statusId !== AppConstants.SERVER_CONSTANTS.STATUSES.REJECTED &&
    task?.statusId !== AppConstants.SERVER_CONSTANTS.STATUSES.IN_PRODUCTION
  );
}

class UpdateTask extends Component<any, any> {
  resetCommentId = () => {
    this.setState({
      commentId: '',
    });
  };
  constructor(props: any) {
    super(props);
    const id = this.props.match.params.id;
    this.props.fetchTaskDetails(id);
    const { history, location } = this.props;
    const { search } = location || '';

    const newLocation = {
      ...location,
      search: '',
    };
    history?.replace(newLocation);
    const commentId = new URLSearchParams(search).get('commentid') || '';
    this.state.commentId = commentId;
  }
  state = {
    commentId: '',
  };

  componentWillUnmount() {
    this.props.resetTaskDetails();
  }

  render(): JSX.Element {
    return (
      <div className="update-task">
        <GridRow className="fe_u_fill--height">
          <GridCol width={{ small: 8 }} className="left-section">
            <div className="fe_u_padding--none">
              <UpdateTaskLeftPane history={this.props.history} />
            </div>
          </GridCol>

          <GridCol width={{ small: 4 }} className="right-section">
            <UpdateTaskRightPane
              commentId={this.state.commentId}
              taskId={this.props.match.params.id}
              resetCommentId={this.resetCommentId}
            />
          </GridCol>
        </GridRow>
      </div>
    );
  }
}

export default connect(null, { fetchTaskDetails, resetTaskDetails })(
  UpdateTask
);
