import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DashboardConnecter, { Dashboard } from './Dashboard';
import { Tabs } from '@athena/forge';
import CreateTask from '../task/create-task/CreateTask';
import DashboardPaginator from './DashboardPaginator';
import DashBoardGrid from './dashboard-grid/DashboardGrid';
import GenerateReport from '../report/GenerateReport';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { BrowserRouter as Router } from 'react-router-dom';
import { sleep } from '../../utils/TestUtils';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });
jest.mock('../../services/CommonService');

let store: any;
let wrapper: any;
let wrappingComponent: any;

const history = createMemoryHistory();

describe('test <Dashboard>', () => {
  store = configureStore([])({
    userPermission: {
      userPermissions: [],
    },
    masterData: {
      workflowSteps: [],
      statusList: [],
      taskTypes: [],
      users: [],
      priorities: [],
      originatingSystems: [],
      departmentOrigins: [],
      reportTypes: [],
    },
  });

  store.dispatch = jest.fn();
  beforeEach(() => {
    act(() => {
      function WrappingComponent(props: any) {
        const { children } = props;

        return (
          <Provider store={store}>
            <Router>{children}</Router>
          </Provider>
        );
      }

      //@ts-ignore
      const wrapperConnecter = mount(<DashboardConnecter history={history} />, {
        wrappingComponent: WrappingComponent,
      });

      wrapper = wrapperConnecter.find(Dashboard);
      wrappingComponent = wrapperConnecter.getWrappingComponent();
    });
  });

  it('should render userInfo element', () => {
    expect(wrapper.find(Tabs)).toHaveLength(1);
  });

  it('should show create task popup', () => {
    act(async () => {
      wrapper.setState({ showCreateTaskDialog: true });
      await sleep(10);
      expect(wrappingComponent.find(CreateTask)).toHaveLength(1);
    });
  });

  it('should open create task popup', () => {
    act(async () => {
      wrapper.instance().onCreateTask();
      await sleep(10);
      expect(wrappingComponent.find(CreateTask)).toHaveLength(1);
    });
  });

  it('should not show create task element after close event', () => {
    act(() => {
      wrapper.instance().onCloseCreateTask();
      expect(wrapper.find(CreateTask)).toHaveLength(0);
    });
  });

  it('should triger change handler any form value changes', () => {
    wrapper.find(DashBoardGrid).first().props().onFilter({
      searchText: '',
      workFlowStepIds: [],
    });
  });

  it('should triger change handler any form value changes', () => {
    wrapper
      .find(DashBoardGrid)
      .first()
      .props()
      .onFilter({
        searchText: '',
        statusIds: ['All'],
        taskTypeIds: ['All'],
        workFlowStepIds: ['All'],
      });
  });

  it('should show the My Task Inbox tab', () => {
    wrapper.instance().tabChangeHandler({
      target: { value: '0' },
    });
    expect(wrapper.state('selectedIndex')).toEqual(0);
  });

  it('should show the Ready for Review tab', () => {
    wrapper.instance().tabChangeHandler({
      target: { value: '1' },
    });
    expect(wrapper.state('selectedIndex')).toEqual(1);
  });

  it('should show the Ready for Modeling tab', () => {
    wrapper.instance().tabChangeHandler({
      target: { value: '2' },
    });
    expect(wrapper.state('selectedIndex')).toEqual(2);
  });

  it('should show the Ready for Dev tab', () => {
    wrapper.instance().tabChangeHandler({
      target: { value: '3' },
    });
    expect(wrapper.state('selectedIndex')).toEqual(3);
  });

  it('should show the All Tasks tab', () => {
    wrapper.instance().tabChangeHandler({
      target: { value: '4' },
    });
    expect(wrapper.state('selectedIndex')).toEqual(4);
  });

  it('should render paginator if contain dataSource', () => {
    act(async () => {
      await wrapper
        .instance()
        .getTasks({ searchText: 'Update', workFlowStepIds: ['test'] });
      expect(wrapper.find(DashboardPaginator)).toHaveLength(1);
    });
  });

  it('should render paginator if contain dataSource', () => {
    act(async () => {
      wrapper.setState({ selectedIndex: 0 });
      await wrapper.instance().getTasks({});
      expect(wrapper.find(DashboardPaginator)).toHaveLength(0);
    });
  });

  it('should change the page when click on paginator', () => {
    wrapper.instance().setCurrentPage(2);
    expect(wrapper.state('currentPage')).toEqual(2);
  });

  it('should show run report popup', () => {
    act(async () => {
      wrapper.setState({ showReportsDialog: true });
      await sleep(10);
      expect(wrappingComponent.find(GenerateReport)).toHaveLength(1);
    });
  });

  it('should show the Ready for Deployment tab', () => {
    wrapper.instance().tabChangeHandler({
      target: { value: '5' },
    });
    expect(wrapper.state('selectedIndex')).toEqual(5);
  });

  it('should not show run report popup', () => {
    act(async () => {
      wrapper.instance().onCloseReport();
      await sleep(10);
      expect(wrappingComponent.find(GenerateReport)).toHaveLength(0);
    });
  });

  it('should render paginator if contain dataSource', () => {
    act(async () => {
      wrapper.setState({ selectedIndex: 0 });
      sleep(10);
      await wrapper.instance().getTasks({
        searchText: 'Update',
        workFlowStepIds: ['test'],
        assignedToMe: 0,
        createdByMe: 0,
        signedOffByMe: 0,
      });
      sleep(10);
      expect(wrapper.find(DashboardPaginator)).toHaveLength(1);
    });
  });

  it('should render paginator if contain dataSource for Ready For Modeling tab', () => {
    act(async () => {
      wrapper.setState({ selectedIndex: 2 });
      sleep(10);
      await wrapper.instance().getTasks({
        searchText: 'Update',
        workFlowStepIds: ['test'],
        assignedToMe: 0,
        createdByMe: 0,
        signedOffByMe: 0,
      });
      sleep(10);
      expect(wrapper.find(DashboardPaginator)).toHaveLength(1);
    });
  });

  it('should render paginator if contain dataSource for Ready For Modeling tab with workflow step filter', () => {
    act(async () => {
      wrapper.setState({ selectedIndex: 2 });

      await sleep(10);

      await wrapper.instance().getTasks({
        searchText: 'Update',
        workFlowStepIds: ['Analyze Task'],
        assignedToMe: 0,
        createdByMe: 0,
        signedOffByMe: 0,
      });
      sleep(10);
      expect(wrapper.find(DashboardPaginator)).toHaveLength(1);
    });
  });
});
