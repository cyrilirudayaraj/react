import React from 'react';
import {
  Button,
  Lightbox,
  Form,
  FormField,
  GridRow,
  GridCol,
  Textarea,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import Labels from '../../../constants/Labels';
import * as Yup from 'yup';
import Messages from '../../../constants/Messages';

interface RejectDeploymentProps {
  onReject: (values: any) => any;
}

interface RejectDeploymentState {
  rejectShown: boolean;
}

export default class RejectDeployment extends React.Component<
  RejectDeploymentProps
> {
  state: RejectDeploymentState = {
    rejectShown: false,
  };

  onConfirmRject = (values: any): void => {
    this.hideConfirmRejectDialog();
    this.props.onReject(values);
  };

  showConfirmRejectDialog = (): void => {
    this.setState({ rejectShown: true });
  };

  hideConfirmRejectDialog = (): void => {
    this.setState({ rejectShown: false });
  };

  validationSchema(): any {
    return Yup.object().shape({
      reason: Yup.string()
        .required(Messages.MSG_REQUIRED)
        .max(500, Messages.ODM_DEPLOY.REASON_MAX_LENGTH),
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

  renderForm = (formik: FormikProps<any>): JSX.Element => {
    const labels = Labels.DEPLOY;

    return (
      <Form labelAlwaysAbove={true} includeSubmitButton={false}>
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

  renderConfirmRejectDialog(): JSX.Element {
    const labels = Labels.DEPLOY;
    const initialValues = {};

    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onConfirmRject}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
      >
        {(formik) => {
          return (
            <Lightbox
              show
              hideDividers
              headerText={labels.REJECT_DEPLOYMENT}
              disableClose
              width="large"
              className="my-custom-lightbox deployment-reject"
            >
              <Button
                variant="tertiary"
                icon="Close"
                onClick={this.hideConfirmRejectDialog}
                className="my-close-button"
              />

              {this.renderForm(formik)}

              <div className="fe_c_lightbox__footer">
                <Button
                  text={labels.CANCEL}
                  variant="secondary"
                  className="fe_u_margin--right-small"
                  onClick={this.hideConfirmRejectDialog}
                />
                <Button text={labels.REJECT} onClick={formik.handleSubmit} />
              </div>
            </Lightbox>
          );
        }}
      </Formik>
    );
  }

  render(): JSX.Element {
    return (
      <>
        <Button
          className="fe_u_margin--right-xsmall"
          id="reject-deployment"
          text={Labels.DEPLOY.REJECT}
          onClick={this.showConfirmRejectDialog}
        />
        {this.state.rejectShown && this.renderConfirmRejectDialog()}
      </>
    );
  }
}
