import { Button } from '@athena/forge';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import AppConstants from '../../../../../constants/AppConstants';
import Messages from '../../../../../constants/Messages';
import Labels from '../../../../../constants/Labels';
import { TaskDetail } from '../../../../../types';
import StringUtil from '../../../../../utils/StringUtil';
import {
  RejectTaskProps,
  UpdateTaskFooterProps,
  EscalateTaskProps,
} from '../../UpdateTaskProps';
import {
  rejectTaskAction,
  escalateTaskAction,
  getTaskDetail,
  resetPopupActions,
  getRightSectionActive,
  setRightFormAction,
} from '../../../../../slices/TaskSlice';
import {
  getActiveTaskStep,
  getNextTaskStep,
  getTaskStepsWithoutWorkLog,
} from '../../UpdateTask';
import ConfirmTransit from './ConfirmTransit';
import { isEmpty } from 'lodash';
import ReturnTransit from './ReturnTransit';
import { addAttentionToast } from '../../../../../slices/ToastSlice';
import { updateFormValidation } from '../../../../../slices/ValidationSlice';
import RejectTransit from './RejectTransit';
import ConfirmEscalateTask from './ConfirmEscalateTask';
import { Popover } from '@athena/forge-popover';
import './UpdateTaskFooter.scss';
import { fetchEventDetails } from '../../../../../slices/TaskHistorySlice';
import { getRightSectionSelectedTabIndex } from '../../../../../slices/TaskSlice';
import { isEmptyArray } from 'formik';
import moment from 'moment';
import {
  isPendingInAtlas,
  isPendingInJira,
  isPendingInRulesTracker,
} from '../../left-pane/task-dependency/TaskDependency';
import Acl from '../../../../../constants/Acl';
import AuthUtil from '../../../../../utils/AuthUtil';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import CommonUtil from '../../../../../utils/CommonUtil';

let taskDetails: TaskDetail | undefined;

interface UpdateTaskFooterState {
  shown: boolean;
  returnShown: boolean;
  rejectShown: boolean;
}

export class UpdateTaskFooter extends Component<
  UpdateTaskFooterProps,
  UpdateTaskFooterState
> {
  constructor(props: UpdateTaskFooterProps) {
    super(props);
    taskDetails = props.task;
  }

  state: UpdateTaskFooterState = {
    shown: false,
    returnShown: false,
    rejectShown: false,
  };

  showConfirmDialog = (): void => {
    this.setState({ shown: true });
  };

  checkRightDirtyStatus = () => {
    if (this.props.rightSectionActive) {
      this.props.setRightFormAction(true);
    }
  };

  showConfirmReturnDialog = () => {
    if (this.props.rightSectionActive) {
      this.props.setRightFormAction(true);
    } else {
      this.props.resetPopupActions();
      const activeStep = getActiveTaskStep(taskDetails);
      const {
        ANALYZE_TASK_STEP,
      } = AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS;
      if (activeStep?.workflowStepId !== ANALYZE_TASK_STEP) {
        this.setState({ returnShown: true });
      }
    }
  };

  showConfirmRejectDialog = () => {
    this.setState({ rejectShown: true });
  };

  hideConfirmRejectDialog = () => {
    this.setState({ rejectShown: false });
  };

  hideConfirmReturnDialog = () => {
    this.setState({ returnShown: false });
  };

  OnShowConfirm = (flag: number) => {
    const { addAttentionToast } = this.props;
    const activeTaskStep = getActiveTaskStep(taskDetails);
    const taskStepsWithoutWorkLog = getTaskStepsWithoutWorkLog(taskDetails);
    const {
      DEPLOY_CHANGES_STEP,
      REVIEW_CHANGES_STEP,
      ANALYZE_TASK_STEP,
    } = AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS;
    const isInReview = activeTaskStep?.workflowStepId === REVIEW_CHANGES_STEP;
    const isInDeploy = activeTaskStep?.workflowStepId === DEPLOY_CHANGES_STEP;
    const isAnalyzeTask = activeTaskStep?.workflowStepId === ANALYZE_TASK_STEP;
    const isSignOff = AppConstants.UI_CONSTANTS.EVENT_SUBMIT_TASK === flag;
    const isReturnTaskEvent =
      AppConstants.UI_CONSTANTS.EVENT_RETURN_TASK === flag;
    const isRejectTaskEvent =
      AppConstants.UI_CONSTANTS.EVENT_REJECT_TASK === flag;
    if (isAnalyzeTask && isEmpty(taskDetails?.dueDate)) {
      addAttentionToast({
        headerText: Messages.VALIDATION_FAILED,
        message: Messages.DUE_DATE_MANDATORY,
      });
    } else if (isInReview && isEmpty(taskDetails?.jiraId)) {
      addAttentionToast({
        headerText: Messages.VALIDATION_FAILED,
        message: Messages.JIRA_ID_MANDATORY,
      });
    } else if (
      isInDeploy &&
      isEmpty(taskDetails?.deploymentDate) &&
      !isReturnTaskEvent &&
      !isRejectTaskEvent
    ) {
      addAttentionToast({
        headerText: Messages.VALIDATION_FAILED,
        message: Messages.DEPLOYMENT_DATE_MANDATORY,
      });
    } else if (
      isInDeploy &&
      isEmpty(taskDetails?.jiraId) &&
      !isReturnTaskEvent &&
      !isRejectTaskEvent
    ) {
      addAttentionToast({
        headerText: Messages.VALIDATION_FAILED,
        message: Messages.JIRA_ID_MANDATORY,
      });
    } else if (taskStepsWithoutWorkLog.length > 0 && !isRejectTaskEvent) {
      this.props?.updateFormValidation({
        isWorkLogFormValid: true,
      });
      addAttentionToast({
        headerText: Messages.WORK_LOG_VALIDATION_FAILURE.HEADER,
        message: isSignOff
          ? Messages.WORK_LOG_VALIDATION_FAILURE.SIGNOFF_MESSAGE
          : isReturnTaskEvent
          ? Messages.WORK_LOG_VALIDATION_FAILURE.RETURN_MESSAGE
          : '',
      });
    } else if (
      this.disableConsecutiveSignoff() &&
      !isReturnTaskEvent &&
      !isRejectTaskEvent
    ) {
      addAttentionToast({
        headerText: Messages.CONSECUTIVE_SIGNOFF_HEADER_MESSAGE,
        message: Messages.DISABLE_CONSECUTIVE_SIGNOFF,
      });
    } else {
      if (taskStepsWithoutWorkLog.length === 0 && !isRejectTaskEvent) {
        this.props?.updateFormValidation({
          isWorkLogFormValid: false,
        });
      }
      if (isSignOff) {
        this.showConfirmDialog();
      } else if (isReturnTaskEvent) {
        this.showConfirmReturnDialog();
      } else if (isRejectTaskEvent) {
        this.showConfirmRejectDialog();
      }
    }
  };

  closeConfirmDialog = (): void => {
    this.setState({ shown: false });
  };

  onConfirm = (values: any): void => {
    const { formik } = this.props;
    this.closeConfirmDialog();
    formik.setValues({ ...formik.values, ...values, signedOffYn: true });
    formik.submitForm();
  };

  onReturn = (values: any) => {
    this.hideConfirmReturnDialog();
    this.props.onReturn({
      ...values,
      version: taskDetails?.version,
      id: taskDetails?.id,
    });
  };

  onReject = (values: any) => {
    this.props.resetPopupActions();
    this.hideConfirmRejectDialog();
    const payload: RejectTaskProps = {
      id: taskDetails?.id,
      version: taskDetails?.version,
      rejectionReasonId: values.reason,
      rejectionReasonNote: values.description,
    };

    this.props.rejectTaskAction(payload).then((taskDetails: any) => {
      if (
        this.props.selectedTabIndex ===
        AppConstants.UI_CONSTANTS.RIGHT_SECTION.HISTORY_TAB_INDEX
      ) {
        this.props.fetchEventDetails(taskDetails.id);
      }
    });
  };

  onSubmit = (): void => {
    if (this.props.rightSectionActive) {
      this.props.setRightFormAction(true);
    } else {
      this.props.resetPopupActions();
      const { formik } = this.props;
      formik.setSubmitting(true);
      formik.validateForm().then((errors) => {
        if (isEmpty(errors)) {
          this.OnShowConfirm(AppConstants.UI_CONSTANTS.EVENT_SUBMIT_TASK);
        } else {
          this.OnShowConfirm(AppConstants.UI_CONSTANTS.EVENT_SUBMIT_TASK);
          this.setState({ shown: false });
          formik.setSubmitting(false);
          this.props.onTransition(formik);
          const [
            TASK_DETAIL_ATTRIBUTES,
            TASK_DECISION_TABLE_DETAILS,
            BR_DETAIL_ATTRIBUTES,
          ] = [
            AppConstants.UI_CONSTANTS.TASK_ATTRIBUTES.TASK_DETAIL_ATTRIBUTES,
            AppConstants.UI_CONSTANTS.TASK_ATTRIBUTES
              .TASK_DECISION_TABLE_DETAILS,
            AppConstants.UI_CONSTANTS.TASK_ATTRIBUTES.BR_DETAIL_ATTRIBUTES,
          ];
          let flag = false;
          flag = this.focusErrorField(
            TASK_DETAIL_ATTRIBUTES,
            TASK_DECISION_TABLE_DETAILS,
            flag,
            errors,
            0
          );
          if (!flag) {
            flag = this.focusErrorField(
              BR_DETAIL_ATTRIBUTES,
              '',
              flag,
              errors,
              1
            );
          }
        }
      });
    }
  };

  focusErrorField = (
    attributes: any,
    taskDtAttributes: any,
    flag: boolean,
    errors: any,
    tab: number
  ): boolean => {
    for (let i = 0; i < attributes.length; i++) {
      const field = attributes[i];
      for (const key in errors) {
        if (field === key && field !== 'taskDecisionTableDetails') {
          this.props.setSelectedIndex(tab);
          this.focusToField(field);
          flag = true;
          return flag;
        } else if (field === key && field === 'taskDecisionTableDetails') {
          for (const index in errors[key]) {
            const item = errors[key][index];
            this.props.setSelectedIndex(tab);
            for (let i = 0; i < taskDtAttributes.length; i++) {
              const field = taskDtAttributes[i];
              for (const key in item) {
                if (field === key) {
                  this.focusToField(
                    `taskDecisionTableDetails.${+index}.${field}`
                  );
                  flag = true;
                  return flag;
                }
              }
            }
          }
        }
      }
    }
    return flag;
  };

  focusToField(field: string) {
    const elementByName = document.getElementsByName(field);
    const elementByClassName = document.getElementsByClassName(field);
    const RTE_FIELD_IDS = AppConstants.UI_CONSTANTS.RTE_FIELD_IDS;
    if (Object.keys(RTE_FIELD_IDS).includes(field)) {
      const elementId = (RTE_FIELD_IDS as any)[field];
      const element = document.getElementById(elementId);
      if (element) element.scrollIntoView();
    } else if (elementByName && elementByName[0]) {
      elementByName[0].focus();
    } else if (elementByClassName && elementByClassName[0]) {
      elementByClassName[0].scrollIntoView(true);
    }
  }

  handleRejectTask = (): void => {
    this.props.resetPopupActions();
    const payload: RejectTaskProps = {
      id: taskDetails?.id,
      version: taskDetails?.version,
    };

    this.props.rejectTaskAction(payload).then((taskDetails: any) => {
      if (
        this.props.selectedTabIndex ===
        AppConstants.UI_CONSTANTS.RIGHT_SECTION.HISTORY_TAB_INDEX
      ) {
        this.props.fetchEventDetails(taskDetails.id);
      }
    });
  };

  handleEscalateTask = (): void => {
    this.props.resetPopupActions();
    const payload: EscalateTaskProps = {
      id: taskDetails?.id,
      version: taskDetails?.version,
      escalatedyn: AppConstants.SERVER_CONSTANTS.YES,
    };

    this.props.escalateTaskAction(payload);
  };

  handleDeEscalateTask = (): void => {
    this.props.resetPopupActions();
    const payload: EscalateTaskProps = {
      id: taskDetails?.id,
      version: taskDetails?.version,
      escalatedyn: AppConstants.SERVER_CONSTANTS.NO,
    };

    this.props.escalateTaskAction(payload);
  };

  isPendingInAtlas = (dependenciesAtlas: any): any => {
    let isPending = true;
    dependenciesAtlas?.forEach(function (dependency: any) {
      if (!isPendingInAtlas(dependency, taskDetails?.deploymentDate)) {
        isPending = false;
      }
    });
    return isPending;
  };
  isPendingInJira = (dependenciesJira: any): any => {
    let isPending = true;
    dependenciesJira?.forEach(function (dependency: any) {
      if (!isPendingInJira(dependency, taskDetails?.deploymentDate)) {
        isPending = false;
      }
    });
    return isPending;
  };
  isPendingInRulesTracker = (dependenciesRulesTraker: any): any => {
    let isPending = true;
    dependenciesRulesTraker?.forEach(function (dependency: any) {
      if (!isPendingInRulesTracker(dependency, taskDetails?.deploymentDate)) {
        isPending = false;
      }
    });
    return isPending;
  };
  isDependenciesBlocked = (blockedDependencies: any): any => {
    let isPending = true;
    blockedDependencies?.forEach(function (dependency: any) {
      if (
        dependency.dependencyName ===
        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.SPECIFIC_DEPLOYMENT_DATE
      ) {
        if (
          !(
            moment(dependency.dependencyDate).isSame(
              moment(taskDetails?.deploymentDate)
            ) && dependency.statusName === 'Completed'
          )
        )
          isPending = false;
      } else {
        if (dependency.statusName !== 'Completed') {
          isPending = false;
        }
      }
    });
    return isPending;
  };
  isDependenciesPending = (): boolean => {
    const dependenciesAtlas = taskDetails?.taskDependencies?.filter(
      (dependency: any) =>
        dependency.dependencySystemId ===
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.ATLAS_ID &&
        dependency.dependencyCondition ===
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
    );
    const dependenciesJira = taskDetails?.taskDependencies?.filter(
      (dependency: any) =>
        dependency.dependencySystemId ===
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.JIRA_ID &&
        dependency.dependencyCondition ===
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
    );
    const dependenciesRulesTraker = taskDetails?.taskDependencies?.filter(
      (dependency: any) =>
        dependency.dependencySystemId ===
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.RULE_TRACKER_ID &&
        dependency.dependencyCondition ===
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
    );
    const blockedDependencies = taskDetails?.taskDependencies?.filter(
      (dependency: any) =>
        dependency.dependencyCondition ===
        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.BLOCKED_BY
    );
    if (
      taskDetails?.taskDependencies.length !==
      taskDetails?.taskDependencies.filter((obj) => obj.deleted).length
    ) {
      if (
        this.isPendingInAtlas(dependenciesAtlas) &&
        this.isPendingInJira(dependenciesJira) &&
        this.isPendingInRulesTracker(dependenciesRulesTraker) &&
        this.isDependenciesBlocked(blockedDependencies)
      ) {
        return false;
      } else {
        return true;
      }
    } else {
      return false;
    }
  };

  disableConsecutiveSignoff = (): boolean => {
    const taskSteps = this.props.task?.taskSteps;
    const activeTaskStep = getActiveTaskStep(this.props.task);
    const previousTaskStep = CommonUtil.getPreviousTaskStep(
      taskSteps,
      activeTaskStep
    );
    return AuthUtil.disableConsecutiveSignoff(previousTaskStep?.assignedTo);
  };

  render(): JSX.Element {
    taskDetails = this.props.task;
    const activeStep = getActiveTaskStep(taskDetails);
    const escalateMessage: string =
      Labels.TASK_DETAIL_FORM.ESCALATE +
      ' ' +
      StringUtil.formatTaskID(taskDetails?.id) +
      ' ?';
    const deescalateMessage: string =
      Labels.TASK_DETAIL_FORM.DEESCALATE +
      ' ' +
      StringUtil.formatTaskID(taskDetails?.id) +
      ' ?';
    const isDisabled: boolean =
      taskDetails?.statusId ===
        AppConstants.SERVER_CONSTANTS.STATUSES.REJECTED ||
      taskDetails?.statusId ===
        AppConstants.SERVER_CONSTANTS.STATUSES.IN_PRODUCTION;
    const hasPendingDependencies: boolean =
      activeStep?.workflowStepId ==
      AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS.DEPLOY_CHANGES_STEP
        ? this.isDependenciesPending()
        : false;
    const label = Labels.TASK_DETAIL_FORM;
    const nextStep = getNextTaskStep(taskDetails);
    const { formik } = this.props;

    return (
      <div className="update-task-footer">
        <Popover
          icon="Expand"
          text={label.MORE_ACTIONS}
          placement="top"
          disableButton={isDisabled}
        >
          {!this.props.rightSectionActive ? (
            <WFEnableForPermission permission={Acl.TASK_REJECT}>
              <Button
                id="reject"
                text={label.REJECT_TASK}
                variant="secondary"
                disabled={isDisabled}
                onClick={() =>
                  this.OnShowConfirm(
                    AppConstants.UI_CONSTANTS.EVENT_REJECT_TASK
                  )
                }
                icon="Close"
              />
            </WFEnableForPermission>
          ) : (
            <WFEnableForPermission permission={Acl.TASK_REJECT}>
              <Button
                text={label.REJECT_TASK}
                variant="secondary"
                disabled={isDisabled}
                onClick={this.checkRightDirtyStatus}
                icon="Close"
              />
            </WFEnableForPermission>
          )}
          {taskDetails?.escalatedYn !== 'Y' ? (
            <WFEnableForPermission permission={Acl.TASK_ESCALATE}>
              <ConfirmEscalateTask
                buttonText={label.ESCALATE_TASK}
                primaryModalText={label.ESCALATE}
                headerText={escalateMessage}
                action={this.handleEscalateTask}
                variant="secondary"
                disabled={isDisabled}
                icon="Critical"
              />
            </WFEnableForPermission>
          ) : (
            <WFEnableForPermission permission={Acl.TASK_ESCALATE}>
              <ConfirmEscalateTask
                buttonText={label.DEESCALATE_TASK}
                primaryModalText={label.DEESCALATE}
                headerText={deescalateMessage}
                action={this.handleDeEscalateTask}
                variant="secondary"
                disabled={isDisabled}
                icon="Critical"
              />
            </WFEnableForPermission>
          )}
          <WFEnableForPermission permission={Acl.TASK_RETURN}>
            <Button
              id="return"
              text={label.RETURN_TASK}
              variant="secondary"
              disabled={
                isDisabled ||
                activeStep?.workflowStepId ===
                  AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS.ANALYZE_TASK_STEP
              }
              onClick={() =>
                this.OnShowConfirm(AppConstants.UI_CONSTANTS.EVENT_RETURN_TASK)
              }
              icon="Left"
            />
          </WFEnableForPermission>
        </Popover>
        <WFEnableForPermission permission={Acl.TASK_UPDATE}>
          <Button
            id="savebtn"
            text={label.SAVE}
            variant="secondary"
            onClick={() => this.props.onSave(formik)}
            disabled={isDisabled}
            className={isDisabled ? 'vis-hidden' : ' '}
          />
        </WFEnableForPermission>
        <WFEnableForPermission permission={Acl.TASK_SIGNOFF}>
          <Button
            id="nextbtn"
            text={
              nextStep?.transitionText
                ? nextStep.transitionText
                : Labels.TRANSIT.DEPLOYMENT_COMPLETE
            }
            onClick={this.onSubmit}
            disabled={
              isDisabled ||
              !isEmptyArray(taskDetails?.associatedBRTasks) ||
              hasPendingDependencies ||
              (AuthUtil.isPermissionEnabled() && !taskDetails?.canSignOff)
            }
            className={isDisabled ? 'vis-hidden' : ' '}
          />
        </WFEnableForPermission>
        {activeStep && this.state.shown && (
          <ConfirmTransit
            activeStep={activeStep}
            nextStep={nextStep}
            onConfirm={this.onConfirm}
            onCancel={this.closeConfirmDialog}
            dependencies={this.props.task?.taskDependencies}
          />
        )}

        {taskDetails && this.state.returnShown && (
          <ReturnTransit
            task={taskDetails}
            onConfirm={this.onReturn}
            onCancel={this.hideConfirmReturnDialog}
          />
        )}
        {taskDetails && this.state.rejectShown && (
          <RejectTransit
            onConfirm={this.onReject}
            onCancel={this.hideConfirmRejectDialog}
          />
        )}
      </div>
    );
  }
}

export default connect(
  (state) => {
    return {
      task: getTaskDetail(state),
      rightSectionActive: getRightSectionActive(state),
      selectedTabIndex: getRightSectionSelectedTabIndex(state),
    };
  },
  {
    addAttentionToast,
    rejectTaskAction,
    escalateTaskAction,
    updateFormValidation,
    resetPopupActions,
    setRightFormAction,
    fetchEventDetails,
  }
)(UpdateTaskFooter);
