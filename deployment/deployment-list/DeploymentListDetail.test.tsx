import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { DeploymentListDetail } from './DeploymentListDetail';
import { sleep, findById } from '../../../utils/TestUtils';
import { BrowserRouter as Router } from 'react-router-dom';
import { act } from 'react-dom/test-utils';
import RejectDeployment from '../deployment-actions/RejectDeployment';
import SignoffDeployment from '../deployment-actions/SignoffDeployment';
import { Checkbox } from '@athena/forge';
let wrapper: any;
configure({ adapter: new Adapter() });
jest.mock('../../../services/CommonService');
configure({ adapter: new Adapter() });
let store: any;
let deployment: any;
beforeEach(() => {
  deployment = {
    id: 1,
    status: 'IN PROGRESS',
    created: '03/21/2021',
    createdBy: 'jcyril',
    releaseVersion: '2.0.2',
    statusId: '3',
  };

  store = configureStore([])({
    toast: {},
    userPermission: {
      userPermissions: ['task.deploy'],
    },
  });
  store.dispatch = jest.fn();
});
describe('test Deployment List Detail>', () => {
  beforeEach(() => {
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DeploymentListDetail
            key={deployment.id}
            deploymentDetails={deployment}
            addSuccessToast={jest.fn()}
            updateDeploymentDetails={jest.fn()}
            handleDeploymentInprogressValidation={jest.fn()}
          />
        </Router>
      </Provider>
    );
  });
  it('set state and update the component', async () => {
    await act(async () => {
      await wrapper.find(DeploymentListDetail).setState({
        isExpanded: true,
        deploymentId: 1,
      });
      await sleep(10);
    });
  });

  it('should fill reject form and submit', async () => {
    await act(async () => {
      await wrapper.find(DeploymentListDetail).setState({
        isExpanded: true,
        deploymentId: 1,
      });
      await sleep(10);
      await wrapper.find(RejectDeployment).setState({
        rejectShown: true,
      });
      await sleep(10);
      findById(wrapper, 'reason').simulate('change', {
        target: { name: 'reason', value: 'areason' },
      });
      await sleep(10);
      wrapper
        .find(RejectDeployment)
        .find('.fe_c_button--primary')
        .last()
        .simulate('click');
    });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should fill verify form and submit', async () => {
    await act(async () => {
      await wrapper.find(DeploymentListDetail).setState({
        isExpanded: true,
        deploymentId: 1,
      });
      await sleep(10);
      await wrapper.find(SignoffDeployment).setState({
        showSignoff: true,
      });
      await sleep(10);
      findById(wrapper, 'releaseVersion').simulate('change', {
        target: { name: 'releaseVersion', value: '2.1' },
      });
      await sleep(10);
      wrapper
        .find(Checkbox)
        .first()
        .props()
        .onChange({ target: { name: 'signoff1', value: 'true' } });
      await sleep(10);
      wrapper
        .find(Checkbox)
        .last()
        .props()
        .onChange({ target: { name: 'signoff2', value: 'true' } });
      await sleep(10);
      wrapper
        .find(SignoffDeployment)
        .find('.fe_c_button--primary')
        .last()
        .simulate('click');
    });
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
