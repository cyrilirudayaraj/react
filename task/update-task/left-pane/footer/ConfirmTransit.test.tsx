import React from 'react';
import { configure, mount } from 'enzyme';
import ConfirmTransit from './ConfirmTransit';

import Adapter from 'enzyme-adapter-react-16';
import { TaskStep } from '../../../../../types';
import { Checkbox } from '@athena/forge';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');

const activeStep: TaskStep = {
  workflowStepId: '5',
  signOffStatement: 'My code changes are complete',
  version: '3',
  signedOffYn: 'Y',
  name: 'Make Code Changes',
  ordering: '5',
  transitionText: 'Send for Testing',
  id: '13',
  assignedTo: 'vsivachandran',
};

const taskDependencies = [
  {
    completedYn: null,
    dependencyCondition: 'test with',
    dependencyDate: null,
    dependencyId: '72',
    dependencyName: 'test task',
    dependencySystemId: '3',
    dependencySystemName: 'Atlas',
    deploymentDate: '08/25/2020',
    description: null,
    id: '19',
    notes: 'test',
    ordering: null,
    statusName: 'In Production',
    taskId: '2039',
    version: '16',
  },
  {
    completedYn: null,
    dependencyCondition: 'deploy with',
    dependencyDate: null,
    dependencyId: '23',
    dependencyName:
      'Expand Rule HNE 281 (override of Rule 195 for PT & radiology)',
    dependencySystemId: '1',
    dependencySystemName: 'Rule Tracker',
    deploymentDate: null,
    description: null,
    id: '27',
    notes: 'test',
    ordering: null,
    statusName: 'INPRODUCTION',
    taskId: '2039',
    version: '11',
  },
];

let wrapper: any;
let onConfirm: any;
let onCancel: any;

beforeEach(() => {
  onConfirm = jest.fn();
  onCancel = jest.fn();
  wrapper = mount(
    <ConfirmTransit
      activeStep={activeStep}
      onConfirm={onConfirm}
      onCancel={onCancel}
      dependencies={taskDependencies}
    />
  );
});

describe('ConfirmTransit', () => {
  it('should render', () => {
    expect(wrapper.find(Checkbox).props().description).toEqual(
      activeStep.signOffStatement
    );
  });

  it('should close the dialog when close button clicked', () => {
    act(() => {
      wrapper.find('.my-close-button').last().simulate('click');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should close the dialog when cancel button clicked', () => {
    act(() => {
      wrapper.find('.fe_c_button--secondary').last().simulate('click');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should trigger validation on valid form submit', () => {
    act(() => {
      wrapper
        .find(Checkbox)
        .props()
        .onChange({ target: { name: 'signedOffYn', value: 'true' } });

      wrapper.find('.fe_c_button--primary').simulate('click');
    });
  });
});
