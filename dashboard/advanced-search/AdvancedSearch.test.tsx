import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';

import Adapter from 'enzyme-adapter-react-16';
import AdvancedSearchConnecter, { AdvancedSearch } from './AdvancedSearch';
import { Input } from '@athena/forge';
import configureStore from 'redux-mock-store';
import { act } from 'react-dom/test-utils';
import { findById, sleep } from '../../../utils/TestUtils';

configure({ adapter: new Adapter() });
let store: any;
let wrapper: any;
let wrappingComponent: any;
let outerProps: any;

const taskTypeFilter: any = [
  'All',
  'Business Requirement Update',
  'New Business Requirement',
  'Dual Update',
  'Global Rule Review',
  'GRR Rule Update',
];
const statusFilter: any = [
  'All',
  'Created',
  'In Queue',
  'Assigned',
  'In Progress',
  'Rejected',
  'In Production',
];
const workFlowStepFilter: any = [
  'All',
  'Analyze Task',
  'Review Task',
  'Manager Review',
  'Model Changes',
  'Code Changes',
  'Test Changes',
  'Review Changes',
  'Deploy Changes',
];

const priorityFilter: any = [
  { id: '1', name: '0' },
  { id: '2', name: '1' },
  { id: '3', name: '2' },
  { id: '4', name: '3' },
];

describe('AdvancedSearch', () => {
  store = configureStore([])({
    masterData: {
      users: [],
    },
  });
  store.dispatch = jest.fn();

  beforeEach(() => {
    function WrappingComponent(props: any) {
      const { children } = props;

      return <Provider store={store}>{children}</Provider>;
    }

    outerProps = {
      onSearch: jest.fn(),
      taskTypeFilter: taskTypeFilter,
      statusFilter: statusFilter,
      workFlowStepFilter: workFlowStepFilter,
      priorities: priorityFilter,
    };
    const wrapperConnecter = mount(
      <AdvancedSearchConnecter {...outerProps} />,
      {
        wrappingComponent: WrappingComponent,
      }
    );

    wrapper = wrapperConnecter.find(AdvancedSearch);
    wrappingComponent = wrapperConnecter.getWrappingComponent();
  });

  it('should render Advanced task search', () => {
    expect(wrapper.find(Input)).toHaveLength(1);
  });

  it('should render all advanced options', async () => {
    await act(async () => {
      wrapper.setState({
        showAdvanceSearchForm: true,
        advancedOptionsFlags: {
          workflowStepIds: true,
          statusIds: true,
          taskTypeIds: true,
          createdDate: true,
          deploymentDate: true,
          internalDueDate: true,
          assignedToIds: true,
          signedoffByIds: true,
          priorityIds: true,
          modelName: true,
          DTName: true,
          DTId: true,
          modelDesignChanges: true,
        },
      });
      await sleep(10);
      wrapper.find('.popupToggleIconSpan').last().simulate('click');
      await sleep(10);

      expect(findById(wrappingComponent, 'workFlowStepFilter')).toHaveLength(1);
      expect(findById(wrappingComponent, 'statusFilter')).toHaveLength(1);
      expect(findById(wrappingComponent, 'taskTypeFilter')).toHaveLength(1);
      expect(findById(wrappingComponent, 'priorityFilter')).toHaveLength(1);
      expect(findById(wrappingComponent, 'createdStartDate')).toHaveLength(1);
      expect(findById(wrappingComponent, 'createdEndDate')).toHaveLength(1);
      expect(findById(wrappingComponent, 'deploymentStartDate')).toHaveLength(
        1
      );
      expect(findById(wrappingComponent, 'deploymentEndDate')).toHaveLength(1);
      expect(findById(wrappingComponent, 'internalDueStartDate')).toHaveLength(
        1
      );
      expect(findById(wrappingComponent, 'internalDueEndDate')).toHaveLength(1);

      expect(findById(wrappingComponent, 'assignedToIds')).toHaveLength(1);
      expect(findById(wrappingComponent, 'signedoffByIds')).toHaveLength(1);
      expect(findById(wrappingComponent, 'modelName')).toHaveLength(1);
      expect(findById(wrappingComponent, 'DTName')).toHaveLength(1);
      expect(findById(wrappingComponent, 'DTId')).toHaveLength(1);
      expect(findById(wrappingComponent, 'modelDesignChanges')).toHaveLength(1);
    });
  });

  it('should call onsearch function on submit form', async () => {
    await act(async () => {
      wrapper.setState({
        showAdvanceSearchForm: true,
      });
      await sleep(10);
      wrapper.find('.popupToggleIconSpan').last().simulate('click');
      await sleep(10);
      findById(wrappingComponent, 'submit').simulate('click');
      await sleep(10);
      expect(outerProps.onSearch).toHaveBeenCalledTimes(1);
    });
  });

  it('should open popover element on advanced search', async () => {
    await act(async () => {
      wrapper.setState({
        showAdvanceSearchForm: true,
      });
      await sleep(10);
      wrapper.find('.popupToggleIconSpan').last().simulate('click');
      await sleep(10);
      await act(async () => {
        expect(wrapper.state('showAdvanceSearchForm')).toEqual(true);

        wrappingComponent
          .find('.fe_c_button_popover_anchor')
          .last()
          .simulate('click');
        await sleep(10);
        expect(wrapper.state('showAdvanceSearchCustomOptions')).toEqual(true);
      });
    });
  });

  it('should add custom filter when user click advance search menu item', async () => {
    await act(async () => {
      wrapper.setState({
        showAdvanceSearchForm: true,
        showAdvanceSearchCustomOptions: true,
      });
      await sleep(10);
      wrapper.find('.popupToggleIconSpan').last().simulate('click');
      await sleep(10);
      await act(async () => {
        wrappingComponent
          .find('.fe_c_button_popover_anchor')
          .last()
          .simulate('click');
        await sleep(10);

        findById(wrappingComponent, 'workflowStepIds').last().simulate('click');

        await sleep(10);
        expect(wrapper.state('advancedOptionsFlags').workflowStepIds).toEqual(
          true
        );
      });
    });
  });

  it('should set values for default search fields', async () => {
    const searchData: any = {
      searchText: 'task',
      searchKeyword: 'task',
      legacyRuleId: '1.11',
      taskId: '1',
      taskName: 'Task Name',
      brId: '1',
      brName: 'BR Name',
      statusIds: [],
      taskTypeIds: [],
      workFlowStepIds: [],
    };
    await act(async () => {
      wrapper.setState({
        showAdvanceSearchForm: true,
      });
      await sleep(5);

      wrapper.find('.popupToggleIconSpan').last().simulate('click');
      await sleep(5);
      await act(async () => {
        findById(wrappingComponent, 'searchKeyword')
          .last()
          .simulate('change', {
            target: { name: 'searchKeyword', value: searchData.searchKeyword },
          });

        findById(wrappingComponent, 'brName')
          .last()
          .simulate('change', {
            target: { name: 'brName', value: searchData.brName },
          });
        findById(wrappingComponent, 'brId')
          .last()
          .simulate('change', {
            target: { name: 'brId', value: searchData.brId },
          });
        findById(wrappingComponent, 'taskName')
          .last()
          .simulate('change', {
            target: {
              name: 'taskName',
              value: searchData.taskName,
            },
          });
        findById(wrappingComponent, 'taskId')
          .last()
          .simulate('change', {
            target: { name: 'taskId', value: searchData.taskId },
          });

        findById(wrappingComponent, 'legacyRuleId')
          .last()
          .simulate('change', {
            target: { name: 'legacyRuleId', value: searchData.legacyRuleId },
          });

        findById(wrappingComponent, 'submit').simulate('click');
        await sleep(5);
        expect(outerProps.onSearch).toBeCalledWith(searchData);
      });
    });
  });

  it('should set values for advance filters simple fields', async () => {
    const searchData: any = {
      modelDesignChanges: 'Model Design Changes',
      DTId: 'DT ID',
      DTName: 'DT Name',
      modelName: 'Model Name',
      internalDueStartDate: '11-11-2020',
      internalDueEndDate: '12-12-2020',
      deploymentStartDate: '11-11-2020',
      createdStartDate: '11-11-2020',
      createdEndDate: '12-12-2020',
      deploymentEndDate: '12-12-2020',
      searchText: '',
      statusIds: [],
      taskTypeIds: [],
      workFlowStepIds: [],
    };
    await act(async () => {
      wrapper.setState({
        showAdvanceSearchForm: true,
        advancedOptionsFlags: {
          createdDate: true,
          deploymentDate: true,
          internalDueDate: true,
          modelName: true,
          DTName: true,
          DTId: true,
          modelDesignChanges: true,
        },
      });
      await sleep(5);

      wrapper.find('.popupToggleIconSpan').last().simulate('click');
      await sleep(5);
      await act(async () => {
        findById(wrappingComponent, 'createdStartDate')
          .last()
          .simulate('change', {
            target: {
              name: 'createdStartDate',
              value: searchData.createdStartDate,
            },
          });
        findById(wrappingComponent, 'createdEndDate')
          .last()
          .simulate('change', {
            target: {
              name: 'createdEndDate',
              value: searchData.createdEndDate,
            },
          });
        findById(wrappingComponent, 'deploymentStartDate')
          .last()
          .simulate('change', {
            target: {
              name: 'deploymentStartDate',
              value: searchData.deploymentStartDate,
            },
          });
        findById(wrappingComponent, 'deploymentEndDate')
          .last()
          .simulate('change', {
            target: {
              name: 'deploymentEndDate',
              value: searchData.deploymentEndDate,
            },
          });
        findById(wrappingComponent, 'internalDueStartDate')
          .last()
          .simulate('change', {
            target: {
              name: 'internalDueStartDate',
              value: searchData.internalDueStartDate,
            },
          });
        findById(wrappingComponent, 'internalDueEndDate')
          .last()
          .simulate('change', {
            target: {
              name: 'internalDueEndDate',
              value: searchData.internalDueEndDate,
            },
          });

        findById(wrappingComponent, 'modelName')
          .last()
          .simulate('change', {
            target: { name: 'modelName', value: searchData.modelName },
          });
        findById(wrappingComponent, 'DTName')
          .last()
          .simulate('change', {
            target: { name: 'DTName', value: searchData.DTName },
          });
        findById(wrappingComponent, 'DTId')
          .last()
          .simulate('change', {
            target: { name: 'DTId', value: searchData.DTId },
          });
        findById(wrappingComponent, 'modelDesignChanges')
          .last()
          .simulate('change', {
            target: {
              name: 'modelDesignChanges',
              value: searchData.modelDesignChanges,
            },
          });

        await sleep(5);
        findById(wrappingComponent, 'submit').simulate('click');
      });
    });
  });

  it('should set values for advanced filter complex fields ', async () => {
    const searchData: any = {
      taskTypeIds: [1],
      statusIds: [1],
      workFlowStepIds: [2],
      assignedToIds: ['aanandkumar'],
      priorityIds: [2],
      signedoffByIds: ['cvenkatesh'],
      searchText: '',
    };

    await act(async () => {
      wrapper.setState({
        showAdvanceSearchForm: true,
        advancedOptionsFlags: {
          workflowStepIds: true,
          statusIds: true,
          taskTypeIds: true,
          assignedToIds: true,
          signedoffByIds: true,
          priorityIds: true,
        },
      });
      await sleep(5);

      wrapper.find('.popupToggleIconSpan').last().simulate('click');
      await sleep(5);
      await act(async () => {
        wrappingComponent
          .find("Multiselect[name='workFlowStepIds']")
          .first()
          .props()
          .onChange(
            {
              target: {
                value: searchData.workFlowStepIds,
                id: 'workFlowStepFilter',
              },
            },
            {}
          );
        await sleep(10);

        wrappingComponent
          .find("Multiselect[name='statusIds']")
          .first()
          .props()
          .onChange(
            {
              target: {
                value: searchData.statusIds,
                id: 'statusFilter',
              },
            },
            {}
          );
        await sleep(10);

        wrappingComponent
          .find("Multiselect[name='taskTypeIds']")
          .first()
          .props()
          .onChange(
            {
              target: {
                value: searchData.taskTypeIds,
                id: 'taskTypeFilter',
              },
            },
            {}
          );
        await sleep(10);

        wrappingComponent
          .find("Multiselect[name='assignedToIds']")
          .first()
          .props()
          .onChange(
            {
              target: {
                value: [
                  {
                    value: searchData.assignedToIds[0],
                    text: searchData.assignedToIds[0],
                  },
                ],
                id: 'assignedToIds',
              },
            },
            {}
          );
        await sleep(10);

        wrappingComponent
          .find("Multiselect[name='signedoffByIds']")
          .first()
          .props()
          .onChange(
            {
              target: {
                value: [
                  {
                    value: '2',
                    text: '2',
                  },
                ],
                id: 'signedoffByIds',
              },
            },
            {}
          );
        await sleep(10);

        wrappingComponent
          .find("Multiselect[name='priorityIds']")
          .first()
          .props()
          .onChange(
            {
              target: {
                value: [2],
                id: 'priorityFilter',
              },
            },
            {}
          );
        await sleep(10);

        findById(wrappingComponent, 'submit').simulate('click');
        await sleep(5);
      });
    });
  });
});
