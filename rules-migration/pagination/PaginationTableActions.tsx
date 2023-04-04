import React, { Component } from 'react';
import { Button, Modal, Label, Input, Lightbox } from '@athena/forge';
import Constants from '../../../constants/AppConstants';
import Labels from '../../../constants/Labels';
import Messages from '../../../constants/Messages';
import {
  updateRationalizationRules,
  updateRulesMigrationData,
} from '../../../services/CommonService';
import DataUtil from '../../../utils/DataUtil';
import 'react-datepicker/dist/react-datepicker.css';
import DatePicker from 'react-datepicker';
import Moment from 'moment';
import store from '../../../store/store';
import { addAttentionToast, addSuccessToast } from '../../../slices/ToastSlice';
import { CSVLink } from 'react-csv';
import { isArray } from 'lodash';

class PaginationTableActions extends Component<any, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.recordSelected,
      fileName: props.fileName,
      showMoveToLightbox: false,
      showMoveToConfirmModal: false,
      showDeleteConfirmModal: false,
      startDate: null,
      lightboxLabel: '',
      commentText: '',
      csvData: isArray(props.tableData)
        ? props.recordSelected.map((obj: any) => {
            return DataUtil.convertObjKeysToUppercase(obj);
          })
        : [],
    };
    this.toggleMoveToLightbox = this.toggleMoveToLightbox.bind(this);
    this.toggleMoveToConfirmModal = this.toggleMoveToConfirmModal.bind(this);
    this.toggleDeleteConfirmModal = this.toggleDeleteConfirmModal.bind(this);
    this.handleDateChange = this.handleDateChange.bind(this);
    this.handleTextChange = this.handleTextChange.bind(this);
  }

  handleDelete = (): void => {
    this.toggleDeleteConfirmModal();
    const recordlist = this.state.data.filter(
      (row: any) => row.isChecked === true
    );
    const formatedList = DataUtil.formatDeleteData(recordlist);
    this.processDelete(formatedList);
  };

  processDelete = (records: any) => {
    if (
      this.props.source ===
      Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_NOT_MIGRATED
    ) {
      this.deleteRationalizedRules(records);
    } else {
      this.deleteMigrationRules(records);
    }
  };

  deleteRationalizedRules = (records: any) => {
    updateRationalizationRules(records)
      .then((response: any) => {
        addSuccessToast({
          headerText: Messages.RULES_MIGRATION.DELETE_SUCCESS,
          message:
            response.ERRORMESSAGE ||
            response.TOTALAFFECTEDROWS + ' record(s) deleted',
        })(store.dispatch);
        this.setState(() => this.props.refreshPage());
      })
      .catch((error: any) => {
        addAttentionToast({
          headerText: Messages.RULES_MIGRATION.DELETE_FAILURE,
          message: error.message,
        })(store.dispatch);
        this.setState(() => this.props.refreshPage(true));
      });
  };

  deleteMigrationRules = (records: any) => {
    updateRulesMigrationData(records)
      .then((response: any) => {
        addSuccessToast({
          headerText: Messages.RULES_MIGRATION.DELETE_SUCCESS,
          message:
            response.ERRORMESSAGE ||
            response.TOTALAFFECTEDROWS + ' record(s) deleted',
        })(store.dispatch);
        this.props.refreshPage();
      })
      .catch((error: any) => {
        addAttentionToast({
          headerText: Messages.RULES_MIGRATION.DELETE_FAILURE,
          message: error.message,
        })(store.dispatch);
        this.props.refreshPage(true);
      });
  };

  toggleDeleteConfirmModal = () => {
    const recordlist = this.props.recordSelected.filter(
      (row: any) => row.isChecked === true
    );
    if (recordlist.length !== 0) {
      this.setState({
        showDeleteConfirmModal: !this.state.showDeleteConfirmModal,
        recordCount: recordlist.length,
      });
    }
  };

  setDisable = (): boolean => {
    const recordlist = this.state.data.filter(
      (row: any) => row.isChecked === true
    );
    if (recordlist.length === 0) {
      return true;
    } else {
      return false;
    }
  };

  toggleClassName = (): any => {
    const recordlist = this.state.data.filter(
      (row: any) => row.isChecked === true
    );
    return recordlist.length === 0
      ? 'extra-margin visibility_hidden'
      : 'extra-margin ';
  };

  toggleSelectAllButtonLabel = (): string => {
    const label = this.props.selectTable
      ? Labels.RULES_MIGRATION.PAGINATION.UNSELECTALL
      : Labels.RULES_MIGRATION.PAGINATION.SELECTALL;
    return label;
  };

  getDeleteModalLayout = (): any => {
    return (
      <Modal
        show={this.state.showDeleteConfirmModal}
        headerText={Messages.RULES_MIGRATION.DELETE_POPUP_HEADER}
        onHide={this.toggleDeleteConfirmModal}
        onPrimaryClick={this.handleDelete}
        onExited={() => {
          document.body.removeAttribute('style');
        }}
      >
        <p>
          {this.state.recordCount} {Messages.RULES_MIGRATION.DELETE_POPUP_MSG}
        </p>
      </Modal>
    );
  };

  getMoveToConfirmModalLayout = (): any => {
    return (
      <Modal
        show={this.state.showMoveToConfirmModal}
        headerText={Messages.RULES_MIGRATION.MOVE_TO_POPUP_HEADER}
        onHide={this.toggleMoveToConfirmModal}
        onPrimaryClick={this.handleMoveTo}
        onExited={() => {
          document.body.removeAttribute('style');
        }}
      >
        <p>
          {this.state.recordCount} {Messages.RULES_MIGRATION.UPDATE_POPUP}
        </p>
      </Modal>
    );
  };

  getLayout = (): JSX.Element => {
    return (
      <span className="actionButtons">
        <div>
          <Button
            text={Labels.RULES_MIGRATION.PAGINATION.DELETE}
            variant="primary"
            className={this.toggleClassName()}
            icon="Delete"
            onClick={this.toggleDeleteConfirmModal}
            disabled={this.setDisable()}
          />
          {this.moveToButton()}
          <div className="export_rules">
            <CSVLink
              data={this.state.csvData}
              filename={`${this.state.fileName || 'data'}.csv`}
            >
              <Button
                text={Labels.RULES_MIGRATION.BUTTONS.EXPORT}
                variant="tertiary"
                icon="Download"
              />
            </CSVLink>
          </div>
          {this.getMoveToLayout()}
          {this.getDeleteModalLayout()}
        </div>
      </span>
    );
  };

  getMoveToLabel = (): string => {
    let label = '';
    switch (this.props.segment) {
      case Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING:
        label = Labels.RULES_MIGRATION.COMMON.MOVE_TO_DUAL_MAINTENANCE;
        break;
      case Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.DUAL_MAINTENANCE:
        label = Labels.RULES_MIGRATION.COMMON.MOVE_TO_BACKWARD_COMPATIBILITY;
        break;
      case Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES
        .BACKWARD_COMPATIBILITY:
        label = Labels.RULES_MIGRATION.COMMON.MOVE_TO_ARCHIVE;
        break;
      default:
        break;
    }
    return label;
  };

  moveToButton = (): any => {
    return this.props.segment ? (
      <Button
        text={this.getMoveToLabel()}
        variant="primary"
        className={this.toggleClassName()}
        icon="NavigateAway"
        onClick={this.toggleMoveToLightbox}
        disabled={this.setDisable()}
      />
    ) : null;
  };

  toggleMoveToLightbox = () => {
    const recordlist = this.props.recordSelected.filter(
      (row: any) => row.isChecked === true
    );
    if (recordlist.length !== 0) {
      this.setState({
        showMoveToLightbox: !this.state.showMoveToLightbox,
        recordCount: recordlist.length,
        lightboxLabel: this.getMoveToLightboxLabel(),
      });
    } else {
      addAttentionToast({
        headerText: '',
        message: Messages.RULES_MIGRATION.NO_RECORDS_SELECTED,
      })(store.dispatch);
    }
  };

  toggleMoveToConfirmModal = () => {
    const recordlist = this.props.recordSelected.filter(
      (row: any) => row.isChecked === true
    );
    if (recordlist.length !== 0) {
      this.setState({
        showMoveToConfirmModal: !this.state.showMoveToConfirmModal,
        recordCount: recordlist.length,
      });
    }
  };

  handleDateChange(dateVal: any) {
    this.setState({
      startDate: dateVal,
    });
  }

  handleTextChange = (event: any): void => {
    this.setState({
      commentText: event.target.value,
    });
  };

  setDisableButton = (): boolean => {
    return this.state.startDate ? false : true;
  };

  getMoveToLightboxLabel = (): string => {
    if (
      this.props.segment ===
      Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING
    ) {
      return Labels.RULES_MIGRATION.COMMON.DUAL_MAINTENANCE_DATE;
    } else if (
      this.props.segment ===
      Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.DUAL_MAINTENANCE
    ) {
      return Labels.RULES_MIGRATION.COMMON.BACKWARD_COMPATIBILITY_DATE;
    } else {
      return Labels.RULES_MIGRATION.COMMON.ARCHIVE_DATE;
    }
  };

  handleMoveTo = (): void => {
    this.toggleMoveToConfirmModal();
    this.toggleMoveToLightbox();
    const recordlist = this.state.data.filter(
      (row: any) => row.isChecked === true
    );
    const formatedList = DataUtil.formatMoveToData(
      recordlist,
      Moment(this.state.startDate).format('MM/DD/YYYY'),
      this.state.commentText,
      this.props.segment
    );
    this.processMoveTo(formatedList);
  };

  processMoveTo = (records: any) => {
    updateRulesMigrationData(records)
      .then((response: any) => {
        addSuccessToast({
          headerText: Messages.RULES_MIGRATION.UPDATE_SUCCESS,
          message: response.TOTALAFFECTEDROWS + ' record(s) updated',
        })(store.dispatch);
        this.setState(
          {
            commentText: '',
            startDate: null,
          },
          () => this.props.refreshMovetoPage()
        );
      })
      .catch((error: any) => {
        addAttentionToast({
          headerText: Messages.RULES_MIGRATION.UPDATE_FAILURE,
          message: error.message,
        })(store.dispatch);
      });
  };

  getMoveToLayout = (): any => {
    return (
      <Lightbox
        className="pagination-table-actions-lightbox"
        show={this.state.showMoveToLightbox}
        headerText={this.getMoveToLabel()}
        onHide={this.toggleMoveToLightbox}
        disableClose
        hideDividers
      >
        {this.getLightboxLayout()}
        <br />
        <div className="fe_c_lightbox__footer">
          <Button
            text="SAVE"
            variant="primary"
            className="fe_u_margin--right-small"
            onClick={this.toggleMoveToConfirmModal}
            disabled={this.setDisableButton()}
          />
          <Button
            text="CANCEL"
            variant="secondary"
            onClick={this.toggleMoveToLightbox}
          />
        </div>
        {this.getMoveToConfirmModalLayout()}
      </Lightbox>
    );
  };

  getLightboxLayout = (): any => {
    return (
      <span>
        <Label text={this.state.lightboxLabel} />
        <DatePicker
          className="fe_c_input__input"
          selected={this.state.startDate}
          onChange={this.handleDateChange}
          name="startDate"
          dateFormat="MM-dd-yyyy"
          placeholderText="MM-DD-YYYY"
          isClearable
        />
        <br />
        <Label text={Labels.RULES_MIGRATION.COMMON.COMMENTS} />
        <Input id="comments" onChange={this.handleTextChange} />
      </span>
    );
  };

  render() {
    return (
      <span className="pagination-table-actions">
        {this.props.editAuth && this.getLayout()}
      </span>
    );
  }
}

export default PaginationTableActions;
