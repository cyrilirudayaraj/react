import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail } from '../../../../../types/index';
import { Card } from '@athena/forge';
import TaskHistory from './TaskHistory';
configure({ adapter: new Adapter() });

jest.mock('../../../../../services/CommonService');

let wrapper: any;
let taskDetails: TaskDetail;
let store: any;
const eventdetails: any = [];
beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '16';
  taskDetails.id = '1';
  eventdetails[0] = {
    changes: [],
    created: '11/23/2020 03:15:16',
    createdBy: 'aanandkumar',
    eventName: 'T-1612 was created',
    eventType: 'Created',
    objectType: 'TASK',
  };
  eventdetails[1] = {
    changes: [],
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
      <TaskHistory />
    </Provider>
  );
});

describe('Task History', () => {
  it('Task history renders properly', () => {
    expect(wrapper.find(Card).length).toBeGreaterThanOrEqual(0);
  });
});
