import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import {
  getTimeEntryLogs,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
} from '../services/CommonService';
import { TimeEntry } from '../types';
import ConversionUtil from '../utils/ConversionUtil';

const timeEntrySlice = createSlice({
  name: 'timeEntry',
  initialState: {
    timeEntryLogs: [],
  },
  reducers: {
    setTimeEntryLogs(state, action) {
      state.timeEntryLogs = action.payload.timeEntryLogs;
    },
  },
});

export const { setTimeEntryLogs } = timeEntrySlice.actions;

export const fetchTimeEntryLogs = (taskId: string) => (
  dispatch: Dispatch
): void => {
  getTimeEntryLogs(taskId).then((timeEntryLogs) => {
    dispatch(setTimeEntryLogs({ timeEntryLogs }));
  });
};

export const createTimeEntryLog = (values: any) => (
  dispatch: Dispatch
): void => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  createTimeEntry(payload).then((timeEntryLogs) => {
    dispatch(setTimeEntryLogs({ timeEntryLogs }));
  });
};

export const updateTimeEntryLog = (values: any) => (
  dispatch: Dispatch
): void => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  updateTimeEntry(payload).then((timeEntryLogs) => {
    dispatch(setTimeEntryLogs({ timeEntryLogs }));
  });
};

export const deleteTimeEntryLog = (values: any) => (
  dispatch: Dispatch
): void => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  deleteTimeEntry(payload).then((timeEntryLogs) => {
    dispatch(setTimeEntryLogs({ timeEntryLogs }));
  });
};

export const getWorkLogs = (state: any): TimeEntry[] =>
  state.timeEntry.timeEntryLogs;

export default timeEntrySlice.reducer;
