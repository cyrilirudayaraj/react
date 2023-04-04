import {
  getPriorities,
  getUsers,
  getTaskTypes,
  getOriginatingSystems,
  searchBusinessRequirements,
  createTask,
  getTaskDetails,
  getTaskList,
  updateTask,
  createUserCommentDetail,
  getBusinessRequirementTypes,
  getRuleReportingCategories,
  getContextList,
  getLocalRuleUseCaseList,
  rejectTask,
  transitTask,
  returnTask,
  getUserComments,
  getReportTypes,
  downloadReport,
  getStatus,
  getDepartmentOrigins,
  getRuleEngines,
  getRuleTypes,
  getVisitRuleDisplayLocations,
  getAttachmentTypes,
  getDependencySystems,
  getClaimRuleCategoryList,
  getScrubTypes,
  getPriorityReasons,
} from './CommonService';

jest.mock('./CallApi');
jest.mock('./CallApiDownload');

describe('common service testing', () => {
  it('test getPriorities', () => {
    getPriorities();
  });
  it('test getUsers', () => {
    getUsers();
  });
  it('test getTaskTypes', () => {
    getTaskTypes();
  });
  it('test getOriginatingSystems', () => {
    getOriginatingSystems();
  });
  it('test searchBusinessRequirements', () => {
    searchBusinessRequirements({});
  });
  it('test createTask', () => {
    createTask({});
  });
  it('test getTaskDetails', () => {
    getTaskDetails('');
  });
  it('test getTaskList', () => {
    getTaskList({});
  });
  it('test rejectTask', () => {
    rejectTask({});
  });
  it('test updateTask', () => {
    updateTask({});
  });
  it('test transitTask', () => {
    transitTask({});
  });
  it('test returnTask', () => {
    returnTask({});
  });
  it('test getUserComments', () => {
    getUserComments('');
  });
  it('test createUserCommentDetail', () => {
    createUserCommentDetail({});
  });
  it('test getBusinessRequirementTypes', () => {
    getBusinessRequirementTypes();
  });
  it('test getRuleReportingCategories', () => {
    getRuleReportingCategories();
  });
  it('test getContextList', () => {
    getContextList();
  });
  it('test getLocalRuleUseCaseList', () => {
    getLocalRuleUseCaseList();
  });
  it('test downloadReport', () => {
    downloadReport({});
  });
  it('test getReportTypes', () => {
    getReportTypes();
  });
  it('test getStatus', () => {
    getStatus();
  });
  it('test getDepartmentOrigins', () => {
    getDepartmentOrigins();
  });
  it('test getRuleEngines', () => {
    getRuleEngines();
  });
  it('test getRuleTypes', () => {
    getRuleTypes();
  });
  it('test getVisitRuleDisplayLocations', () => {
    getVisitRuleDisplayLocations();
  });
  it('test getAttachmentTypes', () => {
    getAttachmentTypes();
  });
  it('test getDependencySystems', () => {
    getDependencySystems();
  });

  it('test getPriorityReasons', () => {
    getPriorityReasons();
  });

  it('test getScrubTypes', () => {
    getScrubTypes();
  });

  it('test getClaimRuleCategoryList', () => {
    getClaimRuleCategoryList({ claimRuleCategoryPrefix: '1' });
  });
});
