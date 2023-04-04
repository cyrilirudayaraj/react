import { FormikProps } from 'formik';

interface BaseType {
  id: string;
  name: string;
  description: string;
}
export interface NewTask {
  name: string;
  priorityId: string;
  priorityReasonId: string;
  priorityReasonNote: string;
  originatingSystemId: string;
  originatingCaseId: string;
  taskTypeId: string;
  legacyRuleId: string;
  legacyTaskId: string;
  businessRequirementName: string;
  businessRequirementId: string;
  dueDate: string;
  assignedTo: string;
  businessRequirementValue: string;
  departmentOriginId: string;
  brUpdateReasonIds: any[];
  clientDueDate?: string;
  isArchivedRule?: boolean;
  isLegacyRuleExist?: boolean;
}

export interface TaskStep {
  workflowStepId: any;
  signOffStatement: any;
  signedOffYn: any;
  name: string;
  ordering: string;
  transitionText: any;
  id: string;
  assignedTo: string | null;
  version: string;
  teamId?: string;
  plannedCompletion: string | null;
  actualCompletion: string | null;
  totalWorkLog?: string;
}

export interface TaskDTDetails {
  id: string;
  taskId: string;
  modelName: string;
  name: string;
  refId: string;
  description: string;
  refUrl: string;
  ordering?: string;
  lastModified?: string;
  lastModifiedBy?: string;
  deleted?: string;
  deletedBy?: string;
  version: string;
  expanded?: boolean;
}

export interface TaskDetail {
  originatingSystemId: string | '';
  statusId: string;
  dueDate: any;
  status: string;
  createdBy: string;
  contextId: string;
  contextName: string;
  contextRefId: string;
  ruleReportingCategoryId: any;
  businessRequirementId: string;
  originatingCaseId: string;
  clientDueDate: any;
  modelDesignChanges: any;
  localRuleUseCaseId: any;
  id: string;
  version: string;
  activeTaskStepId: string;
  activeWorkflowStepId: string;
  businessRequirementTypeId: any;
  priorityName: string;
  dtChangesYn: any;
  legacyRuleId: string;
  jiraId: string | null;
  legacyTaskId: string | null;
  legacyRuleArchived: string | null;
  businessRequirementName: string;
  name: string;
  taskTypeId: string;
  taskTypeName: string;
  priorityId: string;
  description: any;
  taskSteps: TaskStep[];
  created: string;
  lastModified: string;
  businessRequirementDesc: any;
  athenaNetChangesYn: any;
  lastModifiedBy: string;
  deploymentDate: string;
  version: string;
  testClaimExample: any;
  testNote: any;
  modelBranchUrl: string;
  dtBranchUrl: string;
  taskDecisionTableDetails: TaskDTDetails[];
  taskDependencies: TaskDependencyDetails[];
  originatingSystemName: string;
  escalatedYn: string;
  associatedBRTasks: TaskInfo[];
  canSignOff?: any;
  ruleEngineId: any;
  ruleTypeId: any;
  visitRuleDisplayLocationId: any;
  internalFixText1: string;
  internalFixText2: string;
  rules2TransformationStatusId: number;
  departmentOriginId: number;
  departmentOriginName: string;
  brUpdateReasons: any[];
  brUpdateReasonIds: any[];
  claimRuleCategoryId: string | null;
  scrubTypeId: string;
  claimRuleCategoryRefId: string;
  claimRuleCategory: string;
  rtSynchronizationLog: any;
  priorityReasonId: any;
  priorityReason: string;
  priorityReasonNote: any;
  rejectionReason: string;
  rejectionDescription: string;
}

export interface DependencyDetails {
  dependencyId: string;
  dependencyName: string;
  dependencySystemId: string;
  deploymentDate: string;
  statusName: string;
  activeWorkflowStepId?: string;
}

export interface TaskDependencyDetails {
  dependencyDate: string;
  dependencyId: string;
  dependencyName: string;
  dependencySystemId: string;
  dependencySystemName: string;
  deploymentDate: string;
  id: string;
  notes: string;
  ordering: string;
  statusName: string;
  taskId: string;
  dependencyCondition: string;
  version: string;
  dependencySystemId: string;
  completedYn: string;
  description: string;
  deleted?: string;
}
export interface TaskInfo {
  id: string;
  name: string;
  activeTaskStepId: string;
  activeTaskStepName: string;
}
export interface TaskType {
  id: string;
  name: string;
  description: string;
}

export interface ReportType {
  id: string;
  name: string;
  description: string;
}

export interface Task {
  activeTaskStepId: string;
  assignedTo: string | null;
  businessRequirementId: string;
  dueOn: string;
  lastModified: string;
  legacyRuleId: string;
  priorityName: string;
  statusName: string;
  taskId: string;
  taskName: string;
  taskTypeId: string;
  taskTypeName: string;
  workflowStepName: string;
  escalatedYn: string;
}

export interface UpdateTaskProps {
  task: TaskDetail;
  taskUpdateAction?: fn;
  toggleEdit?: fn;
  editBtnClick?: any;
  editBtnValue?: any;
  getEditBtnValue?: any;
  leftSectionActive?: any;
  rightSectionActive?: any;
  setLeftFormAction?: fn;
  setRightFormAction?: fn;
}

export type ToastAlertTypes = 'attention' | 'info' | 'success';

export interface ToastMessage {
  id?: string;
  headerText: string | fn;
  alertType?: ToastAlertTypes;
  message: string | fn;
  params?: Record<string, unknown>;
}

export interface ReportCriteria {
  reportTypeId: string;
  dateType: string;
  startDate: date;
  endDate: date;
}

export interface UserComment {
  id: string;
  taskId: string;
  content: any;
  created: string;
  createdBy: string;
  createdTimestamp: string;
}

export interface TaskDiscusisonProps {
  task: TaskDetail;
  fetchUserCommentDetails?: fn;
  taskId: any;
  commentId: any;
  resetCommentId: any;
}

export interface DiscussionFormProps {
  taskdetails: TaskDetail;
  createUserComment: fn;
  comments: UserComment[];
  resetPopupActions?: any;
  resetCommentId: any;
}

export interface UserCommentFormProps {
  formik: FormikProps<any>;
}

export type BusinessRequirementType = BaseType;

export interface RuleReportingCategory extends BaseType {
  refId: string;
}

export interface Context extends BaseType {
  refId: string;
}

export type LocalRuleUseCase = BaseType;

export interface AttachmentDetail {
  id: string;
  taskId: string;
  taskStepId: any;
  description: string;
  attachmentTypeId: string;
  attachmentName: string;
  createdBy: string;
  fileName: string;
  filePath: string;
  version: string;
}

export interface TaskDocumentProps {
  task: TaskDetail;
  fetchAttachmentDetails?: fn;
}

export interface AttachmentType {
  id: string;
  name: string;
  version: string;
}
export type WorkFlowFilterType = BaseType;

export interface StatusFilterType {
  workFlowStepQueueIds: string;
  name: string;
  id: string;
}
export interface TimeEntry {
  id: string;
  taskId: string;
  taskStepId: any;
  spentOn: string;
  spentTimeInMins: string;
  workflowStepName: string;
  workflowStepId: string;
  createdBy: string;
  created: string;
  version: string;
  totalSpentTimeInMins: string;
}
export interface WorkLogProps {
  task: TaskDetail;
  fetchTimeEntryLogs?: fn;
}

export interface AuditEntry {
  fieldName?: string;
  oldValue?: Record<string, string | null> | string | null;
  newValue?: Record<string, string | null> | string | null;
}

export interface AuditEvent {
  eventType: string;
  objectType: string;
  eventName: string;
  created: string;
  createdBy: string;
  changes: AuditEntry[];
}

export interface Shape {
  text: string;
  value: string;
}

export interface Deployment {
  branchName: string;
  created: string;
  createdBy: string;
  dcUrl: string;
  decisionServiceName: string;
  deploymentConfigName: string;
  description: string | null;
  id: any;
  name: string;
  releaseVersion: string | null;
  status: string;
  statusId: string;
  verifiedYn: string | null;
  version: any;
  archiveFileName: string;
  archiveFilePath: string;
  envNames?: string;
  taskIds?: string;
}

export interface DeploymentLog {
  action: string;
  category: string | null;
  id: string;
  message: string;
  name: string;
  ordering: string;
  request: string;
  response: string;
  statusId: string;
  version: string;
}

export interface DeploymentEnv {
  id: string;
  initialVersion: string;
  name: string;
  resUrl: string;
  resultVersion: string;
  statusId: string;
  version: string;
}

export interface DeploymentTask {
  businessRequirementId: string;
  businessRequirementName: string;
  id: string;
  legacyRuleId: string;
  name: string;
  taskTypeId: string;
  taskTypeName: string;
}

export interface DeploymentDetails extends Deployment {
  logs: DeploymentLog[];
  tasks: DeploymentTask[];
  envs: DeploymentEnv[];
}

export interface DepartmentOrigin {
  id: string;
  name: string;
  description: string;
}

export interface BRUpdateReason {
  id: string;
  name: string;
  description: string;
}

export interface DeploymentStatus {
  ordering: string;
  name: string;
  id: string;
}

export interface PriorityPolicy {
  description1: string;
  description2: string;
  externalDueDate: string;
  externalTatInDays: string;
  id: string;
  internalDueDate: string;
  internalTatInDays: string;
  name: string;
}

export interface RejectionReason {
  id: string;
  name: string;
  version: string;
  ordering: string;
}
export interface RulesMigrationDetail {
  id: string;
  ruleId: string;
  contextId: string;
  businessRequirementId: string;
  migrationStatus: string;
  comment: string;
}

export interface BRDetails {
  legacyRuleId: string;
  rules2TransformationStatusId: string;
  rules2TransformationStatus: string;
  name: string;
  ruleReportingCategoryId: string;
  ruleReportingCategoryName: string;
  description: string;
  internalFixText2: string;
  ruleTypeId: string;
  ruleType: string;
  internalFixText1: string;
  localRuleUseCaseId: string;
  localRuleUseCaseName: string;
  contextId: string;
  contextName: string;
  id: string;
  visitRuleDisplayLocationId: string;
  visitRuleDisplayLocation: string;
  businessRequirementTypeId: string;
  businessRequirementType: string;
  associatedBRTasks: any[];
}
