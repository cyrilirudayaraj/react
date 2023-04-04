import React, { Component } from 'react';
import Constants from '../../../constants/AppConstants';
import { Paginator, Table, Checkbox } from '@athena/forge';
import PaginationTableActions from './PaginationTableActions';
import EditRationalizedRules from './../rulesnotmigrated/EditRationalizedRules';
import './PaginationTable.scss';
import { connect } from 'react-redux';
import AuthUtil from '../../../utils/AuthUtil';
import { getPermissions } from '../../../slices/UserPermissionSlice';

export interface PaginationTableProps {
  rows: any[];
  columns: any[];
  source: string;
  segment?: string;
  editPermission?: any;
  userPermissions: any[];
  fileName?: string;
}

export class PaginationTable extends Component<PaginationTableProps, any> {
  constructor(props: any) {
    super(props);
    this.state = {
      data: props.rows,
      tableData: this.pageData(
        props.rows,
        0,
        Constants.SERVER_CONSTANTS.PAGE_SIZE
      ),
      pageIndex: 0,
      pageSize: Constants.SERVER_CONSTANTS.PAGE_SIZE,
      selectAll: false,
      selectTable: false,
    };
    this.updatePage = this.updatePage.bind(this);
  }

  componentDidUpdate(prevProps: PaginationTableProps, prevState: any) {
    if (prevProps.userPermissions !== this.props.userPermissions) {
      this.refreshPage(true);
    }
  }

  handleSelectAll = (event: any): void => {
    let selectTable = this.state.selectTable;
    const tableData_new = this.state.tableData.map((rec: any) => {
      rec.isChecked = event.target.checked;
      return rec;
    });
    if (this.state.data.length === this.state.tableData.length) {
      selectTable = event.target.checked;
    }
    this.setState({
      tableData: tableData_new,
      selectAll: event.target.checked,
      selectTable: selectTable,
    });
  };

  handleSelectTable = (): void => {
    const data_new = this.state.data.map((rec: any) => {
      rec.isChecked = !this.state.selectTable;
      return rec;
    });
    this.setState({
      data: data_new,
      selectTable: !this.state.selectTable,
    });
  };

  refreshPage = (onlyUpdate: boolean): void => {
    if (onlyUpdate) {
      this.updatePage(this.state.pageIndex);
    } else {
      const state_data = this.state.data.filter((row: any) => !row.deleted);
      let new_index = this.state.pageIndex;
      if (state_data.length <= this.state.pageIndex * this.state.pageSize) {
        new_index = this.state.pageIndex - 1;
      }
      this.setState(
        {
          data: state_data,
          pageIndex: new_index,
        },
        () => this.updatePage(this.state.pageIndex)
      );
    }
  };

  updateEditedRecord = (record: any): void => {
    const { tableData } = this.state;
    const updatefields =
      Constants.UI_CONSTANTS.RULES_MIGRATION.RULES_NOT_MIGRATED.UPDATEFIELDS;
    tableData.map((rec: any) => {
      if (rec.id === record.id) {
        for (let i = 0; i < updatefields.length; i++) {
          rec[updatefields[i]] = record[updatefields[i]];
        }
      }
      return rec;
    });
    this.setState(tableData, () => this.updatePage(this.state.pageIndex));
  };

  refreshMoveToPage = (): void => {
    let state_data;
    if (
      this.props.segment ===
      Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING
    ) {
      state_data = this.refreshModellingPage();
    } else if (
      this.props.segment ===
      Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.DUAL_MAINTENANCE
    ) {
      state_data = this.refreshDualMaintenancePage();
    } else if (
      this.props.segment ===
      Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.BACKWARD_COMPATIBILITY
    ) {
      state_data = this.refreshBackwardCompatibilityPage();
    }
    this.setState(
      {
        data: state_data,
      },
      () => this.updatePage(this.state.pageIndex)
    );
  };

  refreshModellingPage = (): any => {
    const state_data = this.state.data.filter(
      (row: any) =>
        !(
          row.dualMaintStartDate &&
          new Date(row.dualMaintStartDate) < new Date()
        )
    );
    return state_data;
  };

  refreshDualMaintenancePage = (): any => {
    const state_data = this.state.data.filter(
      (row: any) =>
        !(
          row.backCompatStartDate &&
          new Date(row.backCompatStartDate) < new Date()
        )
    );
    return state_data;
  };

  refreshBackwardCompatibilityPage = (): any => {
    const state_data = this.state.data.filter(
      (row: any) => !(row.archiveDate && new Date(row.archiveDate) < new Date())
    );
    return state_data;
  };

  handleSelect = (event: any): void => {
    const selectedRecord_copy = this.state.tableData;
    const { id, checked } = event.target;
    const record_copy = selectedRecord_copy.filter((rec: any) => rec.id === id);
    const index = selectedRecord_copy.indexOf(record_copy[0]);
    record_copy[0].isChecked = checked;
    selectedRecord_copy[index] = record_copy[0];
    let selectall = this.state.selectAll;
    if (selectall === true && checked === false) {
      selectall = false;
    }
    this.setState(
      {
        tableData: selectedRecord_copy,
        selectAll: selectall,
      },
      () => this.setSelectTable()
    );
  };

  setSelectTable = (): void => {
    let { selectTable } = this.state;
    const recordlist = this.state.data.filter(
      (rec: any) => rec.isChecked === true
    );
    if (recordlist.length === 0) {
      selectTable = false;
    } else if (recordlist.length === this.state.data.length) {
      selectTable = true;
    }
    this.setState({ selectTable });
  };

  getSelected = (rowid: any): boolean => {
    const recordlist = this.state.tableData.filter(
      (row: any) => row.id === rowid
    );
    if (recordlist.length > 0 && recordlist[0].isChecked === true) {
      return true;
    }
    return false;
  };

  pageData = (data: any, selectedIndex: number, pageSize: number) => {
    const startindex = selectedIndex * pageSize;
    const endindex = startindex + pageSize;
    const newdata = data.slice(startindex, endindex);
    this.getEditOption(newdata);
    return newdata;
  };

  getEditOption = (records: any) => {
    if (
      AuthUtil.isAuthorized(
        this.props.editPermission,
        this.props.userPermissions
      ) &&
      this.props.source ===
        Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_NOT_MIGRATED
    ) {
      records.map((record: any) => {
        record.EDIT = (
          <EditRationalizedRules
            data={record}
            updateEditedRecord={this.updateEditedRecord}
          />
        );
        return record;
      });
    }
  };

  getSelectAll = (): boolean => {
    const record = this.state.tableData.filter(
      (rec: any) => rec.isChecked === true
    );
    if (record.length === this.state.tableData.length) {
      return true;
    }
    return false;
  };

  getColumns = (): [] => {
    const columns = [] as any;
    if (
      AuthUtil.isAuthorized(
        this.props.editPermission,
        this.props.userPermissions
      )
    ) {
      columns.push(this.getCheckboxTemplate());
      if (
        this.props.source ===
        Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_NOT_MIGRATED
      ) {
        columns.push({
          key: 'EDIT',
        });
      }
    }
    this.props.columns.map((column: any) => columns.push(column));
    return columns;
  };

  getCheckboxTemplate = (): any => {
    return {
      key: 'id',
      displayName: (
        <Checkbox
          id="selectall"
          description=""
          onChange={this.handleSelectAll}
          checked={this.getSelectAll()}
        >
          {}
        </Checkbox>
      ),
      template: (checkboxid: any) => {
        return (
          <Checkbox
            id={checkboxid}
            description=""
            checked={this.getSelected(checkboxid)}
            onChange={this.handleSelect}
          >
            {}
          </Checkbox>
        );
      },
    };
  };

  updatePage = (index: number) => {
    const newdata = this.pageData(this.state.data, index, this.state.pageSize);
    this.setState({
      pageIndex: index,
      tableData: newdata,
    });
  };

  render() {
    return (
      <div className="fe_u_flex-container fe_u_flex-justify-content--space-between fe_u_margin--large pagination-table">
        <div className="paginator">
          <PaginationTableActions
            editAuth={AuthUtil.isAuthorized(
              this.props.editPermission,
              this.props.userPermissions
            )}
            selectTable={this.state.selectTable}
            refreshPage={this.refreshPage}
            refreshMovetoPage={this.refreshMoveToPage}
            recordSelected={this.state.data}
            handleSelectTable={this.handleSelectTable}
            source={this.props.source}
            segment={this.props.segment}
            tableData={this.state.tableData}
            fileName={this.props.fileName}
          />
        </div>
        <Table
          className="fe_u_fill--width fe_u_margin--top-small"
          layout="compact"
          rowKey="id"
          columns={this.getColumns()}
          rows={this.state.tableData}
        />
        <div className="paginator">
          <Paginator
            displayMode="withPageJump"
            pageCount={Math.ceil(this.state.data.length / this.state.pageSize)}
            pageInputId="paginator-page-input"
            selectedIndex={this.state.pageIndex}
            onSelectedIndexChange={this.updatePage}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { userPermissions: getPermissions(state) };
};

export default connect(mapStateToProps)(PaginationTable);
