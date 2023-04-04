import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { getDeploymentStatuses as remoteGetDeploymentStatuses } from '../services/CommonService';
import { isEmpty } from 'lodash';

const deploymentSlice = createSlice({
  name: 'deployment',
  initialState: {
    deploymentStatuses: [],
  },
  reducers: {
    setDeploymentStatuses: (state, action) => {
      state.deploymentStatuses = action.payload.deploymentStatusList;
    },
  },
});

export const { setDeploymentStatuses } = deploymentSlice.actions;
/*************** Async actions Start **************/

export const fetchDeploymentStatusesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { deploymentStatuses } = getState().deployment;
  if (isEmpty(deploymentStatuses)) {
    remoteGetDeploymentStatuses().then((deploymentStatusList: any) => {
      dispatch(setDeploymentStatuses({ deploymentStatusList }));
    });
  }
};

/*************** Async actions END **************/

/*************** Selectors START **************/

export const getDeploymentStatuses = (state: any): any =>
  state.deployment.deploymentStatuses;
/*************** Selectors END **************/

export default deploymentSlice.reducer;
