import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import DeploymentDetailsCompontentConnector, {
  DeploymentDetailsComponent as DeploymentDetails,
} from './DeploymentDetails';
import { BrowserRouter as Router } from 'react-router-dom';
import { DeploymentData1 } from '../../../services/__mocks__/DeploymentMockData';
import { sleep } from '../../../utils/TestUtils';
import AppConstants from '../../../constants/AppConstants';

jest.mock('../../../services/CommonService');

configure({ adapter: new Adapter() });

describe('test <DeploymentDetails>', () => {
  let wrapper: any;
  let wrappingComponent: any;
  let store: any;

  const {
    REJECTED,
    COMPLETE,
  } = AppConstants.SERVER_CONSTANTS.DEPLOYMENT_STATUSES;

  beforeEach(() => {
    store = configureStore([])({
      userPermission: {
        userPermissions: ['task.deploy'],
      },
    });
    store.dispatch = jest.fn();

    wrappingComponent = mount(
      <Provider store={store}>
        <Router>
          <DeploymentDetailsCompontentConnector deployment={DeploymentData1} />
        </Router>
      </Provider>
    );
    wrapper = wrappingComponent.find(DeploymentDetails);
  });

  it('should render DeploymentDetails element', () => {
    expect(wrappingComponent.find('.deployment-details')).toHaveLength(1);
  });

  it('should reject deployment on reject', async () => {
    wrapper.instance().onReject({ reason: 'reason' });
    await sleep(10);
    expect(wrapper.instance().state.deployment.statusId).toEqual(REJECTED);
  });

  it('should complete deployment on verify', async () => {
    const { id, version } = DeploymentData1;
    wrapper.instance().onSignoff({
      ID: id,
      RELEASEVERSION: '3.0.1',
      VERSION: version,
    });
    await sleep(10);
    expect(wrapper.instance().state.deployment.statusId).toEqual(COMPLETE);
  });
});
