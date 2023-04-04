import React from 'react';
import { configure, mount } from 'enzyme';
import TaskOverviewConnector, { TaskOverview } from './TaskOverview';

import Adapter from 'enzyme-adapter-react-16';
import StringUtil from '../../../../../utils/StringUtil';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail } from '../../../../../types';
import { TaskDetailsMockData1 } from '../../../../../services/__mocks__/TaskDetailsMockData';
import { findById, sleep } from '../../../../../utils/TestUtils';

configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');
let wrapper: any;
let wrappingComponent: any;
let store: any;
let taskDetails: TaskDetail;
let link: any;

describe('TaskOverview', () => {
  taskDetails = TaskDetailsMockData1 as TaskDetail;

  const renderTaskOverview = () => {
    store = configureStore([])({
      task: {
        taskDetails: taskDetails,
      },
      userPermission: {
        userPermissions: ['task.update'],
      },
      updateTaskDetails: jest.fn(),
    });

    function WrappingComponent(props: any) {
      const { children } = props;
      return <Provider store={store}>{children}</Provider>;
    }

    wrappingComponent = mount(<TaskOverviewConnector />, {
      wrappingComponent: WrappingComponent,
    });
    wrapper = wrappingComponent.find(TaskOverview);
  };

  it('should render Jira link', () => {
    const originatingCaseId = 'COLRDD-22802';
    const originatingSystemId = '3';
    link = StringUtil.getOriginatingSystemUrl(
      originatingSystemId,
      originatingCaseId
    );
    taskDetails = {
      ...taskDetails,
      originatingCaseId,
      originatingSystemId,
    };

    renderTaskOverview();

    const linkEl = findById(wrapper, 'originatingCaseId');
    wrapper.instance().toggleReset();
    expect(linkEl.find('a').props().href).toEqual(link);
    expect(linkEl.find('a').props().target).toEqual('_blank');
    expect(linkEl.find('a').text()).toEqual(originatingCaseId);
  });

  it('should render Salesforce link', () => {
    const originatingCaseId = '11309869';
    const originatingSystemId = '1';
    const salesforceRecordId = '5006f00001cJJsGAAW';
    link = StringUtil.getOriginatingSystemUrl(
      originatingSystemId,
      salesforceRecordId
    );

    taskDetails = {
      ...taskDetails,
      originatingCaseId,
      originatingSystemId,
    };

    renderTaskOverview();

    setImmediate(async () => {
      await sleep(10);
      const linkEl = findById(wrapper, 'originatingCaseId');
      expect(linkEl.find('a').props().href).toEqual(link);
      expect(linkEl.find('a').props().target).toEqual('_blank');
      expect(linkEl.find('a').text()).toEqual(originatingCaseId);
    });
  });

  it('should render Smartsheet link', () => {
    const originatingCaseId = '111';
    const originatingSystemId = '2';
    link = StringUtil.getOriginatingSystemUrl(
      originatingSystemId,
      originatingCaseId
    );

    taskDetails = {
      ...taskDetails,
      originatingCaseId,
      originatingSystemId,
    };

    renderTaskOverview();

    const linkEl = findById(wrapper, 'originatingCaseId');
    expect(linkEl.find('a').props().href).toEqual(link);
    expect(linkEl.find('a').props().target).toEqual('_blank');
    expect(linkEl.find('a').text()).toEqual(originatingCaseId);
  });
});
