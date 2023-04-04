import store from '../store/store';
import { sleep } from '../utils/TestUtils';
import { MockData } from '../services/__mocks__/MockData';
import { fetchPermissions } from './UserPermissionSlice';

jest.mock('../services/CommonService');

describe('user permission slice testing', () => {
  it('test fetchPermissions', async () => {
    fetchPermissions()(store.dispatch);
    await sleep(10);
    expect(store.getState().userPermission.userPermissions).toEqual(
      MockData.USERPERMISSIONS
    );
  });
});
