import React, { Component } from 'react';
import isValid from 'date-fns/isValid';
import Labels from './../../../constants/Labels';
import ModellingActions from './ModellingActions';
import ModellingTableConf from './ModellingTableConf';
import Messages from '../../../constants/Messages';
import {
  getModelledRules,
  uploadModelingFile,
} from '../../../services/CommonService';
import PaginationTable from '../pagination/PaginationTable';
import ModellingFileChooser from './ModellingFileChooser';
import Constants from '../../../constants/AppConstants';

import { FormError, Signpost } from '@athena/forge';
import store from '../../../store/store';
import AppConstants from '../../../constants/AppConstants';
import Acl from '../../../constants/Acl';
import { addAttentionToast, addSuccessToast } from '../../../slices/ToastSlice';

class Modelling extends Component {
  state = {
    fileName: 'modelledrules',
    data: [],
    error: '',
    ruleid: '',
    startDate: new Date(Date.now()),
    isParsed: false,
    isFileChooserDialogEnabled: false,
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
    const { ALL } = AppConstants.SERVER_CONSTANTS.PAGINATION;
    getModelledRules({ limit: ALL }).then((response: any) => {
      this.parseResponse(response);
    });
  };

  handleClick = (): void => {
    if (this.state.ruleid) {
      this.setState(
        {
          data: '',
          error: '',
          startDate: '',
          isParsed: false,
        },
        () => {
          const { ruleid, startDate } = this.state;
          const payload = {
            ruleid,
            startDate,
            limit: Constants.UI_CONSTANTS.RULES_MIGRATION.SEARCH.RULELIMIT,
          };
          getModelledRules(payload).then((response: any) => {
            this.parseResponse(response);
          });
        }
      );
    } else {
      addAttentionToast({
        headerText: '',
        message: Messages.RULES_MIGRATION.RULE_ID_MISSING,
      })(store.dispatch);
    }
  };

  handleDateSearch = (): void => {
    if (this.state.startDate && isValid(this.state.startDate)) {
      const searchDate = this.state.startDate.toLocaleDateString('en-US', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
      });

      this.setState(
        {
          ruleid: '',
          data: '',
          error: '',
          isParsed: false,
        },
        () => {
          const { ruleid } = this.state;
          const payload = {
            ruleid,
            startDate: searchDate,
            limit: Constants.UI_CONSTANTS.RULES_MIGRATION.SEARCH.DATELIMIT,
          };
          getModelledRules(payload).then((response: any) => {
            this.parseResponse(response);
          });
        }
      );
    } else {
      addAttentionToast({
        headerText: '',
        message: Messages.RULES_MIGRATION.MODELING_DATE_MISSING,
      })(store.dispatch);
    }
  };
  handleChange = (event: any): void => {
    let input = event.target.value;
    if (!input) {
      this.setState({
        ruleid: '',
        error: '',
      });
    } else {
      const lastCharacter = input[input.length - 1];
      const regex = /^[0-9.]/;
      if (!regex.test(lastCharacter)) input = input.slice(0, -1);
      this.setState({ ruleid: input });
    }
  };

  clearFilters = (): void => {
    this.setState(
      {
        ruleid: '',
        data: '',
        error: '',
        startDate: '',
        isParsed: false,
      },
      () => this.populateTableData()
    );
  };

  handleDate = (event: any): void => {
    const value = event.target.value;
    this.setState({ startDate: value });
  };

  openFileChooserDialog = (e: any): void => {
    this.setState({ isFileChooserDialogEnabled: true });
  };

  hideFileChooserDialog = (): void => {
    this.setState({ isFileChooserDialogEnabled: false, file: null });
  };

  uploadFile = (file: File): void => {
    uploadModelingFile(file).then((response: any) => {
      addSuccessToast({
        headerText: Messages.RULES_MIGRATION.IMPORT_SUCCESS,
        message: Messages.RULES_MIGRATION.IMPORT_SUCCESS_MESSAGE,
      })(store.dispatch);
    });
    this.hideFileChooserDialog();
  };

  componentDidMount(): void {
    this.populateTableData();
  }

  getModellingActions(): JSX.Element {
    return (
      <React.Fragment>
        {this.state.isParsed ? (
          <ModellingActions
            data={this.state.data}
            searchString={this.state.ruleid}
            startDate={this.state.startDate}
            handleClick={this.handleClick}
            handleChange={this.handleChange}
            handleDate={this.handleDate}
            handleDateSearch={this.handleDateSearch}
            clearFilters={this.clearFilters}
            onImport={this.openFileChooserDialog}
          />
        ) : null}
      </React.Fragment>
    );
  }

  getPaginationTable(): JSX.Element {
    return (
      <React.Fragment>
        {this.state.data.length ? (
          <PaginationTable
            rows={this.state.data}
            columns={ModellingTableConf.COLUMNS}
            source={
              Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_MIGRATED
            }
            segment={Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING}
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
          {Labels.RULES_MIGRATION.MODELING.OBJECTIVE}
        </Signpost>

        <ModellingFileChooser
          show={this.state.isFileChooserDialogEnabled}
          onPrimaryClick={this.uploadFile}
          onHide={this.hideFileChooserDialog}
        />
        {this.getModellingActions()}
        {this.getPaginationTable()}
      </React.Fragment>
    );
  }
}

export default Modelling;
