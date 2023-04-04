import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail } from '../../../../../types/index';
import TaskDiscussion from './TaskDiscussion';
import { Button, FormField } from '@athena/forge';
import { findById } from '../../../../../utils/TestUtils';
import { MockData } from '../../../../../services/__mocks__/MockData';
import moment from 'moment';
configure({ adapter: new Adapter() });

let wrapper: any;
let taskDetails: TaskDetail;
let store: any;
const userComments: any = [];
const TODAY = moment().clone().startOf('day').format('M/DD/YYYY hh:mm:ss');
const YESTERDAY = moment()
  .clone()
  .subtract(1, 'days')
  .startOf('day')
  .format('M/DD/YYYY hh:mm:ss');
const TODAYWITHOUTTIME = moment().clone().startOf('day').format('M/DD/YYYY');
const YESTERDAYWITHOUTTIME = moment()
  .clone()
  .subtract(1, 'days')
  .startOf('day')
  .format('M/DD/YYYY');
beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '16';
  taskDetails.id = '1';
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
    created: YESTERDAYWITHOUTTIME,
    createdBy: 'jcyril',
    createdTimestamp: YESTERDAY,
  };
  userComments[2] = {
    id: '4',
    taskId: '1',
    taskStepId: '16',
    content: 'Test cyril content 3',
    created: TODAYWITHOUTTIME,
    createdBy: 'jcyril',
    createdTimestamp: TODAY,
  };
  store = configureStore([])({
    task: {
      taskDetails: taskDetails,
    },
    userPermission: {
      userPermissions: ['task.update'],
    },
    userComment: {
      userCommentDetails: userComments,
    },
    masterData: {
      users: MockData.USERS,
    },
    fetchUserCommentDetails: jest.fn(),
    setCommentDetails: jest.fn(),
  });
  store.dispatch = jest.fn();
});
jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

describe('Task Discussion', () => {
  it('basic snapshot', () => {
    wrapper = mount(
      <Provider store={store}>
        <TaskDiscussion commentId="" taskId="" resetCommentId="" />
      </Provider>
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('textarea renders properly', () => {
    expect(wrapper.find(FormField)).toHaveLength(1);
  });

  it('Button renders properly', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('comment submission ', () => {
    findById(wrapper, 'content').simulate('change', {
      target: { value: 'Testing comment section' },
    });
    findById(wrapper, 'sendcomment').simulate('click');
  });
});
