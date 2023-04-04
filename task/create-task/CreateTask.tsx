import {
  Banner,
  BannerItem,
  Button,
  DateInput,
  Form,
  FormField,
  Lightbox,
  Multiselect,
  Select,
  Typeahead,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import { forOwn, isEmpty } from 'lodash';
import React from 'react';
import * as Yup from 'yup';
import AppConstants from '../../../constants/AppConstants';
import Labels from '../../../constants/Labels';
import moment from 'moment';
import {
  brLookup,
  createTask,
  searchBusinessRequirements,
} from '../../../services/CommonService';

import {
  getUsers,
  getPrioritiesWithSla,
  getTaskTypes,
  getOriginatingSystems,
  getDepartmentOrigins,
  getBRUpdateReasons,
  fetchTaskTypesOnce,
  fetchUsersOnce,
  fetchOriginatingSytemsOnce,
  fetchDepartmentOriginsOnce,
  fetchPriorityReasonsOnce,
  fetchPrioritiesWithSla,
  getPriorityReasons,
  fetchBRUpdateReasonsOnce,
} from '../../../slices/MasterDataSlice';

import { NewTask, TaskInfo } from '../../../types/index';
import ConversionUtil from '../../../utils/ConversionUtil';
import StringUtil from '../../../utils/StringUtil';
import AuthUtil from '../../../utils/AuthUtil';
import './CreateTask.scss';
import Messages from '../../../constants/Messages';
import { addSuccessToast } from '../../../slices/ToastSlice';
import { connect } from 'react-redux';
import MultiLineText from '../../../components/multi-line-text/MultiLineText';
import CommonUtil from '../../../utils/CommonUtil';
import PriorityPolicy from './priority-policy/PriorityPolicy';

const initialValues: NewTask = {
  name: '',
  priorityId: '',
  priorityReasonId: '',
  priorityReasonNote: '',
  originatingSystemId: '',
  originatingCaseId: '',
  taskTypeId: '',
  legacyRuleId: '',
  legacyTaskId: '',
  businessRequirementName: '',
  businessRequirementId: '',
  dueDate: '',
  clientDueDate: '',
  businessRequirementValue: '',
  assignedTo: AuthUtil.getLoggedInUsername(),
  departmentOriginId: '',
  brUpdateReasonIds: [],
  isArchivedRule: false,
  isLegacyRuleExist: false,
};

export interface CreateTaskProps {
  history: any;
  priorityReasons?: any[];
  prioritiesWithSla?: any[];
  originatingSystems?: any[];
  departmentOrigins?: any[];
  taskTypes?: any[];
  users?: any[];
  brUpdateReasons?: any[];
  onCloseCreateTask?: any;
  addSuccessToast?: any;
  fetchUsersOnce?: any;
  fetchPrioritiesOnce?: any;
  fetchTaskTypesOnce?: any;
  fetchOriginatingSytemsOnce?: any;
  fetchDepartmentOriginsOnce?: any;
  fetchPriorityReasonsOnce?: any;
  fetchPrioritiesWithSla?: any;
  fetchBRUpdateReasonsOnce?: any;
}

export interface CreateTaskState {
  legacyRuleIds: any[];
  businessRequirements: any[];
  duplicateTaskInfo: TaskInfo | null;
  brUpdateReasonsByTaskType: any[];
}

export class CreateTask extends React.Component<
  CreateTaskProps,
  CreateTaskState
> {
  state: CreateTaskState = {
    legacyRuleIds: [],
    businessRequirements: [],
    duplicateTaskInfo: null,
    brUpdateReasonsByTaskType: [],
  };

  validationSchema = Yup.object().shape({
    name: Yup.string().required(Messages.MSG_REQUIRED),
    priorityId: Yup.string().required(Messages.MSG_REQUIRED),
    originatingSystemId: Yup.string().required(Messages.MSG_REQUIRED),
    originatingCaseId: Yup.string().required(Messages.MSG_REQUIRED),
    departmentOriginId: Yup.string().required(Messages.MSG_REQUIRED),
    priorityReasonId: Yup.string().when('priorityId', {
      is: (value) =>
        AppConstants.UI_CONSTANTS.PRIORITY_REASON_MANDATORY_PRIORITY_IDS.includes(
          value
        ),
      then: Yup.string().required(Messages.MSG_REQUIRED),
      otherwise: Yup.string(),
    }),

    taskTypeId: Yup.string()
      .test(
        AppConstants.UI_CONSTANTS.ACTIVE_TASK_TYPE,
        Messages.TASK_TYPES_NOT_ACTIVE,
        (value) => this.isTaskTypeActive(value)
      )
      .required(Messages.MSG_REQUIRED),
    legacyRuleId: Yup.string()
      .when('taskTypeId', {
        is: (taskTypeId) =>
          taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .DUAL_MAINTENANCE_BR_UPDATE ||
          taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR,
        then: Yup.string().required(Messages.MSG_REQUIRED),
        otherwise: Yup.string(),
      })
      .test({
        name: 'archived-rule',
        test: async function () {
          const { taskTypeId } = this.parent;
          let isArchivedRule = false;
          if (
            taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE
          ) {
            isArchivedRule = this.parent.isArchivedRule;
          }
          return isArchivedRule
            ? this.createError({
                message: Messages.ARCHIVED_RULE,
              })
            : true;
        },
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
        taskTypeId ===
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
        taskTypeId ===
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR,
      then: Yup.string().required(Messages.MSG_REQUIRED),
      otherwise: Yup.string(),
    }),
    businessRequirementName: Yup.string().when('taskTypeId', {
      is: AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE,
      then: Yup.string().notRequired(),
      otherwise: Yup.string().required(Messages.MSG_REQUIRED),
    }),
    businessRequirementId: Yup.string().when('taskTypeId', {
      is: AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE,
      then: Yup.string().required(Messages.MSG_REQUIRED),
      otherwise: Yup.string(),
    }),
    assignedTo: Yup.string().required(Messages.MSG_REQUIRED),
    businessRequirementValue: Yup.string()
      .when('taskTypeId', {
        is:
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE,
        then: Yup.string().required(Messages.MSG_REQUIRED),
        otherwise: Yup.string().nullable(),
      })
      .test({
        name: 'not-archived-rule',
        test: async function () {
          const isArchivedRule = this.parent.isArchivedRule;
          return isArchivedRule
            ? this.createError({
                message: Messages.NOT_ARCHIVED_RULE,
              })
            : true;
        },
      })
      .test({
        name: 'business-requirement-value not typeahead',
        test: async function (businessRequirementValue) {
          let isValid = true;
          const { businessRequirementId, taskTypeId } = this.parent;
          if (
            taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE
          ) {
            if (!businessRequirementId) {
              isValid = false;
            }
          }
          return isValid
            ? isValid
            : this.createError({
                message: Messages.BUSINESS_REQUIREMENT_REQUIRED,
              });
        },
      }),
    brUpdateReasonIds: Yup.mixed().when('taskTypeId', {
      is: (taskTypeId) => CommonUtil.isActiveTaskType(taskTypeId),
      then: Yup.array().nullable().required('Required!'),
      otherwise: Yup.string(),
    }),
  });

  onSubmit = (values: any, form: any): void => {
    const payload: any = {};
    if (CommonUtil.isActiveTaskType(values.taskTypeId)) {
      values.brUpdateReasonIds = ConversionUtil.convertDropDownListToValues(
        values.brUpdateReasonIds
      );
    }
    forOwn(values, function (value: any, key: string) {
      if (value && value instanceof Date) {
        payload[key.toUpperCase()] = value.toLocaleDateString('en-US');
      } else {
        payload[key.toUpperCase()] = value;
      }
    });
    createTask(payload)
      .then((response) => {
        this.props.onCloseCreateTask();
        const { HEADER, MESSAGE } = Messages.CREATE_TASK_SUCCESS;
        this.props.addSuccessToast({
          message: MESSAGE,
          headerText: HEADER,
          params: {
            username:
              payload.ASSIGNEDTO !== AuthUtil.getLoggedInUsername()
                ? payload.ASSIGNEDTO
                : 'you',
            id: response.id,
          },
        });
        this.props.history.push(`tasks/${response.id}`);
      })
      .catch((err) => {
        form.setSubmitting(false);
      });
  };

  isTaskTypeActive(value: string): boolean {
    return (
      value ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
      value ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR ||
      value ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.NEW_BUSINESS_REQUIREMENT ||
      value ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE ||
      value === undefined
    );
  }

  loadFieldValues = (): void => {
    this.props.fetchOriginatingSytemsOnce();
    this.props.fetchTaskTypesOnce();
    this.props.fetchPriorityReasonsOnce();
    this.props.fetchPrioritiesWithSla();
    this.props.fetchUsersOnce();
    this.props.fetchDepartmentOriginsOnce();
    this.props.fetchBRUpdateReasonsOnce();
  };

  componentDidMount(): void {
    this.loadFieldValues();
  }

  handleLegacyRuleIdChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    formik: FormikProps<NewTask>
  ): void => {
    if (event.type === undefined) {
      return;
    }
    formik.setFieldValue('businessRequirementId', '');
    formik.setFieldValue('businessRequirementName', '');
    formik.setFieldValue('isArchivedRule', false);
    const ruleIdInput = event.target.value;
    if (event.target.id !== undefined) {
      if (ruleIdInput && ruleIdInput.length > 2) {
        searchBusinessRequirements({
          LEGACYRULEPREFIX: ruleIdInput,
        }).then((data: any) => {
          const legacyRuleIds = data.map((rule: any) => {
            rule['value'] = rule['legacyRuleId'];
            return rule;
          });
          this.setState({ legacyRuleIds });
        });
      } else {
        this.setState({ legacyRuleIds: [] });
      }
    }
    formik.setFieldValue('legacyRuleId', ruleIdInput);
    this.setState({ duplicateTaskInfo: null });
  };

  handleLegacyRuleIdBlur = (
    event: React.ChangeEvent<HTMLInputElement>,
    formik: FormikProps<NewTask>
  ): void => {
    formik.setTouched(
      {
        legacyRuleId: true,
        businessRequirementId: true,
        businessRequirementName: true,
      },
      true
    );
  };

  handlePrioritiesChange(event: any, id: string, formik: any): void {
    const priorityId = event.target.value;
    const priority: any = this.props.prioritiesWithSla?.find((element) => {
      return element.id === priorityId;
    });
    formik.setFieldValue('dueDate', priority.internalDueDate);
    if (
      formik.values.taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
      formik.values.taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR
    ) {
      formik.setFieldValue('dueDate', new Date(priority.internalDueDate));
    }
    formik.setFieldValue('clientDueDate', priority.externalDueDate);
    formik.setFieldValue('legacyRuleId', '');
    formik.setFieldValue(id, priorityId);
  }

  handleTaskTypeIdChange(event: any, id: string, formik: any): void {
    const taskTypeId = event.target.value;
    if (
      taskTypeId !==
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
      taskTypeId !==
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR
    ) {
      const dueDate = formik.values.dueDate
        ? moment(formik.values.dueDate).format('MM/DD/YYYY')
        : '';
      formik.setFieldValue('dueDate', dueDate);
      formik.setTouched({ taskTypeId: true }, true);
    } else if (
      (taskTypeId ==
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE &&
        formik.values.dueDate) ||
      (taskTypeId ==
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR &&
        formik.values.dueDate)
    ) {
      formik.setFieldValue('dueDate', new Date(formik.values.dueDate));
    }

    if (
      taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE &&
      formik.values.isArchivedRule
    ) {
      formik.setFieldValue('legacyRuleId', formik.values.legacyRuleId);
      formik.setFieldValue(
        'businessRequirementId',
        formik.values.businessRequirementId
      );
      formik.setFieldValue(
        'businessRequirementName',
        formik.values.businessRequirementName
      );
    } else if (
      taskTypeId !==
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE ||
      (taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE &&
        !formik.values.isArchivedRule)
    ) {
      formik.setFieldValue('legacyRuleId', formik.values.legacyRuleId);
      formik.setFieldValue(
        'businessRequirementId',
        formik.values.businessRequirementId
      );
      formik.setFieldValue(
        'businessRequirementName',
        formik.values.businessRequirementName
      );
      formik.setFieldValue('businessRequirementValue', '');
      formik.setFieldValue('brUpdateReasonIds', []);
    } else {
      if (formik.values.isArchivedRule) {
        formik.setFieldValue(
          'businessRequirementValue',
          StringUtil.formatBRID(formik.values.businessRequirementId) +
            ' - ' +
            formik.values.businessRequirementName
        );
        formik.setFieldValue('legacyRuleId', formik.values.legacyRuleId);
        formik.setFieldValue(
          'businessRequirementId',
          formik.values.businessRequirementId
        );
        formik.setFieldValue(
          'businessRequirementName',
          formik.values.businessRequirementName
        );
      }
    }
    if (
      (taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE &&
        formik.values.taskTypeId ===
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR) ||
      (taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR &&
        formik.values.taskTypeId ===
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE)
    ) {
      formik.setFieldValue('legacyRuleId', '');
      formik.setFieldValue('legacyTaskId', '');
      formik.setFieldValue('businessRequirementName', '');
      formik.setFieldValue('businessRequirementId', '');
    }
    formik.setFieldValue('isArchivedRule', false);
    formik.setFieldValue(id, taskTypeId);
    this.setState({ duplicateTaskInfo: null });
    this.setBrUpdateReasons(taskTypeId);
  }

  setBrUpdateReasons = (taskTypeId: string) => {
    if (CommonUtil.isActiveTaskType(taskTypeId)) {
      const brUpdateReasonsByTaskType = this.props.brUpdateReasons?.filter(
        (brUpdateReason) => {
          const taskTypeIds = brUpdateReason.taskTypeIds
            .split(',')
            .map((taskTypeId: string) => taskTypeId.trim());
          return taskTypeIds.includes(taskTypeId);
        }
      );
      if (brUpdateReasonsByTaskType) {
        this.setState({ brUpdateReasonsByTaskType: brUpdateReasonsByTaskType });
      }
    }
  };

  getAssociatedTask = (businessRequirementId: any) => {
    brLookup({
      BUSINESSREQUIREMENTID: businessRequirementId,
    }).then((data: any) => {
      if (data['id']) {
        this.setState({ duplicateTaskInfo: data });
      } else {
        this.setState({ duplicateTaskInfo: null });
      }
    });
  };

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

  setLegacyRuleDetails = (value: any, formik: FormikProps<NewTask>): void => {
    const {
      id,
      name,
      legacyRuleId,
      rules2TransformationStatusId,
    } = value.suggestion;
    const values = {
      ...formik.values,
    };
    values.businessRequirementId = id;
    values.businessRequirementName = name;
    values.businessRequirementValue = value.suggestionValue;
    if (
      formik.values.taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
      !isEmpty(legacyRuleId)
    ) {
      values.legacyRuleId = legacyRuleId;
    }
    if (
      (formik.values.taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE &&
        rules2TransformationStatusId != null &&
        rules2TransformationStatusId !=
          AppConstants.SERVER_CONSTANTS.R2TRANSFORMATION_STATUSES
            .UNDER_DUAL_MAINTENANCE) ||
      (formik.values.taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE &&
        rules2TransformationStatusId ==
          AppConstants.SERVER_CONSTANTS.R2TRANSFORMATION_STATUSES
            .UNDER_DUAL_MAINTENANCE)
    ) {
      values.isArchivedRule = true;
    } else {
      values.isArchivedRule = false;
    }
    formik.setValues(values, true);
    this.getAssociatedTask(id);
  };

  getBusinessRequirements(
    event: React.ChangeEvent<HTMLInputElement>,
    formik: FormikProps<any>
  ) {
    if (event.type === undefined) {
      return;
    }
    const brInput = event.target.value;
    let searchText: any = brInput;
    if (brInput.toLocaleLowerCase().startsWith('br-')) {
      searchText = brInput.replace(/BR-|br-/, '');
      searchText = searchText * 1;
    }
    searchBusinessRequirements({
      SEARCHTEXT: searchText,
    }).then((data: any) => {
      const businessRequirementList = data.map((businessRequirement: any) => {
        businessRequirement['value'] =
          StringUtil.formatBRID(businessRequirement['id']) +
          ' - ' +
          businessRequirement['name'];
        return businessRequirement;
      });
      this.setState({
        businessRequirements: businessRequirementList,
      });
    });
    formik.setFieldValue('businessRequirementValue', brInput);
    this.setState({ duplicateTaskInfo: null });
  }

  showBanner = (formik: any): boolean => {
    return !isEmpty(this.state.duplicateTaskInfo) &&
      (formik.values.taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
        formik.values.taskTypeId ===
          AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE)
      ? true
      : false;
  };

  renderForm(formik: FormikProps<any>): JSX.Element {
    const labels = Labels.CREATE_TASK;
    const { onChange: onLegacyRuleIdChange, ...rest } = formik.getFieldProps(
      'legacyRuleId'
    );
    return (
      <Form
        className="fe_u_margin--large"
        layout="compact"
        labelAlwaysAbove
        includeSubmitButton={false}
        autoComplete="off"
      >
        {this.showBanner(formik) && (
          <Banner>
            <BannerItem>
              <MultiLineText
                value={Messages.TASK_EXIST_FOR_BUSINESS_REQUIREMENT({
                  taskId: StringUtil.formatTaskID(
                    this.state.duplicateTaskInfo?.id
                  ),
                  activeStepName: this.state.duplicateTaskInfo
                    ?.activeTaskStepName,
                  action:
                    AppConstants.UI_CONSTANTS.DUPLICATE_TASK_INFO_ACTION.CREATE,
                })}
              />
            </BannerItem>
          </Banner>
        )}
        <div className="row">
          <FormField
            id="name"
            required={true}
            maxlength="400"
            labelText={labels.TASK_NAME}
            {...formik.getFieldProps('name')}
            error={formik.touched.name ? formik.errors.name?.toString() : ''}
          />
        </div>
        <div className="row">
          <FormField
            className="row2"
            id="priorityId"
            required={true}
            inputAs={Select}
            labelText={labels.PRIORITY}
            options={ConversionUtil.convertMapToDropDownList(
              this.props.prioritiesWithSla
            )}
            {...formik.getFieldProps('priorityId')}
            onChange={(event: any) => {
              this.handlePrioritiesChange(event, 'priorityId', formik);
            }}
            error={
              formik.touched.priorityId
                ? formik.errors.priorityId?.toString()
                : ''
            }
          />

          <FormField
            className="col4 priority-reason"
            id="priorityReasonId"
            required={AppConstants.UI_CONSTANTS.PRIORITY_REASON_MANDATORY_PRIORITY_IDS.includes(
              formik.values.priorityId
            )}
            inputAs={Select}
            labelText={labels.PRIORITY_REASON}
            options={ConversionUtil.convertMapToDropDownList(
              this.props.priorityReasons
            )}
            {...formik.getFieldProps('priorityReasonId')}
            error={
              formik.touched.priorityReasonId
                ? formik.errors.priorityReasonId?.toString()
                : ''
            }
          />
          <PriorityPolicy priorityPolicies={this.props.prioritiesWithSla} />
        </div>

        <div className="row">
          <FormField
            className="priority-reason-note"
            id="priorityReasonNote"
            maxlength="200"
            labelText={labels.PRIORITY_REASON_NOTE}
            {...formik.getFieldProps('priorityReasonNote')}
          />
        </div>
        <div className="row">
          <FormField
            className="row2"
            id="originatingSystemId"
            required={true}
            inputAs={Select}
            labelText={labels.ORIGINATING_SYSTEM}
            options={ConversionUtil.convertMapToDropDownList(
              this.props.originatingSystems
            )}
            {...formik.getFieldProps('originatingSystemId')}
            error={
              formik.touched.originatingSystemId
                ? formik.errors.originatingSystemId?.toString()
                : ''
            }
          />
          <FormField
            className="row2"
            id="originatingCaseId"
            required={true}
            maxlength="20"
            labelText={labels.ORIGINATING_SYSTEM_ID}
            {...formik.getFieldProps('originatingCaseId')}
            error={
              formik.touched.originatingCaseId
                ? formik.errors.originatingCaseId?.toString()
                : ''
            }
          />
          <FormField
            className="col4"
            id="departmentOriginId"
            required={true}
            inputAs={Select}
            labelText={labels.DEPARTMENT_ORIGIN}
            options={ConversionUtil.convertMapToDropDownList(
              this.props.departmentOrigins
            )}
            {...formik.getFieldProps('departmentOriginId')}
            error={
              formik.touched.departmentOriginId
                ? formik.errors.departmentOriginId?.toString()
                : ''
            }
          />
        </div>
        <div className="row">
          <FormField
            className="row3"
            id="taskTypeId"
            required={true}
            inputAs={Select}
            labelText={labels.TASK_TYPE}
            options={ConversionUtil.convertMapToDropDownList(
              this.props.taskTypes
            )}
            {...formik.getFieldProps('taskTypeId')}
            onChange={(event: any) => {
              this.handleTaskTypeIdChange(event, 'taskTypeId', formik);
            }}
            error={
              formik.touched.taskTypeId
                ? formik.errors.taskTypeId?.toString()
                : ''
            }
          />
          {CommonUtil.isActiveTaskType(formik.values.taskTypeId) && (
            <FormField
              labelText={labels.BR_UPDATE_REASON}
              inputAs={Multiselect}
              required={true}
              {...formik.getFieldProps('brUpdateReasonIds')}
              id="brUpdateReasonIds"
              options={ConversionUtil.convertMapToDropDownList(
                this.state.brUpdateReasonsByTaskType
              )}
              error={
                formik.touched.brUpdateReasonIds
                  ? formik.errors.brUpdateReasonIds?.toString()
                  : ''
              }
            />
          )}
        </div>
        <div className="row">
          {formik.values.taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .DUAL_MAINTENANCE_BR_UPDATE && (
            <FormField
              className="field2"
              inputAs={Typeahead}
              required
              id="legacyRuleId"
              maxlength="20"
              labelText={labels.LEGACY_RULE_ID}
              {...formik.getFieldProps('legacyRuleId')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.handleLegacyRuleIdChange(event, formik);
              }}
              onBlur={(event: any) => {
                this.handleLegacyRuleIdBlur(event, formik);
              }}
              alwaysRenderSuggestions={false}
              suggestions={this.state.legacyRuleIds}
              onSuggestionSelected={(
                event: React.ChangeEvent<HTMLInputElement>,
                value: any
              ) => {
                this.setLegacyRuleDetails(value, formik);
              }}
              error={
                formik.touched.legacyRuleId
                  ? formik.errors.legacyRuleId?.toString()
                  : ''
              }
            ></FormField>
          )}
          {formik.values.taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .DUAL_MAINTENANCE_NEW_BR && (
            <FormField
              className="field2"
              required={true}
              id="legacyRuleId"
              maxlength="20"
              labelText={labels.LEGACY_RULE_ID}
              {...rest}
              onBlur={(event: any) => {
                this.validateLegacyRuleId(event, formik);
              }}
              onChange={(event: any) => {
                const { value } = event.target;
                if (/^\d+\.?(\d+)?$/.test(value) || value == '') {
                  onLegacyRuleIdChange(event);
                }
              }}
              error={
                formik.touched.legacyRuleId
                  ? formik.errors.legacyRuleId?.toString()
                  : ''
              }
            ></FormField>
          )}
          {(formik.values.taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .DUAL_MAINTENANCE_BR_UPDATE ||
            formik.values.taskTypeId ===
              AppConstants.SERVER_CONSTANTS.TASK_TYPES
                .DUAL_MAINTENANCE_NEW_BR) && (
            <FormField
              className="field3"
              required={true}
              id="legacyTaskId"
              maxlength="20"
              labelText={labels.LEGACY_TASK_ID}
              {...formik.getFieldProps('legacyTaskId')}
              error={
                formik.touched.legacyTaskId
                  ? formik.errors.legacyTaskId?.toString()
                  : ''
              }
            ></FormField>
          )}
        </div>
        <div className="row">
          {formik.values.taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .BUSINESS_REQUIREMENT_UPDATE && (
            <FormField
              className="businessRequirement"
              inputAs={Typeahead}
              id="businessRequirement"
              required
              labelText={labels.BUSINESS_REQUIREMENT}
              {...formik.getFieldProps('businessRequirementValue')}
              onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                this.getBusinessRequirements(event, formik);
              }}
              alwaysRenderSuggestions={false}
              suggestions={this.state.businessRequirements}
              onSuggestionSelected={(
                event: React.ChangeEvent<HTMLInputElement>,
                value: any
              ) => {
                this.setLegacyRuleDetails(value, formik);
              }}
              error={
                formik.touched.businessRequirementValue
                  ? formik.errors.businessRequirementValue?.toString()
                  : ''
              }
            ></FormField>
          )}
          {formik.values.taskTypeId !==
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .BUSINESS_REQUIREMENT_UPDATE && (
            <FormField
              className="businessRequirementName"
              id="businessRequirementName"
              required={true}
              maxlength="100"
              labelText={labels.BUSINESS_REQUIREMENT_NAME}
              {...formik.getFieldProps('businessRequirementName')}
              error={
                formik.touched.businessRequirementName
                  ? formik.errors.businessRequirementName?.toString()
                  : ''
              }
              disabled={
                formik.values.taskTypeId ===
                AppConstants.SERVER_CONSTANTS.TASK_TYPES
                  .DUAL_MAINTENANCE_BR_UPDATE
              }
            />
          )}
          {formik.values.taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .DUAL_MAINTENANCE_BR_UPDATE && (
            <FormField
              className="businessRequirementId"
              id="businessRequirementId"
              required={true}
              labelText={labels.BUSINESS_REQUIREMENT_ID}
              {...formik.getFieldProps('businessRequirementId')}
              disabled={true}
              error={
                formik.touched.businessRequirementId
                  ? formik.errors.businessRequirementId?.toString()
                  : ''
              }
              value={StringUtil.formatBRID(formik.values.businessRequirementId)}
            />
          )}
        </div>
        <div className="row">
          {formik.values.taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .DUAL_MAINTENANCE_BR_UPDATE ||
          formik.values.taskTypeId ===
            AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR ? (
            <FormField
              className="row5"
              inputAs={DateInput}
              minDate={new Date()}
              id="dueDate"
              labelText={labels.INTERNAL_DUE_DATE}
              {...formik.getFieldProps('dueDate')}
              error={
                formik.touched.dueDate ? formik.errors.dueDate?.toString() : ''
              }
              errorAlwaysBelow={true}
              onBlur={(event: any) => {
                CommonUtil.handleDateChange(event, formik);
              }}
            />
          ) : (
            <FormField
              className="row5"
              id="dueDate"
              required={true}
              labelText={labels.INTERNAL_DUE_DATE}
              {...formik.getFieldProps('dueDate')}
              disabled={true}
            />
          )}
          <FormField
            className="row5"
            id="assignedTo"
            required={true}
            inputAs={Select}
            labelText={labels.ASSIGNED_TO}
            options={ConversionUtil.convertMapToDropDownList(
              this.props.users,
              'userName'
            )}
            {...formik.getFieldProps('assignedTo')}
            error={
              formik.touched.assignedTo
                ? formik.errors.assignedTo?.toString()
                : ''
            }
          />
        </div>
      </Form>
    );
  }

  render(): JSX.Element {
    const labels = Labels.CREATE_TASK;
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
        validateOnMount={false}
      >
        {(formik) => {
          return (
            <Lightbox
              show
              hideDividers
              headerText={labels.NEW_TASK}
              disableClose
              width="large"
              className="my-custom-lightbox create_task"
            >
              <Button
                variant="tertiary"
                icon="Close"
                onClick={this.props.onCloseCreateTask}
                className="my-close-button"
              />
              {this.renderForm(formik)}
              <div className="fe_c_lightbox__footer">
                <Button
                  text={labels.CANCEL}
                  variant="secondary"
                  className="fe_u_margin--right-small"
                  onClick={this.props.onCloseCreateTask}
                />
                <Button text={labels.SAVE} onClick={formik.handleSubmit} />
              </div>
            </Lightbox>
          );
        }}
      </Formik>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    users: getUsers(state),
    priorityReasons: getPriorityReasons(state),
    prioritiesWithSla: getPrioritiesWithSla(state),
    taskTypes: getTaskTypes(state),
    originatingSystems: getOriginatingSystems(state),
    departmentOrigins: getDepartmentOrigins(state),
    brUpdateReasons: getBRUpdateReasons(state),
  };
};

const mapDispatchToProps = {
  addSuccessToast,
  fetchUsersOnce,
  fetchPriorityReasonsOnce,
  fetchPrioritiesWithSla,
  fetchTaskTypesOnce,
  fetchOriginatingSytemsOnce,
  fetchDepartmentOriginsOnce,
  fetchBRUpdateReasonsOnce,
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTask);
