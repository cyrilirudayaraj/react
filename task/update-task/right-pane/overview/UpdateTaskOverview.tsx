import {
  Button,
  DateInput,
  FormField,
  GridCol,
  GridRow,
  ReadOnlyInput,
  Select,
  Label,
  StatusTag,
  Multiselect,
  Accordion,
  AccordionItem,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import Labels from '../../../../../constants/Labels';

import AppConstants from '../../../../../constants/AppConstants';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import StringUtil from '../../../../../utils/StringUtil';
import { getAssignedTo, getActiveTaskStep } from '../../UpdateTask';
import { UpdateTaskOverviewProps } from '../../UpdateTaskProps';
import {
  getTaskDetail,
  updateTaskAction,
  getEditBtnValue,
  setLeftFormAction,
  resetPopupActions,
  setRightFormAction,
  setLeftSectionActive,
  resetcancelBtnAction,
  getLeftSectionActive,
  getRightSectionActive,
  setRightSectionActiveAction,
  getRightFormAction,
  resetNextUrlAction,
  getNextUrl,
} from '../../../../../slices/TaskSlice';

import {
  getUsers,
  getOriginatingSystems,
  getBRUpdateReasons,
  fetchUsersOnce,
  fetchOriginatingSytemsOnce,
  fetchDepartmentOriginsOnce,
  getDepartmentOrigins,
  fetchBRUpdateReasonsOnce,
} from '../../../../../slices/MasterDataSlice';
import WFReadOnlyInput from '../../../../../components/wf-readonlyinput/WFReadOnlyInput';
import Messages from '../../../../../constants/Messages';
import { addSuccessToast } from '../../../../../slices/ToastSlice';
import { TaskDetail } from '../../../../../types';
import { DirtyCheckWarningPopup } from '../../DirtyCheckWarningPopup';
import { isEmpty, isEqual } from 'lodash';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import Acl from '../../../../../constants/Acl';
import { withRouter } from 'react-router-dom';
import moment from 'moment';
import { autoCompleteBlockedbyDependencies } from '../../left-pane/task-dependency/TaskDependency';
import CommonUtil from '../../../../../utils/CommonUtil';
import { searchBusinessRequirements } from '../../../../../services/CommonService';

interface TaskOverviewState {
  legacyRuleIds: string[];
  popupShown: any;
  dontSave: boolean;
  workflowStepId: any;
  jiraField: any;
  deploymentField: any;
  functionThis?: any;
  expandPriority: boolean;
  expandPeople: boolean;
  expandDetails: boolean;
  expandLegacyDetails: boolean;
  expandDates: boolean;
  brUpdateReasonsByTaskType: any[];
}
const constants = AppConstants.SERVER_CONSTANTS;

class UpdateTaskOverview extends Component<
  UpdateTaskOverviewProps,
  TaskOverviewState
> {
  constructor(props: UpdateTaskOverviewProps) {
    super(props);
    this.state = {
      legacyRuleIds: [],
      popupShown: '',
      dontSave: false,
      workflowStepId: '',
      jiraField: false,
      deploymentField: false,
      functionThis: this,
      expandPriority: true,
      expandPeople: true,
      expandDetails: true,
      expandLegacyDetails: true,
      expandDates: true,
      brUpdateReasonsByTaskType: [],
    };
    this.fetchFormDetails();
  }
  static getDerivedStateFromProps(props: any, state: any) {
    const activeTaskStep = getActiveTaskStep(props.task);
    const workflowStepId = activeTaskStep
      ? activeTaskStep.workflowStepId
      : '-1';
    const stateRetunObj = {
      popupShown: props.rightFormFlag,
      jiraField: false,
      deploymentField: false,
    };
    switch (workflowStepId) {
      case constants.WORKFLOW_STEPS.DEPLOY_CHANGES_STEP: {
        stateRetunObj.jiraField = true;
        stateRetunObj.deploymentField = true;
      }
      case constants.WORKFLOW_STEPS.REVIEW_CHANGES_STEP: {
      }
      default: {
      }
    }
    return stateRetunObj;
  }
  addMandatoryFields(): void {
    const activeTaskStep = getActiveTaskStep(this.props.task);
    const workflowStepId = activeTaskStep
      ? activeTaskStep.workflowStepId
      : '-1';
    switch (workflowStepId) {
      case constants.WORKFLOW_STEPS.DEPLOY_CHANGES_STEP: {
        this.setState({ jiraField: true });
        this.setState({ deploymentField: true });
      }
      case constants.WORKFLOW_STEPS.REVIEW_CHANGES_STEP: {
      }
      case constants.WORKFLOW_STEPS.TEST_CHANGES_STEP: {
      }
      case constants.WORKFLOW_STEPS.CODE_CHANGES_STEP: {
      }
      case constants.WORKFLOW_STEPS.MODEL_CHANGES_STEP: {
      }
      case constants.WORKFLOW_STEPS.MANAGER_REVIEW_STEP: {
      }
      case constants.WORKFLOW_STEPS.REVIEW_TASK_STEP: {
      }
      case constants.WORKFLOW_STEPS.ANALYZE_TASK_STEP: {
      }
      default: {
      }
    }
  }
  fetchFormDetails(): void {
    this.props.fetchOriginatingSytemsOnce();
    this.props.fetchUsersOnce();
    this.props.fetchDepartmentOriginsOnce();
    this.props.fetchBRUpdateReasonsOnce();
  }

  formCancel = (): void => {
    this.props.resetPopupActions();
    this.props.resetcancelBtnAction(false);
    this.props.toggleReset();
  };
  onSubmit = (values: any): void => {
    if (this.props.leftSectionActive) {
      this.props.setLeftFormAction(true);
    } else {
      const { addSuccessToast, task } = this.props;
      const taskDependencies = task?.taskDependencies;
      const { nextUrl } = this.props;
      this.props.resetPopupActions();
      if (
        taskDependencies &&
        !moment(values.deploymentDate).isSame(task?.deploymentDate)
      ) {
        values.taskDependencies = autoCompleteBlockedbyDependencies(
          taskDependencies,
          values.deploymentDate
        );
      }
      if (CommonUtil.isActiveTaskType(values.taskTypeId)) {
        values.brUpdateReasonIds = ConversionUtil.convertDropDownListToValues(
          values.brUpdateReasonIds
        );
      }
      this.props.updateTaskAction(values).then((taskDetails: TaskDetail) => {
        if (nextUrl) {
          this.props.history.push(nextUrl);
          this.props.resetNextUrlAction();
        }
        const { HEADER, MESSAGE } = Messages.UPDATE_TASK_OVERVIEW_SUCCESS;
        addSuccessToast({
          message: MESSAGE,
          headerText: HEADER,
          params: {
            id: taskDetails.id,
          },
        });
      });
      this.props.toggleReset();
      this.props.setRightFormAction(false);
    }
  };

  handleSave(event: any, formik: any) {
    event.preventDefault();
    formik.validateForm().then((errors: any) => {
      formik.handleSubmit();
      if (!isEmpty(errors)) {
        this.setState({
          expandPeople: true,
          expandPriority: true,
          expandDates: true,
          expandDetails: true,
          expandLegacyDetails: true,
        });
      }
    });
  }

  validationSchema = Yup.object().shape({
    legacyRuleId: Yup.string()
      .when('taskTypeId', {
        is: AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR,
        then: Yup.string().required('Required!'),
        otherwise: Yup.string(),
      })
      .test({
        name: 'Legacy rule id not exist',
        test: async function () {
          let isLegacyRuleExist = false;
          const { taskTypeId } = this.parent;
          if (
            taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR
          ) {
            isLegacyRuleExist = this.parent.isLegacyRuleExist;
          }
          return isLegacyRuleExist
            ? this.createError({
                message: Messages.LEGACY_RULE_ID_EXISTS,
              })
            : true;
        },
      }),
    legacyTaskId: Yup.string().when('taskTypeId', {
      is: (taskTypeId) =>
        taskTypeId ==
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
        taskTypeId ==
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR,
      then: Yup.string().required('Required!'),
      otherwise: Yup.string(),
    }),
    originatingCaseId: Yup.string().required('Required!'),
    departmentOriginId: Yup.string().required('Required!'),
    dueDate: Yup.date().required('Required!'),
    brUpdateReasonIds: Yup.mixed().when('taskTypeId', {
      is: (taskTypeId) => CommonUtil.isActiveTaskType(taskTypeId),
      then: Yup.array().nullable().required('Required!'),
      otherwise: Yup.string(),
    }),
  });

  validateLegacyRuleId(event: any, formik: any): void {
    formik.setFieldValue('isLegacyRuleExist', false);
    formik.setFieldTouched('legacyRuleId', true, false);
    const legacyRuleIdValue = event.target.value;
    if (legacyRuleIdValue && legacyRuleIdValue.length > 2) {
      searchBusinessRequirements({
        LEGACYRULEPREFIX: legacyRuleIdValue,
      }).then((data: any) => {
        const result = data.find((obj: any) => {
          return obj.legacyRuleId === legacyRuleIdValue;
        });
        if (result) {
          formik.setFieldTouched('legacyRuleId', true, false);
          formik.setFieldValue('isLegacyRuleExist', true);
        }
      });
    }
  }

  getBRUpdateReasonsByTaskType = () => {
    const brUpdateReasonsByTaskType = this.props.brUpdateReasons?.filter(
      (brUpdateReason) => {
        const taskTypeIds = brUpdateReason.taskTypeIds
          .split(',')
          .map((taskTypeId: string) => taskTypeId.trim());
        return taskTypeIds.includes(this.props.task?.taskTypeId);
      }
    );
    return brUpdateReasonsByTaskType;
  };
  onReject = (formik: FormikProps<any>) => {
    const { nextUrl } = this.props;
    if (nextUrl) {
      this.props.history.push(nextUrl);
      this.props.resetNextUrlAction();
    }
    this.props.resetPopupActions();
    formik.resetForm();
  };
  onCancel = (): void => {
    this.props.setRightFormAction(false);
    this.props.resetcancelBtnAction(false);
    this.props.resetNextUrlAction();
  };
  render(): React.ReactNode {
    const labels = Labels.TASK_OVERVIEW;
    const overviewWidth = { small: 6 };
    const task = this.props.task;
    const initialValues = {
      assignedTo: getAssignedTo(task) || '',
      originatingSystemId: task?.originatingSystemId || '',
      originatingCaseId: task?.originatingCaseId || '',
      legacyRuleId: task?.legacyRuleId || '',
      legacyTaskId: task?.legacyTaskId || '',
      legacyRuleArchived: task?.legacyRuleArchived
        ? new Date(task?.legacyRuleArchived)
        : null,
      dueDate: task?.dueDate ? new Date(task?.dueDate) : '',
      jiraId: task?.jiraId || '',
      deploymentDate: task?.deploymentDate
        ? new Date(task?.deploymentDate)
        : null,
      clientDueDate: task?.clientDueDate ? new Date(task?.clientDueDate) : null,
      id: task?.id || '',
      version: task?.version || '',
      activeTaskStepId: task?.activeTaskStepId || '',
      taskTypeId: task?.taskTypeId,
      departmentOriginId: task?.departmentOriginId || '',
      brUpdateReasonIds: ConversionUtil.convertMapToDropDownList(
        task?.brUpdateReasons
      ),
      isLegacyRuleExist: false,
    };

    const taskstatus = task?.status == undefined ? '' : task?.status;
    const handleAccordionClick = (event: any, expandAttribute: any) => {
      switch (expandAttribute) {
        case AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDPEOPLE:
          this.setState({ expandPeople: !this.state.expandPeople });
          break;
        case AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDDETAILS:
          this.setState({ expandDetails: !this.state.expandDetails });
          break;
        case AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDPRIORITY:
          this.setState({ expandPriority: !this.state.expandPriority });
          break;
        case AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDLEGACYDETAILS:
          this.setState({
            expandLegacyDetails: !this.state.expandLegacyDetails,
          });
          break;
        case AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDDATES:
          this.setState({ expandDates: !this.state.expandDates });
          break;
      }
    };
    return (
      <Formik
        enableReinitialize={true}
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
        validateOnChange={false}
        validateOnBlur={false}
        validateOnMount={false}
      >
        {(formik) => {
          const { leftSectionActive, rightSectionActive } = this.props;
          const {
            onChange: onLegacyRuleIdChange,
            ...rest
          } = formik.getFieldProps('legacyRuleId');
          if (leftSectionActive) {
            if (formik.dirty) {
              formik.resetForm();
              this.props.setLeftFormAction(true);
            }
          } else if (!rightSectionActive && formik.dirty) {
            this.props.setRightSectionActiveAction(true);
          } else if (
            rightSectionActive &&
            isEqual(formik.initialValues, formik.values) &&
            !formik.dirty
          ) {
            this.props.resetPopupActions();
          }
          return (
            <div className="update-overview">
              <div className="overview-pane-scroll">
                <Accordion>
                  <AccordionItem
                    className="accordion-priority"
                    headingText={
                      Labels.TASK_OVERVIEW.PRIORITY + ': ' + task?.priorityName
                    }
                    onExpandedChange={(event) =>
                      handleAccordionClick(
                        event,
                        AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDPRIORITY
                      )
                    }
                    expanded={this.state.expandPriority}
                  >
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol>
                        <WFReadOnlyInput
                          labelText={labels.PRIORITY}
                          text={task?.priorityName}
                        />
                      </GridCol>
                      <GridCol>
                        <WFReadOnlyInput
                          labelText={labels.PRIORITY_REASON}
                          text={task?.priorityReason}
                        />
                      </GridCol>
                    </GridRow>
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol>
                        <WFReadOnlyInput
                          labelText={labels.PRIORITY_REASON_NOTE}
                          text={task?.priorityReasonNote}
                        />
                      </GridCol>
                    </GridRow>
                  </AccordionItem>
                  <AccordionItem
                    headingText={Labels.TASK_OVERVIEW.DETAILS}
                    onExpandedChange={(event) =>
                      handleAccordionClick(
                        event,
                        AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDDETAILS
                      )
                    }
                    expanded={this.state.expandDetails}
                  >
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol>
                        <FormField
                          id="taskid"
                          inputAs={ReadOnlyInput}
                          labelText={labels.TASK_ID}
                          text={StringUtil.formatTaskID(task?.id)}
                        />
                      </GridCol>
                      <GridCol>
                        <WFReadOnlyInput
                          labelText={
                            Labels.TASK_BUSINESS_REQUIREMENT_FIELD_LABEL
                              .BUSINESS_REQUIREMENT_ID
                          }
                          text={StringUtil.formatBRID(
                            task?.businessRequirementId
                          )}
                        />
                      </GridCol>
                    </GridRow>
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol className="fe_u_padding--small">
                        <FormField
                          id="taskTypeName"
                          inputAs={ReadOnlyInput}
                          labelText={labels.TASK_TYPE}
                          text={StringUtil.returnHyphenIfEmpty(
                            task?.taskTypeName
                          )}
                        />
                      </GridCol>
                      <GridCol width={overviewWidth}>
                        {CommonUtil.isActiveTaskType(task?.taskTypeId) && (
                          <WFEnableForPermission
                            permission={
                              Acl.BUSINESS_REQUIREMENT_UPDATE_REASONS_UPDATE
                            }
                          >
                            <FormField
                              labelText={labels.BR_UPDATE_REASON}
                              inputAs={Multiselect}
                              required={true}
                              {...formik.getFieldProps('brUpdateReasonIds')}
                              id="brUpdateReasonIds"
                              options={ConversionUtil.convertMapToDropDownList(
                                this.getBRUpdateReasonsByTaskType()
                              )}
                              error={formik.errors.brUpdateReasonIds?.toString()}
                            />
                          </WFEnableForPermission>
                        )}
                      </GridCol>
                    </GridRow>
                    <GridRow className="fe_u_padding--top-small">
                      <GridCol className="status-padding-singlerow">
                        <Label
                          className="fe_c_label"
                          text={labels.CURRENT_STATUS}
                        ></Label>
                        <StatusTag
                          className={` status_nowrap_no_transform ${StringUtil.getStatusClassName(
                            task?.statusId
                          )}`}
                          text={taskstatus}
                        />
                      </GridCol>
                    </GridRow>

                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol width={overviewWidth}>
                        <WFEnableForPermission
                          permission={Acl.TASK_ORIGINATING_SYSTEM_UPDATE}
                        >
                          <FormField
                            id="originatingSystemId"
                            inputAs={Select}
                            labelText={labels.ORIGINATING_SYSTEM}
                            options={ConversionUtil.convertMapToDropDownList(
                              this.props.originatingSystems
                            )}
                            {...formik.getFieldProps('originatingSystemId')}
                          />
                        </WFEnableForPermission>
                      </GridCol>
                      <GridCol width={overviewWidth}>
                        <WFEnableForPermission
                          permission={Acl.TASK_ORIGINATING_SYSTEM_ID_UPDATE}
                        >
                          <FormField
                            id="originatingCaseId"
                            required
                            maxlength="20"
                            labelText={labels.ORIGINATING_CASE}
                            {...formik.getFieldProps('originatingCaseId')}
                            error={formik.errors.originatingCaseId}
                          />
                        </WFEnableForPermission>
                      </GridCol>
                    </GridRow>
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol>
                        <FormField
                          id="departmentOrigin"
                          inputAs={Select}
                          required
                          labelText={labels.DEPARTMENT_ORIGIN}
                          {...formik.getFieldProps('departmentOriginId')}
                          options={ConversionUtil.convertMapToDropDownList(
                            this.props.departmentOrigins
                          )}
                          error={formik.errors.departmentOriginId}
                        />
                      </GridCol>
                      <GridCol width={overviewWidth}>
                        <WFEnableForPermission
                          permission={Acl.TASK_JIRA_ISSUE_UPDATE}
                        >
                          <FormField
                            id="jiraId"
                            maxlength="50"
                            required={this.state.jiraField}
                            labelText={labels.JIRA_ISSUE}
                            {...formik.getFieldProps('jiraId')}
                          />
                        </WFEnableForPermission>
                      </GridCol>
                    </GridRow>
                  </AccordionItem>
                  {task?.taskTypeId !==
                    AppConstants.SERVER_CONSTANTS.TASK_TYPES
                      .NEW_BUSINESS_REQUIREMENT && (
                    <AccordionItem
                      headingText={Labels.TASK_OVERVIEW.LEGACYDETAILS}
                      onExpandedChange={(event) =>
                        handleAccordionClick(
                          event,
                          AppConstants.UI_CONSTANTS.TASK_OVERVIEW
                            .EXPANDLEGACYDETAILS
                        )
                      }
                      expanded={this.state.expandLegacyDetails}
                    >
                      <GridRow className="fe_u_padding--top-small">
                        {task?.taskTypeId !==
                          AppConstants.SERVER_CONSTANTS.TASK_TYPES
                            .DUAL_MAINTENANCE_NEW_BR && (
                          <GridCol>
                            <WFReadOnlyInput
                              labelText={labels.LEGACY_RULE}
                              href={StringUtil.getRTRuleIdUrl(
                                task?.legacyRuleId
                              )}
                              target="_blank"
                              text={task?.legacyRuleId}
                            />
                          </GridCol>
                        )}
                        {task?.taskTypeId ===
                          AppConstants.SERVER_CONSTANTS.TASK_TYPES
                            .DUAL_MAINTENANCE_NEW_BR && (
                          <GridCol width={overviewWidth}>
                            <FormField
                              labelText={labels.LEGACY_RULE}
                              id="legacyRuleId"
                              required
                              {...rest}
                              onBlur={(event: any) => {
                                this.validateLegacyRuleId(event, formik);
                              }}
                              onChange={(event: any) => {
                                const { value } = event.target;
                                if (
                                  /^\d+\.?(\d+)?$/.test(value) ||
                                  value == ''
                                ) {
                                  onLegacyRuleIdChange(event);
                                }
                              }}
                              error={formik.errors.legacyRuleId}
                            />
                          </GridCol>
                        )}
                        {task?.taskTypeId ===
                          AppConstants.SERVER_CONSTANTS.TASK_TYPES
                            .BUSINESS_REQUIREMENT_UPDATE && (
                          <GridCol width={overviewWidth}>
                            <WFEnableForPermission
                              permission={
                                Acl.TASK_LEGACY_RULE_ARCHIVED_DATE_UPDATE
                              }
                            >
                              <FormField
                                inputAs={DateInput}
                                id="legacyRuleArchived"
                                popperPlacement="top-end"
                                labelText={labels.LEGACY_RULE_ARCHIVED_DATE}
                                {...formik.getFieldProps('legacyRuleArchived')}
                                onBlur={(event: any) => {
                                  CommonUtil.handleDateChange(event, formik);
                                }}
                              />
                            </WFEnableForPermission>
                          </GridCol>
                        )}
                        {task?.taskTypeId !==
                          AppConstants.SERVER_CONSTANTS.TASK_TYPES
                            .BUSINESS_REQUIREMENT_UPDATE && (
                          <GridCol width={overviewWidth}>
                            <WFEnableForPermission
                              permission={Acl.TASK_LEGACY_TASK_UPDATE}
                            >
                              <FormField
                                id="legacyTaskId"
                                required
                                maxlength="20"
                                labelText={labels.LEGACY_TASK}
                                {...formik.getFieldProps('legacyTaskId')}
                                error={formik.errors.legacyTaskId}
                              />
                            </WFEnableForPermission>
                          </GridCol>
                        )}
                      </GridRow>
                    </AccordionItem>
                  )}
                  <AccordionItem
                    onExpandedChange={(event) =>
                      handleAccordionClick(
                        event,
                        AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDPEOPLE
                      )
                    }
                    headingText={Labels.TASK_OVERVIEW.PEOPLE}
                    expanded={this.state.expandPeople}
                  >
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol>
                        <WFEnableForPermission
                          permission={Acl.TASK_ASSIGNED_TO_UPDATE}
                        >
                          <FormField
                            id="assignedTo"
                            inputAs={Select}
                            labelText={labels.ASSIGNED_TO}
                            options={ConversionUtil.convertMapToDropDownList(
                              this.props.users,
                              'userName'
                            )}
                            placeholder={'Unassigned'}
                            {...formik.getFieldProps('assignedTo')}
                          />
                        </WFEnableForPermission>
                      </GridCol>
                      <GridCol>
                        <FormField
                          id="createdBy"
                          inputAs={ReadOnlyInput}
                          labelText={labels.CREATED_BY}
                          text={StringUtil.returnHyphenIfEmpty(task?.createdBy)}
                        />
                      </GridCol>
                    </GridRow>
                  </AccordionItem>
                  <AccordionItem
                    headingText={Labels.TASK_OVERVIEW.DATE}
                    onExpandedChange={(event) =>
                      handleAccordionClick(
                        event,
                        AppConstants.UI_CONSTANTS.TASK_OVERVIEW.EXPANDDATES
                      )
                    }
                    expanded={this.state.expandDates}
                  >
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol>
                        <FormField
                          id="lastModified"
                          inputAs={ReadOnlyInput}
                          labelText={labels.LAST_MODIFIED_DATE}
                          text={StringUtil.returnHyphenIfEmpty(
                            task?.lastModified
                          )}
                        />
                      </GridCol>
                      <GridCol>
                        <FormField
                          id="created"
                          inputAs={ReadOnlyInput}
                          labelText={labels.TASK_CREATED_DATE}
                          text={StringUtil.returnHyphenIfEmpty(task?.created)}
                        />
                      </GridCol>
                    </GridRow>
                    <GridRow>
                      <GridCol width={overviewWidth}>
                        <WFEnableForPermission
                          permission={Acl.TASK_INTERNAL_DUE_DATE_UPDATE}
                        >
                          <FormField
                            inputAs={DateInput}
                            required
                            minDate={new Date()}
                            id="dueDate"
                            labelText={labels.INTERNAL_DUE_DATE}
                            {...formik.getFieldProps('dueDate')}
                            onBlur={(event: any) => {
                              CommonUtil.handleDateChange(event, formik);
                            }}
                            error={formik.errors.dueDate}
                          />
                        </WFEnableForPermission>
                      </GridCol>
                      <GridCol width={overviewWidth}>
                        <WFEnableForPermission
                          permission={Acl.TASK_EXTERNAL_DUE_DATE_UPDATE}
                        >
                          <FormField
                            inputAs={DateInput}
                            popperPlacement="top-end"
                            minDate={new Date()}
                            id="clientDueDate"
                            labelText={labels.CLIENT_DUE_DATE}
                            {...formik.getFieldProps('clientDueDate')}
                            onBlur={(event: any) => {
                              CommonUtil.handleDateChange(event, formik);
                            }}
                          />
                        </WFEnableForPermission>
                      </GridCol>
                    </GridRow>
                    <GridRow className="fe_u_padding--top-medium">
                      <GridCol width={overviewWidth}>
                        <WFEnableForPermission
                          permission={Acl.TASK_DEPLOYMENT_DATE_UPDATE}
                        >
                          <FormField
                            inputAs={DateInput}
                            minDate={new Date()}
                            popperPlacement="top-end"
                            id="deploymentDate"
                            required={this.state.deploymentField}
                            labelText={labels.DEPLOYMENT_DATE}
                            {...formik.getFieldProps('deploymentDate')}
                            onBlur={(event: any) => {
                              CommonUtil.handleDateChange(event, formik);
                            }}
                          />
                        </WFEnableForPermission>
                      </GridCol>
                    </GridRow>
                  </AccordionItem>
                </Accordion>
                <DirtyCheckWarningPopup
                  show={this.state.popupShown}
                  save="rightsession"
                  {...this.props}
                  formik={formik}
                  onSaveBtn={formik.handleSubmit}
                  onRejectBtn={this.onReject}
                  onCancelBtn={this.onCancel}
                />
                <GridRow className="footer">
                  <Button
                    text={labels.CANCEL}
                    variant="secondary"
                    onClick={this.formCancel}
                  />
                  <Button
                    id="updateoverview"
                    text={labels.SAVE}
                    type="submit"
                    onClick={(event) => this.handleSave(event, formik)}
                  />
                </GridRow>
              </div>
            </div>
          );
        }}
      </Formik>
    );
  }
}

const mapStateToProps = (state: any) => ({
  task: getTaskDetail(state),
  leftSectionActive: getLeftSectionActive(state),
  rightSectionActive: getRightSectionActive(state),
  rightFormFlag: getRightFormAction(state),
  editBtnValue: getEditBtnValue(state),
  history: state.history,
  nextUrl: getNextUrl(state),
  users: getUsers(state),
  originatingSystems: getOriginatingSystems(state),
  departmentOrigins: getDepartmentOrigins(state),
  brUpdateReasons: getBRUpdateReasons(state),
});

const dispatchToProps = {
  updateTaskAction,
  setRightFormAction,
  setLeftSectionActive,
  resetPopupActions,
  addSuccessToast,
  setRightSectionActiveAction,
  setLeftFormAction,
  resetcancelBtnAction,
  resetNextUrlAction,
  fetchUsersOnce,
  fetchOriginatingSytemsOnce,
  fetchDepartmentOriginsOnce,
  fetchBRUpdateReasonsOnce,
};

export default connect(
  mapStateToProps,
  dispatchToProps
)(withRouter<any, any>(UpdateTaskOverview));
