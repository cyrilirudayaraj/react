import React from 'react';
import {
  Button,
  Lightbox,
  Form,
  FormField,
  Select,
  GridRow,
  GridCol,
  Textarea,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import Labels from '../../../../../constants/Labels';
import * as Yup from 'yup';
import { TaskStep, TaskDetail } from '../../../../../types';
import { getUsers } from '../../../../../services/CommonService';
import ConversionUtil from '../../../../../utils/ConversionUtil';

interface ReturnTransitProps {
  task: TaskDetail;
  onConfirm: (values: any) => any;
  onCancel: () => any;
}

interface ReturnTransitState {
  users: string[];
}
export default class ReturnTransit extends React.Component<
  ReturnTransitProps,
  ReturnTransitState
> {
  state: ReturnTransitState = {
    users: [],
  };
  validationSchema(): any {
    return Yup.object().shape({
      returnTo: Yup.string().required('Required!'),
      reason: Yup.string()
        .required('Required!')
        .max(4000, 'Reason must be at most 4000 characters!'),
    });
  }

  getFormFieldProps = (fieldName: string, formik: FormikProps<any>): any => {
    const props = {
      ...formik.getFieldProps(fieldName),
      error: formik.errors[fieldName],
      id: fieldName,
      labelWidth: 12,
      required: true,
    };
    return props;
  };

  getReturnSteps(): any[] {
    const { taskSteps } = this.props.task;
    return taskSteps
      .filter((step) => step.signedOffYn === 'Y')
      .map((step: TaskStep) => {
        return { text: step.name, value: step.workflowStepId };
      });
  }

  componentDidMount(): void {
    getUsers().then((data) => {
      this.setState({
        users: ConversionUtil.convertMapToDropDownList(data, 'userName'),
      });
    });
  }

  renderForm = (formik: FormikProps<any>): JSX.Element => {
    const labels = Labels.RETURN_TRANSIT;

    return (
      <Form labelAlwaysAbove={true} includeSubmitButton={false}>
        <GridRow>
          <GridCol width={{ small: 4 }}>
            <FormField
              labelText={labels.RETURN_TO}
              inputAs={Select}
              options={this.getReturnSteps()}
              {...this.getFormFieldProps('returnTo', formik)}
            />
          </GridCol>

          <GridCol width={{ small: 4 }}>
            <FormField
              labelText={labels.ASSIGN_TO}
              inputAs={Select}
              options={this.state.users}
              {...this.getFormFieldProps('assignedTo', formik)}
              required={false}
            />
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol>
            <FormField
              maxlength="4000"
              labelText={labels.REASON}
              inputAs={Textarea}
              {...this.getFormFieldProps('reason', formik)}
            />
          </GridCol>
        </GridRow>
      </Form>
    );
  };

  render(): JSX.Element {
    const labels = Labels.RETURN_TRANSIT;
    const initialValues = {};

    return (
      <div className="return-transit">
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.props.onConfirm}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
        >
          {(formik) => {
            return (
              <Lightbox
                show
                hideDividers
                headerText={labels.RETURN_TASK}
                disableClose
                width="large"
                className="my-custom-lightbox return-transit-lightbox"
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
                  <Button text={labels.RETURN} onClick={formik.handleSubmit} />
                </div>
              </Lightbox>
            );
          }}
        </Formik>
      </div>
    );
  }
}
