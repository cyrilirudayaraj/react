import { Button, FormField, Select } from '@athena/forge';
import { FormikProps } from 'formik';
import React, { Component } from 'react';
import Labels from '../../../../../constants/Labels';
import { get } from 'lodash';
import AppConstants from '../../../../../constants/AppConstants';

const labels = Labels.TASK_DEPENDENCY;

export interface DependencySystemProps {
  index: number;
  formik: FormikProps<any>;
  hideActionButtons?: boolean;
  onAdd?: (event: any) => void;
  onDelete?: (event: any) => void;
}

export default class DependencySystem extends Component<
  DependencySystemProps,
  any
> {
  getFormFieldProps = (fieldName: string, formik: FormikProps<any>): any => {
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

  render(): JSX.Element {
    const { index, formik, hideActionButtons } = this.props;

    return (
      <div className="dependency-system row">
        <FormField
          inputAs={Select}
          labelText={labels.SYSTEM}
          options={
            AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES.DEPENDENCY_SYSTEMS
          }
          className="row2"
          {...this.getFormFieldProps(
            `taskDependencies.${index}.dependencySystemId`,
            formik
          )}
        />

        <FormField
          labelText={labels.TASK_ID}
          className="row2"
          {...this.getFormFieldProps(
            `taskDependencies.${index}.dependencyId`,
            formik
          )}
        />

        <FormField
          labelText={labels.NOTES}
          className="notes"
          {...this.getFormFieldProps(`taskDependencies.${index}.notes`, formik)}
          required={false}
          maxlength={4000}
        />

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
