import { Button, Form, FormField, Lightbox, Select } from '@athena/forge';
import { FieldArray, Formik, FormikProps } from 'formik';
import React, { Component } from 'react';
import * as Yup from 'yup';
import Labels from '../../../../../constants/Labels';
import Messages from '../../../../../constants/Messages';
import {
  DependencyDetails,
  TaskDependencyDetails,
  TaskDetail,
} from '../../../../../types';
import './TaskDependency.scss';
import { values, includes, find } from 'lodash';
import DependencyReason from './DependencyReason';
import DependencySystem from './DependencySystem';
import AppConstants from '../../../../../constants/AppConstants';
import { fetchDependencyDetailsListByIds } from '../../../../../services/CommonService';
import { autoCompleteBlockedbyDependencies } from './TaskDependency';

export interface EditDependencyProps {
  taskDependency: TaskDependencyDetails;
  show: boolean;
  onCancel?: any;
  onSave?: any;
  task?: TaskDetail;
  index?: number;
}

const labels = Labels.TASK_DEPENDENCY;

const dependencyConditions =
  AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES.DEPENDENCY_CONDITIONS;
const TASK_DEPENDENCY = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;
function validateByDependencyCondition(
  context: any,
  conditions: string[]
): boolean {
  //@ts-ignore
  const { dependencyCondition } = context.from[1].value;
  return includes(conditions, dependencyCondition);
}

export default class EditDependency extends Component<
  EditDependencyProps,
  any
> {
  initialValues = {
    dependencyCondition: this.props.taskDependency.dependencyCondition,
    taskDependencies: [this.props.taskDependency],
  };

  validationSchema = Yup.object().shape({
    dependencyCondition: Yup.string().required(Messages.MSG_REQUIRED),
    taskDependencies: Yup.array()
      .of(
        Yup.object().shape({
          // Deploy with/Test with related validations
          dependencySystemId: Yup.string()
            .nullable()
            .test('dependency-system-id', Messages.MSG_REQUIRED, function (
              value
            ) {
              let valid = true;
              if (
                validateByDependencyCondition(this, [
                  TASK_DEPENDENCY.DEPLOY_WITH,
                  TASK_DEPENDENCY.TEST_WITH,
                ])
              ) {
                valid = !!value;
              }
              return valid;
            }),
          dependencyId: Yup.string()
            .nullable()
            .test('dependency-id', Messages.MSG_REQUIRED, function (value) {
              let valid = true;
              if (
                validateByDependencyCondition(this, [
                  TASK_DEPENDENCY.DEPLOY_WITH,
                  TASK_DEPENDENCY.TEST_WITH,
                ])
              ) {
                valid = !!value;
              }
              return valid;
            })
            .test('dependency-id-invalid', Messages.INVALID, function (value) {
              let valid = true;
              if (
                validateByDependencyCondition(this, [
                  TASK_DEPENDENCY.DEPLOY_WITH,
                  TASK_DEPENDENCY.TEST_WITH,
                ])
              ) {
                valid = this.parent.dependencyName ? true : false;
              }
              return valid;
            })
            .test(
              'dependency-id-invalid-scope',
              Messages.TASK_DEPENDENCY_INVALID_SCOPE,
              function (value) {
                let valid = true;

                //@ts-ignore
                const { dependencyCondition } = this.from[1].value;
                const { TEST_WITH, ATLAS_ID } = TASK_DEPENDENCY;
                if (
                  dependencyCondition == TEST_WITH &&
                  this.parent.dependencySystemId == ATLAS_ID
                ) {
                  valid =
                    this.parent.activeWorkflowStepId <=
                    AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS
                      .TEST_CHANGES_STEP
                      ? true
                      : false;
                }
                return valid;
              }
            )
            .test({
              name: 'dependency-id-duplicate',
              message: Messages.DUPLICATE_ENTRY,
              test: ((props) => {
                return function (value: any) {
                  let valid = true;
                  const context = {
                    //@ts-ignore
                    ...this,
                  };
                  if (
                    validateByDependencyCondition(context, [
                      TASK_DEPENDENCY.DEPLOY_WITH,
                      TASK_DEPENDENCY.TEST_WITH,
                    ])
                  ) {
                    const taskDependencies = props.task?.taskDependencies;
                    if (taskDependencies) {
                      const {
                        dependencySystemId,
                        dependencyCondition,
                      } = context.parent;
                      valid = !taskDependencies.some(
                        (taskDependency, index) => {
                          return (
                            taskDependency.dependencyId == value &&
                            taskDependency.dependencySystemId ==
                              dependencySystemId &&
                            taskDependency.dependencyCondition ==
                              dependencyCondition &&
                            index != props.index
                          );
                        }
                      );
                    }
                  }
                  return valid;
                };
              })(this.props),
            }),

          // Blocked by related validations
          dependencyName: Yup.string().test(
            'dependency-name',
            Messages.MSG_REQUIRED,
            function (value) {
              let valid = true;
              if (
                validateByDependencyCondition(this, [
                  TASK_DEPENDENCY.BLOCKED_BY,
                ])
              ) {
                valid = !!value;
              }
              return valid;
            }
          ),
          statusName: Yup.string()
            .nullable()
            .test('status-name', Messages.MSG_REQUIRED, function (value) {
              let valid = true;
              if (
                validateByDependencyCondition(this, [
                  TASK_DEPENDENCY.BLOCKED_BY,
                ])
              ) {
                valid = !!value;
              }
              return valid;
            }),
          dependencyDate: Yup.date()
            .nullable()
            .when('dependencyName', {
              is:
                AppConstants.UI_CONSTANTS.TASK_DEPENDENCY
                  .SPECIFIC_DEPLOYMENT_DATE,
              then: Yup.date().required(Messages.MSG_REQUIRED),
              otherwise: Yup.date(),
            }),
        })
      )
      .min(1),
  });

  onSubmit = (values: any): void => {
    this.props.onSave(values.taskDependencies[0]);
  };

  renderDependencyByCondition(
    formik: FormikProps<any>,
    dependencyProps: any
  ): JSX.Element | undefined {
    let field: any;
    switch (formik.values.dependencyCondition) {
      case TASK_DEPENDENCY.DEPLOY_WITH:
      case TASK_DEPENDENCY.TEST_WITH: {
        field = <DependencySystem {...dependencyProps} />;
        break;
      }
      case TASK_DEPENDENCY.BLOCKED_BY: {
        field = <DependencyReason {...dependencyProps} />;
        break;
      }
    }
    return field;
  }

  renderDepedencyTaskTemplate = (formik: FormikProps<any>): any => {
    let content = null;

    const taskDependencies: TaskDependencyDetails[] =
      formik.values.taskDependencies;

    content = (
      <FieldArray
        name="taskDependencies"
        render={(arrayHelpers) => {
          return (
            <div>
              {taskDependencies.map(
                (obj: TaskDependencyDetails, index: number) => {
                  const dependencyProps: any = {
                    hideActionButtons: true,
                    index: index,
                    formik: formik,
                    task: this.props.task,
                  };

                  return this.renderDependencyByCondition(
                    formik,
                    dependencyProps
                  );
                }
              )}
            </div>
          );
        }}
      />
    );

    return content;
  };

  beforeFormSubmit(formik: FormikProps<any>) {
    const { dependencyCondition, taskDependencies } = formik.values;
    if (
      dependencyCondition == TASK_DEPENDENCY.DEPLOY_WITH ||
      dependencyCondition == TASK_DEPENDENCY.TEST_WITH
    ) {
      const payload = taskDependencies.map((o: TaskDependencyDetails) => {
        const { dependencyId, dependencySystemId } = o;
        return { dependencyId, dependencySystemId };
      });

      fetchDependencyDetailsListByIds(payload).then(
        (result: DependencyDetails[]) => {
          const updatedDeps: TaskDependencyDetails[] = taskDependencies.map(
            (o: TaskDependencyDetails) => {
              const dependencyDetail: DependencyDetails | undefined = find(
                result,
                {
                  dependencyId: o.dependencyId,
                  dependencySystemId: o.dependencySystemId,
                }
              );
              const data = {
                ...o,
                deploymentDate: dependencyDetail?.deploymentDate,
                dependencyName: dependencyDetail?.dependencyName,
                statusName: dependencyDetail?.statusName,
                activeWorkflowStepId: dependencyDetail?.activeWorkflowStepId,
              };
              return data;
            }
          );
          formik.setFieldValue('taskDependencies', updatedDeps, false);
          formik.handleSubmit();
        }
      );
    } else {
      const deploymentDate = this.props.task?.deploymentDate;
      if (deploymentDate) {
        formik.setFieldValue(
          'taskDependencies',
          autoCompleteBlockedbyDependencies(taskDependencies, deploymentDate),
          false
        );
      }

      formik.handleSubmit();
    }
  }

  renderForm(formik: FormikProps<any>): JSX.Element {
    const dependencyConditionValues = values(dependencyConditions);
    return (
      <Form
        className="fe_u_margin--medium"
        layout="compact"
        labelAlwaysAbove
        includeSubmitButton={false}
        autoComplete="off"
      >
        <div className="row">
          <FormField
            className="row2"
            id="dependencyCondition"
            required={true}
            inputAs={Select}
            labelText={labels.TYPE}
            options={dependencyConditionValues}
            {...formik.getFieldProps('dependencyCondition')}
            disabled={true}
            onChange={(event: any) => {
              formik.setValues({
                ...formik.values,
                dependencyCondition: event.target.value,
                taskDependencies: [],
              });
            }}
            error={formik.errors.dependencyCondition?.toString()}
          />
        </div>

        {this.renderDepedencyTaskTemplate(formik)}
      </Form>
    );
  }

  render(): JSX.Element {
    return (
      <Formik
        initialValues={this.initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
        validateOnMount={false}
        validateOnChange={false}
        validateOnBlur={false}
      >
        {(formik) => {
          return (
            <Lightbox
              show={this.props.show}
              hideDividers
              headerText={labels.EDIT_DEPENDENCIES}
              disableClose
              width="large"
              className="my-custom-lightbox edit-dependency"
            >
              <Button
                variant="tertiary"
                icon="Close"
                onClick={this.props.onCancel}
                className="my-close-button"
              />
              {this.renderForm(formik)}
              <div className="fe_c_lightbox__footer">
                <Button
                  text={labels.CANCEL}
                  variant="secondary"
                  className="fe_u_margin--right-small"
                  onClick={this.props.onCancel}
                />
                <Button
                  text={labels.SAVE}
                  onClick={() => this.beforeFormSubmit(formik)}
                />
              </div>
            </Lightbox>
          );
        }}
      </Formik>
    );
  }
}
