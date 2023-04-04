import React, { Component } from 'react';
import {
  Button,
  Lightbox,
  Form,
  FormField,
  Select,
  DateInput,
} from '@athena/forge';
import { ButtonVariant } from '@athena/forge/Button/Button';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { TaskStep } from '../../../../../types';
import Labels from '../../../../../constants/Labels';
import { getTaskDetail } from '../../../../../slices/TaskSlice';
import { connect } from 'react-redux';
import { fetchTaskDetails } from '../../../../../slices/TaskSlice';
import AppConstants from '../../../../../constants/AppConstants';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import CommonUtil from '../../../../../utils/CommonUtil';

interface AddTimeEntryProps {
  onConfirm: (values: any) => any;
  className: string;
  id: string;
  headerText: string;
  context: string;
  icon: string;
  variant: ButtonVariant;
  disabled: boolean;
  text?: string;
  timeentry?: any;
  type?: string[];
  activeWorkflowStepId?: any;
  task: any;
  fetchTaskDetails?: (value: any) => any;
}

export class AddTimeEntry extends Component<AddTimeEntryProps, any> {
  state = {
    shown: false,
  };
  constructor(props: AddTimeEntryProps) {
    super(props);
  }

  showLightbox = (formik: FormikProps<any>) => {
    this.setState({
      shown: true,
    });
    if (this.props.context === Labels.WORKLOG.CONTEXT_EDIT) {
      formik.setValues({
        spentTimeInMins: ConversionUtil.convertMinsToHm(
          this.props.timeentry?.spentTimeInMins
        ),
        spentOn: this.props.timeentry?.spentOn,
        workflowStepId: this.props.timeentry?.workflowStepId,
      });
    } else if (this.props.context === Labels.WORKLOG.CONTEXT_ADD) {
      formik.resetForm();
      formik.setValues({
        spentTimeInMins: '',
        spentOn: new Date(),
        workflowStepId: this.props.activeWorkflowStepId,
      });
    }
  };

  hideLightbox = (): void => {
    this.setState({
      shown: false,
    });
  };

  handleWorkflowStepIdChange = (event: any, formik: any): void => {
    formik.setFieldValue(event.target.id, event.target.value);
  };

  initialValues = {
    spentTimeInMins: this.props.timeentry?.spentTimeInMins || '',
    spentOn: this.props.timeentry?.spentOn || new Date(),
    workflowStepId:
      this.props.timeentry?.workflowStepId || this.props.activeWorkflowStepId,
  };

  convertDHMToMinutes(value: string) {
    const splitArr = value.split(' ');
    let initialMins = 0;
    for (let i = 0; i < splitArr.length; i++) {
      if (splitArr[i].includes('d')) {
        initialMins =
          initialMins +
          parseInt(splitArr[i].slice(0, splitArr[i].indexOf('d'))) * 1440;
      }
      if (splitArr[i].includes('h')) {
        initialMins =
          initialMins +
          parseInt(splitArr[i].slice(0, splitArr[i].indexOf('h'))) * 60;
      }
      if (splitArr[i].includes('m')) {
        initialMins =
          initialMins +
          parseInt(splitArr[i].slice(0, splitArr[i].indexOf('h')));
      }
    }
    return initialMins;
  }

  isValidTimeFomat(value: string): boolean {
    return AppConstants.UI_CONSTANTS.TIME_FORMAT_REGEX.test(value.trim());
  }

  validationSchema = Yup.object().shape({
    spentTimeInMins: Yup.string()
      .test('spent-time', Labels.WORKLOG.SPENT_ON_VALIDATION_TEXT, (value) =>
        this.isValidTimeFomat(value)
      )
      .required('Required!'),
    spentOn: Yup.string().required('Required!'),
    workflowStepId: Yup.string().required('Required!'),
  });

  getFormFieldProps = (fieldName: string, formik: any) => {
    const props = {
      ...formik.getFieldProps(fieldName),
      error: formik.errors[fieldName],
      id: fieldName,
      labelWidth: 12,
      required: true,
    };
    return props;
  };

  getWorkflowStepOrdering(activeWorkflowStepId: any): number {
    const activeTaskStep = this.props.task?.taskSteps?.find(
      (taskStep: TaskStep) => taskStep.workflowStepId === activeWorkflowStepId
    );
    return parseInt(activeTaskStep?.ordering);
  }

  getPreviousWorkflowStepOptions(
    taskSteps: any,
    workflowStepId: string
  ): any[] {
    const ordering = this.getWorkflowStepOrdering(workflowStepId);
    return taskSteps
      .filter((taskStep: TaskStep) => parseInt(taskStep.ordering) <= ordering)
      .map((ts: TaskStep) => {
        return { text: ts.name, value: ts.workflowStepId };
      });
  }

  getWorkLogWorkflowStepOptions(): any[] {
    const { taskSteps } = this.props.task;
    let convertedArr = [];
    if (this.props.context === Labels.WORKLOG.CONTEXT_ADD) {
      convertedArr = this.getPreviousWorkflowStepOptions(
        taskSteps,
        this.props.activeWorkflowStepId
      );
    } else if (this.props.context === Labels.WORKLOG.CONTEXT_EDIT) {
      convertedArr = this.getPreviousWorkflowStepOptions(
        taskSteps,
        this.props.timeentry.workflowStepId
      );
    }
    return convertedArr;
  }

  renderForm = (formik: FormikProps<any>) => {
    return (
      <Form
        labelAlwaysAbove={true}
        includeSubmitButton={false}
        requiredVariation="blueBarWithLegend"
        className="fe_u_margin--large"
        layout="compact"
      >
        <FormField
          labelText="Time Spent"
          {...this.getFormFieldProps('spentTimeInMins', formik)}
          hintText={Labels.WORKLOG.SPENT_ON_HINT_TEXT}
        />

        <FormField
          labelText="Workflow Step"
          inputAs={Select}
          options={this.getWorkLogWorkflowStepOptions()}
          {...this.getFormFieldProps('workflowStepId', formik)}
          onChange={(event: any) => {
            this.handleWorkflowStepIdChange(event, formik);
          }}
        />
        <FormField
          labelText="Date Started"
          inputAs={DateInput}
          required
          minDate={new Date('01-01-1900')}
          maxDate={new Date()}
          {...this.getFormFieldProps('spentOn', formik)}
          onBlur={(event: any) => {
            CommonUtil.handleDateChange(event, formik);
          }}
        />
      </Form>
    );
  };

  render(): JSX.Element {
    return (
      <div className={this.props.className}>
        <Formik
          initialValues={this.initialValues}
          validationSchema={this.validationSchema}
          onSubmit={(values) => {
            this.props.onConfirm({
              ...values,
              spentTimeInMins: this.convertDHMToMinutes(values.spentTimeInMins),
              id: this.props?.timeentry?.id,
              version: this.props?.timeentry?.version,
            });
            this.hideLightbox();
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
        >
          {(formik) => {
            return (
              <>
                <Button
                  className={this.props.className}
                  id={this.props.id}
                  text={this.props.text}
                  icon={this.props.icon}
                  variant={this.props.variant}
                  disabled={this.props.disabled}
                  onClick={() => this.showLightbox(formik)}
                />
                <Lightbox
                  show={this.state.shown}
                  hideDividers
                  headerText={this.props.headerText}
                  disableClose
                  width="large"
                  className="my-custom-lightbox create_document"
                >
                  <Button
                    variant="tertiary"
                    icon={Labels.WORKLOG.ICON_CLOSE}
                    onClick={() => this.hideLightbox()}
                    className="my-close-button"
                  />
                  {this.renderForm(formik)}

                  <div className="fe_c_lightbox__footer">
                    <Button
                      text={Labels.WORKLOG.BUTTON_CANCEL}
                      variant="secondary"
                      className="fe_u_margin--right-small"
                      onClick={() => this.hideLightbox()}
                    />
                    <Button
                      text={this.props.context}
                      onClick={(values) => {
                        formik.handleSubmit(values);
                      }}
                    />
                  </div>
                </Lightbox>
              </>
            );
          }}
        </Formik>
      </div>
    );
  }
}

const mapTaskStateToProps = (state: any) => ({
  task: getTaskDetail(state),
});

export default connect(mapTaskStateToProps, { fetchTaskDetails })(AddTimeEntry);
