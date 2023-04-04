import React from 'react';
import {
  Button,
  Lightbox,
  Form,
  FormField,
  ReadOnlyInput,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import Labels from '../../../constants/Labels';
import * as Yup from 'yup';
import StringUtil from '../../../utils/StringUtil';
import AppConstants from '../../../constants/AppConstants';
import AuthUtil from '../../../utils/AuthUtil';

interface NewDeploymentProps {
  onDeploy: (values: any) => any;
  disabled: boolean;
  selectedTasks: string[];
  decisionServiceName: string;
}

interface NewDeploymentState {
  deployShown: boolean;
}

export default class NewDeployment extends React.Component<NewDeploymentProps> {
  state: NewDeploymentState = {
    deployShown: false,
  };

  onConfirmDeploy = (values: any): void => {
    this.hideConfirmDeployDialog();
    this.props.onDeploy(values);
  };

  showConfirmDeployDialog = (): void => {
    this.setState({ deployShown: true });
  };

  hideConfirmDeployDialog = (): void => {
    this.setState({ deployShown: false });
  };

  handleEnter = (event: any, formik: FormikProps<any>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      formik.handleChange(event);
      formik.submitForm();
    }
  };

  validationSchema = Yup.object().shape({
    username: Yup.string().required('Required!'),
    password: Yup.string().required('Required!'),
  });

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

  renderConfirmRejectDialog(): JSX.Element {
    const labels = Labels.DEPLOY;

    const initialValues = {
      decisionServiceName: this.props.decisionServiceName,
      username: AuthUtil.getLoggedInUsername(),
      password: '',
    };
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onConfirmDeploy}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {(formik) => {
          return (
            <Lightbox
              show={true}
              hideDividers
              headerText={
                labels.DEPLOY_TASKS +
                AppConstants.UI_CONSTANTS.WHITE_SPACE +
                labels.OPEN_BRACKET +
                this.props.selectedTasks.length +
                AppConstants.UI_CONSTANTS.WHITE_SPACE +
                labels.SELECTED +
                labels.CLOSE_BRACKET
              }
              disableClose
              width="large"
              className="my-custom-lightbox"
            >
              <div className="fe_u_padding--small">
                <Form
                  className="fe_u_margin--small"
                  layout="compact"
                  labelAlwaysAbove={false}
                  includeSubmitButton={false}
                  autoComplete="off"
                >
                  <div className="fe_u_padding--bottom-small">
                    <span>
                      {StringUtil.formatTaskIdList([
                        ...this.props.selectedTasks,
                      ])}
                    </span>
                  </div>
                  <FormField
                    id="enviornment"
                    inputAs={ReadOnlyInput}
                    labelText={labels.ENVIRONMENT}
                    labelWidth={4}
                    text={
                      AppConstants.SERVER_CONSTANTS.DEPLOY_ENV_NAMES.PROD_MIRROR
                    }
                    className="fe_u_padding--top-small"
                  />
                  <FormField
                    id="decisionServiceName"
                    inputAs={ReadOnlyInput}
                    labelText={labels.DECISION_SERVICE_NAME}
                    labelWidth={4}
                    text={formik.values.decisionServiceName}
                    className="fe_u_padding--top-small"
                  />
                  <FormField
                    {...formik.getFieldProps('username')}
                    id="username"
                    labelText={labels.USERNAME}
                    labelWidth={4}
                    error={formik.errors['username']}
                    className="fe_u_padding--top-small"
                  />
                  <FormField
                    {...formik.getFieldProps('password')}
                    id="password"
                    labelText={labels.PASSWORD}
                    type="password"
                    error={formik.errors['password']}
                    labelWidth={4}
                    className="fe_u_padding--top-small"
                    onKeyPress={(event: any) => {
                      this.handleEnter(event, formik);
                    }}
                  />
                </Form>
              </div>
              <Button
                variant="tertiary"
                icon="Close"
                onClick={this.hideConfirmDeployDialog}
                className="my-close-button"
              />
              <div className="fe_c_lightbox__footer">
                <Button
                  text={Labels.CREATE_TASK.CANCEL}
                  variant="secondary"
                  className="fe_u_margin--right-small"
                  onClick={this.hideConfirmDeployDialog}
                />
                <Button
                  text={Labels.DEPLOY.CREATE_DEPLOYMENT}
                  onClick={formik.handleSubmit}
                />
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
          text={Labels.DEPLOY.DEPLOY}
          variant="primary"
          disabled={this.props.disabled}
          onClick={this.showConfirmDeployDialog}
        />
        {this.state.deployShown && this.renderConfirmRejectDialog()}
      </>
    );
  }
}
