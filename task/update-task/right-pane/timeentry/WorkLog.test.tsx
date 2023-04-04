import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail, TaskStep } from '../../../../../types/index';
import WorkLog from './WorkLog';
import { WorkLogList } from './WorkLogList';
import { Formik } from 'formik';
import { AddTimeEntry } from './AddTimeEntry';
import { act } from 'react-dom/test-utils';
configure({ adapter: new Adapter() });

let wrapper: any;
let wrapper1: any;
let wrapperConnector: any;
let taskDetails: TaskDetail;
let store: any;
const timeEntryLogs: any = [];
let payload: any;
let deletePayload: any;
beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '1';
  const taskStep: TaskStep = {} as TaskStep;
  taskDetails.taskSteps = [] as TaskStep[];
  taskDetails.taskSteps[0] = taskStep;
  taskDetails.taskSteps[0].name = 'Analyze Task';
  taskDetails.taskSteps[0].workflowStepId = '1';
  taskDetails.taskSteps[0].ordering = '1';
  timeEntryLogs[0] = {
    spentOn: '08/15/2020',
    createdBy: 'jcyril',
    spentTimeInMins: '1660',
    workflowStepId: '1',
    workflowStepName: 'Analyze Task',
    id: '10',
    taskId: '1',
  };
  timeEntryLogs[1] = {
    spentOn: '08/16/2020',
    createdBy: 'jcyril',
    spentTimeInMins: '1660',
    workflowStepId: '2',
    workflowStepName: 'Review Task',
    id: '11',
    taskId: '1',
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
    timeEntry: {
      timeEntryLogs: timeEntryLogs,
    },
    fetchTimeEntryLogs: jest.fn(),
    setTimeEntryLogs: jest.fn(),
  });

  store.dispatch = jest.fn();
  wrapperConnector = mount(
    <Provider store={store}>
      <Formik initialValues={{}} onSubmit={jest.fn()} validate={jest.fn()}>
        <WorkLog />
      </Formik>
    </Provider>
  );
  wrapper = wrapperConnector.find(WorkLogList);
  wrapper1 = wrapperConnector.find(AddTimeEntry);
  payload = {
    spentOn: '08/15/2020',
    createdBy: 'jcyril',
    spentTimeInMins: '30',
    workflowStepId: '1',
    workflowStepName: 'Analyze Task',
    id: '10',
    taskId: '1',
    version: '1',
    deleted: '09/16/2020',
  };
  deletePayload = {
    id: '1',
    taskId: '1',
    deleted: '09/16/2020',
    version: '1',
    workflowStepId: '1',
    spentTimeInMins: '30',
  };
});

describe('Work Log', () => {
  it('basic snapshot', () => {
    expect(wrapper.debug()).toMatchSnapshot();
    wrapper.instance().addWorkLog(payload);
    wrapper.instance().updateWorkLog(payload);
    wrapper.instance().deleteWorkLog('1', '1', deletePayload);
  });

  it('basic time entry snap', () => {
    expect(wrapper1.debug()).toMatchSnapshot();
  });
  it('should close the dialog when close button clicked', () => {
    act(() => {
      wrapper1.setState({ shown: true });
      wrapper1.instance().hideLightBox;
      expect(wrapper1.state().shown).toEqual(false);
    });
  });
});
