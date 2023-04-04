import Labels from '../../../constants/Labels';
import StringUtil from '../../../utils/StringUtil';

const DualMaintenanceTableConf = {
  COLUMNS: [
    {
      key: 'contextId',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.CONTEXT_ID,
      numeric: true,
      sortable: true,
    },
    {
      key: 'ruleId',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.RULE_ID,
      numeric: true,
      sortable: true,
    },
    {
      key: 'businessRequirementId',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.BR_ID,
      sortable: { reducer: (brId: any) => parseInt(brId) },
      template: StringUtil.formatBRID,
    },
    {
      key: 'dualMaintStartDate',
      displayName:
        Labels.RULES_MIGRATION.TABLE_HEADERS.DUAL_MAINTENANCE_START_DATE,
    },
    {
      key: 'dualMaintRtTaskId',
      displayName:
        Labels.RULES_MIGRATION.TABLE_HEADERS.DUAL_MAINTENANCE_RT_TASK_ID,
      numeric: true,
      sortable: true,
    },
    {
      key: 'dualMaintRtTaskStatus',
      displayName:
        Labels.RULES_MIGRATION.TABLE_HEADERS.DUAL_MAINTENANCE_RT_TASK_STATUS,
    },
    {
      key: 'dualMaintComment',
      displayName:
        Labels.RULES_MIGRATION.TABLE_HEADERS.DUAL_MAINTENANCE_COMMENT,
      template: StringUtil.returnDoubleHyphenIfEmpty,
    },
    {
      key: 'lastModified',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.LAST_MODIFIED,
      sortable: true,
    },
    {
      key: 'lastModifiedBy',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.LAST_MODIFIED_BY,
      sortable: true,
    },
  ],
};

export default DualMaintenanceTableConf;
