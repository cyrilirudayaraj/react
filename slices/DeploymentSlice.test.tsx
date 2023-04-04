import { fetchDeploymentStatusesOnce } from './DeploymentSlice';
import store from '../store/store';
import { MockData } from '../services/__mocks__/MockData';
import { sleep } from '..//utils/TestUtils';
jest.mock('../services/CommonService');

describe('create attachment slice testing', () => {
  const state = jest.fn();
  state.mockReturnValue({
    deployment: {
      deploymentStatuses: [],
    },
  });
  it('test fetchTaskTypesOnce', async () => {
    fetchDeploymentStatusesOnce()(store.dispatch, state);
    await sleep(10);
    expect(store.getState().deployment.deploymentStatuses).toEqual(
      MockData.DEPLOYMENTSTATUSES
    );
  });
});
