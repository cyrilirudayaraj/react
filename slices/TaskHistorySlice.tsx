import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { getTaskHistory } from '../services/CommonService';
import { AuditEvent } from '../types';
const taskHistorySlice = createSlice({
  name: 'taskHistory',
  initialState: {
    events: [],
  },
  reducers: {
    setEvents(state, action) {
      state.events = action.payload.events;
    },
  },
});

export const { setEvents } = taskHistorySlice.actions;

export const fetchEventDetails = (taskId: string) => (
  dispatch: Dispatch
): void => {
  getTaskHistory(taskId).then((events) => {
    dispatch(setEvents({ events }));
  });
};

export const getEventDetail = (state: any): AuditEvent =>
  state.taskHistory.events;

export default taskHistorySlice.reducer;
