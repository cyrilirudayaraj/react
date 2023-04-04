import React from 'react';
import { Stepper } from '@athena/forge';
import { TaskStep, UpdateTaskProps } from '../../../../../types';
import { connect } from 'react-redux';
import { getTaskDetail } from '../../../../../slices/TaskSlice';
import AppConstants from '../../../../../constants/AppConstants';

function TaskStepper(props: UpdateTaskProps): JSX.Element {
  const getSteps = () => {
    return props?.task?.taskSteps?.map((step: TaskStep) => step.name) || [];
  };

  const getSelected = () => {
    let index = props?.task?.taskSteps?.findIndex(
      (step) => step.id === props?.task?.activeTaskStepId
    );
    const statusId = props?.task?.statusId;
    if (statusId == AppConstants.SERVER_CONSTANTS.STATUSES.IN_PRODUCTION) {
      index = props?.task?.taskSteps?.length;
    }
    return index !== undefined ? index : -1;
  };

  return (
    <div className="task-stepper">
      <Stepper
        compact={false}
        selected={getSelected()}
        steps={getSteps()}
        numerical={false}
      />
    </div>
  );
}
export default connect((state) => {
  return { task: getTaskDetail(state) };
})(TaskStepper);
