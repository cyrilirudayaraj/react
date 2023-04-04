import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Adapter from 'enzyme-adapter-react-16';
import UpdateTaskRightPane from './UpdateTaskRightPane';
import { TaskDetail, TaskStep } from '../../../../types';
import { MockData } from '../../../../services/__mocks__/MockData';
import { Tabs } from '@athena/forge';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

let store: any;
let wrapper: any;
let taskDetails: TaskDetail;
let props: any;

beforeEach(() => {
  props = {
    commentId: '',
    taskId: '150',
    resetCommentId: jest.fn(),
  };

  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '1';
  const taskStep: TaskStep = {} as TaskStep;
  taskDetails.taskSteps = [] as TaskStep[];
  taskDetails.taskSteps[0] = taskStep;
  taskDetails.taskSteps[0].id = '1';
  taskDetails.taskSteps[0].assignedTo = 'Prem';
  taskDetails.taskSteps[0].version = '100';

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

  store = mockStore({
    task: {
      taskDetails: taskDetails,
      leftSectionActive: false,
      rightSectionActive: true,
    },
    userPermission: {
      userPermissions: ['task.update'],
    },
    userComment: {
      userCommentDetails: userComments,
    },
    validation: {
      formInvalid: {
        isWorkLogFormValid: true,
      },
    },
    masterData: {
      users: MockData.USERS,
      originatingSystems: MockData.ORGINATINGSYSTEMS,
      usersInfo: MockData.USERS,
    },
  });
  store.dispatch = jest.fn();

  wrapper = mount(
    <Provider store={store}>
      <UpdateTaskRightPane {...props} />
    </Provider>
  );
});

describe('test UpdateTaskRightPane', () => {
  it('basic snapshot', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should handle tab change', () => {
    act(() => {
      wrapper
        .find(Tabs)
        .props()
        .onTabsChange({ target: { value: 2 } });
    });
  });
});
