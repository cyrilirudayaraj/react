import Labels from '../../../constants/Labels';
import StringUtil from '../../../utils/StringUtil';

const RuleNotMigratedTableConf = {
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
      key: 'ordering',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.ORDERING,
      numeric: true,
      sortable: true,
    },
    {
      key: 'migrationPhase',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.MIGRATION_PHASE,
    },
    {
      key: 'modelingDate',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.MODELING_DATE,
      sortable: true,
    },
    {
      key: 'modelingComment',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.MODELING_COMMENT,
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

export default RuleNotMigratedTableConf;
