import {
  TabPane,
  Tabs,
  Icon,
  Tooltip,
  Banner,
  BannerItem,
  Button,
  ProgressIndicator,
} from '@athena/forge';
import { Formik, FormikProps, yupToFormErrors } from 'formik';
import React, { Fragment, useState, useEffect, useRef } from 'react';
import { connect } from 'react-redux';
import * as Yup from 'yup';
import Labels from '../../../../constants/Labels';
import Messages from '../../../../constants/Messages';
import { TaskDetail } from '../../../../types';
import StringUtil from '../../../../utils/StringUtil';
import { UpdateTaskLeftPaneProps } from '../UpdateTaskProps';
import isEqual from 'lodash/isEqual';
import {
  getTaskDetail,
  updateTaskAction,
  setRightFormAction,
  resetPopupActions,
  transitTaskAction,
  updateEditBtnAction,
  getLeftFormAction,
  setLeftFormAction,
  resetcancelBtnAction,
  returnTaskAction,
  getLeftSectionActive,
  getRightSectionActive,
  setLeftSectionActiveAction,
  getNextUrl,
  resetNextUrlAction,
  refreshTaskList,
  setDismissSuccessBannerAction,
  getDismissSuccessBanner,
} from '../../../../slices/TaskSlice';
import TaskBasicDetail from './basic-details/TaskBasicDetail';
import { syncRTTask } from '../../../../services/CommonService';
import TaskStepper from './stepper/TaskStepper';
import AppConstants from '../../../../constants/AppConstants';
import UpdateTaskFooter from './footer/UpdateTaskFooter';
import SignOffDetails from './signoff-details/SignOffDetails';
import {
  getAssignedTo,
  getActiveTaskStep,
  getTaskStepByWorkflowStepId,
  isTaskEditable,
} from '../UpdateTask';
import BusinessRequirement from './business-requirement/BusinessRequirement';
import './UpdateTaskLeftPane.scss';
import { addSuccessToast } from '../../../../slices/ToastSlice';
import { DirtyCheckWarningPopup } from '../DirtyCheckWarningPopup';
import { fetchUserCommentDetails } from '../../../../slices/UserCommentSlice';
import { getRightSectionSelectedTabIndex } from '../../../../slices/TaskSlice';
import { fetchEventDetails } from '../../../../slices/TaskHistorySlice';
import MultiLineText from '../../../../components/multi-line-text/MultiLineText';
import ConversionUtil from '../../../../utils/ConversionUtil';
import { includes } from 'lodash';
import { CSSTransition } from 'react-transition-group';

const dtValidationMsg = Messages.DT_VALIDATION_MSG;
const initialValues = (task?: TaskDetail): any => {
  const initValues = {
    id: task?.id,
    version: task?.version,
    name: task?.name || '',
    deploymentDate: task?.deploymentDate || '',
    description: task?.description || '',
    modelDesignChanges: task?.modelDesignChanges || '',
    athenaNetChangesYn: StringUtil.convertToBoolean(task?.athenaNetChangesYn),
    dtChangesYn: StringUtil.convertToBoolean(task?.dtChangesYn),
    testClaimExample: task?.testClaimExample || '',
    testNote: task?.testNote || '',
    taskDecisionTableDetails: task?.taskDecisionTableDetails || [],
    taskDependencies: task?.taskDependencies || [],
    modelBranchUrl: task?.modelBranchUrl || '',
    dtBranchUrl: task?.dtBranchUrl || '',
    businessRequirementName: task?.businessRequirementName,
    businessRequirementId: task?.businessRequirementId,
    ruleReportingCategoryId: task?.ruleReportingCategoryId,
    businessRequirementDesc: task?.businessRequirementDesc,
    businessRequirementTypeId: task?.businessRequirementTypeId,
    ruleTypeId: task?.ruleTypeId,
    visitRuleDisplayLocationId: task?.visitRuleDisplayLocationId,
    internalFixText1: task?.internalFixText1,
    internalFixText2: task?.internalFixText2,
    context: StringUtil.concat(task?.contextRefId, task?.contextName),
    localRuleUseCaseId: task?.localRuleUseCaseId,
    contextId: task?.contextId,
    claimRuleCategory: StringUtil.concat(
      task?.claimRuleCategoryRefId,
      task?.claimRuleCategory
    ),
    claimRuleCategoryId: task?.claimRuleCategoryId || '',
    scrubTypeId: task?.scrubTypeId,
  };
  return initValues;
};

const validationSchema = (task: any) => {
  const activeTaskStep = getActiveTaskStep(task);
  const workflowStepId = activeTaskStep ? activeTaskStep.workflowStepId : '-1';
  return validationSchemaByWorkflowStep(String(workflowStepId));
};

let mandatoryIndex = 0;
const mandatoryFieldsByWorkflowStep = (task: any) => {
  const constants = AppConstants.SERVER_CONSTANTS;
  const mandatoryFields: any = {};
  const activeTaskStep = getActiveTaskStep(task);
  const workflowStepId = activeTaskStep ? activeTaskStep.workflowStepId : '-1';
  mandatoryIndex = mandatoryIndex + 1;

  switch (workflowStepId) {
    case constants.WORKFLOW_STEPS.DEPLOY_CHANGES_STEP: {
    }
    case constants.WORKFLOW_STEPS.REVIEW_CHANGES_STEP: {
    }
    case constants.WORKFLOW_STEPS.TEST_CHANGES_STEP: {
      mandatoryFields['testNote'] = true;
    }
    case constants.WORKFLOW_STEPS.CODE_CHANGES_STEP: {
      mandatoryFields['dtBranchUrl'] = true;
    }
    case constants.WORKFLOW_STEPS.MODEL_CHANGES_STEP: {
      mandatoryFields['modelBranchUrl'] = true;
      for (let i = 0; i <= mandatoryIndex; i++) {
        mandatoryFields[`taskDecisionTableDetails.${i}.modelName`] = true;
        mandatoryFields[`taskDecisionTableDetails.${i}.refId`] = true;
        mandatoryFields[`taskDecisionTableDetails.${i}.name`] = true;
        mandatoryFields[`taskDecisionTableDetails.${i}.description`] = true;
        mandatoryFields[`taskDecisionTableDetails.${i}.refUrl`] = true;
      }
    }
    case constants.WORKFLOW_STEPS.MANAGER_REVIEW_STEP: {
    }
    case constants.WORKFLOW_STEPS.REVIEW_TASK_STEP: {
    }
    case constants.WORKFLOW_STEPS.ANALYZE_TASK_STEP: {
      mandatoryFields['modelDesignChanges'] = true;
      mandatoryFields['name'] = true;
      mandatoryFields['description'] = true;
      mandatoryFields['testClaimExample'] = true;
    }
    default: {
    }
  }
  return mandatoryFields;
};

const getDefaultValidationSchema = () => {
  const schema: any = {};
  schema['name'] = Yup.string()
    .trim()
    .required(Messages.MSG_REQUIRED)
    .max(400, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['description'] = Yup.string()
    .transform(ConversionUtil.convertHtmlToPlainText)
    .max(4000, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['internalFixText1'] = Yup.string()
    .transform(ConversionUtil.convertHtmlToPlainText)
    .max(2000, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['internalFixText2'] = Yup.string()
    .transform(ConversionUtil.convertHtmlToPlainText)
    .max(2000, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['testClaimExample'] = Yup.string()
    .trim()
    .max(200, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['modelDesignChanges'] = Yup.string()
    .transform(ConversionUtil.convertHtmlToPlainText)
    .max(4000, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['modelBranchUrl'] = Yup.string().trim().nullable();
  schema['dtBranchUrl'] = Yup.string().trim().nullable();
  schema['testNote'] = Yup.string()
    .transform(ConversionUtil.convertHtmlToPlainText)
    .max(4000, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['businessRequirementName'] = Yup.string()
    .trim()
    .max(200, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['ruleReportingCategoryId'] = Yup.string().trim().nullable();
  schema['ruleTypeId'] = Yup.string().trim().nullable();
  schema['claimRuleCategory'] = Yup.string().trim().nullable();
  schema['scrubTypeId'] = Yup.string().trim().nullable();
  schema['businessRequirementDesc'] = Yup.string()
    .transform(ConversionUtil.convertHtmlToPlainText)
    .max(4000, Messages.CHAR_LIMIT_EXCEED)
    .nullable();
  schema['businessRequirementTypeId'] = Yup.string().trim().nullable();
  schema['taskDecisionTableDetails'] = Yup.array().of(
    Yup.object().shape({
      deleted: Yup.string().trim().nullable(),
      modelName: Yup.string()
        .when('deleted', {
          is: (deleted: any) => (deleted ? true : false),
          then: Yup.string(),
          otherwise: Yup.string().max(200, Messages.CHAR_LIMIT_EXCEED),
        })
        .trim()
        .nullable(),
      refId: Yup.string()
        .when('deleted', {
          is: (deleted: any) => (deleted ? true : false),
          then: Yup.string(),
          otherwise: Yup.string().max(6, dtValidationMsg.REF_ID_LENGTH),
        })
        .trim()
        .nullable(),
      name: Yup.string()
        .when('deleted', {
          is: (deleted: any) => (deleted ? true : false),
          then: Yup.string(),
          otherwise: Yup.string().max(400, Messages.CHAR_LIMIT_EXCEED),
        })
        .trim()
        .nullable(),
      description: Yup.string()
        .transform(ConversionUtil.convertHtmlToPlainText)
        .when('deleted', {
          is: (deleted: any) => (deleted ? true : false),
          then: Yup.string(),
          otherwise: Yup.string().max(2000, Messages.CHAR_LIMIT_EXCEED),
        })
        .nullable(),
    })
  );
  return schema;
};

const validationSchemaByWorkflowStep = (workflowStepId: string) => {
  const constants = AppConstants.SERVER_CONSTANTS;
  const schema: any = getDefaultValidationSchema();
  switch (workflowStepId) {
    case constants.WORKFLOW_STEPS.DEPLOY_CHANGES_STEP: {
    }
    case constants.WORKFLOW_STEPS.REVIEW_CHANGES_STEP: {
    }
    case constants.WORKFLOW_STEPS.TEST_CHANGES_STEP: {
      schema['testNote'] = schema['testNote'].required(Messages.MSG_REQUIRED);

      if (!schema['taskDependencies']) {
        schema['taskDependencies'] = Yup.array().of(
          Yup.object().shape({
            completedYn: Yup.string().when('deleted', {
              is: (deleted: any) => (deleted ? true : false),
              then: Yup.string().nullable(),
              otherwise: Yup.string()
                .nullable()
                .test({
                  name: 'dependency-not-complete',
                  message: Messages.COMPLETE_DEPENDENCY_MESSAGE,
                  test: function (value) {
                    let valid = true;
                    const {
                      CLIENT_OR_INTERNAL_COMMUNICATION,
                      IMPACT_QUERY,
                      LRA_UPDATES,
                      BLOCKED_BY,
                    } = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;
                    if (
                      this.parent.dependencyCondition === BLOCKED_BY &&
                      includes(
                        [
                          CLIENT_OR_INTERNAL_COMMUNICATION,
                          IMPACT_QUERY,
                          LRA_UPDATES,
                        ],
                        this.parent.dependencyName
                      )
                    ) {
                      valid = value === 'Y' ? true : false;
                    }
                    return valid;
                  },
                }),
            }),
          })
        );
      }
    }
    case constants.WORKFLOW_STEPS.CODE_REVIEW_STEP: {
    }
    case constants.WORKFLOW_STEPS.CODE_CHANGES_STEP: {
      schema['dtBranchUrl'] = schema['dtBranchUrl'].required(
        Messages.MSG_REQUIRED
      );
    }
    case constants.WORKFLOW_STEPS.MODEL_REVIEW_STEP: {
    }
    case constants.WORKFLOW_STEPS.MODEL_CHANGES_STEP: {
      schema['modelBranchUrl'] = schema['modelBranchUrl'].required(
        Messages.MSG_REQUIRED
      );
      schema['claimRuleCategory'] = schema['claimRuleCategory'].required(
        Messages.MSG_REQUIRED
      );
      schema['scrubTypeId'] = schema['scrubTypeId'].required(
        Messages.MSG_REQUIRED
      );
      schema['taskDecisionTableDetails'] = Yup.array()
        .test(
          'validate non deleted DT length',
          dtValidationMsg.DT_REQUIRED,
          function (val) {
            let result = false;
            val.forEach(function (item: any) {
              if (!item.deleted) {
                result = true;
              }
            });
            return result;
          }
        )
        .of(
          Yup.object().shape({
            deleted: Yup.string().trim().nullable(),
            modelName: Yup.string()
              .when('deleted', {
                is: (deleted: any) => (deleted ? true : false),
                then: Yup.string(),
                otherwise: Yup.string()
                  .required(Messages.MSG_REQUIRED)
                  .max(200, Messages.CHAR_LIMIT_EXCEED),
              })
              .trim()
              .nullable(),
            refId: Yup.string()
              .when('deleted', {
                is: (deleted: any) => (deleted ? true : false),
                then: Yup.string(),
                otherwise: Yup.string()
                  .required(Messages.MSG_REQUIRED)
                  .max(6, dtValidationMsg.REF_ID_LENGTH),
              })
              .trim()
              .nullable(),
            name: Yup.string()
              .when('deleted', {
                is: (deleted: any) => (deleted ? true : false),
                then: Yup.string(),
                otherwise: Yup.string()
                  .required(Messages.MSG_REQUIRED)
                  .max(400, Messages.CHAR_LIMIT_EXCEED),
              })
              .trim()
              .nullable(),
            description: Yup.string()
              .transform(ConversionUtil.convertHtmlToPlainText)
              .when('deleted', {
                is: (deleted: any) => (deleted ? true : false),
                then: Yup.string(),
                otherwise: Yup.string()
                  .required(Messages.MSG_REQUIRED)
                  .max(2000, Messages.CHAR_LIMIT_EXCEED),
              })
              .nullable(),
            refUrl: Yup.string()
              .when('deleted', {
                is: (deleted: any) => (deleted ? true : false),
                then: Yup.string(),
                otherwise: Yup.string().required(Messages.MSG_REQUIRED),
              })
              .trim()
              .nullable(),
          })
        );
    }
    case constants.WORKFLOW_STEPS.MANAGER_REVIEW_STEP: {
    }
    case constants.WORKFLOW_STEPS.REVIEW_TASK_STEP: {
      if (!schema['taskDependencies']) {
        schema['taskDependencies'] = Yup.array().of(
          Yup.object().shape({
            completedYn: Yup.string().when('deleted', {
              is: (deleted: any) => (deleted ? true : false),
              then: Yup.string().nullable(),
              otherwise: Yup.string()
                .nullable()
                .test({
                  name: 'dependency-not-complete',
                  message: Messages.COMPLETE_DEPENDENCY_MESSAGE,
                  test: function (value) {
                    let valid = true;
                    const {
                      CRMT,
                      BLOCKED_BY,
                    } = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;
                    if (
                      this.parent.dependencyCondition === BLOCKED_BY &&
                      includes([CRMT], this.parent.dependencyName)
                    ) {
                      valid = value === 'Y' ? true : false;
                    }
                    return valid;
                  },
                }),
            }),
          })
        );
      }
    }
    case constants.WORKFLOW_STEPS.ANALYZE_TASK_STEP: {
      schema['description'] = schema['description'].required(
        Messages.MSG_REQUIRED
      );
      schema['testClaimExample'] = schema['testClaimExample'].required(
        Messages.MSG_REQUIRED
      );
      schema['modelDesignChanges'] = schema['modelDesignChanges'].required(
        Messages.MSG_REQUIRED
      );
      schema['businessRequirementName'] = schema[
        'businessRequirementName'
      ].required(Messages.MSG_REQUIRED);
      schema['ruleReportingCategoryId'] = schema[
        'ruleReportingCategoryId'
      ].required(Messages.MSG_REQUIRED);
      schema['ruleTypeId'] = schema['ruleTypeId'].required(
        Messages.MSG_REQUIRED
      );
      schema['businessRequirementDesc'] = schema[
        'businessRequirementDesc'
      ].required(Messages.MSG_REQUIRED);
      schema['businessRequirementTypeId'] = schema[
        'businessRequirementTypeId'
      ].required(Messages.MSG_REQUIRED);
      schema['context'] = Yup.string()
        .trim()
        .when('businessRequirementTypeId', {
          is: AppConstants.SERVER_CONSTANTS.BUSINESS_REQUIREMENT_TYPES.GLOBAL,
          then: Yup.string().trim().nullable(),
          otherwise: Yup.string()
            .trim()
            .required(Messages.MSG_REQUIRED)
            .nullable(),
        });
      schema['localRuleUseCaseId'] = Yup.string().when(
        'businessRequirementTypeId',
        {
          is: AppConstants.SERVER_CONSTANTS.BUSINESS_REQUIREMENT_TYPES.GLOBAL,
          then: Yup.string().trim().nullable(),
          otherwise: Yup.string()
            .trim()
            .required(Messages.MSG_REQUIRED)
            .nullable(),
        }
      );
    }
    default: {
    }
  }
  return Yup.object().shape(schema);
};

const getBannerMessage = (task: any): any => {
  if (task?.statusId === AppConstants.SERVER_CONSTANTS.STATUSES.IN_PRODUCTION) {
    return Messages.TASK_IN_PRODUCTION_BANNER_MSG;
  } else if (
    task?.statusId === AppConstants.SERVER_CONSTANTS.STATUSES.REJECTED
  ) {
    return Messages.TASK_REJECTED_BANNER_MSG;
  } else if (
    task?.statusId === AppConstants.SERVER_CONSTANTS.STATUSES.BLOCKED
  ) {
    return Messages.TASK_BLOCKED_BANNER_MSG;
  } else if (isArrayNotEmpty(task?.associatedBRTasks)) {
    return (
      <MultiLineText
        value={Messages.TASK_EXIST_FOR_BUSINESS_REQUIREMENT({
          taskId: StringUtil.formatTaskID(task?.associatedBRTasks?.[0].id),
          activeStepName: task?.associatedBRTasks?.[0].activeTaskStepName,
          action: AppConstants.UI_CONSTANTS.DUPLICATE_TASK_INFO_ACTION.EDIT,
        })}
      />
    );
  }
  return '';
};

const showBanner = (task: any): boolean => {
  return (
    !isTaskEditable(task) ||
    isArrayNotEmpty(task?.associatedBRTasks) ||
    isTaskBlocked(task)
  );
};

const isArrayNotEmpty = (arr: any): boolean => {
  return typeof arr !== 'undefined' && Array.isArray(arr) && arr.length > 0;
};

const isTaskBlocked = (task: any): boolean => {
  return task?.statusId === AppConstants.SERVER_CONSTANTS.STATUSES.BLOCKED;
};

export const Warning = (props: any): JSX.Element => {
  return (
    <Fragment>
      {props.label}
      {props.warning && (
        <Tooltip
          text={props.tooltip}
          id={props.label}
          className="requirement-tip"
        >
          <Icon icon="Attention" className="requirement-icon" />
        </Tooltip>
      )}
    </Fragment>
  );
};

function UpdateTaskLeftPane(props: UpdateTaskLeftPaneProps): JSX.Element {
  const [isBRFormInvalid, setBRFormInvalid] = useState<boolean>(false);
  const [inProgressBanner] = useState<boolean>(false);
  const [isTaskDetailsFormInvalid, setTaskDetailsFormInvalid] = useState<
    boolean
  >(false);

  const scrollPane = useRef<HTMLDivElement>(null);
  const scrollToTop = () => {
    const { current } = scrollPane;
    if (current != null) {
      current.scrollTo({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
    }
  };
  const onSubmit = (values: any) => {
    const activeTaskStep = getActiveTaskStep(props.task);
    const { addSuccessToast } = props;
    props.resetPopupActions();
    props.transitTaskAction(values).then((taskDetails: TaskDetail) => {
      scrollToTop();
      const transitionedTaskStep = getActiveTaskStep(taskDetails);
      if (transitionedTaskStep) {
        const { HEADER, MESSAGE } = Messages.SIGNOFF_TASK_SUCCESS;
        addSuccessToast({
          message: MESSAGE,
          headerText: HEADER,
          params: {
            id: taskDetails.id,
            currentStep: activeTaskStep?.name,
            nextStep: transitionedTaskStep?.name,
          },
        });
      } else {
        const { HEADER, MESSAGE } = Messages.DEPLOYMENT_SIGNOFF_SUCCESS;
        addSuccessToast({
          message: MESSAGE,
          headerText: HEADER,
          params: {
            id: taskDetails.id,
          },
        });
      }
      if (
        props.selectedTabIndex ===
        AppConstants.UI_CONSTANTS.RIGHT_SECTION.HISTORY_TAB_INDEX
      ) {
        props.fetchEventDetails(taskDetails.id);
      }
    });
  };

  const formHasErrors = (fields: any, formik: FormikProps<any>): boolean => {
    let hasErrors = false;
    const textProp = 'textContent' in document ? 'textContent' : 'innerText';
    for (const value of Object.values(fields)) {
      [].slice
        .call(document.querySelectorAll('label'), 0)
        .forEach(function (labelElement: any) {
          if (
            labelElement[textProp]
              .replace('/ - Required/g', '')
              .trim()
              .indexOf(value) > -1
          ) {
            if (
              formik?.errors[labelElement.getAttribute('for')] !== undefined
            ) {
              hasErrors = true;
            }
          }
        });
      if (hasErrors) return hasErrors;
    }
    return hasErrors;
  };
  //   This method is used to find task dependencies custom errors.
  const formHasCustomErrors = (formEl: Element | null): boolean => {
    let hasErrors = false;
    if (formEl && formEl.querySelector('.fe_c_form-error')) {
      hasErrors = true;
    }
    return hasErrors;
  };

  const setWarningOnTaskDetailsTab = (formik: FormikProps<any>) => {
    const taskDetailsForm = {
      ...Labels.TASK_BASIC_DETAILS,
      ...Labels.TASK_TESTING_DETAILS,
      ...Labels.TASK_DT_DETAILS,
    };
    if (
      formHasErrors(taskDetailsForm, formik) ||
      formHasCustomErrors(document.querySelector('.task-detail'))
    ) {
      setTaskDetailsFormInvalid(true);
    } else {
      setTaskDetailsFormInvalid(false);
    }
  };

  const setWarningOnBRTab = (formik: FormikProps<any>) => {
    const brFormFields = {
      ...Labels.TASK_BUSINESS_REQUIREMENT_FIELD_LABEL,
    };
    setBRFormInvalid(formHasErrors(brFormFields, formik));
  };

  const onTransition = (formik: FormikProps<any>) => {
    setWarningOnTaskDetailsTab(formik);
    setWarningOnBRTab(formik);
  };

  const onReject = (formik: FormikProps<any>) => {
    if (props.nextUrl) {
      props.history.push(props.nextUrl);
      props.resetNextUrlAction();
    }
    props.resetPopupActions();
    formik.resetForm();
  };

  const onCancel = () => {
    props.setLeftFormAction(false);
    props.resetcancelBtnAction(false);
    props.resetNextUrlAction();
  };

  const onSave = (formik: FormikProps<any>) => {
    if (props.rightSectionActive) {
      props.setRightFormAction(true);
    } else {
      const payload: any = { ...formik.values };
      delete payload['context'];
      delete payload['claimRuleCategory'];
      formik.setErrors({});
      const schema = validationSchemaByWorkflowStep('');
      const assignedTo = getAssignedTo(props.task);
      const { nextUrl } = props;
      schema
        .validate(payload, { abortEarly: false, recursive: true })
        .then(function () {
          setUserSelectedIndex(
            userSelectedIndex == -1 ? selectedIndex : userSelectedIndex
          );
          props
            .updateTaskAction({
              ...payload,
              ...(assignedTo ? { assignedTo } : {}),
            })
            .then((taskDetails: any) => {
              if (nextUrl) {
                props.history.push(nextUrl);
                resetNextUrlAction();
              }

              const { HEADER, MESSAGE } = Messages.UPDATE_TASK_SUCCESS;
              props.resetPopupActions();
              props.addSuccessToast({
                message: MESSAGE,
                headerText: HEADER,
                params: {
                  id: taskDetails.id,
                },
              });
              if (
                props.selectedTabIndex ===
                AppConstants.UI_CONSTANTS.RIGHT_SECTION.HISTORY_TAB_INDEX
              ) {
                props.fetchEventDetails(taskDetails.id);
              }
            });
        })
        .catch(function (err) {
          const errors = yupToFormErrors(err);
          formik.setErrors(errors);
        });
    }
  };

  const onReturn = (values: any) => {
    props.setDismissSuccessBannerAction(false);
    props.returnTaskAction(values).then((taskDetails: any) => {
      scrollToTop();
      const { HEADER, MESSAGE } = Messages.RETURN_TASK_SUCCESS;
      props.addSuccessToast({
        message: MESSAGE,
        headerText: HEADER,
        params: {
          returnStep: getTaskStepByWorkflowStepId(values.returnTo, taskDetails)
            ?.name,
          id: taskDetails.id,
        },
      });

      if (
        props.selectedTabIndex ===
        AppConstants.UI_CONSTANTS.RIGHT_SECTION.DISCUSSION_TAB_INDEX
      ) {
        props.fetchUserCommentDetails(taskDetails?.id);
      }
      if (
        props.selectedTabIndex ===
        AppConstants.UI_CONSTANTS.RIGHT_SECTION.HISTORY_TAB_INDEX
      ) {
        props.fetchEventDetails(taskDetails.id);
      }
    });
  };

  const ref = useRef<any>(null);
  const labels = Labels.TASK_DETAIL_FORM;
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [userSelectedIndex, setUserSelectedIndex] = useState(-1);
  const [popupShown, setPopupShown] = useState(false);
  const [showMore] = useState(false);

  useEffect(() => {
    if (!props.task?.ruleReportingCategoryId) {
      setSelectedIndex(1);
    } else {
      setSelectedIndex(0);
    }
    setPopupShown(props.leftFormFlag);
  }, [props.task?.ruleReportingCategoryId, props.leftFormFlag]);

  const handleTabsChange = (e: any) => {
    const value = e.target.value;
    if (value) {
      setUserSelectedIndex(parseInt(value, 10));
    }
  };
  const toggleBannerDetail = (
    event: any,
    bannerId: any,
    bannerDetailId: any
  ): void => {
    const buttonElmt = document.getElementById(event.target.id);
    const bannerElmt = document.getElementById(bannerId);
    const bannerDetailElmt = document.getElementById(bannerDetailId);
    if (
      buttonElmt !== null &&
      bannerElmt !== null &&
      bannerDetailElmt !== null
    ) {
      if (buttonElmt.innerText === Labels.REJECT_TRANSIT.VIEW_DETAILS) {
        bannerDetailElmt.style.display = 'block';
        bannerElmt.style.maxHeight = '250px';
        buttonElmt.innerText = Labels.REJECT_TRANSIT.HIDE_DETAILS;
      } else {
        bannerDetailElmt.style.display = 'none';
        buttonElmt.innerText = Labels.REJECT_TRANSIT.VIEW_DETAILS;
      }
    }
  };
  const getRejectionDetails = (task: any) => {
    return (
      <>
        <a
          id="toggle-btn"
          onClick={(event: any) => {
            toggleBannerDetail(event, 'task-banner-info', 'banner-detail');
          }}
        >
          {showMore
            ? Labels.REJECT_TRANSIT.HIDE_DETAILS
            : Labels.REJECT_TRANSIT.VIEW_DETAILS}
        </a>
        <div id="banner-detail" className="banner-detail">
          <div className="banner-detail-title">
            {Labels.REJECT_TRANSIT.REASON + ': '}
            <span className="banner-detail-content">
              {task.rejectionReason}
            </span>
          </div>

          <div className="banner-detail-title">
            {Labels.REJECT_TRANSIT.DESCRIPTION + ': '}
            <span className="banner-detail-content">
              {task.rejectionDescription}
            </span>
          </div>
        </div>
      </>
    );
  };
  return (
    <Formik
      innerRef={ref}
      enableReinitialize={true}
      initialValues={initialValues(props.task)}
      onSubmit={onSubmit}
      validationSchema={validationSchema(props.task)}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
    >
      {(formik) => {
        const { leftSectionActive, rightSectionActive } = props;
        if (rightSectionActive) {
          if (formik.dirty) {
            formik.resetForm();
            props.setRightFormAction(true);
          }
        } else if (!leftSectionActive && formik.dirty) {
          props.setLeftSectionActiveAction(true);
        } else if (
          leftSectionActive &&
          isEqual(formik.initialValues, formik.values) &&
          !formik.dirty
        ) {
          props.resetPopupActions();
        }
        onTransition(formik);
        return (
          <React.Fragment>
            <div className="fe_u_padding--large">
              <TaskStepper />
            </div>
            <div className="central-pane-scroll" ref={scrollPane}>
              <Tabs
                selectedIndex={
                  userSelectedIndex == -1 ? selectedIndex : userSelectedIndex
                }
                onTabsChange={handleTabsChange}
              >
                <TabPane
                  label={
                    isTaskDetailsFormInvalid ? (
                      <Warning
                        warning={isTaskDetailsFormInvalid}
                        label={labels.TASK_DETAILS}
                        tooltip={labels.TASK_DETAILS_REQUIRED}
                      />
                    ) : (
                      labels.TASK_DETAILS
                    )
                  }
                  padded
                  mountedWhileHidden={true}
                >
                  {showBanner(props.task) && (
                    <Banner id="task-banner-info" className="task-banner-info">
                      <BannerItem>{getBannerMessage(props.task)}</BannerItem>
                      {props.task?.statusId ===
                        AppConstants.SERVER_CONSTANTS.STATUSES.REJECTED &&
                        props.task.rejectionReason != null &&
                        getRejectionDetails(props.task)}
                    </Banner>
                  )}
                  {props.task?.rtSynchronizationLog?.rtTaskCreationStatusId ==
                    AppConstants.SERVER_CONSTANTS.RTTASK_CREATION_STATUSES
                      .FAILURE &&
                    props.task?.rtSynchronizationLog && (
                      <Banner className="br-banner-info" alertType="attention">
                        <BannerItem>
                          {Messages.RT_TASK_CREATION_FAILURE}
                        </BannerItem>
                        <div className="break"></div>
                        <div className="dismiss-icon">
                          <Button
                            text={Labels.RT_TASK_CREATION.RETRY}
                            variant="tertiary"
                            onClick={() => {
                              syncRTTask({
                                id: props.task?.id,
                              }).then((response: any) => {
                                const updatedTaskDetails = {
                                  ...props.task,
                                  rtSynchronizationLog:
                                    response.rtSynchronizationLog,
                                  statusId: response.statusId,
                                  status: response.status,
                                  version: response.version,
                                };
                                props.refreshTaskList(updatedTaskDetails);
                              });
                            }}
                          />
                        </div>
                      </Banner>
                    )}
                  {!props.dismissSuccessBanner &&
                    props.task?.rtSynchronizationLog &&
                    props.task?.rtSynchronizationLog?.rtTaskCreationStatusId ==
                      AppConstants.SERVER_CONSTANTS.RTTASK_CREATION_STATUSES
                        .SUCCESS && (
                      <Banner className="br-banner-info" alertType="success">
                        <BannerItem>
                          {StringUtil.formatRTTaskID(
                            props.task?.rtSynchronizationLog?.rtTaskId
                          )}
                          {Messages.RT_TASK_CREATION_SUCCESS}
                        </BannerItem>
                        <div className="break"></div>
                        <div className="dismiss-icon">
                          <Button
                            text={Labels.RT_TASK_CREATION.DISMISS}
                            variant="tertiary"
                            onClick={() => {
                              props.setDismissSuccessBannerAction(true);
                            }}
                          />
                        </div>
                      </Banner>
                    )}
                  <CSSTransition
                    in={inProgressBanner}
                    appear={false}
                    timeout={400}
                    classNames="fade-open"
                    unmountOnExit={true}
                  >
                    <Banner className="br-banner-info" alertType="info">
                      <BannerItem>{Messages.RT_TASK_IN_PROGRESS}</BannerItem>
                      <div className="dismiss-icon">
                        <ProgressIndicator
                          className="fe_u_margin--left-small"
                          shape="circular"
                          variant="determinate"
                          currentValue={25}
                          size="small"
                        />
                      </div>
                    </Banner>
                  </CSSTransition>
                  <TaskBasicDetail
                    formik={formik}
                    task={props.task}
                    mandatoryFields={mandatoryFieldsByWorkflowStep(props.task)}
                  />
                </TabPane>
                <TabPane
                  label={
                    isBRFormInvalid ? (
                      <Warning
                        warning={isBRFormInvalid}
                        label={labels.BUSINESS_REQUIREMENT_DETAILS}
                        tooltip={
                          labels.BUSINESS_REQUIREMENT_DETAILS_ARE_REQUIRED
                        }
                      />
                    ) : (
                      labels.BUSINESS_REQUIREMENT_DETAILS
                    )
                  }
                  padded
                  mountedWhileHidden={true}
                >
                  <BusinessRequirement formik={formik} />
                </TabPane>
                <TabPane label={Labels.TASK_SIGNOFF_DETAILS.SIGNOFFS} padded>
                  <SignOffDetails task={props.task} />
                </TabPane>
              </Tabs>
            </div>
            <DirtyCheckWarningPopup
              show={popupShown}
              save="leftsession"
              {...props}
              formik={formik}
              onSaveBtn={onSave}
              onRejectBtn={onReject}
              onCancelBtn={onCancel}
            />
            <div>
              <UpdateTaskFooter
                {...props}
                formik={formik}
                setSelectedIndex={setUserSelectedIndex}
                onSave={onSave}
                onReturn={onReturn}
                onTransition={onTransition}
              />
            </div>
          </React.Fragment>
        );
      }}
    </Formik>
  );
}

const mapStateToProps = (state: any) => {
  return {
    task: getTaskDetail(state),
    leftSectionActive: getLeftSectionActive(state),
    rightSectionActive: getRightSectionActive(state),
    leftFormFlag: getLeftFormAction(state),
    selectedTabIndex: getRightSectionSelectedTabIndex(state),
    nextUrl: getNextUrl(state),
    dismissSuccessBanner: getDismissSuccessBanner(state),
  };
};

export default connect(mapStateToProps, {
  refreshTaskList,
  updateTaskAction,
  transitTaskAction,
  returnTaskAction,
  addSuccessToast,
  setLeftFormAction,
  setRightFormAction,
  resetPopupActions,
  setLeftSectionActiveAction,
  updateEditBtnAction,
  resetcancelBtnAction,
  fetchUserCommentDetails,
  fetchEventDetails,
  resetNextUrlAction,
  setDismissSuccessBannerAction,
})(UpdateTaskLeftPane);
