import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Table } from '@athena/forge';
import SignOffDetails from './SignOffDetails';
import { TaskDetail } from '../../../../../types';

configure({ adapter: new Adapter() });

describe('test <SignOffDetails>', () => {
  let wrapper: any;
  const taskDetails = {} as TaskDetail;
  taskDetails.taskSteps = [
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: 'y',
      name: 'Analyze Task',
      ordering: '1',
      transitionText: null,
      id: '101',
      assignedTo: 'vsivachandran',
      version: '1',
      plannedCompletion: '01/01/2000',
      actualCompletion: '01/01/2000',
    },
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: null,
      name: 'Review Task',
      ordering: '2',
      transitionText: null,
      id: '102',
      assignedTo: null,
      version: '1',
      plannedCompletion: null,
      actualCompletion: null,
    },
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: null,
      name: 'Manager Review',
      ordering: '3',
      transitionText: null,
      id: '103',
      assignedTo: null,
      version: '1',
      plannedCompletion: null,
      actualCompletion: null,
    },
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: null,
      name: 'Make Model Changes',
      ordering: '4',
      transitionText: null,
      id: '104',
      assignedTo: null,
      version: '1',
      plannedCompletion: null,
      actualCompletion: null,
    },
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: 'y',
      name: 'Make Code Changes',
      ordering: '5',
      transitionText: null,
      id: '105',
      assignedTo: null,
      version: '1',
      plannedCompletion: null,
      actualCompletion: null,
    },
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: null,
      name: 'Test Changes',
      ordering: '6',
      transitionText: null,
      id: '106',
      assignedTo: null,
      version: '1',
      plannedCompletion: null,
      actualCompletion: null,
    },
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: null,
      name: 'Review Changes',
      ordering: '7',
      transitionText: null,
      id: '107',
      assignedTo: null,
      version: '1',
      plannedCompletion: null,
      actualCompletion: null,
    },
    {
      workflowStepId: null,
      signOffStatement: null,
      signedOffYn: null,
      name: 'Deploy Changes',
      ordering: '8',
      transitionText: null,
      id: '108',
      assignedTo: null,
      version: '1',
      plannedCompletion: null,
      actualCompletion: null,
    },
  ];
  beforeEach(() => {
    wrapper = mount(<SignOffDetails task={taskDetails} />);
  });

  it('should render as expected', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render Table element', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('should render as expected with empty data source', () => {
    let task;
    wrapper = mount(<SignOffDetails task={task} />);
    expect(wrapper.find(Table)).toHaveLength(1);
  });
});
