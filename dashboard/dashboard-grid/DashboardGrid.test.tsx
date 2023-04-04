import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DashboardGrid from './DashboardGrid';
import { Table } from '@athena/forge';
import { Task } from '../../../types';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { sleep } from '../../../utils/TestUtils';
import AppConstants from '../../../constants/AppConstants';
import Labels from '../../../constants/Labels';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

configure({ adapter: new Adapter() });

describe('test <Dashboard>', () => {
  let wrapper: any;
  const filterDataSource: any[] = ['filter1', 'filter2', 'filter3'];
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

  let onChange: any;
  let store: any;
  beforeEach(() => {
    store = configureStore([])({
      userPermission: {
        userPermissions: ['task.update'],
      },
      updateTaskDetails: jest.fn(),
    });
    store.dispatch = jest.fn();
    act(() => {
      onChange = jest.fn();
      wrapper = mount(
        <Provider store={store}>
          <Router>
            <DashboardGrid
              dataSource={dataSource}
              onFilter={onChange}
              selectedTabIndex={
                AppConstants.UI_CONSTANTS.DASHBOARD_QUEUE_TAB_INDEX
                  .MY_TASK_INBOX
              }
              taskTypeFilter={filterDataSource}
              statusFilter={filterDataSource}
              workFlowStepFilter={filterDataSource}
              searchResultEmptyMessage=""
              isAdvancedSearch={false}
              onSort={filterDataSource}
            />
          </Router>
        </Provider>
      );
    });
  });
  it('should render Table element', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('should call onchange function if assigned to filter changes', async () => {
    const assignedToFilterEl = wrapper.find('#assignedToFilter').first();

    await act(async () => {
      assignedToFilterEl.props().onFocus('assignedToFilter');
      assignedToFilterEl.props().onBlur('assignedToFilter');
      assignedToFilterEl.props().onChange(
        {
          target: { value: [AppConstants.UI_CONSTANTS.ALL] },
        },
        {}
      );
      assignedToFilterEl.props().onChange(
        {
          target: { value: [Labels.DASHBOARD_GRID.ASSIGNED_TO_ME] },
        },
        {}
      );
      assignedToFilterEl.props().onChange(
        {
          target: { value: [Labels.DASHBOARD_GRID.CREATED_BY_ME] },
        },
        {}
      );
      assignedToFilterEl.props().onChange(
        {
          target: { value: [Labels.DASHBOARD_GRID.SIGNED_OFF_BY_ME] },
        },
        {}
      );

      await sleep(1);
      expect(onChange).toHaveBeenCalledTimes(4);
    });
  });

  it('should call onchange function if any filter changes', async () => {
    const taskTypeFilter = wrapper.find('#taskTypeFilter').first();
    const statusFilter = wrapper.find('#statusFilter').first();
    const workFlowStepFilter = wrapper.find('#workFlowStepFilter').first();

    taskTypeFilter.props().onFocus('taskTypeFilter');
    statusFilter.props().onFocus('statusFilter');
    workFlowStepFilter.props().onFocus('workFlowStepFilter');

    taskTypeFilter.props().onBlur('taskTypeFilter');
    statusFilter.props().onBlur('statusFilter');
    workFlowStepFilter.props().onBlur('workFlowStepFilter');
    await act(async () => {
      taskTypeFilter.props().onChange(
        {
          target: {
            value: ['All'],
            id: 'taskTypeFilter',
          },
        },
        {}
      );
      taskTypeFilter.props().onChange(
        {
          target: {
            value: ['All'],
            id: 'mockFilter',
          },
        },
        {}
      );
      statusFilter.props().onChange(
        {
          target: {
            value: ['All'],
            id: 'statusFilter',
          },
        },
        {}
      );
      workFlowStepFilter.props().onChange(
        {
          target: {
            value: ['All'],
            id: 'workFlowStepFilter',
          },
        },
        {}
      );

      await sleep(1);
      expect(onChange).toHaveBeenCalledTimes(4);
    });
  });

  it('should call onchange function for state filter and cover all the filter condition ', async () => {
    const statusFilter = wrapper.find('#statusFilter').first();
    await act(async () => {
      statusFilter.props().onChange(
        {
          target: {
            value: ['Queue'],
            id: 'statusFilter',
          },
        },
        {}
      );

      statusFilter.props().onChange(
        {
          target: {
            value: ['All'],
            id: 'statusFilter',
          },
        },
        {}
      );
      await sleep(1);
      expect(onChange).toHaveBeenCalledTimes(2);
    });
  });

  it('should call onchange function for assigned To Filter and cover all the filter condition ', async () => {
    const assignedToFilter = wrapper.find('#assignedToFilter').first();
    await act(async () => {
      assignedToFilter.props().onChange(
        {
          target: {
            value: ['Assiged to me'],
          },
        },
        {}
      );

      assignedToFilter.props().onChange(
        {
          target: {
            value: ['All'],
          },
        },
        {}
      );

      assignedToFilter.props().onChange(
        {
          target: {
            value: ['All'],
          },
        },
        {}
      );
      await sleep(1);
      expect(onChange).toHaveBeenCalledTimes(3);
    });
  });
});
