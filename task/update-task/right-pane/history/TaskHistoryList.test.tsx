import { Accordion, Card } from '@athena/forge';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail } from '../../../../../types/index';
import TaskHistoryList from './TaskHistoryList';
configure({ adapter: new Adapter() });

jest.mock('../../../../../services/CommonService');

let wrapper: any;
let taskDetails: any;
let store: any;
const eventdetails: any = [];

beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails = {
    activeTaskStepId: '1047',
    activeTaskStepName: 'Review Task',
    activeWorkflowStepId: '2',
    assignedTo: 'bvenkatesan',
    athenaNetChangesYn: 'N',
    businessRequirementDesc: '<p>test</p>',
    businessRequirementId: '338',
    businessRequirementName:
      'Force Drop Specified Policy/Group Numbers for ECTE',
    businessRequirementTypeId: '1',
    canSignOff: '1',
    created: '02/28/2021',
    createdBy: 'jcyril',
    description: '<p>test</p>',
    dtChangesYn: 'N',
    dueDate: '03/02/2021',
    id: '150',
    lastModified: '02/28/2021',
    lastModifiedBy: 'jcyril',
    legacyRuleId: '1.2129',
    legacyTaskId: '12',
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
    taskTypeId: '3',
    taskTypeName: 'Dual Update',
    testClaimExample: 'test',
    version: '10',
  };

  eventdetails[0] = {
    changes: [
      {
        loggedOn: '03/13/2021',
        timeSpent: '230',
        workflowStep: 'Review Task',
        oldValue: true,
      },
    ],
    created: '11/23/2020 03:15:16',
    createdBy: 'aanandkumar',
    eventName: 'T-1612 was created',
    eventType: 'Created',
    objectType: 'TASK',
  };
  eventdetails[1] = {
    changes: [
      {
        newValue: {
          loggedOn: '03/14/2021',
          timeSpent: '50',
          workflowStep: 'Review Task',
          newValue: true,
        },
      },
    ],
    created: '11/23/2020 03:15:16',
    createdBy: 'aanandkumar',
    eventName: 'Set to Analyze task step',
    eventType: 'Updated',
    objectType: 'TASK',
  };
  eventdetails[2] = {
    changes: [
      {
        fieldName: 'timespent',
      },
    ],
    created: '11/23/2020 03:15:16',
    createdBy: 'aanandkumar',
    eventName: 'Set to Analyze task step',
    eventType: 'Updated',
    objectType: 'TASK',
  };
  store = configureStore([])({
    task: {
      taskDetails: taskDetails,
    },
    taskHistory: {
      events: eventdetails,
    },
  });
  store.dispatch = jest.fn();

  wrapper = mount(
    <Provider store={store}>
      <TaskHistoryList taskdetails={taskDetails} />
    </Provider>
  );
});

describe('Task History List', () => {
  it('Should render Task history List properly', () => {
    expect(wrapper.find(Card).length).toBeGreaterThanOrEqual(0);
  });

  it('it should have Accordion', () => {
    expect(wrapper.find(Accordion)).toHaveLength(3);
  });
});
