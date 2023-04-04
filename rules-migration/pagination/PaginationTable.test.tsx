import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PaginationTable } from './PaginationTable';
import { Paginator, Table } from '@athena/forge';
import Constants from '../../../constants/AppConstants';
import EditRationalizedRules from '../rulesnotmigrated/EditRationalizedRules';
import Acl from '../../../constants/Acl';

configure({ adapter: new Adapter() });
let wrapper: any;

describe('test <PaginationTable>', () => {
  const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  const columns = [
    {
      key: 'id',
      displayName: 'ID',
      numeric: true,
      sortable: true,
    },
  ];

  const userPermissions: any[] = [
    Acl.RATIONALIZATIONRULE_UPDATE,
    Acl.MIGRATIONRULE_UPDATE,
  ];

  const defaultProps = {
    rows,
    columns,
    userPermissions: [],
    editPermission: Acl.RATIONALIZATIONRULE_UPDATE,
    source: '',
  };
  beforeEach(() => {
    wrapper = mount(<PaginationTable {...defaultProps} />);
  });

  it('should render 1 <Table> component', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });

  it('should render 2 <Paginator> components', () => {
    expect(wrapper.find(Paginator)).toHaveLength(1);
  });

  it('should re-render on page switch', () => {
    wrapper.instance().updatePage(1);
    expect(wrapper.state('pageIndex')).toBe(1);
  });

  it('Should set SelectAll', () => {
    const event = {
      target: {
        id: 'selectall',
        checked: true,
      },
    };
    wrapper.instance().handleSelectAll(event);
    expect(wrapper.state('selectAll')).toBe(true);
  });
  it('Should set Edit option for current page', () => {
    wrapper = mount(
      <PaginationTable
        {...defaultProps}
        userPermissions={userPermissions}
        source={
          Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_NOT_MIGRATED
        }
      />
    );
    expect(wrapper.find(EditRationalizedRules)).toHaveLength(rows.length);
  });

  it('Should set Checkbox for true', () => {
    const event = {
      target: {
        id: 1,
        checked: true,
      },
    };

    wrapper.instance().handleSelect(event);
    const record = wrapper
      .state('tableData')
      .filter((rec: any) => rec.id === 1);
    expect(record[0].isChecked).toBe(true);
  });

  it('Should unset Checkbox for false', () => {
    const event = {
      target: {
        id: 1,
        checked: false,
      },
    };
    wrapper.setState({
      selectAll: true,
    });
    wrapper.instance().handleSelect(event);
    const record = wrapper
      .state('tableData')
      .filter((rec: any) => rec.id === 1);
    expect(record[0].isChecked).toBe(false);
  });

  it('Should set Select Table', () => {
    wrapper.setState({
      selectTable: false,
    });
    wrapper.instance().handleSelectTable();
    const record = wrapper
      .state('data')
      .filter((rec: any) => rec.isChecked === true);
    expect(wrapper.state('selectTable')).toBe(true);
    expect(record.length).toBe(rows.length);
  });

  it('Should unset Select Table', () => {
    const rows = [{ id: 1, isChecked: true }, { id: 2 }, { id: 3 }, { id: 4 }];
    wrapper = mount(<PaginationTable {...defaultProps} rows={rows} />);
    wrapper.setState({
      selectTable: false,
    });
    const event = {
      target: {
        id: 1,
        checked: false,
      },
    };
    wrapper.instance().handleSelect(event);
    expect(wrapper.state('selectTable')).toBe(false);
  });

  it('Should remove deleted record from data', () => {
    const rows = [
      { id: 1, isChecked: true, deleted: '01/01/2021' },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];
    wrapper = mount(<PaginationTable {...defaultProps} rows={rows} />);
    wrapper.setState({
      selectTable: false,
    });
    wrapper.instance().refreshPage();
    expect(wrapper.state('data').length).toBe(rows.length - 1);
  });

  it('Should remove old dated moved record from Modelling page', () => {
    const rows = [
      { id: 1, isChecked: true, dualMaintStartDate: '01/01/2021' },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];
    wrapper = mount(<PaginationTable {...defaultProps} rows={rows} />);
    wrapper.setProps({
      segment: Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING,
    });
    wrapper.setState({
      selectTable: false,
    });
    wrapper.instance().refreshMoveToPage();
    expect(wrapper.state('data').length).toBe(rows.length - 1);
  });

  it('Should remove old dated moved record from Dual Maintenance page', () => {
    const rows = [
      { id: 1, isChecked: true, archiveDate: '01/01/2021' },
      { id: 2 },
      { id: 3 },
      { id: 4 },
    ];
    wrapper = mount(<PaginationTable {...defaultProps} rows={rows} />);
    wrapper.setProps({
      segment:
        Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.DUAL_MAINTENANCE,
    });
    wrapper.setState({
      selectTable: false,
    });
    wrapper.instance().refreshMoveToPage();
    expect(wrapper.state('data').length).toBe(rows.length);
  });

  it('Should update record', () => {
    const rows = [{ id: 1, pattern: '123' }, { id: 2 }, { id: 3 }, { id: 4 }];
    wrapper = mount(<PaginationTable {...defaultProps} rows={rows} />);
    wrapper.setState({
      selectTable: false,
    });
    const record = { id: 1, pattern: '1234' };
    wrapper.instance().updateEditedRecord(record);
    const record_updated = wrapper
      .state('data')
      .filter((rec: any) => rec.id === record.id);
    expect(record.pattern).toBe(record_updated[0].pattern);
  });
});
