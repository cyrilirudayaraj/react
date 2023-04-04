import React from 'react';
import { configure, mount } from 'enzyme';
import Header from '../header/Header';
import SideNav from '../sidenav/SideNav';
import Layout from './Layout';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { TaskDetail } from '../../types';

jest.mock('../../services/CommonService');
configure({ adapter: new Adapter() });
let store: any;
const eventdetails: any = [];
const taskDetails = {} as TaskDetail;
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
beforeEach(() => {
  store = configureStore([])({
    userPermission: {
      userPermissions: ['task.update'],
    },
    task: {
      taskDetails: taskDetails,
    },
    taskHistory: {
      events: eventdetails,
    },
    masterData: {
      priorities: [
        { id: '1', name: '0' },
        { id: '2', name: '1' },
        { id: '3', name: '2' },
        { id: '4', name: '3' },
      ],
    },
  });
  store.dispatch = jest.fn();
});
describe('test <Layout>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Layout />
      </Provider>
    );
  });
  it('should render Header element', () => {
    expect(wrapper.find(Header)).toHaveLength(1);
  });
  it('should render LeftSideNav element', () => {
    expect(wrapper.find(SideNav)).toHaveLength(1);
  });
});
