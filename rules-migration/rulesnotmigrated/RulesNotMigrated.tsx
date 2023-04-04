import React, { Component } from 'react';
import Labels from '../../../constants/Labels';
import RuleNotMigratedTableConf from './RuleNotMigratedTableConf';
import RulesNotMigratedActions from './RulesNotMigratedActions';
import Messages from '../../../constants/Messages';
import { getRationalizationRules } from '../../../services/CommonService';
import PaginationTable from '../pagination/PaginationTable';
import { FormError, Signpost } from '@athena/forge';
import Constants from '../../../constants/AppConstants';
import Acl from '../../../constants/Acl';

class RulesNotMigrated extends Component {
  state = {
    fileName: 'rationalizedrules',
    data: [],
    error: '',
  };

  parseResponse = (response: any): void => {
    if (response.total === '0') {
      this.setState({
        error: Messages.RULES_MIGRATION.NO_RECORDS_FOUND,
      });
    } else {
      this.setState({ data: response.result });
    }
  };

  populateTableData = (): void => {
    const { ALL } = Constants.SERVER_CONSTANTS.PAGINATION;
    getRationalizationRules({ limit: ALL }).then((response: any) => {
      this.parseResponse(response);
    });
  };

  reloadTableData = (): void => {
    this.setState({
      data: '',
      error: '',
    });
    this.populateTableData();
  };

  componentDidMount(): void {
    this.populateTableData();
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <Signpost type="info">
          {Labels.RULES_MIGRATION.RULES_NOT_MIGRATED.OBJECTIVE}
        </Signpost>

        <RulesNotMigratedActions onAfterAdd={this.reloadTableData} />

        {this.state.data.length ? (
          <PaginationTable
            rows={this.state.data}
            columns={RuleNotMigratedTableConf.COLUMNS}
            source={
              Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_NOT_MIGRATED
            }
            editPermission={Acl.RATIONALIZATIONRULE_UPDATE}
            fileName={this.state.fileName}
          />
        ) : this.state.error ? (
          <FormError>{this.state.error}</FormError>
        ) : null}
      </React.Fragment>
    );
  }
}

export default RulesNotMigrated;
