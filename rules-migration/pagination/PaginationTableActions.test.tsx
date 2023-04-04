import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button } from '@athena/forge';
import { act } from 'react-dom/test-utils';
import { sleep } from '../../../utils/TestUtils';
import PaginationTableActions from './PaginationTableActions';
import * as CommonService from '../../../services/CommonService';
import Constants from '../../../constants/AppConstants';
import { addAttentionToast } from '../../../slices/ToastSlice';

configure({ adapter: new Adapter() });

let wrapper: any;

const updateRationalizationRules = jest.spyOn(
  CommonService,
  'updateRationalizationRules'
);
const updateRulesMigrationData = jest.spyOn(
  CommonService,
  'updateRulesMigrationData'
);
describe('test <PaginationTableActions>: ', () => {
  const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];
  let refreshPage: any;
  let refreshMoveToPage: any;
  beforeEach(() => {
    refreshPage = jest.fn();
    refreshMoveToPage = jest.fn();
  });

  it('should render 4 <Button>', () => {
    wrapper = shallow(
      <PaginationTableActions
        editAuth={true}
        selectTable={true}
        recordSelected={rows}
      />
    );
    expect(wrapper.find(Button)).toHaveLength(4);
  });
  it('should render 4 <Button>', () => {
    wrapper = shallow(
      <PaginationTableActions
        editAuth={true}
        selectTable={false}
        recordSelected={rows}
      />
    );
    expect(wrapper.find(Button)).toHaveLength(4);
  });
  it('should not render <Button>', () => {
    wrapper = shallow(
      <PaginationTableActions editAuth={false} recordSelected={rows} />
    );
    expect(wrapper.find(Button)).toHaveLength(0);
  });

  it('should close the Modal when close button clicked for Rules Migration as source', async () => {
    const rows = [{ id: 0, isChecked: true }, { id: 2 }, { id: 3 }, { id: 4 }];
    updateRulesMigrationData.mockImplementation(() =>
      Promise.resolve({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : .',
        TOTALAFFECTEDROWS: 1,
      })
    );
    wrapper = mount(
      <PaginationTableActions
        editAuth={true}
        recordSelected={rows}
        refreshPage={refreshPage}
        source={Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_MIGRATED}
      />
    );
    wrapper.setState({
      showDeleteConfirmModal: true,
    });
    await act(async () => {
      wrapper.find(Button).last().simulate('click');
      await sleep(2);
      expect(wrapper.state('showDeleteConfirmModal')).toBe(false);
    });
  });
  it('should close the Modal when close button clicked for Rules Not Migration as source', async () => {
    const rows = [{ id: 0, isChecked: true }, { id: 2 }, { id: 3 }, { id: 4 }];
    updateRationalizationRules.mockImplementation(() =>
      Promise.resolve({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : .',
        TOTALAFFECTEDROWS: 1,
      })
    );
    wrapper = mount(
      <PaginationTableActions
        editAuth={true}
        recordSelected={rows}
        refreshPage={refreshPage}
        source={
          Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_NOT_MIGRATED
        }
      />
    );
    wrapper.setState({
      showDeleteConfirmModal: true,
    });
    await act(async () => {
      wrapper.find(Button).last().simulate('click');
      await sleep(2);
      expect(wrapper.state('showDeleteConfirmModal')).toBe(false);
    });
  });

  it('should show toaster for failure for Rules Not Migration as source', async () => {
    const rows = [{ id: 0, isChecked: true }, { id: 2 }, { id: 3 }, { id: 4 }];
    updateRationalizationRules.mockImplementation(() =>
      Promise.reject({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : .',
        TOTALAFFECTEDROWS: 1,
      })
    );
    wrapper = mount(
      <PaginationTableActions
        editAuth={true}
        recordSelected={rows}
        refreshPage={refreshPage}
        source={
          Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_NOT_MIGRATED
        }
      />
    );
    wrapper.setState({
      showDeleteConfirmModal: true,
    });
    await act(async () => {
      wrapper.find(Button).last().simulate('click');
      await sleep(2);
      expect(addAttentionToast).toHaveBeenCalled;
    });
  });

  it('should show toaster for failure for Rules Migration as source', async () => {
    const rows = [{ id: 0, isChecked: true }, { id: 2 }, { id: 3 }, { id: 4 }];
    updateRulesMigrationData.mockImplementation(() =>
      Promise.reject({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : .',
        TOTALAFFECTEDROWS: 1,
      })
    );
    wrapper = mount(
      <PaginationTableActions
        editAuth={true}
        recordSelected={rows}
        refreshPage={refreshPage}
        source={Constants.UI_CONSTANTS.RULES_MIGRATION.SOURCES.RULES_MIGRATED}
      />
    );
    wrapper.setState({
      showDeleteConfirmModal: true,
    });
    await act(async () => {
      wrapper.find(Button).last().simulate('click');
      await sleep(2);
      expect(addAttentionToast).toHaveBeenCalled;
    });
  });

  it('should close the Modal when close button clicked for Modelling as segment', async () => {
    const rows = [{ id: 0, isChecked: true }, { id: 2 }, { id: 3 }, { id: 4 }];
    updateRulesMigrationData.mockImplementation(() =>
      Promise.resolve({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : .',
        TOTALAFFECTEDROWS: 1,
      })
    );
    wrapper = mount(
      <PaginationTableActions
        editAuth={true}
        recordSelected={rows}
        refreshMovetoPage={refreshMoveToPage}
        segment={Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.MODELING}
      />
    );
    wrapper.setState({
      startDate: new Date(),
      showMoveToLightbox: true,
      showMoveToConfirmModal: true,
    });
    await act(async () => {
      wrapper.find(Button).last().simulate('click');
      await sleep(2);
      expect(wrapper.state('showMoveToConfirmModal')).toBe(false);
    });
  });

  it('should close the Modal when close button clicked for DualMaintenance as segment', async () => {
    const rows = [{ id: 0, isChecked: true }, { id: 2 }, { id: 3 }, { id: 4 }];
    updateRulesMigrationData.mockImplementation(() =>
      Promise.resolve({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : .',
        TOTALAFFECTEDROWS: 1,
      })
    );
    wrapper = mount(
      <PaginationTableActions
        editAuth={true}
        recordSelected={rows}
        refreshMovetoPage={refreshMoveToPage}
        segment={
          Constants.SERVER_CONSTANTS.RULES_MIGRATION_TYPES.DUAL_MAINTENANCE
        }
      />
    );
    wrapper.setState({
      startDate: new Date(),
      showMoveToLightbox: true,
      showMoveToConfirmModal: true,
    });
    await act(async () => {
      wrapper.find(Button).last().simulate('click');
      await sleep(2);
      expect(wrapper.state('showMoveToConfirmModal')).toBe(false);
    });
  });
});
