import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import {
  getTaskDetails,
  rejectTask,
  updateTask,
  transitTask,
  returnTask,
  escalateTask,
} from '../services/CommonService';
import { TaskDetail } from '../types';
import ConversionUtil from '../utils/ConversionUtil';

const initialValue = { taskSteps: [] };
const taskSlice = createSlice({
  name: 'task',
  initialState: {
    taskDetails: initialValue,
    leftSectionActive: false,
    rightSectionActive: false,
    leftSectionFormActive: false,
    rightSectionFormActive: false,
    editBtnEnable: false,
    rightDropdownVal: false,
    cancelBtnAction: false,
    nextUrl: null,
    selectedTabIndex: 0,
    dismissSuccessBanner: false,
  },
  reducers: {
    setcancelBtnAction(state, action) {
      state.cancelBtnAction = action.payload;
    },
    setTaskDetails(state, action) {
      state.taskDetails = action.payload.taskDetails;
    },
    setNextUrl(state, action) {
      state.nextUrl = action.payload;
    },
    resetNextUrl(state, action) {
      state.nextUrl = null;
    },
    updateEditBtn(state, action) {
      state.editBtnEnable = !state.editBtnEnable;
    },
    updateRightDropDownVal(state, action) {
      state.rightDropdownVal = action.payload;
    },
    updateLeftSectionFormActive(state, action) {
      state.leftSectionFormActive = action.payload;
    },
    updateRightSectionFormAction(state, action) {
      state.rightSectionFormActive = action.payload;
    },
    setLeftSectionActive(state, action) {
      state.leftSectionActive = action.payload;
      state.rightSectionActive = false;
    },
    setRightSectionActive(state, action) {
      state.rightSectionActive = action.payload;
      state.leftSectionActive = false;
    },

    resetActiveSections(state, action) {
      state.leftSectionActive = false;
      state.rightSectionActive = false;
      state.leftSectionFormActive = false;
      state.rightSectionFormActive = false;
      state.rightDropdownVal = !state.rightDropdownVal;
      state.editBtnEnable = false;
      state.nextUrl = null;
    },
    setSelectedTabIndex(state, action) {
      state.selectedTabIndex = action.payload;
    },
    setDismissSuccessBanner(state, action) {
      state.dismissSuccessBanner = action.payload;
    },
  },
});

/*************** Actions  **************/

export const {
  setTaskDetails,
  setLeftSectionActive,
  setRightSectionActive,
  resetActiveSections,
  updateRightDropDownVal,
  updateEditBtn,
  updateLeftSectionFormActive,
  updateRightSectionFormAction,
  setcancelBtnAction,
  setSelectedTabIndex,
  setNextUrl,
  resetNextUrl,
  setDismissSuccessBanner,
} = taskSlice.actions;
/*************** Actions  **************/

/*************** Async actions Start **************/

export const fetchTaskDetails = (taskId: string) => (
  dispatch: Dispatch
): void => {
  getTaskDetails(taskId).then((taskDetails) => {
    dispatch(setTaskDetails({ taskDetails }));
  });
};

export const resetTaskDetails = () => (dispatch: Dispatch): void => {
  dispatch(setTaskDetails({ taskDetails: initialValue }));
};

export const updateTaskAction = (values: any) => (
  dispatch: Dispatch
): Promise<TaskDetail> => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  return updateTask(payload).then((taskDetails) => {
    dispatch(setTaskDetails({ taskDetails }));
    dispatch(resetActiveSections({}));
    return taskDetails;
  });
};

export const transitTaskAction = (values: any) => (
  dispatch: Dispatch
): Promise<TaskDetail> => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  return transitTask(payload).then((taskDetails) => {
    dispatch(setTaskDetails({ taskDetails }));
    return taskDetails;
  });
};

export const returnTaskAction = (values: any) => (
  dispatch: Dispatch
): Promise<TaskDetail> => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  return returnTask(payload).then((taskDetails) => {
    dispatch(setTaskDetails({ taskDetails }));
    return taskDetails;
  });
};

export const rejectTaskAction = (payload: any) => (
  dispatch: Dispatch
): Promise<TaskDetail> => {
  return rejectTask(payload).then((taskDetails) => {
    dispatch(setTaskDetails({ taskDetails }));
    dispatch(resetActiveSections({}));
    return taskDetails;
  });
};

export const escalateTaskAction = (payload: any) => (
  dispatch: Dispatch
): void => {
  escalateTask(payload).then((taskDetails) => {
    dispatch(setTaskDetails({ taskDetails }));
    dispatch(resetActiveSections({}));
  });
};

export const setRightDropdownVal = (payload: any) => (
  dispatch: Dispatch
): void => {
  dispatch(updateRightDropDownVal(payload));
};
export const updateEditBtnAction = (payload: any) => (
  dispatch: Dispatch
): void => {
  dispatch(updateEditBtn({ payload }));
};
export const setLeftFormAction = (payload: any) => (
  dispatch: Dispatch
): void => {
  dispatch(updateLeftSectionFormActive(payload));
};
export const setRightFormAction = (payload: any) => (
  dispatch: Dispatch
): void => {
  dispatch(updateRightSectionFormAction(payload));
};
export const setLeftSectionActiveAction = (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setLeftSectionActive(payload));
};
export const setDismissSuccessBannerAction = (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setDismissSuccessBanner(payload));
};
export const resetPopupActions = (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(resetActiveSections({}));
};
export const resetcancelBtnAction = (payload?: any) => (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setcancelBtnAction(payload));
};
export const refreshTaskList = (taskDetails?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setTaskDetails({ taskDetails }));
};
export const setRightSectionSelectedTabIndex = (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setSelectedTabIndex(payload));
};

export const setNextUrlAction = (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setNextUrl(payload));
};
export const resetNextUrlAction = (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(resetNextUrl(payload));
};

export const setRightSectionActiveAction = (payload?: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setRightSectionActive(payload));
};

/*************** Async actions END **************/

/*************** Selectors START **************/

export const getTaskDetail = (state: any): TaskDetail => state.task.taskDetails;
export const getLeftSectionActive = (state: any): boolean =>
  state.task.leftSectionActive;
export const getRightSectionActive = (state: any): boolean =>
  state.task.rightSectionActive;
export const getEditBtnValue = (state: any): boolean =>
  state.task.editBtnEnable;
export const getLeftFormAction = (state: any): boolean =>
  state.task.leftSectionFormActive;
export const getRightFormAction = (state: any): boolean =>
  state.task.rightSectionFormActive;
export const getRightDropdownVal = (state: any): boolean =>
  state.task.rightDropdownVal;
export const getCancelBtnAction = (state: any): boolean =>
  state.task.cancelBtnAction;
export const getRightSectionSelectedTabIndex = (state: any): boolean =>
  state.task.selectedTabIndex;
export const getNextUrl = (state: any): boolean => state.task.nextUrl;
export const getDismissSuccessBanner = (state: any): boolean =>
  state.task.dismissSuccessBanner;
/*************** Selectors END **************/
export default taskSlice.reducer;
