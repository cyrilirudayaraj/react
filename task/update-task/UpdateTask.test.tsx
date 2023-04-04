import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockData } from '../../../services/__mocks__/MockData';
import { TaskDetail, TaskStep } from '../../../types';
import UpdateTask, {
  getActiveTaskStepVersion,
  getAssignedTo,
} from './UpdateTask';

jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

configure({ adapter: new Adapter() });

let wrapper: any;
let taskDetails: TaskDetail;
let store: any;
beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '1';
  const taskStep: TaskStep = {} as TaskStep;
  taskDetails.taskSteps = [] as TaskStep[];
  taskDetails.taskSteps[0] = taskStep;
  taskDetails.taskSteps[0].id = '1';
  taskDetails.taskSteps[0].assignedTo = 'Prem';
  taskDetails.taskSteps[0].version = '100';
  const usersInfo: any = [];
  usersInfo[0] = {
    firstName: 'Cyril',
    lastName: 'Irudayaraj',
    userName: 'jcyril',
  };
  const userComments: any = [];
  userComments[0] = {
    id: '1',
    taskId: '1',
    taskStepId: '16',
    content: 'Test cyril ontent 1',
    created: '08/15/2020',
    createdBy: 'jcyril',
    createdTimestamp: '08/15/2020 03:22:13',
  };
  userComments[1] = {
    id: '3',
    taskId: '1',
    taskStepId: '16',
    content: 'Test cyril content 2',
    created: '',
    createdBy: 'jcyril',
    createdTimestamp: '',
  };
  userComments[2] = {
    id: '4',
    taskId: '1',
    taskStepId: '16',
    content: 'Test cyril content 3',
    created: '',
    createdBy: 'jcyril',
    createdTimestamp: '',
  };
  store = configureStore([])({
    task: {
      taskDetails: taskDetails,
    },
    userPermission: {
      userPermissions: ['task.update'],
    },
    validation: {
      formInvalid: {
        isWorkLogFormValid: true,
      },
    },
    userComment: {
      userCommentDetails: userComments,
    },
    masterData: {
      businessRequirementTypes: MockData.BUSINESSREQUIREMENTTYPES,
      ruleReportingCategories: MockData.RULEREPORTINGCATEGORIES,
      localRuleUseCaseList: MockData.LOCALRULEUSECASES,
      ruleTypes: MockData.RULETYPES,
      visitRuleDisplayLocations: MockData.VISITRULEDISPLAYLOCATIONS,
      users: MockData.USERS,
      originatingSystems: MockData.ORGINATINGSYSTEMS,
      usersInfo: MockData.USERS,
    },
    fetchTaskDetails: jest.fn(),
  });
  store.dispatch = jest.fn();
});

describe('UpdateTask', () => {
  it('basic snapshot', () => {
    const match = {
      params: {
        id: 1,
      },
    };
    wrapper = mount(
      <Provider store={store}>
        <UpdateTask match={match} />
      </Provider>
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('getAssignedTo', () => {
    expect(getAssignedTo(taskDetails)).toBe(
      taskDetails.taskSteps[0].assignedTo
    );
    taskDetails.taskSteps[0].assignedTo = null;
    expect(getAssignedTo(taskDetails)).toBe('');
  });
  it('getActiveTaskStepVersion', () => {
    expect(getActiveTaskStepVersion(taskDetails)).toBe(
      taskDetails.taskSteps[0].version
    );
    taskDetails.taskSteps = [];
    expect(getActiveTaskStepVersion(taskDetails)).toBe('');
  });
});
