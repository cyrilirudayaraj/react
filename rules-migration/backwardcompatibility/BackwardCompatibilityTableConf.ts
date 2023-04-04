import Labels from '../../../constants/Labels';
import StringUtil from '../../../utils/StringUtil';

const BackwardCompatibilityTableConf = {
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
      displayName: Labels.DASHBOARD_GRID.BR_ID,
      sortable: { reducer: (brId: any) => parseInt(brId) },
      template: StringUtil.formatBRID,
    },
    {
      key: 'backCompatStartDate',
      displayName:
        Labels.RULES_MIGRATION.TABLE_HEADERS.BACKWARD_COMPATIBILITY_START_DATE,
    },
    {
      key: 'backCompatComment',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.COMMENT,
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

export default BackwardCompatibilityTableConf;
