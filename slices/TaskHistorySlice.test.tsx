import { fetchEventDetails } from './TaskHistorySlice';
import store from '../store/store';
import { sleep } from '../utils/TestUtils';
import { TaskHistoryMockData } from '../services/__mocks__/TaskHistoryMockData';

jest.mock('../services/CommonService');

describe('task history slice testing', () => {
  it('test fetchEventDetails', async () => {
    const taskId = '50';
    fetchEventDetails(taskId)(store.dispatch);
    await sleep(10);
    expect(store.getState().taskHistory.events).toEqual(TaskHistoryMockData);
  });
});
