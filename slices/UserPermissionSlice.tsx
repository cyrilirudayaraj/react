import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import { getUserPermissions } from '../services/CommonService';

const userPermissionSlice = createSlice({
  name: 'userPermission',
  initialState: {
    userPermissions: [],
  },
  reducers: {
    setPermissions(state, action) {
      state.userPermissions = action.payload.permissions;
    },
  },
});

export const { setPermissions } = userPermissionSlice.actions;

export const fetchPermissions = () => (dispatch: Dispatch): void => {
  getUserPermissions().then((permissions) => {
    dispatch(setPermissions({ permissions }));
  });
};

export const getPermissions = (state: any): string[] =>
  state.userPermission.userPermissions;

export default userPermissionSlice.reducer;
