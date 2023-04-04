import React, { useState } from 'react';
import {
  GridRow,
  GridCol,
  Button,
  Icon,
  StatusTag,
  Tooltip,
  Modal,
  FormError,
} from '@athena/forge';
import { FieldArray, FormikProps } from 'formik';
import './TaskDependency.scss';
import Labels from '../../../../../constants/Labels';
import AppConstants from '../../../../../constants/AppConstants';
import Messages from '../../../../../constants/Messages';
import StringUtil from '../../../../../utils/StringUtil';
import { TaskDependencyDetails, TaskDetail } from '../../../../../types';
import AddDependency from './AddDependency';
import EditDependency from './EditDependency';
import { findIndex, get } from 'lodash';
import moment from 'moment';
import {
  getTaskDetail,
  refreshTaskList,
} from '../../../../../slices/TaskSlice';
import { isTaskEditable } from '../../UpdateTask';
import { connect } from 'react-redux';
import Acl from '../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';

interface TaskDependencyProps {
  formik: FormikProps<any>;
  task?: TaskDetail;
  refreshTaskList: (values: any) => void;
}

export function isPendingInAtlas(
  taskDependency: TaskDependencyDetails,
  taskDeploymentDate: any
): boolean {
  if (
    taskDependency.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.ATLAS_ID &&
    moment(taskDependency.deploymentDate).isSame(moment(taskDeploymentDate)) &&
    AppConstants.SERVER_CONSTANTS.COMPLETED_STATUSES.ATLAS.includes(
      taskDependency.statusName?.toUpperCase()
    )
  ) {
    return true;
  }
  return false;
}
export function isPendingInJira(
  taskDependency: TaskDependencyDetails,
  taskDeploymentDate: any
): boolean {
  if (
    taskDependency.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.JIRA_ID &&
    moment(taskDependency.deploymentDate).isSame(moment(taskDeploymentDate)) &&
    AppConstants.SERVER_CONSTANTS.COMPLETED_STATUSES.JIRA.includes(
      taskDependency.statusName?.toUpperCase()
    )
  ) {
    return true;
  }
  return false;
}
export function isPendingInRulesTracker(
  taskDependency: TaskDependencyDetails,
  taskDeploymentDate: any
): boolean {
  if (
    (taskDependency.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.RULE_TRACKER_ID &&
      moment(taskDependency.deploymentDate).isSame(
        moment(taskDeploymentDate)
      ) &&
      AppConstants.SERVER_CONSTANTS.COMPLETED_STATUSES.RULE_TRACKER.includes(
        taskDependency.statusName?.toUpperCase()
      )) ||
    taskDependency.statusName ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.COMPLETED
  ) {
    return true;
  }
  return false;
}

export function autoCompleteBlockedbyDependencies(
  taskDependencies: TaskDependencyDetails[] = [],
  deploymentDate: string,
  dependencyCondition?: string
): TaskDependencyDetails[] {
  const {
    BLOCKED_BY,
    SPECIFIC_DEPLOYMENT_DATE,
  } = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;
  const {
    PENDING,
    COMPLETED,
  } = AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES.DEPENDENCY_BLOCKING_STATUS;
  const { YES, NO } = AppConstants.SERVER_CONSTANTS;
  const response = taskDependencies.map((taskDependency) => {
    const { dependencyDate, dependencyName } = taskDependency;
    const condition = dependencyCondition || taskDependency.dependencyCondition;

    if (condition == BLOCKED_BY && dependencyName == SPECIFIC_DEPLOYMENT_DATE) {
      let completedYn, statusName;

      if (moment(dependencyDate).isSame(deploymentDate)) {
        completedYn = YES;
        statusName = COMPLETED;
      } else {
        completedYn = NO;
        statusName = PENDING;
      }

      return { ...taskDependency, completedYn, statusName };
    } else {
      return taskDependency;
    }
  });
  return response;
}

export function getDependencyReasonsByWFStepId(workflowStepId = '0'): string[] {
  const constants = AppConstants.SERVER_CONSTANTS;
  const dependencyConstants = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;
  let reasons =
    AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES.DEPENDENCY_BLOCKING_REASONS;

  if (workflowStepId > constants.WORKFLOW_STEPS.TEST_CHANGES_STEP) {
    reasons = reasons.filter((value) => {
      return ![
        dependencyConstants.CLIENT_OR_INTERNAL_COMMUNICATION,
        dependencyConstants.IMPACT_QUERY,
        dependencyConstants.LRA_UPDATES,
      ].includes(value);
    });
  }
  if (workflowStepId > constants.WORKFLOW_STEPS.REVIEW_TASK_STEP) {
    reasons = reasons.filter((value) => {
      return value !== AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.CRMT;
    });
  }
  return reasons;
}

let deleteDependency: TaskDependencyDetails | null;
export function TaskDependency(props: TaskDependencyProps): JSX.Element {
  const { formik } = props;
  const { taskDependencies } = formik.values;
  const [showAddDependency, setShowAddDependency] = useState(false);
  const [
    editDependency,
    setEditDependency,
  ] = useState<TaskDependencyDetails | null>(null);
  const [showDeleteDependency, setShowDeleteDependency] = useState(false);
  const changeShowAddDependency = () => {
    setShowAddDependency(!showAddDependency);
  };
  const clearEditDependency = () => {
    setEditDependency(null);
  };
  const clearDeleteDependency = () => {
    setShowDeleteDependency(false);
    deleteDependency = null;
  };
  const confirmDeleteDependency = () => {
    const updatedDependencies = [...taskDependencies];
    const index = findIndex(updatedDependencies, (o) => o === deleteDependency);
    let updatedDependency: TaskDependencyDetails;
    if (deleteDependency) {
      updatedDependency = { ...deleteDependency };
      updatedDependency.deleted = StringUtil.formatDate(new Date());
      updatedDependencies[index] = updatedDependency;
      formik.setFieldValue('taskDependencies', updatedDependencies);
      setShowDeleteDependency(false);
      deleteDependency = null;
      props.refreshTaskList({
        ...props.task,
        taskDependencies: updatedDependencies,
      });
    }
  };
  const saveAddDependency = (values: any) => {
    values.taskDependencies.forEach(function (
      taskDependency: TaskDependencyDetails
    ) {
      const { dependencyCondition } = values;
      taskDependency.dependencyCondition = dependencyCondition;
      if (
        dependencyCondition ==
        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.BLOCKED_BY
      ) {
        taskDependency.statusName =
          taskDependency.statusName ||
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES.DEPENDENCY_BLOCKING_STATUS
            .PENDING;
      }
      const { dependencyDate, dependencyName } = taskDependency;
      taskDependency.dependencyDate =
        dependencyDate &&
        dependencyName ==
          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.SPECIFIC_DEPLOYMENT_DATE
          ? new Date(dependencyDate).toLocaleDateString('en-US')
          : '';
      if (
        taskDependency.dependencyCondition ===
        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
      ) {
        updateDependencyTaskCompletionStatus(taskDependency);
      }
    });

    formik.setFieldValue(
      'taskDependencies',
      [...formik.values.taskDependencies, ...values.taskDependencies],
      false
    );
    const addedDependencies = [
      ...formik.values.taskDependencies,
      ...values.taskDependencies,
    ];
    props.refreshTaskList({
      ...props.task,
      taskDependencies: addedDependencies,
    });

    changeShowAddDependency();
  };

  const updateDependencyTaskCompletionStatus = (
    taskDependency: TaskDependencyDetails
  ) => {
    if (
      isPendingInAtlas(taskDependency, props.task?.deploymentDate) ||
      isPendingInJira(taskDependency, props.task?.deploymentDate) ||
      isPendingInRulesTracker(taskDependency, props.task?.deploymentDate)
    ) {
      taskDependency.completedYn = AppConstants.SERVER_CONSTANTS.YES;
    }
  };

  const findEditDependencyIndex = () => {
    return findIndex(taskDependencies, (o) => o === editDependency);
  };

  const saveEditDependency = (input: TaskDependencyDetails) => {
    const value = { ...input };
    const updatedDependencies = [...taskDependencies];
    const index = findEditDependencyIndex();
    const { dependencyDate, dependencyName } = value;
    value.dependencyDate =
      dependencyDate &&
      dependencyName ==
        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.SPECIFIC_DEPLOYMENT_DATE
        ? new Date(dependencyDate).toLocaleDateString('en-US')
        : '';
    if (
      value.dependencyCondition ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
    ) {
      value.completedYn = AppConstants.SERVER_CONSTANTS.NO;
      updateDependencyTaskCompletionStatus(value);
    }
    updatedDependencies[index] = value;
    formik.setFieldValue('taskDependencies', updatedDependencies);
    const addedDependencies = [...updatedDependencies];
    props.refreshTaskList({
      ...props.task,
      taskDependencies: addedDependencies,
    });
    clearEditDependency();
  };

  const getDependencyIdURL = (obj: TaskDependencyDetails): any => {
    let dependencyIdURL = '';
    if (
      obj.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.ATLAS_ID
    ) {
      dependencyIdURL = StringUtil.getAtlasTaskIdUrl(obj?.dependencyId);
    } else if (
      obj.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.JIRA_ID
    ) {
      dependencyIdURL = StringUtil.getJIRAIdUrl(obj?.dependencyId);
    } else if (
      obj.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.RULE_TRACKER_ID
    ) {
      dependencyIdURL = StringUtil.getRTTaskIdUrl(obj?.dependencyId);
    }
    return dependencyIdURL;
  };

  const getDependencyId = (obj: TaskDependencyDetails): any => {
    let dependencyId = '';
    if (
      obj.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.ATLAS_ID
    ) {
      dependencyId = StringUtil.formatTaskID(obj?.dependencyId);
    } else if (
      obj.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.JIRA_ID
    ) {
      dependencyId = obj?.dependencyId;
    } else if (
      obj.dependencySystemId ===
      AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.RULE_TRACKER_ID
    ) {
      dependencyId = StringUtil.formatRuleTrackerTaskID(obj?.dependencyId);
    }
    return dependencyId;
  };

  const getStatusCss = (obj: TaskDependencyDetails): string => {
    let style = 'status';
    if (obj?.completedYn === AppConstants.SERVER_CONSTANTS.YES) {
      style += ' completed';
    }
    return style;
  };

  const isDisabled = !isTaskEditable(props.task);

  const getTaskDependencyDetailsTemplate = (): any => {
    let content = null;
    content = (
      <FieldArray
        name="taskDependencies"
        render={(arrayHelpers) => (
          <div>
            {
              <div>
                <div>
                  {formik.values.taskDependencies.length === 0 ? (
                    <div>
                      <p className="no-tasks">{Messages.NO_RELATED_TASKS}</p>
                      <div className="no-tasks">
                        <WFEnableForPermission
                          permission={Acl.TASK_DEPENDENCY_DETAILS_UPDATE}
                        >
                          <Button
                            className="root-add-button"
                            text={Labels.TASK_DEPENDENCY_DETAILS.ADD}
                            icon={Labels.TASK_DEPENDENCY_DETAILS.ADD}
                            variant="tertiary"
                            onClick={() => setShowAddDependency(true)}
                            disabled={isDisabled}
                          />
                        </WFEnableForPermission>
                      </div>
                    </div>
                  ) : (
                    <div className="add-dependency">
                      <WFEnableForPermission
                        permission={Acl.TASK_DEPENDENCY_DETAILS_UPDATE}
                      >
                        <Button
                          className="root-add-button"
                          text={Labels.TASK_DEPENDENCY_DETAILS.ADD}
                          icon={Labels.TASK_DEPENDENCY_DETAILS.ADD}
                          variant="tertiary"
                          onClick={() => setShowAddDependency(true)}
                          disabled={isDisabled}
                        />
                      </WFEnableForPermission>
                    </div>
                  )}
                </div>
                <div>
                  <div className="deploy-with">
                    {(formik.values.taskDependencies.filter(
                      (obj: TaskDependencyDetails) =>
                        obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY
                            .DEPLOY_WITH && obj.deleted
                    ).length === 1 &&
                      formik.values.taskDependencies.filter(
                        (obj: TaskDependencyDetails) =>
                          obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
                      ).length === 1) ||
                    formik.values.taskDependencies.filter(
                      (obj: TaskDependencyDetails) =>
                        obj.dependencyCondition ===
                        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
                    ).length === 0 ? (
                      <b></b>
                    ) : (
                      <b>
                        {
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES
                            .DEPENDENCY_CONDITIONS[0].text
                        }
                      </b>
                    )}
                    {formik.values.taskDependencies
                      .filter(
                        (obj: TaskDependencyDetails) =>
                          obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.DEPLOY_WITH
                      )
                      .map((obj: TaskDependencyDetails, index: number) => {
                        return (
                          <div
                            key={index}
                            className={
                              obj.deleted ? 'hidden-row' : 'dependency-item'
                            }
                          >
                            <div className="dependency-row">
                              <GridRow className="dependency-content">
                                <GridCol width={{ small: 2 }}>
                                  <span className="font16">
                                    <a
                                      href={getDependencyIdURL(obj)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {getDependencyId(obj)}
                                    </a>
                                  </span>
                                </GridCol>
                                <GridCol width={{ small: 4 }}>
                                  <span className="font16">
                                    {obj?.dependencyName}
                                  </span>
                                  {obj.notes && (
                                    <Tooltip
                                      text={obj.notes}
                                      id={'task-dependency-notes'}
                                      className="task-dependency-notes-tip"
                                    >
                                      <Icon icon="Info" className="info-icon" />
                                    </Tooltip>
                                  )}
                                </GridCol>
                                <GridCol
                                  width={{ small: 3 }}
                                  className="deployment-date"
                                >
                                  <span>
                                    {
                                      Labels.TASK_DEPENDENCY_DETAILS
                                        .DEPLOYMENT_DATE
                                    }
                                    {obj?.deploymentDate
                                      ? obj?.deploymentDate
                                      : '---'}
                                  </span>
                                </GridCol>
                                <GridCol
                                  width={{ small: 1 }}
                                  className="edit-dependency"
                                >
                                  <WFEnableForPermission
                                    permission={
                                      Acl.TASK_DEPENDENCY_DETAILS_UPDATE
                                    }
                                  >
                                    <Button
                                      variant="tertiary"
                                      icon="Edit"
                                      className="edit-icon"
                                      onClick={() => {
                                        setEditDependency(obj);
                                      }}
                                      disabled={isDisabled}
                                    />
                                  </WFEnableForPermission>
                                  <WFEnableForPermission
                                    permission={
                                      Acl.TASK_DEPENDENCY_DETAILS_UPDATE
                                    }
                                  >
                                    <Button
                                      variant="tertiary"
                                      icon="Delete"
                                      className="delete-icon"
                                      onClick={() => {
                                        deleteDependency = obj;
                                        setShowDeleteDependency(true);
                                      }}
                                      disabled={isDisabled}
                                    />
                                  </WFEnableForPermission>
                                </GridCol>
                                <GridCol
                                  width={{ small: 2 }}
                                  className="status-tag"
                                >
                                  <StatusTag
                                    className={` status_nowrap_no_transform ${getStatusCss(
                                      obj
                                    )}`}
                                    text={obj?.statusName}
                                  />
                                </GridCol>
                              </GridRow>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="test-with">
                    {(formik.values.taskDependencies.filter(
                      (obj: TaskDependencyDetails) =>
                        obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.TEST_WITH &&
                        obj.deleted
                    ).length === 1 &&
                      formik.values.taskDependencies.filter(
                        (obj: TaskDependencyDetails) =>
                          obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.TEST_WITH
                      ).length === 1) ||
                    formik.values.taskDependencies.filter(
                      (obj: TaskDependencyDetails) =>
                        obj.dependencyCondition ===
                        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.TEST_WITH
                    ).length === 0 ? (
                      <b></b>
                    ) : (
                      <b>
                        {
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES
                            .DEPENDENCY_CONDITIONS[2].text
                        }
                      </b>
                    )}
                    {formik.values.taskDependencies
                      .filter(
                        (obj: TaskDependencyDetails) =>
                          obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.TEST_WITH
                      )
                      .map((obj: TaskDependencyDetails, index: number) => {
                        return (
                          <div
                            key={index}
                            className={
                              obj.deleted ? 'hidden-row' : 'dependency-item'
                            }
                          >
                            <div className="dependency-row">
                              <GridRow className="dependency-content">
                                <GridCol width={{ small: 2 }}>
                                  <span className="font16">
                                    <a
                                      href={getDependencyIdURL(obj)}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {getDependencyId(obj)}
                                    </a>
                                  </span>
                                </GridCol>
                                <GridCol
                                  width={{ small: 17, medium: 11, large: 7 }}
                                >
                                  <span className="font16">
                                    {obj?.dependencyName}
                                  </span>
                                  {obj.notes && (
                                    <Tooltip
                                      text={obj.notes}
                                      id={'task-dependency-notes'}
                                      className="task-dependency-notes-tip"
                                    >
                                      <Icon icon="Info" className="info-icon" />
                                    </Tooltip>
                                  )}
                                </GridCol>
                                <GridCol
                                  width={{ small: 1 }}
                                  className="edit-dependency"
                                >
                                  <WFEnableForPermission
                                    permission={
                                      Acl.TASK_DEPENDENCY_DETAILS_UPDATE
                                    }
                                  >
                                    <Button
                                      variant="tertiary"
                                      icon="Edit"
                                      className="edit-icon"
                                      onClick={() => {
                                        setEditDependency(obj);
                                      }}
                                      disabled={isDisabled}
                                    />
                                  </WFEnableForPermission>
                                  <WFEnableForPermission
                                    permission={
                                      Acl.TASK_DEPENDENCY_DETAILS_UPDATE
                                    }
                                  >
                                    <Button
                                      variant="tertiary"
                                      icon="Delete"
                                      className="delete-icon"
                                      onClick={() => {
                                        deleteDependency = obj;
                                        setShowDeleteDependency(true);
                                      }}
                                      disabled={isDisabled}
                                    />
                                  </WFEnableForPermission>
                                </GridCol>
                                <GridCol
                                  width={{ small: 2 }}
                                  className="status-tag"
                                >
                                  <StatusTag
                                    className={` status_nowrap_no_transform ${getStatusCss(
                                      obj
                                    )}`}
                                    text={obj?.statusName}
                                  />
                                </GridCol>
                              </GridRow>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                  <div className="blocked-by">
                    {(formik.values.taskDependencies.filter(
                      (obj: TaskDependencyDetails) =>
                        obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY
                            .BLOCKED_BY && obj.deleted
                    ).length === 1 &&
                      formik.values.taskDependencies.filter(
                        (obj: TaskDependencyDetails) =>
                          obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.BLOCKED_BY
                      ).length === 1) ||
                    formik.values.taskDependencies.filter(
                      (obj: TaskDependencyDetails) =>
                        obj.dependencyCondition ===
                        AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.BLOCKED_BY
                    ).length === 0 ? (
                      <b></b>
                    ) : (
                      <b>
                        {
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES
                            .DEPENDENCY_CONDITIONS[1].text
                        }
                      </b>
                    )}
                    {formik.values.taskDependencies
                      .filter(
                        (obj: TaskDependencyDetails) =>
                          obj.dependencyCondition ===
                          AppConstants.UI_CONSTANTS.TASK_DEPENDENCY.BLOCKED_BY
                      )
                      .map((obj: TaskDependencyDetails, index: number) => {
                        const idx = formik.values.taskDependencies.indexOf(obj);
                        const error = get(
                          formik.errors,
                          `taskDependencies.${idx}.completedYn`
                        );
                        const activeDepReasons = getDependencyReasonsByWFStepId(
                          props.task?.activeWorkflowStepId
                        );
                        const isDependencyEditable = activeDepReasons.includes(
                          obj.dependencyName
                        );
                        return (
                          <div
                            key={index}
                            className={
                              obj.deleted ? 'hidden-row' : 'dependency-item'
                            }
                          >
                            <div className="dependency-row">
                              <GridRow className="dependency-content">
                                <GridCol width={{ small: 9 }}>
                                  <span className="font16">
                                    {obj?.dependencyName}
                                  </span>
                                  {obj.notes && (
                                    <Tooltip
                                      text={
                                        obj.dependencyName ===
                                        AppConstants.UI_CONSTANTS
                                          .TASK_DEPENDENCY
                                          .SPECIFIC_DEPLOYMENT_DATE
                                          ? obj.deploymentDate
                                          : obj.notes
                                      }
                                      id={'task-dependency-notes'}
                                      className="task-dependency-notes-tip"
                                    >
                                      <Icon icon="Info" className="info-icon" />
                                    </Tooltip>
                                  )}
                                  {obj.dependencyDate && (
                                    <span> = {obj.dependencyDate}</span>
                                  )}
                                </GridCol>
                                <GridCol
                                  width={{ small: 1 }}
                                  className="edit-dependency"
                                >
                                  <WFEnableForPermission
                                    permission={
                                      Acl.TASK_DEPENDENCY_DETAILS_UPDATE
                                    }
                                  >
                                    <Button
                                      variant="tertiary"
                                      icon="Edit"
                                      className="edit-icon"
                                      onClick={() => {
                                        setEditDependency(obj);
                                      }}
                                      disabled={
                                        isDisabled || !isDependencyEditable
                                      }
                                    />
                                  </WFEnableForPermission>
                                  <WFEnableForPermission
                                    permission={
                                      Acl.TASK_DEPENDENCY_DETAILS_UPDATE
                                    }
                                  >
                                    <Button
                                      variant="tertiary"
                                      icon="Delete"
                                      className="delete-icon"
                                      onClick={() => {
                                        deleteDependency = obj;
                                        setShowDeleteDependency(true);
                                      }}
                                      disabled={
                                        isDisabled || !isDependencyEditable
                                      }
                                    />
                                  </WFEnableForPermission>
                                </GridCol>
                                <GridCol
                                  width={{ small: 2 }}
                                  className="status-tag"
                                >
                                  <StatusTag
                                    className={` status_nowrap_no_transform ${getStatusCss(
                                      obj
                                    )}`}
                                    text={obj?.statusName}
                                  />
                                </GridCol>
                              </GridRow>
                              {error && (
                                <FormError className="error">{error}</FormError>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            }
          </div>
        )}
      />
    );
    return content;
  };

  return (
    <div className="task-dependency">
      <div className="task-dependency-details">
        {getTaskDependencyDetailsTemplate()}
      </div>

      {showAddDependency && (
        <AddDependency
          show
          onCancel={changeShowAddDependency}
          onSave={saveAddDependency}
          task={props.task}
        />
      )}

      {editDependency && (
        <EditDependency
          show
          taskDependency={editDependency}
          onCancel={clearEditDependency}
          onSave={saveEditDependency}
          task={props.task}
          index={findEditDependencyIndex()}
        />
      )}
      {showDeleteDependency && (
        <Modal
          show
          headerText={Labels.TASK_DEPENDENCY.HEADER_TEXT_DELETE}
          primaryButtonText={Labels.TASK_DEPENDENCY.PRIMARY_MODAL_TEXT_DELETE}
          alertType="attention"
          width="small"
          onHide={clearDeleteDependency}
          onPrimaryClick={confirmDeleteDependency}
        >
          <p>{Labels.TASK_DEPENDENCY.MESSAGE_TEXT_DELETE}</p>
        </Modal>
      )}
    </div>
  );
}
const mapStateToProps = (state: any) => {
  return {
    task: getTaskDetail(state),
  };
};

export default connect(mapStateToProps, {
  refreshTaskList,
})(TaskDependency);
