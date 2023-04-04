import React, { Component } from 'react';
import Labels from '../../../constants/Labels';
import DualMaintenanceTableConf from './DualMaintenanceTableConf';
import Messages from '../../../constants/Messages';
import { getDualMaintenanceRules } from '../../../services/CommonService';
import PaginationTable from '../pagination/PaginationTable';
import { FormError, Signpost } from '@athena/forge';
import Constants from '../../../constants/AppConstants';
import Acl from '../../../constants/Acl';

class DualMaintenance extends Component {
  state = {
    fileName: 'dualmaintenancerules',
    data: [],
    error: '',
    ruleid: '',
    startDate: new Date(Date.now()),
    isParsed: false,
  };

  parseResponse = (response: any): void => {
    if (response.total === '0') {
      this.setState({
        error: Messages.RULES_MIGRATION.NO_RECORDS_FOUND,
      });
    } else {
      this.setState({ data: response.result });
    }
    this.setState({ isParsed: true });
  };

  populateTableData = (): void => {
    this.setState({ isParsed: false });
    const { ALL } = Constants.SERVER_CONSTANTS.PAGINATION;
    getDualMaintenanceRules({ limit: ALL }).then((response: any) => {
      this.parseResponse(response);
    });
  };

  componentDidMount(): void {
    this.populateTableData();
  }

  getPaginationTable(): JSX.Element {
    return (
      <React.Fragment>
        {this.state.data.length ? (
          <PaginationTable
            rows={this.state.data}
            columns={DualMaintenanceTableConf.COLUMNS}
            source={
              Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_MIGRATED
            }
            segment={
              Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.DUAL_MAINTENANCE
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

  render(): JSX.Element {
    return (
      <React.Fragment>
        <Signpost type="info">
          {Labels.RULES_MIGRATION.DUAL_MAINTENANCE.OBJECTIVE}
        </Signpost>
        {this.getPaginationTable()}
      </React.Fragment>
    );
  }
}

export default DualMaintenance;
