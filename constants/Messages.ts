import { template } from 'lodash';

const Messages = {
  INVALID: 'Invalid!',
  QUESTION_MARK: '?',
  DUPLICATE_ENTRY: 'Duplicate entry!',
  NO_RECORDS_FOUND: 'No records found..',
  RECORDS_FOUND: ' items found',
  EMPTY_TASK_INBOX: 'No tasks assigned to you.',
  DELETE_DT_MSG: 'This action cannot be undone.',
  VALIDATION_FAILED: 'Validation failed',
  DUE_DATE_MANDATORY: 'Internal Due Date is required',
  JIRA_ID_MANDATORY: 'JIRA Id is mandatory',
  DEPLOYMENT_DATE_MANDATORY: 'Deployment Date is mandatory',
  RRC_EDIT_MSG: "Return task to 'Analyze Task' step to edit this field.",
  ESCALATED_P0_TASK: 'Escalated P0 Task',
  DISABLE_CONSECUTIVE_SIGNOFF:
    'You cannot sign-off on this step since you signed off on the previous step',
  CONSECUTIVE_SIGNOFF_HEADER_MESSAGE: 'Sign-off error',
  P0_TASK: 'P0 Task',
  ESCALATED_TASK: 'Escalated Task',
  DT_VALIDATION_MSG: {
    MODEL_BRANCH_URL: 'Enter DFM Branch Url.',
    DT_BRANCH_URL: 'Enter ODM Branch Link.',
    MODEL_NAME: 'Enter Model Name.',
    REF_ID: 'Enter Decision Table ID.',
    REF_ID_LENGTH: 'Maximum characters are 6.',
    NAME: 'Enter Decision Table Name.',
    DESCRIPTION: 'Enter Decision Table Change Description.',
    REF_URL: 'Enter Decision Table Link.',
    DT_REQUIRED:
      'Please complete the fields for at least one Decision Table change.',
  },
  NO_CPC_CODER: 'is a coding task and needs to be signed off by a CPC coder.',
  TASK_NOT_SUBMITTED: 'Task Not Submitted',
  TASK_TYPES_NOT_ACTIVE:
    'This Task Type is not active. Please update the Task Type to "New BR/BR Update/Dual Update" to proceed',
  REPORT: {
    INVALID_DATE_RANGE:
      'Invalid date range. Select a date range one year or less',
    GREATER_DATE: 'Start Date is greater than End date',
  },
  CREATE_TASK_SUCCESS: {
    HEADER: template('T-${id} created!'),
    MESSAGE: template('This task was created and assigned to ${username}.'),
  },
  UPDATE_TASK_SUCCESS: {
    HEADER: template('T-${id} saved!'),
    MESSAGE: 'All changes were saved.',
  },
  UPDATE_TASK_OVERVIEW_SUCCESS: {
    HEADER: template('T-${id} saved!'),
    MESSAGE: 'All changes were saved for the overview tab.',
  },
  RETURN_TASK_SUCCESS: {
    HEADER: template('Task returned!'),
    MESSAGE: template("Task was returned to '${returnStep}' step."),
  },
  SIGNOFF_TASK_SUCCESS: {
    HEADER: template('Task signed-off!'),
    MESSAGE: template(
      "'${currentStep}' step was signed-off and sent to '${nextStep}' step."
    ),
  },
  DEPLOYMENT_SIGNOFF_SUCCESS: {
    HEADER: template('T-${id} in production!'),
    MESSAGE: 'Deployment is complete and task is in production.',
  },
  WORK_LOG_VALIDATION_FAILURE: {
    HEADER: 'Work Log entry is required',
    SIGNOFF_MESSAGE:
      'You must have at least one work log entry before signing off on this step.',
    RETURN_MESSAGE:
      'You must have at least one work log entry before returning to this step.',
  },
  BUSINESS_REQUIREMENT_DETAIL_BANNER:
    'Edits to these fields will not update the business requirement associated fields until this task is in production.',
  BUSINESS_REQUIREMENT_REQUIRED: 'Invalid business requirement',
  MSG_REQUIRED: 'Required!',
  CHAR_LIMIT_EXCEED: 'Character limit exceeded!',
  LEGACY_RULE_ID_EXISTS: 'Associated 1.0 Rule ID already exists!',
  INVALID_LEGACY_RULE_ID: 'Invalid Associated 1.0 Rule ID.',
  TASK_EXIST_FOR_BUSINESS_REQUIREMENT: template(
    "This business requirement is being updated in task ${taskId} (current step:${activeStepName}). \n You can ${action} this task, but you can't advance this task ${taskId} until is in production."
  ),
  TASK_IN_PRODUCTION_BANNER_MSG:
    "This task is in production and can't be edited.",
  TASK_REJECTED_BANNER_MSG: "This task is rejected and can't be edited.",
  TASK_BLOCKED_BANNER_MSG:
    'Please click on submit again since the Auto-generated Rule Tracker task creation has failed.',
  NO_RELATED_TASKS: 'No related tasks or dependencies for this task.',
  TASK_DEPENDENCY_INVALID_SCOPE:
    'The related task cannot be added since T-${value} has moved beyond Test Changes workflow step.',
  COMPLETE_DEPENDENCY_MESSAGE:
    'Complete dependency before signing off on this step.',
  ODM_DEPLOY: {
    REASON_MAX_LENGTH: 'Reason must be at most 500 characters!',
  },
  REJECT_TASK_SUCCESS: {
    HEADER: template('D-${id} rejected!'),
    MESSAGE: 'All changes were saved.',
  },
  DEPLOYMENT_SUCCESS: {
    HEADER: template('D-${id} deployed in ${envname}!'),
    MESSAGE: 'All changes were saved.',
  },
  DEPLOYMENT_FAILURE: {
    HEADER: template('D-${id} deployment failed in ${envname}!'),
    MESSAGE: 'View logs for more details.',
  },
  ARCHIVED_RULE: `This rule has been archived in 1.0. Please change task type to 'Business Requirement Update'.`,
  NOT_ARCHIVED_RULE:
    'This business requirement has not been archived in 1.0. Please change task type to ‘Dual Maintenance’.',
  RULES_MIGRATION: {
    NO_RECORDS_FOUND: 'No records found!',
    RULE_ID_MISSING: 'Rule ID is missing.',
    MODELING_DATE_MISSING: 'Modeling Date is missing.',
    DUAL_MAINTENANCE_DATE_MISSING: 'Dual Maintenance Start Date is missing.',
    BACKWARD_COMPATIBILITY_DATE_MISSING:
      'Backward Compatibility Start Date is missing.',
    IMPORT_FAILURE: 'Import Failure',
    IMPORT_SUCCESS: 'Import Success',
    IMPORT_SUCCESS_MESSAGE: 'Rules are migrated successfully',
    DELETE_SUCCESS: 'Delete Success',
    DELETE_FAILURE: 'Delete Failure',
    DELETE_POPUP_HEADER: 'Are you sure you want to delete?',
    DELETE_POPUP_MSG: ' record(s) will be deleted.',
    NO_RECORDS_SELECTED: 'No records selected',
    UPDATE_SUCCESS: 'Updated Successfully',
    UPDATE_FAILURE: 'Update Failed',
    MOVE_TO_POPUP_HEADER:
      'Are you sure you want to move these rules to next phase?',
    UPDATE_POPUP: ' record(s) will be updated.',
    REVIEWED_BY_REQUIRED: 'Reviewed by cannot be empty',
    CONTEXT_ID_REQUIRED: 'Context Id cannot be empty',
    RULE_ID_REQUIRED: 'Rule Id cannot be empty',
    ADD_SUCCESS: 'Add operation is successful',
    ADD_FAILURE: 'Add operation is unsuccessful',
  },
  RT_TASK_CREATION_FAILURE:
    'There was an issue creating RT task for backward compatibility. Please retry.',
  RT_TASK_CREATION_SUCCESS: 'created successfully for backward compatibility.',
  RT_TASK_IN_PROGRESS:
    'RT task is being created to support backward compatibility. This may take a few minutes.',
  PRIORITY_POLICY_CRITERIA_MESSAGE:
    'Tasks within the rules queue will be prioritized and targeted for completion according to the following criteria.',
};

export default Messages;
