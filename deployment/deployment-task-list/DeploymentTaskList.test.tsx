import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button } from '@athena/forge';
import { sleep } from '../../../utils/TestUtils';
import DeploymentTaskList from './DeploymentTaskList';
import { act } from 'react-dom/test-utils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });

jest.mock('../../../services/CommonService');

let store: any;
beforeEach(() => {
  const configs = [
    {
      textValue: 'atlas',
      dateValue: null,
      name: 'app.name',
      id: '1',
      numericValue: null,
    },

    {
      textValue: 'rules-master',
      dateValue: null,
      name: 'app.ui.package.name',
      id: '2',
      numericValue: null,
    },
  ];
  store = configureStore([])({
    masterData: {
      configs: configs,
      taskDetails: [],
      users: [],
    },

    userPermission: {
      userPermissions: ['task.deploy'],
    },
    getDeploymentDetails: jest.fn(),
    rejectDeployment: jest.fn(),
  });
  store.dispatch = jest.fn();
});

describe('test <DeploymentTaskList>', () => {
  let wrapper: any;
  let props: any;

  beforeEach(() => {
    props = {
      onDeploy: jest.fn(),
      isDeploymentInprogress: false,
      decisionServiceInfo: { textValue: 'claims service' },
      handleDeploymentInprogressValidation: jest.fn(),
      handelDeploymentSuccessEvent: jest.fn(),
    };
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DeploymentTaskList {...props} />
        </Router>
      </Provider>
    );
  });

  it('should render DeploymentTaskList element', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should handel submit event', () => {
    act(async () => {
      await wrapper.find(DeploymentTaskList).setState({
        selectedTasks: ['1'],
      });
      wrapper.instance().onSubmit({});
      await sleep(10);
      expect(wrapper.find(Button)).toHaveLength(0);
    });
  });

  it('should handel handleCheckBoxEvent  event', () => {
    act(async () => {
      await wrapper.find(DeploymentTaskList).setState({
        selectedTasks: ['1'],
        dataSource: [
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
        ],
      });
      wrapper.instance().handleCheckBoxEvent(
        {
          target: {
            checked: true,
            id: '12',
          },
        },
        {
          rowIndex: 0,
        }
      );
      await sleep(10);
      expect(wrapper.find(Button)).toHaveLength(0);
    });
  });
});
