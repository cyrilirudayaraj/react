import React from 'react';
import { configure, mount } from 'enzyme';
import { AddTimeEntry } from './AddTimeEntry';

import Adapter from 'enzyme-adapter-react-16';
import { TaskDetail, TaskStep } from '../../../../../types';
import { act } from 'react-dom/test-utils';
import Labels from '../../../../../constants/Labels';
import { FormikProps } from 'formik';
configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');
import { findByName, sleep } from '../../../../../utils/TestUtils';

const worklog: any = {
  spentOn: '08/15/2020',
  createdBy: 'jcyril',
  spentTimeInMins: '1d 1h 30m',
  workflowStepId: '1',
  workflowStepName: 'Analyze Task',
  id: '10',
  taskId: '1',
};

let wrapperConnector: any;
let updateWorkLog: any;
let addWorkLog: any;
let formikProps: FormikProps<any>;
let addComponent: any;
let taskDetails: TaskDetail;

beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '1';
  const taskStep: TaskStep = {} as TaskStep;
  taskDetails.taskSteps = [] as TaskStep[];
  taskDetails.taskSteps[0] = taskStep;
  taskDetails.taskSteps[0].name = 'Analyze Task';
  taskDetails.taskSteps[0].workflowStepId = '1';
  updateWorkLog = jest.fn();
  addWorkLog = jest.fn();
  formikProps = {} as FormikProps<any>;
  formikProps = {
    ...formikProps,
    values: '',
    touched: {},
    errors: {},
    handleChange: (a: any) => a,
    handleBlur: (a: any) => a,
    handleSubmit: (a: any) => a,
    setValues: (a: any) => a,
    resetForm: jest.fn(),
    getFieldProps: jest.fn(),
    setFieldValue: jest.fn(),
  };
  wrapperConnector = mount(
    <AddTimeEntry
      className="edit-button"
      id="edit-button"
      headerText={Labels.WORKLOG.HEADER_TEXT_EDIT}
      context={Labels.WORKLOG.CONTEXT_EDIT}
      icon={Labels.WORKLOG.ICON_EDIT}
      variant="tertiary"
      onConfirm={updateWorkLog}
      timeentry={worklog}
      activeWorkflowStepId="2"
      task={taskDetails}
      disabled={false}
    />
  );
  wrapperConnector.setState({ shown: true });
  addComponent = mount(
    <AddTimeEntry
      className="add-button"
      id="add-button"
      headerText={Labels.WORKLOG.HEADER_TEXT_ADD}
      context={Labels.WORKLOG.CONTEXT_ADD}
      icon={Labels.WORKLOG.ICON_ADD}
      variant="tertiary"
      onConfirm={addWorkLog}
      activeWorkflowStepId="2"
      task={taskDetails}
      disabled={false}
    />
  );
});

describe('AddTimeEntry', () => {
  it('basic snapshot', () => {
    expect(wrapperConnector.debug()).toMatchSnapshot();
  });

  it('should close the dialog when close button clicked', () => {
    act(() => {
      wrapperConnector.find('.my-close-button').last().simulate('click');
      wrapperConnector.instance().hideLightBox;
      expect(wrapperConnector.state().shown).toEqual(true);
    });
  });

  it('should show the edit dialog when edit button clicked', () => {
    act(() => {
      wrapperConnector.find('button#edit-button').last().simulate('click');
      wrapperConnector.instance().showLightbox(formikProps);
      expect(wrapperConnector.state().shown).toEqual(true);
    });
  });

  it('should show the add dialog when add button clicked', async () => {
    await act(async () => {
      addComponent.find('button#add-button').simulate('click');
      await sleep(5);
      expect(addComponent.find(AddTimeEntry).state().shown).toEqual(true);
      addComponent.instance().showLightbox(formikProps);
    });
  });

  it('should close the dialog when cancel button clicked', () => {
    act(() => {
      wrapperConnector.find('.fe_c_button--secondary').last().simulate('click');
      wrapperConnector.instance().hideLightBox;
      expect(wrapperConnector.state().shown).toEqual(true);
    });
  });

  it('should fill the form and submit', async () => {
    await act(async () => {
      setWorkFlowStep();
      findByName(wrapperConnector, 'spentTimeInMins').simulate('change', {
        target: { name: 'spentTimeInMins', value: '1d 1h 30m' },
      });
      findByName(wrapperConnector, 'spentOn').simulate('change', {
        target: { name: 'spentOn', value: '09/18/2020' },
      });
      wrapperConnector.instance().convertDHMToMinutes('1d 1h 30m');
      wrapperConnector.find('.fe_c_button--primary').simulate('click');
    });
  });
});

function setWorkFlowStep(): void {
  wrapperConnector
    .find('#workflowStepId')
    .last()
    .simulate('change', {
      target: { name: 'workflowStepId', value: '1', selectedIndex: 1 },
    });
}
