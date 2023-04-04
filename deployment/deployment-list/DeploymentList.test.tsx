import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { sleep } from '../../../utils/TestUtils';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import DashboardListPaginator from '../deployment-list/DeploymentListPaginator';
import DeploymentList from './DeploymentList';

let wrapper: any;
configure({ adapter: new Adapter() });
jest.mock('../../../services/CommonService');
configure({ adapter: new Adapter() });
let store: any;
const deploymentStatuses: any[] = [
  { id: '1', name: 'SUCCESS' },
  { id: '2', name: 'FAILURE' },
];
beforeEach(() => {
  store = configureStore([])({
    toast: {},
    userPermission: {
      userPermissions: ['task.deploy'],
    },
  });
  store.dispatch = jest.fn();
});
describe('test Deployment>', () => {
  const releasedByFilter: any[] = ['filter1', 'filter2', 'filter3'];
  const statusFilter: any[] = ['All', 'filter1', 'filter2', 'filter3'];
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DeploymentList
            releasedByFilter={releasedByFilter}
            statusFilter={statusFilter}
            deploymentStatuses={deploymentStatuses}
          />
        </Router>
      </Provider>
    );
  });
  it('snapshot', async () => {
    await wrapper.find(DeploymentList).setState({
      total: 0,
      currentPage: 0,
      sortBy: null,
      sortOrder: null,
      dataSource: [
        {
          id: 1,
          status: 'COMPLETE',
          created: '03/21/2021',
          createdBy: 'jcyril',
          releaseVersion: '2.-0.2',
          taskIds: '2,3,4',
        },
        {
          id: 2,
          status: 'COMPLETE',
          created: '03/21/2021',
          createdBy: 'jcyril',
          releaseVersion: '2.-0.2',
          taskIds: '5,6,7',
        },
        {
          id: 3,
          status: 'COMPLETE',
          created: '03/21/2021',
          createdBy: 'jcyril',
          releaseVersion: '2.-0.2',
          taskIds: '1',
        },
        {
          id: 4,
          status: 'COMPLETE',
          created: '03/21/2021',
          createdBy: 'jcyril',
          releaseVersion: '2.-0.2',
          taskIds: '8,9,10',
        },
      ],
    });
    await sleep(10);
  });

  it('should render paginator if contain dataSource', async () => {
    await act(async () => {
      await wrapper.find(DeploymentList).setState({
        total: 0,
        currentPage: 0,
        sortBy: null,
        sortOrder: null,
        dataSource: [
          {
            id: 1,
            status: 'COMPLETE',
            created: '03/21/2021',
            createdBy: 'jcyril',
            releaseVersion: '2.-0.2',
            taskIds: '11,12,13',
          },
          {
            id: 2,
            status: 'COMPLETE',
            created: '03/21/2021',
            createdBy: 'jcyril',
            releaseVersion: '2.-0.2',
            taskIds: '2',
          },
        ],
      });
      await sleep(10);
      expect(wrapper.find(DashboardListPaginator)).toHaveLength(1);
    });
  });

  it('should call onchange function if any filter changes', async () => {
    const releasedByFilter = wrapper.find('#statusFilter').first();
    const statusFilter = wrapper.find('#releasedByFilter').first();
    const taskFilter = wrapper.find('#taskFilter').first();

    releasedByFilter.props().onFocus('releasedByFilter');
    statusFilter.props().onFocus('statusFilter');

    releasedByFilter.props().onBlur('releasedByFilter');
    statusFilter.props().onBlur('statusFilter');
    await act(async () => {
      taskFilter.simulate('change', {
        target: { name: 'taskFilter', value: '90,12' },
      });
      await sleep(10);
      releasedByFilter.props().onChange(
        {
          target: {
            value: ['All'],
            id: 'releasedByFilter',
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
      taskFilter.props().onBlur(
        {
          target: {
            value: '90,120',
            id: 'taskFilter',
          },
        },
        {
          values: {
            taskFilter: '90,120',
          },
        }
      );
      await sleep(10);
    });
  });
  it('should call onchange function for status filter and cover all the filter condition ', async () => {
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
            value: [''],
            id: 'statusFilter',
          },
        },
        {}
      );
      await sleep(10);
    });
  });
  it('should call onchange function for released by filter and cover all the filter condition ', async () => {
    const releasedByFilter = wrapper.find('#releasedByFilter').first();
    await act(async () => {
      releasedByFilter.props().onChange(
        {
          target: {
            value: ['Queue'],
            id: 'releasedByFilter',
          },
        },
        {}
      );

      releasedByFilter.props().onChange(
        {
          target: {
            value: [''],
            id: 'releasedByFilter',
          },
        },
        {}
      );
      await sleep(10);
    });
  });
  it('should call onchange function for task filter and cover all the filter condition ', async () => {
    const taskFilter = wrapper.find('#taskFilter').first();
    await act(async () => {
      taskFilter.simulate('change', {
        target: { name: 'taskFilter', value: '90,12' },
      });
      taskFilter.props().onKeyPress(
        {
          target: {
            value: '90,120',
            id: 'taskFilter',
          },
          key: 'Enter',
          preventDefault: () => {
            jest.fn;
          },
        },
        {}
      );
      await sleep(10);
    });
  });

  it('should enable clear button on change', async () => {
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
      await sleep(10);
    });
    expect(wrapper.find(DeploymentList).state('clearAllBtn')).toEqual(false);
  });
  it('should clear formik fields on click of clear all button', async () => {
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
      await sleep(10);
      wrapper.find('#clear-all-btn').first().simulate('click');
    });
    expect(wrapper.find(DeploymentList).state('clearAllBtn')).toEqual(true);
    expect(statusFilter.props().value).toEqual(
      wrapper.find(DeploymentList).state('filterDetails').statusFilter
    );
  });
});
