import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';

const validationSlice = createSlice({
  name: 'validation',
  initialState: {
    formInvalid: {},
  },
  reducers: {
    setFormInvalid(state, action) {
      state.formInvalid = action.payload.value;
    },
  },
});

export const { setFormInvalid } = validationSlice.actions;

export const updateFormValidation = (value: any) => (
  dispatch: Dispatch
): void => {
  dispatch(setFormInvalid({ value }));
};

export const getFormValidity = (state: any): any =>
  state.validation.formInvalid;

export default validationSlice.reducer;
