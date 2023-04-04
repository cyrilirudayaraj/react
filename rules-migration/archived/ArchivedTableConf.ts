import Labels from '../../../constants/Labels';
import StringUtil from '../../../utils/StringUtil';

const ArchivedTableConf = {
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
      key: 'archiveDate',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.ARCHIVE_DATE,
      sortable: true,
    },
    {
      key: 'archiveRtTaskId',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.ARCHIVE_RT_TASK_ID,
      numeric: true,
      sortable: true,
    },
    {
      key: 'archiveRtTaskStatus',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.ARCHIVE_RT_TASK_STATUS,
      sortable: true,
    },
    {
      key: 'archiveComment',
      displayName: Labels.RULES_MIGRATION.TABLE_HEADERS.ARCHIVE_COMMENT,
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

export default ArchivedTableConf;
