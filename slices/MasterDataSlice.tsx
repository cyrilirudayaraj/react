import { createSlice, Dispatch } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import {
  getConfigs as remoteGetConfigs,
  getUsers as remoteGetUsers,
  getPriorities as remoteGetPriorities,
  getPrioritiesWithSla as remoteGetPrioritiesWithSla,
  getPriorityReasons as remoteGetPriorityReasons,
  getWorkFlowSteps as remoteGetWorkflowSteps,
  getStatus as remoteGetStatusList,
  getTaskTypes as remoteGetTaskTypes,
  getOriginatingSystems as remoteGetOriginatingSystems,
  getDepartmentOrigins as remoteGetDepartmentOrigins,
  getBusinessRequirementTypes as remoteGetBusinessRequirementTypes,
  getRuleReportingCategories as remoteGetRuleReportingCategories,
  getLocalRuleUseCaseList as remoteGetLocalRuleUseCaseList,
  getRuleEngines as remoteGetRuleEngines,
  getRuleTypes as remoteGetRuleTypes,
  getScrubTypes as remoteGetScrubTypes,
  getVisitRuleDisplayLocations as remoteGetVisitRuleDisplayLocations,
  getAttachmentTypes as remoteGetAttachmentTypes,
  getDependencySystems as remoteGetDependencySystems,
  getReportTypes as remoteGetReportTypes,
  getBRUpdateReasons as remoteGetBRUpdateReasons,
  getRejectionReasons as remoteGetRejectionReasons,
} from '../services/CommonService';

const masterDataSlice = createSlice({
  name: 'masterData',
  initialState: {
    configs: [],
    users: [],
    priorities: [],
    priorityReasons: [],
    prioritiesWithSla: [],
    workflowSteps: [],
    statusList: [],
    taskTypes: [],
    originatingSystems: [],
    businessRequirementTypes: [],
    ruleReportingCategories: [],
    localRuleUseCaseList: [],
    departmentOrigins: [],
    ruleEngines: [],
    ruleTypes: [],
    visitRuleDisplayLocations: [],
    attachmentTypes: [],
    dependencySystems: [],
    reportTypes: [],
    brUpdateReasons: [],
    scrubTypes: [],
    rejectionReasons: [],
  },
  reducers: {
    setConfigs: (state, action) => {
      state.configs = action.payload.configs;
    },
    setUsers: (state, action) => {
      state.users = action.payload.users;
    },
    setPriorities: (state, action) => {
      state.priorities = action.payload.priorities;
    },
    setPrioritiesWithSla: (state, action) => {
      state.prioritiesWithSla = action.payload.prioritiesWithSla;
    },
    setPriorityReasons: (state, action) => {
      state.priorityReasons = action.payload.priorityReasons;
    },
    setWorkflowSteps: (state, action) => {
      state.workflowSteps = action.payload.workflowSteps;
    },
    setStatusList: (state, action) => {
      state.statusList = action.payload.statusList;
    },
    setTaskTypes: (state, action) => {
      state.taskTypes = action.payload.taskTypes;
    },
    setScrubTypes: (state, action) => {
      state.scrubTypes = action.payload.scrubTypes;
    },
    setOriginatingSytems: (state, action) => {
      state.originatingSystems = action.payload.originatingSystems;
    },
    setBusinessRequirementTypes: (state, action) => {
      state.businessRequirementTypes = action.payload.businessRequirementTypes;
    },
    setRuleReportingCategories: (state, action) => {
      state.ruleReportingCategories = action.payload.ruleReportingCategories;
    },
    setLocalRuleUseCaseList: (state, action) => {
      state.localRuleUseCaseList = action.payload.localRuleUseCaseList;
    },
    setDepartmentOrigins: (state, action) => {
      state.departmentOrigins = action.payload.departmentOrigins;
    },
    setRuleEngines: (state, action) => {
      state.ruleEngines = action.payload.ruleEngines;
    },
    setRuleTypes: (state, action) => {
      state.ruleTypes = action.payload.ruleTypes;
    },
    setVisitRuleDisplayLocations: (state, action) => {
      state.visitRuleDisplayLocations =
        action.payload.visitRuleDisplayLocations;
    },
    setAttachmentTypes: (state, action) => {
      state.attachmentTypes = action.payload.attachmentTypes;
    },
    setDependencySystems: (state, action) => {
      state.dependencySystems = action.payload.dependencySystems;
    },
    setReportTypes: (state, action) => {
      state.reportTypes = action.payload.reportTypes;
    },
    setBRUpdateReasons: (state, action) => {
      state.brUpdateReasons = action.payload.brUpdateReasons;
    },
    setRejectionReasons: (state, action) => {
      state.rejectionReasons = action.payload.rejectionReasons;
    },
  },
});

export const {
  setConfigs,
  setUsers,
  setPriorities,
  setPrioritiesWithSla,
  setPriorityReasons,
  setWorkflowSteps,
  setStatusList,
  setTaskTypes,
  setScrubTypes,
  setOriginatingSytems,
  setBusinessRequirementTypes,
  setRuleReportingCategories,
  setLocalRuleUseCaseList,
  setRuleEngines,
  setRuleTypes,
  setVisitRuleDisplayLocations,
  setDepartmentOrigins,
  setAttachmentTypes,
  setDependencySystems,
  setReportTypes,
  setBRUpdateReasons,
  setRejectionReasons,
} = masterDataSlice.actions;
/*************** Async actions Start **************/

export const fetchConfigsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { configs } = getState().masterData;
  if (isEmpty(configs)) {
    remoteGetConfigs().then((configs) => {
      dispatch(setConfigs({ configs }));
    });
  }
};

export const fetchUsersOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { users } = getState().masterData;
  if (isEmpty(users)) {
    remoteGetUsers().then((users) => {
      dispatch(setUsers({ users }));
    });
  }
};

export const fetchPrioritiesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { priorities } = getState().masterData;
  if (isEmpty(priorities)) {
    remoteGetPriorities().then((priorities) => {
      dispatch(setPriorities({ priorities }));
    });
  }
};

export const fetchRejectionReasonsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { rejectionReasons } = getState().masterData;
  if (isEmpty(rejectionReasons)) {
    remoteGetRejectionReasons().then((rejectionReasons) => {
      dispatch(setRejectionReasons({ rejectionReasons }));
    });
  }
};

export const fetchPriorityReasonsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { priorityReasons } = getState().masterData;
  if (isEmpty(priorityReasons)) {
    remoteGetPriorityReasons().then((priorityReasons) => {
      dispatch(setPriorityReasons({ priorityReasons }));
    });
  }
};

export const fetchPrioritiesWithSla = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  remoteGetPrioritiesWithSla().then((prioritiesWithSla) => {
    const response: any[] = [];
    prioritiesWithSla.forEach((priority: any) => {
      const { description, ...rest } = priority;
      const descriptions = description ? description.split('|') : [];
      response.push({
        ...rest,
        description1: descriptions[0],
        description2: descriptions[1],
      });
    });
    dispatch(setPrioritiesWithSla({ prioritiesWithSla: response }));
  });
};

export const fetchWorkflowStepsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { workflowSteps } = getState().masterData;
  if (isEmpty(workflowSteps)) {
    remoteGetWorkflowSteps().then((workflowSteps) => {
      dispatch(setWorkflowSteps({ workflowSteps }));
    });
  }
};

export const fetchStatusListOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { statusList } = getState().masterData;
  if (isEmpty(statusList)) {
    remoteGetStatusList().then((statusList) => {
      dispatch(setStatusList({ statusList }));
    });
  }
};

export const fetchTaskTypesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { taskTypes } = getState().masterData;
  if (isEmpty(taskTypes)) {
    remoteGetTaskTypes().then((taskTypes) => {
      dispatch(setTaskTypes({ taskTypes }));
    });
  }
};

export const fetchScrubTypesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { scrubTypes } = getState().masterData;
  if (isEmpty(scrubTypes)) {
    remoteGetScrubTypes().then((scrubTypes) => {
      dispatch(setScrubTypes({ scrubTypes }));
    });
  }
};

export const fetchOriginatingSytemsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { originatingSystems } = getState().masterData;
  if (isEmpty(originatingSystems)) {
    remoteGetOriginatingSystems().then((originatingSystems) => {
      dispatch(setOriginatingSytems({ originatingSystems }));
    });
  }
};

export const fetchBusinessRequirementTypesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { businessRequirementTypes } = getState().masterData;
  if (isEmpty(businessRequirementTypes)) {
    remoteGetBusinessRequirementTypes().then((businessRequirementTypes) => {
      dispatch(setBusinessRequirementTypes({ businessRequirementTypes }));
    });
  }
};

export const fetchRuleReportingCategoriesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { ruleReportingCategories } = getState().masterData;
  if (isEmpty(ruleReportingCategories)) {
    remoteGetRuleReportingCategories().then((ruleReportingCategories) => {
      dispatch(setRuleReportingCategories({ ruleReportingCategories }));
    });
  }
};

export const fetchLocalRuleUseCaseListOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { localRuleUseCaseList } = getState().masterData;
  if (isEmpty(localRuleUseCaseList)) {
    remoteGetLocalRuleUseCaseList().then((localRuleUseCaseList) => {
      dispatch(setLocalRuleUseCaseList({ localRuleUseCaseList }));
    });
  }
};

export const fetchDepartmentOriginsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { departmentOrigins } = getState().masterData;
  if (isEmpty(departmentOrigins)) {
    remoteGetDepartmentOrigins().then((departmentOrigins) => {
      dispatch(setDepartmentOrigins({ departmentOrigins }));
    });
  }
};

export const fetchRuleEnginesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { ruleEngines } = getState().masterData;
  if (isEmpty(ruleEngines)) {
    remoteGetRuleEngines().then((ruleEngines) => {
      dispatch(setRuleEngines({ ruleEngines }));
    });
  }
};

export const fetchRuleTypesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { ruleTypes } = getState().masterData;
  if (isEmpty(ruleTypes)) {
    remoteGetRuleTypes().then((ruleTypes) => {
      dispatch(setRuleTypes({ ruleTypes }));
    });
  }
};

export const fetchVisitRuleDisplayLocationsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { visitRuleDisplayLocations } = getState().masterData;
  if (isEmpty(visitRuleDisplayLocations)) {
    remoteGetVisitRuleDisplayLocations().then((visitRuleDisplayLocations) => {
      dispatch(setVisitRuleDisplayLocations({ visitRuleDisplayLocations }));
    });
  }
};

export const fetchAttachmentTypesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { attachmentTypes } = getState().masterData;
  if (isEmpty(attachmentTypes)) {
    remoteGetAttachmentTypes().then((attachmentTypes) => {
      dispatch(setAttachmentTypes({ attachmentTypes }));
    });
  }
};

export const fetchDependencySystemsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { dependencySystems } = getState().masterData;
  if (isEmpty(dependencySystems)) {
    remoteGetDependencySystems().then((dependencySystems) => {
      dispatch(setDependencySystems({ dependencySystems }));
    });
  }
};

export const fetchReportTypesOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { reportTypes } = getState().masterData;
  if (isEmpty(reportTypes)) {
    remoteGetReportTypes().then((reportTypes) => {
      dispatch(setReportTypes({ reportTypes }));
    });
  }
};

export const fetchBRUpdateReasonsOnce = () => (
  dispatch: Dispatch,
  getState: any
): void => {
  const { brUpdateReasons } = getState().masterData;
  if (isEmpty(brUpdateReasons)) {
    remoteGetBRUpdateReasons({ includeTaskTypes: 1 }).then(
      (brUpdateReasons) => {
        dispatch(setBRUpdateReasons({ brUpdateReasons }));
      }
    );
  }
};

/*************** Async actions END **************/

/*************** Selectors START **************/

export const getConfigs = (state: any): any => state.masterData.configs;

export const getConfigInfo = (state: any, name: string): any => {
  return state.masterData.configs?.find(
    (config: { name: string }) => config.name === name
  );
};

export const getUsers = (state: any): any => state.masterData.users;

export const getPriorities = (state: any): any => state.masterData.priorities;

export const getPrioritiesWithSla = (state: any): any =>
  state.masterData.prioritiesWithSla;

export const getPriorityReasons = (state: any): any =>
  state.masterData.priorityReasons;

export const getWorkflowSteps = (state: any): any =>
  state.masterData.workflowSteps;

export const getStatusList = (state: any): any => state.masterData.statusList;

export const getTaskTypes = (state: any): any => state.masterData.taskTypes;

export const getScrubTypes = (state: any): any => state.masterData.scrubTypes;

export const getOriginatingSystems = (state: any): any =>
  state.masterData.originatingSystems;

export const getBusinessRequirementTypes = (state: any): any =>
  state.masterData.businessRequirementTypes;

export const getRuleReportingCategories = (state: any): any =>
  state.masterData.ruleReportingCategories;

export const getLocalRuleUseCaseList = (state: any): any =>
  state.masterData.localRuleUseCaseList;

export const getDepartmentOrigins = (state: any): any =>
  state.masterData.departmentOrigins;

export const getRuleEngines = (state: any): any => state.masterData.ruleEngines;

export const getRuleTypeList = (state: any): any => state.masterData.ruleTypes;

export const getVisitRuleDisplayLocationList = (state: any): any =>
  state.masterData.visitRuleDisplayLocations;

export const getAttachmentTypes = (state: any): any =>
  state.masterData.attachmentTypes;

export const getDependencySystems = (state: any): any =>
  state.masterData.dependencySystems;

export const getReportTypes = (state: any): any => state.masterData.reportTypes;

export const getBRUpdateReasons = (state: any): any =>
  state.masterData.brUpdateReasons;

export const getRejectionReasons = (state: any): any =>
  state.masterData.rejectionReasons;

/*************** Selectors END **************/

export default masterDataSlice.reducer;
