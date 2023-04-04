import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DeploymentTaskListGrid from './DeploymentTaskListGrid';
import { Task } from '../../../../types';
import { Table } from '@athena/forge';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

describe('test <DeploymentTaskListGrid>', () => {
  let wrapper: any;
  const dataSource: Task[] = [
    {
      escalatedYn: 'N',
      activeTaskStepId: '117',
      assignedTo: 'aanandkumar',
      businessRequirementId: '5',
      dueOn: '07/02/2020',
      lastModified: '07/02/2020',
      legacyRuleId: '121212',
      priorityName: 'P1',
      statusName: 'Assigned',
      taskId: '28',
      taskName:
        'Update Global Business Requirement 123456:12 Exclude XHC Claim Task1',
      taskTypeId: '3',
      taskTypeName: 'Dual Update',
      workflowStepName: 'Analyze Task',
    },
    {
      escalatedYn: 'N',
      activeTaskStepId: '117',
      assignedTo: null,
      businessRequirementId: '5',
      dueOn: '07/02/2020',
      lastModified: '07/02/2020',
      legacyRuleId: '121212',
      priorityName: 'P1',
      statusName: 'Assigned',
      taskId: '28',
      taskName:
        'Update Global Business Requirement 123456:12 Exclude XHC Claim Task1',
      taskTypeId: '3',
      taskTypeName: 'Dual Update',
      workflowStepName: 'Analyze Task',
    },
  ];
  let onSelectAllCheckbox: any;
  let onSelectCheckbox: any;

  beforeEach(() => {
    onSelectAllCheckbox = jest.fn();
    onSelectCheckbox = jest.fn();
    wrapper = mount(
      <Router>
        <DeploymentTaskListGrid
          dataSource={dataSource}
          onSelectAllCheckbox={onSelectAllCheckbox}
          onSelectCheckbox={onSelectCheckbox}
        />
      </Router>
    );
  });
  it('should render Table element', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });
});
