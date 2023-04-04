import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import Deployment from './Deployment';
import { DEPLOYMOCKDATA } from '../../services/__mocks__/MockData';

jest.mock('../../services/CommonService');
configure({ adapter: new Adapter() });
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
    deployment: {
      deploymentDetails: DEPLOYMOCKDATA,
      deploymentStatuses: [],
    },

    userPermission: {
      userPermissions: ['task.deploy'],
    },
    getDeploymentDetails: jest.fn(),
    rejectDeployment: jest.fn(),
  });
  store.dispatch = jest.fn();
});
describe('test <Layout>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Deployment />
      </Provider>
    );
  });
  it('should render Header element', () => {
    expect(wrapper.debug()).toMatchSnapshot();
    expect(wrapper.find(Deployment)).toHaveLength(1);
  });
});
