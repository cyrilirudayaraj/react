import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';

import { getBusinessRequirementDetails } from '../services/CommonService';

const initialValue = {
  legacyRuleId: '',
  rules2TransformationStatusId: '',
  rules2TransformationStatus: '',
  ruleEngineId: '',
  name: '',
  ruleReportingCategoryId: '',
  ruleReportingCategoryName: '',
  description: '',
  internalFixText2: '',
  ruleTypeId: '',
  ruleType: '',
  internalFixText1: '',
  localRuleUseCaseId: '',
  localRuleUseCaseName: '',
  contextId: '',
  contextName: '',
  id: '',
  visitRuleDisplayLocationId: '',
  visitRuleDisplayLocation: '',
  businessRequirementTypeId: '',
  businessRequirementType: '',
};
const businessRequirementSlice = createSlice({
  name: 'businessRequirement',
  initialState: {
    businessRequirementDetails: initialValue,
  },
  reducers: {
    setBusinessRequirementDetails(state, action) {
      state.businessRequirementDetails =
        action.payload.businessRequirementDetails;
    },
  },
});

/*************** Actions  **************/

export const {
  setBusinessRequirementDetails,
} = businessRequirementSlice.actions;
/*************** Actions  **************/

/*************** Async actions Start **************/

export const fetchBusinessRequirementDetails = (brId: string) => (
  dispatch: Dispatch
): void => {
  getBusinessRequirementDetails(brId).then((businessRequirementDetails) => {
    dispatch(setBusinessRequirementDetails({ businessRequirementDetails }));
  });
};

export const resetBusinessRequirementDetails = () => (
  dispatch: Dispatch
): void => {
  dispatch(
    setBusinessRequirementDetails({ businessRequirementDetails: initialValue })
  );
};

/*************** Selectors START **************/

export const getBusinessRequirementDetail = (state: any): any =>
  state.businessRequirement.businessRequirementDetails;

/*************** Selectors END **************/
export default businessRequirementSlice.reducer;
