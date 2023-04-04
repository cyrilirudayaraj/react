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
      key: 'ordering',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.ORDERING,
      numeric: true,
      sortable: true,
    },
    {
      key: 'pattern',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.PATTERN,
    },
    {
      key: 'reviewedBy',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.REVIEWED_BY,
      sortable: true,
    },
    {
      key: 'reviewerComments',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.REVIEWER_COMMENTS,
      template: StringUtil.returnDoubleHyphenIfEmpty,
    },
    {
      key: 'rtTaskId',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.RT_TASK_ID,
      numeric: true,
      sortable: true,
    },
    {
      key: 'rtTaskStatus',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.RT_TASK_STATUS,
      sortable: true,
    },
  ],
};

export default RuleNotMigratedTableConf;
