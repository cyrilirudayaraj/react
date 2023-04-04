import { cloneDeep } from 'lodash';
import { AuditEvent, TaskDetail } from '../../types';
import { MockData } from './MockData';
import { TaskDetailsMockData1 } from './TaskDetailsMockData';
import { TaskHistoryMockData } from './TaskHistoryMockData';
import { DeploymentData1 } from './DeploymentMockData';
import AppConstants from '../../constants/AppConstants';
import { BRDetailsMockData1 } from './BRDetailsMockData';

export async function getPriorities() {
  return await new Promise((resolve) => {
    resolve(MockData.PRIORITIES);
  });
}

export async function getPrioritiesWithSla() {
  return await new Promise((resolve) => {
    resolve(MockData.PRIORITIES);
  });
}

export async function getOriginatingSystems() {
  return await new Promise((resolve) => {
    resolve(MockData.ORGINATINGSYSTEMS);
  });
}

export async function getTaskTypes() {
  return await new Promise((resolve) => {
    resolve(MockData.TASKTYPES);
  });
}

export async function getUsers() {
  return await new Promise((resolve) => {
    resolve(MockData.USERS);
  });
}

export async function searchBusinessRequirements(legacyRulePrefix = '') {
  return await new Promise((resolve) => {
    resolve(MockData.BUSINESSREQUIREMENTS);
  });
}

export async function brLookup(businessRequirementId = '') {
  const task = {
    taskId: 19,
  };

  return await new Promise((resolve) => {
    resolve(task);
  });
}

export async function createTask(payload: any) {
  return await new Promise((resolve, reject) => {
    if (payload['PRIORITYID'] == 1) {
      resolve({ id: '000001' });
    } else {
      reject({ message: 'Request failed' });
    }
  });
}

export async function getTaskList(payload: any) {
  const taskList = [
    {
      activeTaskStepId: '117',
      assignedTo: 'aanandkumar',
      businessRequirementId: '5',
      dueOn: '07/02/2020',
      lastModified: '07/02/2020',
      legacyRuleId: '121212',
      priorityName: 'P1',
      statusName: 'Assigned',
      taskId: '28',
      taskName:
        'Update Global Business Requirement 123456:12 Exclude XHC Claim Task1',
      taskTypeId: '3',
      taskTypeName: 'Dual Update',
      workflowStepName: 'Analyze Task',
    },
  ];

  if (payload && payload.searchText && payload.searchText === 'Update') {
    return await new Promise((resolve) => {
      resolve({
        limit: 10,
        offset: 0,
        result: taskList,
        total: 25,
      });
    });
  }
  if (payload && payload.statusIds && payload.statusIds[0] === '10') {
    return await new Promise((resolve) => {
      resolve({
        limit: 10,
        offset: 0,
        result: taskList,
        total: 25,
      });
    });
  }
  return await new Promise((resolve) => {
    resolve({
      limit: 10,
      offset: 0,
      result: [],
      total: 0,
    });
  });
}

export function getTaskCountByQueue() {
  return new Promise((resolve) => {
    resolve(MockData.QUEUETASKCOUNT);
  });
}

export async function getTaskDetails(id: string) {
  return await new Promise((resolve) => {
    resolve(TaskDetailsMockData1);
  });
}

export function updateTask(payload: any): Promise<TaskDetail> {
  return new Promise((resolve) => {
    resolve(TaskDetailsMockData1);
  });
}

export function getBusinessRequirementTypes() {
  return new Promise((resolve) => {
    resolve(MockData.BUSINESSREQUIREMENTTYPES);
  });
}

export function getRuleReportingCategories() {
  return new Promise((resolve) => {
    resolve(MockData.RULEREPORTINGCATEGORIES);
  });
}

export function getUserPermissions() {
  return new Promise((resolve) => {
    resolve(MockData.USERPERMISSIONS);
  });
}

export function getContextList(context = '') {
  return new Promise((resolve) => {
    resolve(MockData.CONTEXTS);
  });
}

export function getLocalRuleUseCaseList() {
  return new Promise((resolve) => {
    resolve(MockData.LOCALRULEUSECASES);
  });
}

export function getDepartmentOrigins() {
  return new Promise((resolve) => {
    resolve(MockData.DEPARTMENTORIGINS);
  });
}

export async function getRuleEngines() {
  return new Promise((resolve) => {
    resolve(MockData.RULEENGINES);
  });
}

export function getRuleTypes() {
  return new Promise((resolve) => {
    resolve(MockData.RULETYPES);
  });
}

export function getVisitRuleDisplayLocations() {
  return new Promise((resolve) => {
    resolve(MockData.VISITRULEDISPLAYLOCATIONS);
  });
}

export async function getDependencySystems() {
  return new Promise((resolve) => {
    resolve(MockData.DEPENDENCYSYSTEMS);
  });
}

export async function getAttachmentTypes() {
  return await new Promise((resolve) => {
    resolve(MockData.ATTACHMENTTYPES);
  });
}

export async function getReportTypes() {
  return await new Promise((resolve) => {
    resolve(MockData.REPORTTYPES);
  });
}

export async function downloadReport(payload: any) {
  return await new Promise((resolve, reject) => {
    if (payload['REPORTTYPEID'] == 1) {
      resolve({ id: '000001' });
    } else {
      reject({ message: 'Request failed' });
    }
  });
}

export function getWorkFlowSteps() {
  return new Promise((resolve) => {
    resolve(MockData.WORKFLOWSTEPS);
  });
}

export function getStatus() {
  return new Promise((resolve) => {
    resolve(MockData.STATUSES);
  });
}

export function getAttachmentDetails(taskId: string) {
  return new Promise((resolve) => {
    resolve(MockData.ATTACHMENTS);
  });
}

export function createAttachment(payload: any) {
  return new Promise((resolve) => {
    resolve(MockData.ATTACHMENTS);
  });
}

export function updateAttachmentDetails(payload: any) {
  return new Promise((resolve) => {
    resolve(MockData.ATTACHMENTS);
  });
}

export function deleteAttachmentDetails(payload: any) {
  return new Promise((resolve) => {
    resolve(MockData.ATTACHMENTS);
  });
}

export function getTimeEntryLogs(taskId: string) {
  return new Promise((resolve) => {
    resolve(MockData.TIMEENTRYLOGS);
  });
}

export function createTimeEntry(payload: any) {
  return new Promise((resolve) => {
    resolve(MockData.TIMEENTRYLOGS);
  });
}
export function updateTimeEntry(payload: any) {
  return new Promise((resolve) => {
    resolve(MockData.TIMEENTRYLOGS);
  });
}
export function deleteTimeEntry(payload: any) {
  return new Promise((resolve) => {
    resolve([]);
  });
}

export function getUserComments(taskId: string) {
  return new Promise((resolve) => {
    resolve(MockData.USERCOMMENTS);
  });
}

export function createUserCommentDetail(payload: any) {
  return new Promise((resolve) => {
    resolve(MockData.USERCOMMENTS);
  });
}

export function getTaskHistory(taskId: string): Promise<AuditEvent[]> {
  return new Promise((resolve) => {
    resolve(TaskHistoryMockData);
  });
}

export function fetchDependencyDetailsListByIds(payload: any) {
  return new Promise((resolve) => {
    const [firstDependency] = payload;

    let mockDependencies = MockData.DEPENDENCIES;
    if (firstDependency && firstDependency.dependencyId == '1') {
      mockDependencies = cloneDeep(mockDependencies);
      mockDependencies[0].activeWorkflowStepId = '7';
    }
    if (payload) resolve(mockDependencies);
  });
}

export function getSalesforceCaseDetails(caseId: string): Promise<any> {
  return new Promise((resolve) => {
    resolve({
      subject: 'claim',
      practiceId: '951',
      id: '5006f00001cJJsGAAW',
      salesforceId: '11309869',
    });
  });
}

export function getDeployments(payload: any): Promise<any> {
  if (payload.LIMIT == 1) {
    return new Promise((resolve) => {
      resolve([
        {
          id: '1',
          status: 'SUCCESS',
          releaseVersion: '2.0.1',
          createdBy: 'jcyril',
        },
      ]);
    });
  } else {
    return new Promise((resolve) => {
      resolve(DeploymentData1);
    });
  }
}

export function deploy(payload: any) {
  return new Promise((resolve) => {
    resolve(DeploymentData1);
  });
}

export function completeDeployment(payload: any) {
  return new Promise((resolve) => {
    const response = cloneDeep(DeploymentData1);
    response.statusId =
      AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES.COMPLETE;
    response.status = 'COMPLETE';
    resolve(response);
  });
}

export function rejectDeployment(payload: any): Promise<any> {
  return new Promise((resolve) => {
    const response = cloneDeep(DeploymentData1);
    response.statusId =
      AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES.REJECTED;
    response.status = 'REJECTED';
    resolve(response);
  });
}
export function getDeploymentStatuses(payload: any): Promise<any> {
  return new Promise((resolve) => {
    resolve(MockData.DEPLOYMENTSTATUSES);
  });
}

export async function getScrubTypes() {
  return await new Promise((resolve) => {
    resolve(MockData.SCRUBTYPELIST);
  });
}

export async function getPriorityReasons() {
  return await new Promise((resolve) => {
    resolve(MockData.PRIORITYREASONLIST);
  });
}

export async function getClaimRuleCategoryList() {
  return await new Promise((resolve) => {
    resolve(MockData.CLAIMRULECATEGORYLIST);
  });
}
export async function searchMigrationRules(payload: any) {
  if (payload && payload.searchText && payload.searchText === '58') {
    return await new Promise((resolve) => {
      resolve(MockData.MIGRATIONRULESLIST);
    });
  } else {
    return await new Promise((resolve) => {
      resolve({
        limit: 10,
        offset: 0,
        result: [],
        total: 0,
      });
    });
  }
}
export async function getRationalizationRules(payload: any) {
  return await new Promise((resolve) => {
    resolve(MockData.RATIONALIZATIONRULES);
  });
}

export async function getBusinessRequirementDetails(id: string) {
  return await new Promise((resolve) => {
    resolve(BRDetailsMockData1);
  });
}
