import React from 'react';
import { Table } from '@athena/forge';
import { RulesMigrationDetail } from '../../../types';
import Labels from '../../../constants/Labels';
import StringUtil from '../../../utils/StringUtil';

interface RulesMigrationSearchResultProps {
  searchResults: RulesMigrationDetail[];
  searchResultEmptyMessage: any;
}

const RulesMigrationSearchResult = (
  props: RulesMigrationSearchResultProps
): JSX.Element => {
  const businessRequirementIdTemplateHandler = (
    businessRequirementId: string
  ) => {
    return (
      <span className="text-nowrap">
        {StringUtil.formatBRID(businessRequirementId)}
      </span>
    );
  };

  const getGridColumns = (): any => {
    const gridColumn = [
      {
        key: 'contextId',
        displayName: Labels.RULES_MIGRATION.SEARCH_RESULT_GRID.CONTEXT_ID,
        numeric: true,
        sortable: { reducer: (contextId: any) => parseInt(contextId) },
      },
      {
        key: 'ruleId',
        displayName: Labels.RULES_MIGRATION.SEARCH_RESULT_GRID.RULE_ID,
        numeric: true,
        sortable: { reducer: (ruleId: any) => parseInt(ruleId) },
      },

      {
        key: 'businessRequirementId',
        displayName: Labels.RULES_MIGRATION.SEARCH_RESULT_GRID.BR_ID,
        sortable: { reducer: (brId: any) => parseInt(brId) },
        template: businessRequirementIdTemplateHandler,
      },
      {
        key: 'migrationStatus',
        displayName: Labels.RULES_MIGRATION.SEARCH_RESULT_GRID.MIGRATION_STATUS,
        sortable: true,
      },
      {
        key: 'comment',
        displayName: Labels.RULES_MIGRATION.SEARCH_RESULT_GRID.COMMENT,
        sortable: true,
      },
    ];
    return gridColumn;
  };

  let recordNotFoundContent;
  if (props.searchResultEmptyMessage) {
    recordNotFoundContent = (
      <div className="fe_u_flex-container">
        <span className="record-not-found">
          {props.searchResultEmptyMessage}
        </span>
      </div>
    );
  }

  return (
    <div className="rulesmigration-grid">
      <div className="fe_u_flex-container">
        <div className="fe_u_margin--top-small full-width">
          <Table
            layout="medium"
            className="full-width"
            rows={props.searchResults}
            rowKey="id"
            columns={getGridColumns()}
          />
        </div>
      </div>
      {recordNotFoundContent}
    </div>
  );
};

export default RulesMigrationSearchResult;
