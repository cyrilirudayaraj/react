import store from '../store/store';
import { MockData } from '../services/__mocks__/MockData';
import { sleep } from '../utils/TestUtils';
import {
  createTimeEntryLog,
  deleteTimeEntryLog,
  fetchTimeEntryLogs,
  updateTimeEntryLog,
} from './TimeEntrySlice';

jest.mock('../services/CommonService');

describe('time entry slice testing', () => {
  it('test fetchTimeEntryLogs', async () => {
    const taskId = '2093';
    fetchTimeEntryLogs(taskId)(store.dispatch);
    await sleep(10);
    expect(store.getState().timeEntry.timeEntryLogs).toEqual(
      MockData.TIMEENTRYLOGS
    );
  });

  it('test createTimeEntryLog', async () => {
    const values = {
      id: undefined,
      spentOn: '03/29/2021',
      spentTimeInMins: 45,
      taskId: '2093',
      taskStepId: '14653',
      version: undefined,
      workflowStepId: '1',
    };
    createTimeEntryLog(values)(store.dispatch);
    await sleep(10);
    expect(store.getState().timeEntry.timeEntryLogs).toEqual(
      MockData.TIMEENTRYLOGS
    );
  });

  it('test updateTimeEntryLog', async () => {
    const values = {
      id: '14817',
      spentOn: '03/29/2021',
      spentTimeInMins: 30,
      taskId: '2093',
      taskStepId: '14653',
      version: '1',
      workflowStepId: '1',
    };
    updateTimeEntryLog(values)(store.dispatch);
    await sleep(10);
    expect(store.getState().timeEntry.timeEntryLogs).toEqual(
      MockData.TIMEENTRYLOGS
    );
  });

  it('test deleteTimeEntryLog', async () => {
    const values = {
      deleted: '03/30/2021',
      id: '14817',
      taskId: '2093',
      version: '2',
    };
    deleteTimeEntryLog(values)(store.dispatch);
    await sleep(10);
    expect(store.getState().timeEntry.timeEntryLogs).toEqual([]);
  });
});
