import {
  fetchUsersOnce,
  fetchPrioritiesOnce,
  fetchPrioritiesWithSla,
  fetchWorkflowStepsOnce,
  fetchStatusListOnce,
  fetchTaskTypesOnce,
  fetchOriginatingSytemsOnce,
  fetchBusinessRequirementTypesOnce,
  fetchRuleReportingCategoriesOnce,
  fetchLocalRuleUseCaseListOnce,
  fetchDepartmentOriginsOnce,
  fetchRuleEnginesOnce,
  fetchRuleTypesOnce,
  fetchVisitRuleDisplayLocationsOnce,
  fetchAttachmentTypesOnce,
  fetchDependencySystemsOnce,
  fetchReportTypesOnce,
  fetchScrubTypesOnce,
} from './MasterDataSlice';
import store from '../store/store';
import { MockData } from '../services/__mocks__/MockData';
import { sleep } from '../utils/TestUtils';

jest.mock('../services/CommonService');

describe('master data slice testing', () => {
  const state = jest.fn();
  state.mockReturnValue({
    masterData: {
      users: [],
      priorities: [],
      prioritiesWithSla: [],
      workflowSteps: [],
      statusList: [],
      taskTypes: [],
      originatingSystems: [],
      businessRequirementTypes: [],
      ruleReportingCategories: [],
      localRuleUseCaseList: [],
      departmentOrigins: [],
      ruleEngines: [],
      ruleTypes: [],
      visitRuleDisplayLocations: [],
      attachmentTypes: [],
      dependencySystems: [],
      reportTypes: [],
    },
  });
  it('test fetchUsersOnce', async () => {
    fetchUsersOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.users).toEqual(MockData.USERS);
  });
  it('test fetchPrioritiesOnce', async () => {
    fetchPrioritiesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.priorities).toEqual(MockData.PRIORITIES);
  });
  it('test fetchPrioritiesWithSla', async () => {
    fetchPrioritiesWithSla()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.prioritiesWithSla).toEqual(
      MockData.PRIORITIES
    );
  });
  it('test fetchWorkflowStepsOnce', async () => {
    fetchWorkflowStepsOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.workflowSteps).toEqual(
      MockData.WORKFLOWSTEPS
    );
  });
  it('test fetchStatusListOnce', async () => {
    fetchStatusListOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.statusList).toEqual(MockData.STATUSES);
  });
  it('test fetchTaskTypesOnce', async () => {
    fetchTaskTypesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.taskTypes).toEqual(MockData.TASKTYPES);
  });
  it('test fetchOriginatingSytemsOnce', async () => {
    fetchOriginatingSytemsOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.originatingSystems).toEqual(
      MockData.ORGINATINGSYSTEMS
    );
  });
  it('test fetchBusinessRequirementTypesOnce', async () => {
    fetchBusinessRequirementTypesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.businessRequirementTypes).toEqual(
      MockData.BUSINESSREQUIREMENTTYPES
    );
  });
  it('test fetchRuleReportingCategoriesOnce', async () => {
    fetchRuleReportingCategoriesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.ruleReportingCategories).toEqual(
      MockData.RULEREPORTINGCATEGORIES
    );
  });
  it('test fetchLocalRuleUseCaseListOnce', async () => {
    fetchLocalRuleUseCaseListOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.localRuleUseCaseList).toEqual(
      MockData.LOCALRULEUSECASES
    );
  });
  it('test fetchDepartmentOriginsOnce', async () => {
    fetchDepartmentOriginsOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.departmentOrigins).toEqual(
      MockData.DEPARTMENTORIGINS
    );
  });
  it('test fetchRuleEnginesOnce', async () => {
    fetchRuleEnginesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.ruleEngines).toEqual(
      MockData.RULEENGINES
    );
  });
  it('test fetchRuleTypesOnce', async () => {
    fetchRuleTypesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.ruleTypes).toEqual(MockData.RULETYPES);
  });
  it('test fetchVisitRuleDisplayLocationsOnce', async () => {
    fetchVisitRuleDisplayLocationsOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.visitRuleDisplayLocations).toEqual(
      MockData.VISITRULEDISPLAYLOCATIONS
    );
  });
  it('test fetchAttachmentTypesOnce', async () => {
    fetchAttachmentTypesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.attachmentTypes).toEqual(
      MockData.ATTACHMENTTYPES
    );
  });
  it('test fetchDependencySystemsOnce', async () => {
    fetchDependencySystemsOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.dependencySystems).toEqual(
      MockData.DEPENDENCYSYSTEMS
    );
  });
  it('test fetchReportTypesOnce', async () => {
    fetchReportTypesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.reportTypes).toEqual(
      MockData.REPORTTYPES
    );
  });
  it('test fetchScrubTypesOnce', async () => {
    fetchScrubTypesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().masterData.scrubTypes).toEqual(
      MockData.SCRUBTYPELIST
    );
  });
});
