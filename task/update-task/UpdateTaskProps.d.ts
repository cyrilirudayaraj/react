import { TaskDetail } from '../../../types';
import { FormikProps } from 'formik';

export interface UpdateTaskProps {
  task?: TaskDetail;
  updateTaskAction?: fn;
  transitTaskAction?: fn;
  returnTaskAction?: fn;
}

export interface UpdateTaskLeftPaneProps extends UpdateTaskProps {
  history: any;
  addSuccessToast?: fn;
  leftSectionActive?: boolean;
  rightSectionActive: boolean;
  resetcancelBtnAction?: any;
  setLeftSectionActiveAction?: fn;
  shouldBlockNavigation?: any;
  checkFormDiff?: any;
  editBtnClick?: fn;
  getEditBtnValue?: any;
  updateEditBtnAction?: any;
  editBtnValue?: any;
  leftFormFlag?: any;
  setLeftFormAction?: fn;
  setRightFormAction?: fn;
  setRightSectionActive?: fn;
  resetPopupActions?: fn;
  selectedTabIndex?: fn;
  fetchUserCommentDetails?: fn;
  fetchEventDetails?: fn;
  nextUrl?: any;
  resetNextUrlAction: fn;
  refreshTaskList: fn;
  dismissSuccessBanner: boolean;
  setDismissSuccessBannerAction: fn;
}
export interface UpdateTaskRightPaneProps {
  editBtnClick?: any;
  editBtnClick?: any;
  leftSectionActive?: any;
  rightSectionActive?: any;
  setLeftFormAction?: fn;
  setRightFormAction?: fn;
  setRightDropdownVal?: fn;
  dropdownVal?: any;
  setRightSectionSelectedTabIndex?: fn;
  commentId: any;
  taskId: any;
  resetCommentId?: fn;
}

export interface UpdateTaskRightPaneProps {
  rightPaneFormvalidity: any;
}

export interface TaskBasicDetailProps extends UpdateTaskProps {
  task?: TaskDetail;
  formik: FormikProps<any>;
  onSave?: fn;
  onReturn?: fn;
  mandatoryFields?: any;
}

export interface UpdateTaskFooterProps extends TaskBasicDetailProps {
  onSave: (formik: FormikProps<any>) => void;
  onTransition: fn;
  setSelectedIndex: fn;
  addAttentionToast?: fn;
  rejectTaskAction?: fn;
  escalateTaskAction?: fn;
  updateFormValidation?: fn;
  resetPopupActions?: fn;
  rightSectionActive?: any;
  setRightFormAction?: any;
  selectedTabIndex?: fn;
  fetchEventDetails?: fn;
  setDismissSuccessBannerAction?: fn;
}

export interface UpdateTaskOverviewProps extends UpdateTaskProps {
  toggleEditButton: fn;
  updateTaskAction?: fn;
  addSuccessToast?: fn;
  setRightSectionActiveAction?: fn;
  leftSectionActive?: boolean;
  rightSectionActive: boolean;
  resetcancelBtnAction?: any;
  editBtnValue?: any;
  leftFormFlag?: any;
  setLeftFormAction?: fn;
  setLeftSectionActive?: fn;
  rightFormFlag?: any;
  setRightFormAction?: fn;
  popupShown?: any;
  resetPopupActions?: any;
  toggleReset?: fn;
  addMandatoryFields?: any;
  nextUrl?: any;
  resetNextUrlAction?: any;
  history?: any;
  users?: any[];
  originatingSystems?: any[];
  fetchUsersOnce?: any;
  fetchOriginatingSytemsOnce?: any;
  departmentOrigins?: any[];
  brUpdateReasons?: any[];
  fetchDepartmentOriginsOnce?: any;
  fetchBRUpdateReasonsOnce?: any;
}

export interface RejectTaskProps {
  id: string | undefined;
  version: string | undefined;
  rejectionReasonId?: any;
  rejectionReasonNote?: any;
}

export interface EscalateTaskProps {
  id: string | undefined;
  version: string | undefined;
  escalatedyn: string | undefined;
}

export interface TaskTestingDetailProps extends UpdateTaskProps {
  formik: FormikProps<any>;
  mandatoryFields?: any;
  task?: TaskDetail;
}
