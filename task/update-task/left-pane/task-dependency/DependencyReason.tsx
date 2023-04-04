import { Button, DateInput, FormField, Select } from '@athena/forge';
import { FormikProps } from 'formik';
import React, { Component } from 'react';
import Labels from '../../../../../constants/Labels';
import { get, values } from 'lodash';
import AppConstants from '../../../../../constants/AppConstants';
import moment from 'moment';
import { TaskDetail } from '../../../../../types';
import { getDependencyReasonsByWFStepId } from './TaskDependency';

export interface DependencyReasonProps {
  index: number;
  formik: FormikProps<any>;
  task: TaskDetail;
  hideActionButtons?: boolean;
  onAdd?: (event: any) => void;
  onDelete?: (event: any) => void;
}

const labels = Labels.TASK_DEPENDENCY;

export default class DependencyReason extends Component<
  DependencyReasonProps,
  any
> {
  state = {};

  getFormFieldProps = (fieldName: string, formik: any): any => {
    const props = {
      ...formik.getFieldProps(fieldName),
      required: true,
      autoComplete: 'off',
      error: get(formik.errors, fieldName),
      id: fieldName,
    };
    return props;
  };

  onAddClicked = (): void => {
    const { onAdd, index } = this.props;
    if (onAdd) onAdd(index);
  };

  onDeleteClicked = (): void => {
    const { onDelete, index } = this.props;
    if (onDelete && !this.isDeleteDisabled()) onDelete(index);
  };

  isDeleteDisabled(): boolean {
    const { taskDependencies } = this.props.formik.values;
    const length = taskDependencies ? taskDependencies.length : 0;
    return length <= 1 ? true : false;
  }

  handleReasonChange(event: any, id: string, index: number, formik: any): void {
    const { value } = event.target;
    formik.setFieldValue(id, value);

    const {
      SPECIFIC_DEPLOYMENT_DATE,
    } = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;

    if (value == SPECIFIC_DEPLOYMENT_DATE) {
      formik.setFieldValue(`taskDependencies.${index}.notes`, null);
    } else {
      formik.setFieldValue(`taskDependencies.${index}.dependencyDate`, null);
    }
  }

  handleDependencyDateChange(event: any, id: string, formik: any): void {
    const { value } = event.target;
    let output: any = '';
    if (value) {
      const momentDate = moment(
        value,
        AppConstants.UI_CONSTANTS.DATE_INPUT_FORMAT
      );
      if (momentDate.isValid()) {
        output = momentDate.toDate();
      }
    }
    formik.setFieldValue(id, output, false);
  }

  handleStatusChange(event: any, id: string, tarId: string, formik: any): void {
    const { value } = event.target;
    formik.setFieldValue(id, value);
    if (
      value ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES.DEPENDENCY_BLOCKING_STATUS
        .COMPLETED
    ) {
      formik.setFieldValue(tarId, AppConstants.SERVER_CONSTANTS.YES);
    } else {
      formik.setFieldValue(tarId, AppConstants.SERVER_CONSTANTS.NO);
    }
  }

  render(): JSX.Element {
    const { index, formik, hideActionButtons } = this.props;
    const taskDependency = formik.values.taskDependencies[index];
    const { dependencyName } = taskDependency;
    const {
      SPECIFIC_DEPLOYMENT_DATE,
    } = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;

    return (
      <div className="dependency-reason row">
        <FormField
          inputAs={Select}
          labelText={labels.REASON}
          options={getDependencyReasonsByWFStepId(
            this.props.task.activeWorkflowStepId
          )}
          className="row2"
          {...this.getFormFieldProps(
            `taskDependencies.${index}.dependencyName`,
            formik
          )}
          onChange={(event: any) => {
            this.handleReasonChange(
              event,
              `taskDependencies.${index}.dependencyName`,
              index,
              formik
            );
          }}
        />

        {dependencyName == SPECIFIC_DEPLOYMENT_DATE && (
          <FormField
            inputAs={DateInput}
            labelText={labels.DATE}
            className="row2"
            {...this.getFormFieldProps(
              `taskDependencies.${index}.dependencyDate`,
              formik
            )}
            onBlur={(event: any) => {
              this.handleDependencyDateChange(
                event,
                `taskDependencies.${index}.dependencyDate`,
                formik
              );
            }}
          />
        )}

        {hideActionButtons && dependencyName != SPECIFIC_DEPLOYMENT_DATE && (
          <FormField
            inputAs={Select}
            labelText={labels.STATUS}
            options={values(
              AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES
                .DEPENDENCY_BLOCKING_STATUS
            )}
            className="row2"
            {...this.getFormFieldProps(
              `taskDependencies.${index}.statusName`,
              formik
            )}
            onChange={(event: any) => {
              this.handleStatusChange(
                event,
                `taskDependencies.${index}.statusName`,
                `taskDependencies.${index}.completedYn`,
                formik
              );
            }}
          />
        )}

        {dependencyName !=
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY
            .SPECIFIC_DEPLOYMENT_DATE && (
          <FormField
            labelText={labels.NOTES}
            className="notes"
            {...this.getFormFieldProps(
              `taskDependencies.${index}.notes`,
              formik
            )}
            required={false}
            maxlength={4000}
          />
        )}
        {!hideActionButtons && (
          <React.Fragment>
            <Button
              className="add-button"
              icon="Add"
              variant="tertiary"
              onClick={this.onAddClicked}
            />
            <Button
              className="delete-button"
              icon="Delete"
              variant="tertiary"
              onClick={this.onDeleteClicked}
              disabled={this.isDeleteDisabled()}
            />
          </React.Fragment>
        )}
      </div>
    );
  }
}
