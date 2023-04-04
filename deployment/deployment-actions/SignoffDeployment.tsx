import { Button, Checkbox, FormField, Lightbox } from '@athena/forge';
import { Formik } from 'formik';
import React, { Component } from 'react';
import Labels from '../../../constants/Labels';
import * as Yup from 'yup';
import { getDeployments } from '../../../services/CommonService';
import Messages from '../../../constants/Messages';
import StringUtil from '../../../utils/StringUtil';
import { DeploymentDetails } from '../../../types';

interface SignoffDeploymentProps {
  deployResponse: DeploymentDetails;
  onSignoff: (values: any) => any;
}
interface SignoffDeploymentState {
  showSignoff: boolean;
  releaseVersion: string;
}
export default class SignoffDeployment extends Component<
  SignoffDeploymentProps,
  SignoffDeploymentState
> {
  state: SignoffDeploymentState = {
    showSignoff: false,
    releaseVersion: '',
  };

  onConfirmSignoff = (values: any): void => {
    const payload = {
      ID: this.props.deployResponse.id,
      RELEASEVERSION: values['releaseVersion'],
      VERSION: this.props.deployResponse.version,
    };
    this.hideConfirmSignoffDialog();
    this.props.onSignoff(payload);
  };

  showConfirmSignoffDialog = (): void => {
    this.setState({ showSignoff: true });
  };

  hideConfirmSignoffDialog = (): void => {
    this.setState({ showSignoff: false });
  };

  componentDidMount(): void {
    this.getLastPassedDeploymentDetails();
  }

  incrementReleaseVersion = (releaseVersion: any): string => {
    const releaseArray = releaseVersion?.split('.');
    if (!releaseArray || releaseArray.length < 3) {
      return releaseVersion;
    }
    let lastBuildNumber = parseInt(releaseArray.pop());
    lastBuildNumber += 1;
    releaseArray.push(lastBuildNumber);
    return releaseArray.join('.');
  };

  getLastPassedDeploymentDetails = () => {
    getDeployments({ LIMIT: 1 }).then((data: any) => {
      const lastSuccessfullDeployment = data[0];
      this.setState({
        releaseVersion: this.incrementReleaseVersion(
          lastSuccessfullDeployment?.releaseVersion
        ),
      });
    });
  };

  validationSchema = Yup.object().shape({
    releaseVersion: Yup.string()
      .required(Messages.MSG_REQUIRED)
      .matches(
        /^(\d+\.)?(\d+\.)?(\*|\d+)$/,
        Labels.DEPLOY.RELEASE_VERSION_FORMAT_MESSAGE
      ),
    signoff1: Yup.bool().test(
      'is-checked',
      Messages.MSG_REQUIRED,
      (value) => value === true
    ),
    signoff2: Yup.bool().test(
      'is-checked',
      Messages.MSG_REQUIRED,
      (value) => value === true
    ),
  });

  getTaskIds(): React.ReactNode {
    const taskList = this.props.deployResponse.tasks;
    const taskIds: string[] = [];
    taskList?.forEach(function (task: any, index: any) {
      taskIds.push(StringUtil.formatTaskID(task.id));
    });
    return taskIds.join(', ');
  }

  renderConfirmSignoff(): JSX.Element {
    const labels = Labels.DEPLOY;
    const headerText =
      labels.SIGNOFF +
      ' ' +
      StringUtil.formatDeploymentID(this.props.deployResponse.id);

    const initialValue = {
      releaseVersion: this.state.releaseVersion,
      signoff1: false,
      signoff2: false,
    };
    return (
      <Formik
        initialValues={initialValue}
        validationSchema={this.validationSchema}
        onSubmit={this.onConfirmSignoff}
        validateOnMount={false}
        validateOnBlur={false}
        validateOnChange={false}
      >
        {(formik) => {
          return (
            <Lightbox
              show
              hideDividers
              headerText={headerText}
              disableClose
              width="large"
              className="my-custom-lightbox deployment-signoff"
            >
              <Button
                variant="tertiary"
                icon="Close"
                onClick={this.hideConfirmSignoffDialog}
                className="my-close-button"
              />
              <span>{this.getTaskIds()}</span>
              <FormField
                inputAs={Checkbox}
                id="signoff1"
                labelText=""
                description={labels.VERIFIED_DEPLOYMENT_VERIONS}
                checked={formik.values.signoff1}
                required
                errorAlwaysBelow
                {...formik.getFieldProps('signoff1')}
                error={formik.errors.signoff1}
              ></FormField>
              <FormField
                inputAs={Checkbox}
                id="signoff2"
                labelText=""
                description={labels.SAMPLE_REQUEST_TESTED}
                checked={formik.values.signoff2}
                required
                errorAlwaysBelow
                {...formik.getFieldProps('signoff2')}
                error={formik.errors.signoff2}
              ></FormField>
              <FormField
                id="releaseVersion"
                labelWidth={1}
                labelText={labels.RELEASE_VERSION}
                required
                {...formik.getFieldProps('releaseVersion')}
                errorAlwaysBelow
                error={formik.errors.releaseVersion}
              ></FormField>
              <div className="fe_c_lightbox__footer">
                <Button
                  text={labels.CANCEL}
                  onClick={this.hideConfirmSignoffDialog}
                  variant="secondary"
                  className="fe_u_margin--right-small"
                />
                <Button
                  text={labels.VERIFY}
                  id="verifySubmit"
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
          id="signoff-deployment"
          text={Labels.DEPLOY.VERIFY}
          onClick={this.showConfirmSignoffDialog}
        />
        {this.state.showSignoff && this.renderConfirmSignoff()}
      </>
    );
  }
}
