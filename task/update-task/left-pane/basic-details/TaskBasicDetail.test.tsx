import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import TaskBasicDetail from './TaskBasicDetail';

configure({ adapter: new Adapter() });
let wrapper: any;
const formik: any = {
  values: {
    athenaNetChangesYn: false,
    businessRequirementDesc: '<p>test</p>',
    businessRequirementId: '338',
    businessRequirementName:
      'Force Drop Specified Policy/Group Numbers for ECTE',
    businessRequirementTypeId: '1',
    context: '',
    description: '<p>test</p>',
    dtBranchUrl: '',
    dtChangesYn: false,
    id: '150',
    contextId: null,
    localRuleUseCaseId: null,
    modelBranchUrl: '',
    modelDesignChanges: '<p>test</p>',
    name: 'test',
    ruleReportingCategoryId: '13',
    taskDecisionTableDetails: [],
    taskDependencies: [],
    testClaimExample: 'test',
    testNote: '',
    version: '10',
  },
  touched: {},
  errors: {},
  getFieldProps: jest.fn(() => {
    return { value: 'test' };
  }),
};
const mandatoryFields: any = {
  description: true,
  modelDesignChanges: true,
  name: true,
  testClaimExample: true,
};

const task: any = {
  activeTaskStepId: '1047',
  activeTaskStepName: 'Review Task',
  activeWorkflowStepId: '2',
  assignedTo: 'bvenkatesan',
  associatedBRTasks: [],
  athenaNetChangesYn: 'N',
  businessRequirementDesc: '<p>test</p>',
  businessRequirementId: '338',
  businessRequirementName: 'Force Drop Specified Policy/Group Numbers for ECTE',
  businessRequirementTypeId: '1',
  canSignOff: '1',
  clientDueDate: null,
  created: '02/28/2021',
  createdBy: 'jcyril',
  deploymentDate: null,
  description: '<p>test</p>',
  dtBranchUrl: null,
  dtChangesYn: 'N',
  dueDate: '03/02/2021',
  escalatedYn: null,
  id: '150',
  jiraId: null,
  lastModified: '02/28/2021',
  lastModifiedBy: 'jcyril',
  legacyRuleArchived: null,
  legacyRuleId: '1.2129',
  legacyTaskId: '12',
  contextId: null,
  contextName: null,
  contextRefId: null,
  localRuleUseCaseId: null,
  modelBranchUrl: null,
  modelDesignChanges: '<p>test</p>',
  name: 'test',
  originatingCaseId: '12',
  originatingSystemId: '1',
  originatingSystemName: 'Salesforce',
  priorityId: '1',
  priorityName: '0',
  ruleReportingCategoryId: '13',
  ruleReportingCategoryName: 'Validation: Patient Insurance Issues',
  status: 'Assigned',
  statusId: '3',
  taskDecisionTableDetails: [],
  taskDependencies: [],
  taskSteps: [
    {
      actualCompletion: '02/28/2021',
      actualStart: '02/28/2021',
      assignedTo: 'jcyril',
      id: '1046',
      initialCompletion: '02/28/2021',
      initialStart: '02/28/2021',
      name: 'Analyze Task',
      ordering: '1',
      plannedCompletion: null,
      plannedStart: null,
      signOffStatement: 'My analysis is complete',
      signedOffYn: 'Y',
      totalWorkLog: '45',
      transitionText: 'Send for Analysis',
      version: '9',
      workflowStepId: '1',
    },
  ],
  taskTypeId: '3',
  taskTypeName: 'Dual Update',
  testClaimExample: 'test',
  testNote: null,
  version: '10',
};

beforeEach(() => {
  wrapper = shallow(
    <TaskBasicDetail
      formik={formik}
      task={task}
      mandatoryFields={mandatoryFields}
    />
  );
});
describe('TaskBasicDetail', () => {
  it('basic snapshot', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
