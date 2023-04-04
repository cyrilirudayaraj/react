import {
  Accordion,
  AccordionItem,
  Button,
  Form,
  GridCol,
  GridRow,
  Label,
  StatusTag,
} from '@athena/forge';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import WFReadOnlyInput from '../../../../../components/wf-readonlyinput/WFReadOnlyInput';
import AppConstants from '../../../../../constants/AppConstants';
import Messages from '../../../../../constants/Messages';
import Labels from '../../../../../constants/Labels';
import { TaskDetail, UpdateTaskProps } from '../../../../../types';
import StringUtil from '../../../../../utils/StringUtil';
import { getAssignedTo, isTaskEditable } from '../../UpdateTask';
import {
  getTaskDetail,
  getEditBtnValue,
  setLeftFormAction,
  setRightFormAction,
  updateEditBtnAction,
  getLeftSectionActive,
  getRightSectionActive,
  getLeftFormAction,
} from '../../../../../slices/TaskSlice';
import './TaskOverview.scss';
import UpdateTaskOverview from './UpdateTaskOverview';
import WarningIcon from '../../../../../components/warning-icon/WarningIcon';
import Acl from '../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import { getSalesforceCaseDetails } from '../../../../../services/CommonService';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import CommonUtil from '../../../../../utils/CommonUtil';

interface GetderivedStateProps {
  editBtnClick?: any;
  functionThis?: any;
}

export class TaskOverview extends Component<
  UpdateTaskProps,
  any,
  GetderivedStateProps
> {
  constructor(props: UpdateTaskProps) {
    super(props);
    this.state = {
      isEditable: false,
      functionThis: this,
      dupEditAction: false,
      escalatedMessage: '',
      isEscalated: false,
      salesforceRecordId: '',
    };
  }

  fechSalesforceRecordId() {
    const { props } = this;
    const { originatingCaseId, originatingSystemId } = props.task;
    const { SALESFORCE } = AppConstants.UI_CONSTANTS.ORIGINATING_SYSTEM;

    if (originatingSystemId == SALESFORCE && originatingCaseId) {
      getSalesforceCaseDetails(originatingCaseId)
        .then((response: any) => {
          this.setState({ salesforceRecordId: response.id });
        })
        .catch((e: any) => {
          this.setState({ salesforceRecordId: '' });
        });
    }
  }

  componentDidMount() {
    this.fechSalesforceRecordId();
  }

  componentDidUpdate(prevProps: UpdateTaskProps) {
    const { originatingCaseId, originatingSystemId } = this.props.task;

    if (
      originatingCaseId != prevProps.task.originatingCaseId ||
      originatingSystemId != prevProps.task.originatingSystemId
    ) {
      this.fechSalesforceRecordId();
    }
  }

  getOriginatingCaseLink() {
    const { originatingCaseId, originatingSystemId } = this.props.task;
    const { SALESFORCE } = AppConstants.UI_CONSTANTS.ORIGINATING_SYSTEM;
    let uriId = originatingCaseId;
    if (originatingSystemId == SALESFORCE) {
      uriId = this.state.salesforceRecordId;
    }

    return StringUtil.getOriginatingSystemUrl(originatingSystemId, uriId);
  }

  static getDerivedStateFromProps(props: any, state: any) {
    if (!props.leftSectionActive && !props.rightSectionActive) {
      if (state.dupEditAction) {
        return { isEditable: true };
      } else {
        return {};
      }
    } else if (props.leftSectionActive && !props.leftFormFlag) {
      return { dupEditAction: false };
    } else {
      return {};
    }
  }

  toggleReset = (): void => {
    this.setState({ dupEditAction: false, isEditable: false });
  };

  toggleEditButton = (): void => {
    if (this.props.leftSectionActive) {
      this.props.setLeftFormAction(true);
    } else {
      if (!this.state.isEditable) {
        this.setState({
          isEditable: true,
        });
      }
    }
    this.setState({ dupEditAction: true });
  };

  isEscalated = (task?: TaskDetail): boolean => {
    if (this.state.isEscalated && task?.escalatedYn === 'N') {
      if (task?.priorityId !== AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1) {
        this.setState({ isEscalated: false });
      } else if (this.state.escalatedMessage !== Messages.P0_TASK) {
        this.setState({ escalatedMessage: Messages.P0_TASK });
      }
    }
    if (!this.state.isEscalated) {
      if (
        task?.escalatedYn === 'Y' &&
        task?.priorityId === AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
      ) {
        this.setState({
          isEscalated: true,
          escalatedMessage: Messages.ESCALATED_P0_TASK,
        });
      } else if (
        task?.escalatedYn !== 'Y' &&
        task?.priorityId === AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
      ) {
        this.setState({
          isEscalated: true,
          escalatedMessage: Messages.P0_TASK,
        });
      } else if (
        task?.escalatedYn === 'Y' &&
        task?.priorityId !== AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
      ) {
        this.setState({
          isEscalated: true,
          escalatedMessage: Messages.ESCALATED_TASK,
        });
      }
    } else if (
      this.state.escalatedMessage === Messages.P0_TASK &&
      task?.escalatedYn === 'Y' &&
      task?.priorityId === AppConstants.SERVER_CONSTANTS.PRIORITY_ID_1
    ) {
      this.setState({
        isEscalated: true,
        escalatedMessage: Messages.ESCALATED_P0_TASK,
      });
    }
    return this.state.isEscalated;
  };

  readOnlyView(task?: TaskDetail): JSX.Element {
    const labels = Labels.TASK_OVERVIEW;
    const taskstatus = task?.status == undefined ? '' : task?.status;
    return (
      <div className="task-overview overview-pane-scroll">
        {isTaskEditable(task) && (
          <div className="editbtn fe_u_padding--top-small">
            <WFEnableForPermission permission={Acl.TASK_UPDATE}>
              <Button
                icon="Edit"
                id="editbtn"
                onClick={this.toggleEditButton}
                variant="tertiary"
              />
            </WFEnableForPermission>
          </div>
        )}
        <Accordion>
          <AccordionItem
            headingText={
              Labels.TASK_OVERVIEW.PRIORITY + ': ' + task?.priorityName
            }
            defaultExpanded={true}
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
            defaultExpanded={true}
          >
            <GridRow className="fe_u_padding--top-small">
              <GridCol className="taskidfield">
                <label className="fe_c_label">Task ID </label>
                <div className="fe_c_read-only-input fe_c_form-field__input">
                  <p className="fe_c_read-only-input__text">
                    {this.isEscalated(task) ? (
                      <WarningIcon
                        warning={true}
                        label={labels.TASK_ID + ' '}
                        tooltip={this.state.escalatedMessage}
                        height={22}
                        width={25}
                      />
                    ) : (
                      ''
                    )}
                    {StringUtil.formatTaskID(task?.id)}{' '}
                  </p>
                </div>
              </GridCol>
              <GridCol>
                <WFReadOnlyInput
                  labelText={
                    Labels.TASK_BUSINESS_REQUIREMENT_FIELD_LABEL
                      .BUSINESS_REQUIREMENT_ID
                  }
                  text={StringUtil.formatBRID(task?.businessRequirementId)}
                />
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-small">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.TASK_TYPE}
                  text={task?.taskTypeName}
                />
              </GridCol>
              <GridCol>
                {CommonUtil.isActiveTaskType(task?.taskTypeId) && (
                  <WFReadOnlyInput
                    labelText={labels.BR_UPDATE_REASON}
                    text={ConversionUtil.getListOfKeyValues(
                      task?.brUpdateReasons,
                      'name'
                    )?.join()}
                  />
                )}
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-small">
              <GridCol className="status-padding">
                <React.Fragment>
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
                </React.Fragment>
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-small">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.ORIGINATING_SYSTEM}
                  text={task?.originatingSystemName}
                />
              </GridCol>
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.ORIGINATING_CASE}
                  href={this.getOriginatingCaseLink()}
                  target="_blank"
                  text={task?.originatingCaseId}
                  id="originatingCaseId"
                ></WFReadOnlyInput>
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-small">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.DEPARTMENT_ORIGIN}
                  text={task?.departmentOriginName}
                />
              </GridCol>
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.JIRA_ISSUE}
                  text={task?.jiraId}
                  target="_blank"
                  href={StringUtil.getJIRAIdUrl(task?.jiraId || '/#')}
                />
              </GridCol>
            </GridRow>
          </AccordionItem>
          {task?.taskTypeId !==
            AppConstants.SERVER_CONSTANTS.TASK_TYPES
              .NEW_BUSINESS_REQUIREMENT && (
            <AccordionItem
              headingText={Labels.TASK_OVERVIEW.LEGACYDETAILS}
              defaultExpanded={true}
            >
              <GridRow className="fe_u_padding--top-small">
                <GridCol>
                  <WFReadOnlyInput
                    labelText={labels.LEGACY_RULE}
                    href={StringUtil.getRTRuleIdUrl(task?.legacyRuleId)}
                    target="_blank"
                    text={task?.legacyRuleId}
                  />
                </GridCol>
                {task?.taskTypeId ===
                  AppConstants.SERVER_CONSTANTS.TASK_TYPES
                    .BUSINESS_REQUIREMENT_UPDATE && (
                  <GridCol>
                    <WFReadOnlyInput
                      labelText={labels.LEGACY_RULE_ARCHIVED_DATE}
                      text={task?.legacyRuleArchived}
                    />
                  </GridCol>
                )}
                {(task?.taskTypeId ===
                  AppConstants.SERVER_CONSTANTS.TASK_TYPES
                    .DUAL_MAINTENANCE_BR_UPDATE ||
                  task?.taskTypeId ===
                    AppConstants.SERVER_CONSTANTS.TASK_TYPES
                      .DUAL_MAINTENANCE_NEW_BR) && (
                  <GridCol>
                    <WFReadOnlyInput
                      labelText={labels.LEGACY_TASK}
                      href={StringUtil.getRTTaskIdUrl(task?.legacyTaskId)}
                      target="_blank"
                      text={task?.legacyTaskId}
                    />
                  </GridCol>
                )}
              </GridRow>
            </AccordionItem>
          )}
          <AccordionItem
            headingText={Labels.TASK_OVERVIEW.PEOPLE}
            defaultExpanded={true}
          >
            <GridRow className="fe_u_padding--top-small">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.ASSIGNED_TO}
                  text={getAssignedTo(task)}
                />
              </GridCol>
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.CREATED_BY}
                  text={task?.createdBy}
                />
              </GridCol>
            </GridRow>
          </AccordionItem>
          <AccordionItem
            headingText={Labels.TASK_OVERVIEW.DATE}
            defaultExpanded={true}
          >
            <GridRow className="fe_u_padding--top-small">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.LAST_MODIFIED_DATE}
                  text={task?.lastModified}
                />
              </GridCol>
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.TASK_CREATED_DATE}
                  text={task?.created}
                />
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-small">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.INTERNAL_DUE_DATE}
                  text={task?.dueDate}
                />
              </GridCol>
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.CLIENT_DUE_DATE}
                  text={task?.clientDueDate}
                />
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-small">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.DEPLOYMENT_DATE}
                  text={task?.deploymentDate}
                />
              </GridCol>
            </GridRow>
          </AccordionItem>
        </Accordion>
      </div>
    );
  }

  render(): JSX.Element {
    return (
      <Form labelAlwaysAbove={true} includeSubmitButton={false}>
        {this.state.isEditable ? (
          <UpdateTaskOverview
            toggleEditButton={this.toggleEditButton}
            toggleReset={this.toggleReset}
          />
        ) : (
          this.readOnlyView(this.props.task)
        )}
      </Form>
    );
  }
}

const mapStateToProps = (state: any) => ({
  task: getTaskDetail(state),
  editBtnValue: getEditBtnValue(state),
  leftSectionActive: getLeftSectionActive(state),
  rightSectionActive: getRightSectionActive(state),
  leftFormFlag: getLeftFormAction(state),
});

export default connect(mapStateToProps, {
  updateEditBtnAction,
  setLeftFormAction,
  setRightFormAction,
})(TaskOverview);
