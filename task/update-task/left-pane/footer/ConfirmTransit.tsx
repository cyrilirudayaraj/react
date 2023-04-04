import React, { useEffect, useState } from 'react';
import {
  Button,
  Lightbox,
  Form,
  FormField,
  Select,
  Checkbox,
  GridRow,
  GridCol,
  FormError,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import Labels from '../../../../../constants/Labels';
import * as Yup from 'yup';
import { TaskStep } from '../../../../../types';
import { getUsers } from '../../../../../services/CommonService';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import AppConstants from '../../../../../constants/AppConstants';
import StringUtil from '../../../../../utils/StringUtil';
import Messages from '../../../../../constants/Messages';

interface ConfirmTransitProps {
  activeStep: TaskStep;
  nextStep: TaskStep | undefined;
  onConfirm: (values: any) => any;
  onCancel: () => any;
  dependencies: any;
}
function ConfirmTransit(props: ConfirmTransitProps): JSX.Element {
  const activeStep = props.activeStep;
  const nextStep = props.nextStep;
  const labels = Labels.CONFIRM_TRANSIT;
  const initialValues = {
    signedOffYn: false,
    completedYn: false,
  };

  const [users, setUsers] = useState<string[]>([]);
  useEffect(() => {
    getUsers().then((data) => {
      setUsers(ConversionUtil.convertMapToDropDownList(data, 'userName'));
    });
  }, []);

  const dependencies = props.dependencies;
  const testWithDependencies = dependencies.filter(
    (dependency: any) =>
      dependency.dependencyCondition ==
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.TEST_WITH
  );
  let singleTaskTestLabel =
    AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.TEST_RELATED_SINGLE_TASK;
  let multiTaskTestLabel =
    AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.TEST_RELATED_MULTI_TASK;
  let taskTestLabel: any;
  let dependencyId;

  testWithDependencies.forEach(function (dependency: any, index: any) {
    dependencyId =
      dependency.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.ATLAS_ID
        ? StringUtil.formatTaskID(dependency.dependencyId)
        : dependency.dependencySystemId ===
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.RULE_TRACKER_ID
        ? StringUtil.formatRuleTrackerTaskID(dependency.dependencyId)
        : dependency.dependencyId;
    if (testWithDependencies.length === 1) {
      singleTaskTestLabel = singleTaskTestLabel + dependencyId;
      taskTestLabel = singleTaskTestLabel;
    } else {
      if (index !== testWithDependencies.length - 1) {
        multiTaskTestLabel = multiTaskTestLabel + dependencyId + ' ' + ',';
      } else {
        multiTaskTestLabel = multiTaskTestLabel + dependencyId;
      }
      taskTestLabel = multiTaskTestLabel;
    }
  });

  const getDefaultValidationSchema = (workflowStepId: any) => {
    const schema: any = {};
    schema['signedOffYn'] = Yup.bool().test(
      'is-checked',
      Messages.MSG_REQUIRED,
      (value) => value === true
    );
    if (
      workflowStepId ==
        AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS.TEST_CHANGES_STEP &&
      testWithDependencies.length > 0
    ) {
      schema['completedYn'] = Yup.bool().test(
        'is-checked',
        Messages.MSG_REQUIRED,
        (value) => value === true
      );
    }
    return schema;
  };

  const validationSchemaByWorkflowStep = (workflowStepId: any) => {
    const schema: any = getDefaultValidationSchema(workflowStepId);
    return Yup.object().shape(schema);
  };

  const validationSchema = function () {
    return validationSchemaByWorkflowStep(activeStep.workflowStepId);
  };

  const getFormFieldProps = (fieldName: string, formik: any) => {
    const props = {
      ...formik.getFieldProps(fieldName),
      error: formik.errors[fieldName],
      id: fieldName,
      labelWidth: 12,
    };
    return props;
  };

  const renderForm = (formik: FormikProps<any>) => {
    return (
      <Form labelAlwaysAbove={true} includeSubmitButton={false}>
        {nextStep && (
          <GridRow>
            <GridCol width={{ small: 4 }}>
              <FormField
                id="assignedTo"
                labelText={labels.ASSIGN_TO}
                inputAs={Select}
                options={users}
                placeholder={'Unassigned'}
                {...getFormFieldProps('assignedTo', formik)}
              />
            </GridCol>
          </GridRow>
        )}
        {activeStep.workflowStepId ==
          AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS.TEST_CHANGES_STEP &&
          testWithDependencies.length > 0 && (
            <>
              <Checkbox
                description={taskTestLabel}
                id="completedYn"
                checked={formik.values.completedYn}
                {...getFormFieldProps('completedYn', formik)}
                required
              />
              <div className="dependencytest-error">
                {formik.errors.completedYn && (
                  <FormError>{formik.errors.completedYn}</FormError>
                )}
              </div>
            </>
          )}
        <Checkbox
          description={activeStep.signOffStatement}
          id="signedOffYn"
          checked={formik.values.signedOffYn}
          {...getFormFieldProps('signedOffYn', formik)}
          required
        />
        <div className="signoff-error">
          {formik.errors.signedOffYn && (
            <FormError>{formik.errors.signedOffYn}</FormError>
          )}
        </div>
      </Form>
    );
  };

  return (
    <div className="confirm-transit">
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={props.onConfirm}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
      >
        {(formik) => {
          return (
            <Lightbox
              show
              hideDividers
              headerText={
                nextStep?.transitionText
                  ? nextStep.transitionText
                  : Labels.TRANSIT.DEPLOYMENT_COMPLETE
              }
              disableClose
              width="large"
              className="my-custom-lightbox confirm-transit-lightbox"
            >
              <Button
                variant="tertiary"
                icon="Close"
                onClick={props.onCancel}
                className="my-close-button"
              />
              {renderForm(formik)}

              <div className="fe_c_lightbox__footer">
                <Button
                  text={labels.CANCEL}
                  variant="secondary"
                  className="fe_u_margin--right-small"
                  onClick={props.onCancel}
                />
                <Button text={labels.SUBMIT} onClick={formik.handleSubmit} />
              </div>
            </Lightbox>
          );
        }}
      </Formik>
      );
    </div>
  );
}

export default ConfirmTransit;
