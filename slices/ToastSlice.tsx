/* eslint-disable no-plusplus */
import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { ToastMessage } from '../types';

export interface ToastPayload {
  id: number;
  headerText?: string | '';
  message?: string;
  alertType: 'attention' | 'info' | 'success';
}

let lastId = 0;
const initialState: ToastPayload[] = [];

const toastSlice = createSlice({
  name: 'toast',
  initialState,
  reducers: {
    add(toasts, action) {
      toasts[0] = {
        ...action.payload,
        id: ++lastId,
      };
    },
    remove(toasts, action) {
      const index = toasts.findIndex((toast) => toast.id === action.payload.id);
      toasts.splice(index, 1);
    },
  },
});

export const { add, remove } = toastSlice.actions;

export const addSuccessToast = (value: ToastMessage) => (
  dispatch: Dispatch
): void => {
  const { headerText, message, params } = value;
  dispatch(
    add({
      alertType: 'success',
      headerText,
      message,
      params,
    })
  );
};

export const addAttentionToast = (value: ToastMessage) => (
  dispatch: Dispatch
): void => {
  const { headerText, message, params } = value;
  dispatch(
    add({
      alertType: 'attention',
      headerText,
      message,
      params,
    })
  );
};

export const removeToast = (id: number) => (dispatch: Dispatch): void => {
  dispatch(remove(id));
};

export default toastSlice.reducer;
