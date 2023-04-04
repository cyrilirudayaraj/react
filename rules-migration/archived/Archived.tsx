import React, { Component } from 'react';
import Labels from '../../../constants/Labels';
import ArchivedTableConf from './ArchivedTableConf';
import Messages from '../../../constants/Messages';
import { getArchivedRules } from '../../../services/CommonService';
import PaginationTable from '../pagination/PaginationTable';
import { FormError, Signpost } from '@athena/forge';
import Constants from '../../../constants/AppConstants';
import Acl from '../../../constants/Acl';

class Archived extends Component {
  state = {
    fileName: 'archivedrules',
    data: [],
    error: '',
    ruleid: '',
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
    getArchivedRules({ limit: ALL }).then((response: any) => {
      this.parseResponse(response);
    });
  };

  componentDidMount(): void {
    this.populateTableData();
  }

  render(): JSX.Element {
    return (
      <React.Fragment>
        <Signpost type="info">
          {Labels.RULES_MIGRATION.ARCHIVED.OBJECTIVE}
        </Signpost>

        {this.state.data.length ? (
          <PaginationTable
            rows={this.state.data}
            columns={ArchivedTableConf.COLUMNS}
            source={
              Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_MIGRATED
            }
            editPermission={Acl.MIGRATIONRULE_UPDATE}
            fileName={this.state.fileName}
          />
        ) : this.state.error ? (
          <FormError>{this.state.error} </FormError>
        ) : null}
      </React.Fragment>
    );
  }
}

export default Archived;
