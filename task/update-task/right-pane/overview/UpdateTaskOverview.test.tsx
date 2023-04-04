import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';
import UpdateTaskOverview from './UpdateTaskOverview';
import { TaskDetail, TaskStep } from '../../../../../types';
import {
  findById,
  changeValueById,
  sleep,
  findByName,
} from '../../../../../utils/TestUtils';
import { MockData } from '../../../../../services/__mocks__/MockData';
import AppConstants from '../../../../../constants/AppConstants';

configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');

let wrapper: any;
let store: any;
let taskDetails: TaskDetail;

beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '1';
  const taskStep: TaskStep = {} as TaskStep;
  taskDetails.taskSteps = [] as TaskStep[];
  taskDetails.taskSteps[0] = taskStep;
  taskDetails.taskSteps[0].id = '1';
  taskDetails.taskSteps[0].assignedTo = 'Prem';
  taskDetails.taskSteps[0].version = '100';

  store = configureStore([])({
    task: {
      taskDetails: taskDetails,
    },
    userPermission: {
      userPermissions: ['task.update'],
    },
    masterData: {
      users: MockData.USERS,
      originatingSystems: MockData.ORGINATINGSYSTEMS,
      brUpdateReasons: MockData.BRUPDATEREASONS,
    },
    updateTaskDetails: jest.fn(),
  });
  store.dispatch = jest.fn();
});

describe('UpdateTaskOverview', () => {
  it('basic snapshot', () => {
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <UpdateTaskOverview toggleEditButton={jest.fn} />
        </Router>
      </Provider>
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('date field coverage', () => {
    taskDetails.taskTypeId =
      AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE;
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <UpdateTaskOverview toggleEditButton={jest.fn} />
        </Router>
      </Provider>
    );
    const date1 = '08-12-2020';
    const date2 = '09-12-2020';
    const date3 = '10-12-2020';
    const date4 = '11-12-2020';
    changeValueById(wrapper, 'dueDate', date1);
    changeValueById(wrapper, 'legacyRuleArchived', date2);
    changeValueById(wrapper, 'deploymentDate', date3);
    changeValueById(wrapper, 'clientDueDate', date4);
  });

  it('form submission', async () => {
    taskDetails.taskTypeId =
      AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE;
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <UpdateTaskOverview toggleEditButton={jest.fn} />
        </Router>
      </Provider>
    );
    changeValueById(wrapper, 'originatingCaseId', 'SF-0987');
    changeValueById(wrapper, 'legacyTaskId', 'LT-001');
    changeValueById(wrapper, 'dueDate', new Date('11-11-2022').toISOString());
    await sleep(1);
    findById(wrapper, 'updateoverview').simulate('click');
    await sleep(1);
  });
  it('should trigger legacyRuleId onChange event', () => {
    taskDetails.taskTypeId =
      AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR;
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <UpdateTaskOverview toggleEditButton={jest.fn} />
        </Router>
      </Provider>
    );
    findByName(wrapper, 'legacyRuleId')
      .props()
      .onBlur({ target: { value: '1.166' } }, {});
  });
});
