import moment from 'moment';
import AppConstants from '../constants/AppConstants';
import { TaskStep } from '../types';

class CommonUtil {
  static handleDateChange(event: any, formik: any): void {
    const { value } = event.target;
    let output: any = undefined;
    if (value) {
      const momentDate = moment(
        value,
        AppConstants.UI_CONSTANTS.DATE_INPUT_FORMAT,
        true
      );
      if (momentDate.isValid()) {
        output = momentDate.toDate();
      }
    }
    formik.setFieldValue(event.target.id, output, false);
  }
  static getPreviousTaskStep(taskSteps: any, activeTaskStep: any): any {
    const previousStep = taskSteps.filter(
      (taskStep: TaskStep) =>
        parseInt(taskStep.ordering) === parseInt(activeTaskStep.ordering) - 1
    );
    return previousStep[0];
  }

  static isActiveTaskType(taskTypeId: string | undefined): boolean {
    if (
      taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.BUSINESS_REQUIREMENT_UPDATE ||
      taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.NEW_BUSINESS_REQUIREMENT ||
      taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_BR_UPDATE ||
      taskTypeId ===
        AppConstants.SERVER_CONSTANTS.TASK_TYPES.DUAL_MAINTENANCE_NEW_BR
    ) {
      return true;
    }
    return false;
  }
}
export default CommonUtil;
