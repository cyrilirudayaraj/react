import { configureStore } from '@reduxjs/toolkit';
import taskReducer from '../slices/TaskSlice';
import userCommentReducer from '../slices/UserCommentSlice';
import attachmentReducer from '../slices/AttachmentSlice';
import toastReducer from '../slices/ToastSlice';
import timeEntryReducer from '../slices/TimeEntrySlice';
import validationReducer from '../slices/ValidationSlice';
import taskHistoryReducer from '../slices/TaskHistorySlice';
import userPermissionReducer from '../slices/UserPermissionSlice';
import masterDataReducer from '../slices/MasterDataSlice';
import deploymentReducer from '../slices/DeploymentSlice';
import businessRequirementReducer from '../slices/BusinessRequirementSlice';

export default configureStore({
  reducer: {
    task: taskReducer,
    userComment: userCommentReducer,
    attachment: attachmentReducer,
    toast: toastReducer,
    timeEntry: timeEntryReducer,
    validation: validationReducer,
    taskHistory: taskHistoryReducer,
    userPermission: userPermissionReducer,
    masterData: masterDataReducer,
    deployment: deploymentReducer,
    businessRequirement: businessRequirementReducer,
  },
});
