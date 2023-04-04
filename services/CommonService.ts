import CallApi from './CallApi';
import {
  TaskDetail,
  TaskType,
  UserComment,
  BusinessRequirementType,
  RuleReportingCategory,
  Context,
  LocalRuleUseCase,
  AttachmentDetail,
  AttachmentType,
  WorkFlowFilterType,
  StatusFilterType,
  ReportType,
  TimeEntry,
  AuditEvent,
  DependencyDetails,
  DepartmentOrigin,
  Deployment,
  BRUpdateReason,
  BRDetails,
} from '../types';
import { CallApiDownload } from './CallApiDownload';
import AppConstants from '../constants/AppConstants';

export async function getConfigs() {
  const response = await CallApi('/v1/config/get', {});
  // eslint-disable-next-line no-console
  console.warn('config info', response);
  return response;
}

export async function getPriorities() {
  return await CallApi('/v1/priority/get');
}

export async function getPrioritiesWithSla() {
  return await CallApi('/v1/priority/getprioritywithsla');
}

export async function getUsers() {
  return await CallApi('/v1/user/get');
}

export async function getTaskTypes(): Promise<TaskType[]> {
  return await CallApi('/v1/tasktype/get');
}

export async function getOriginatingSystems() {
  return await CallApi('/v1/originatingsystem/get');
}

export async function searchBusinessRequirements(payload: any) {
  return await CallApi('/v1/businessrequirement/search', payload);
}

export async function brLookup(payload: any) {
  return await CallApi('/v1/task/brlookup', payload);
}

export async function createTask(payload: any) {
  return await CallApi('/v1/task/create', payload);
}

export async function rejectTask(payload: any) {
  return await CallApi('/v1/task/reject', payload);
}

export async function escalateTask(payload: any) {
  return await CallApi('/v1/task/escalate', payload);
}

export async function getTaskDetails(id: string): Promise<TaskDetail> {
  return await CallApi('/v1/task/get', { ID: id });
}

export function getTaskList(payload: any) {
  return CallApi('/v1/task/search', payload);
}

export function getTaskCountByQueue() {
  return CallApi('/v1/task/count');
}

export function updateTask(payload: any): Promise<TaskDetail> {
  return CallApi('/v1/task/update', payload);
}

export function transitTask(payload: any): Promise<TaskDetail> {
  return CallApi('/v1/task/transit', payload);
}

export function returnTask(payload: any): Promise<TaskDetail> {
  return CallApi('/v1/task/return', payload);
}

export function getUserComments(id: string): Promise<UserComment> {
  return CallApi('/v1/comment/get', { TASKID: id });
}

export function createUserCommentDetail(payload: any): Promise<UserComment> {
  return CallApi('/v1/comment/create', payload);
}

export async function getWorkFlowSteps(): Promise<WorkFlowFilterType[]> {
  // This empty payload is used to support loader.
  return await CallApi('/v1/workflowstep/get', {});
}

export async function getStatus(): Promise<StatusFilterType[]> {
  return await CallApi('/v1/status/get');
}

export function getBusinessRequirementTypes(): Promise<
  BusinessRequirementType
> {
  return CallApi('/v1/businessrequirementtype/get');
}

export function getRuleReportingCategories(): Promise<RuleReportingCategory> {
  return CallApi('/v1/rulereportingcategory/get');
}

export function getContextList(context = ''): Promise<Context> {
  return CallApi('/v1/context/get', {
    CONTEXTPREFIX: context,
  });
}

export function getLocalRuleUseCaseList(): Promise<LocalRuleUseCase> {
  return CallApi('/v1/localruleusecase/get');
}

export async function getAttachmentDetails(
  taskId: string
): Promise<AttachmentDetail> {
  return await CallApi('/v1/attachment/get', { TASKID: taskId });
}

export function createAttachment(payload: any): Promise<AttachmentDetail> {
  return CallApi('/v1/attachment/create', payload);
}

export function updateAttachmentDetails(
  payload: any
): Promise<AttachmentDetail> {
  return CallApi('/v1/attachment/update', payload);
}

export function deleteAttachmentDetails(
  payload: any
): Promise<AttachmentDetail> {
  return CallApi('/v1/attachment/delete', payload);
}

export function getAttachmentTypes(): Promise<AttachmentType> {
  return CallApi('/v1/attachmenttype/get');
}

export async function getReportTypes(): Promise<ReportType[]> {
  return await CallApi('/v1/reporttype/get');
}

export async function downloadReport(payload: any) {
  return await CallApiDownload('/v1/report/generate', payload);
}

export function createTimeEntry(payload: any): Promise<TimeEntry> {
  return CallApi('/v1/timeentry/create', payload);
}

export function updateTimeEntry(payload: any): Promise<TimeEntry> {
  return CallApi('/v1/timeentry/update', payload);
}

export function deleteTimeEntry(payload: any): Promise<TimeEntry> {
  return CallApi('/v1/timeentry/delete', payload);
}

export async function getTimeEntryLogs(taskId: string): Promise<TimeEntry> {
  return await CallApi('/v1/timeentry/get', { TASKID: taskId });
}

export async function getTaskHistory(taskId: string): Promise<AuditEvent[]> {
  return await CallApi('/v1/task/auditlist', { TASKID: taskId });
}

export async function getDependencySystems() {
  return await CallApi('/v1/dependencysystem/get');
}

export function fetchDependencyDetailsListByIds(
  payload: any
): Promise<DependencyDetails[]> {
  return CallApi('/v1/dependencysystem/task/get', payload);
}

export async function getUserPermissions(): Promise<string[]> {
  return await CallApi('/v1/user/permission/get');
}

export async function getSalesforceCaseDetails(caseId: string) {
  return await CallApi(
    '/v1/salesforce/case/get',
    { CASEID: caseId },
    { showError: false }
  );
}

export async function deploy(payload: any) {
  return await CallApi('/v1/deployment/deploy', payload);
}

export async function completeDeployment(payload: any) {
  return await CallApi('/v1/deployment/complete', payload);
}

export function rejectDeployment(payload: any): Promise<Deployment> {
  return CallApi('/v1/deployment/reject', payload);
}

export function getDeployments(payload: any, config?: any) {
  return CallApi('/v1/deployment/get', payload, config);
}

export async function getRuleTypes() {
  return await CallApi('/v1/ruletype/get');
}

export async function getVisitRuleDisplayLocations() {
  return await CallApi('/v1/visitruledisplaylocation/get');
}

export async function getRuleEngines() {
  return await CallApi('/v1/ruleengine/get');
}

export async function getDepartmentOrigins(): Promise<DepartmentOrigin[]> {
  return await CallApi('/v1/departmentorigin/get');
}

export function getDeploymentStatuses() {
  return CallApi('/v1/deploy/status/get');
}
export async function getBRUpdateReasons(
  payload: any
): Promise<BRUpdateReason[]> {
  return await CallApi('/v1/brupdatereason/get', payload);
}

export async function getRationalizationRules(payload: any = {}) {
  return await CallApi('/v1/rationalizationrules/get', payload);
}

export async function updateRationalizationRules(records: any) {
  return await CallApi('/v1/rationalizationrules/update', { records });
}

export async function getMigrationRules(payload: any = {}) {
  return await CallApi('/v1/migrationrules/get', payload);
}

// Modelling Rules
export async function getModelledRules(payload: any) {
  return await getMigrationRules({
    ...payload,
    migrationType: AppConstants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING,
  });
}

// Backward Compatibility Rules
export async function getBackwardCompatibilityRules(payload: any) {
  return await getMigrationRules({
    ...payload,
    migrationType:
      AppConstants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES
        .BACKWARD_COMPATIBILITY,
  });
}

// Dual Maintenance Rules
export async function getDualMaintenanceRules(payload: any) {
  return await getMigrationRules({
    ...payload,
    migrationType:
      AppConstants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.DUAL_MAINTENANCE,
  });
}

// Archived Rules
export async function getArchivedRules(payload: any) {
  return await getMigrationRules({
    ...payload,
    migrationType: AppConstants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.ARCHIVE,
  });
}

export async function uploadRuleNotMigratedFile(file: any) {
  return await CallApi('/v1/rationalizationrules/import', {}, {}, file);
}

export async function uploadModelingFile(file: any) {
  return await CallApi('/v1/migrationrules/import', {}, {}, file);
}

export async function updateRulesMigrationData(records: any) {
  return await CallApi('/v1/migrationrules/update', { records });
}

export async function addRationalizationRules(records: any) {
  return await CallApi('/v1/rationalizationrules/create', { records });
}

export async function getPriorityReasons() {
  return await CallApi('/v1/priorityreason/get');
}

export async function getScrubTypes() {
  return await CallApi('/v1/scrubtype/get');
}

export async function getClaimRuleCategoryList(payload: any) {
  return await CallApi('/v1/claimrulecategory/get', payload);
}

export async function getRejectionReasons() {
  return await CallApi('/v1/rejectionreason/get');
}

export async function syncRTTask(payload: any) {
  return await CallApi('/v1/task/rttasksync', payload);
}

export async function searchMigrationRules(payload: any) {
  return await CallApi('/v1/migrationrules/search', payload);
}

export async function getBusinessRequirementDetails(
  id: string
): Promise<BRDetails> {
  return await CallApi('/v1/businessrequirement/get', {
    ID: id,
  });
}
