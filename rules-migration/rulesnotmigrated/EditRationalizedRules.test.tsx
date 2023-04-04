import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import Messages from '../../../constants/Messages';
import { Button } from '@athena/forge';
import { act } from 'react-dom/test-utils';
import { sleep } from '../../../utils/TestUtils';
import EditRationalizedRules from './EditRationalizedRules';
import * as CommonService from '../../../services/CommonService';
import { addAttentionToast, addSuccessToast } from '../../../slices/ToastSlice';

configure({ adapter: new Adapter() });

const updateRationalizationRules = jest.spyOn(
  CommonService,
  'updateRationalizationRules'
);

describe('test <RuleNotMigratedFileChooser>', () => {
  let wrapper: any;
  let updateEditedRecord: any;
  const record = {
    contextId: '1',
    created: '08/14/2020',
    createdBy: 'DBA_PATCH_20200814',
    id: '0',
    lastModified: '02/18/2021',
    lastModifiedBy: 'abcd',
    ordering: '10',
    pattern: 'Global - Unused/ Expired Claimformat - Slice 1.',
    rationalizationType: 'Rule Rationalization',
    reviewedBy: 'John Doe',
    reviewerComments:
      'Fires on format "NYMcaidHCFA (old)". Old format, confirmed by R&D. Hasn\'t been batched since before 2018',
    rtTaskId: '136525',
    rtTaskStatus: 'COMPLETED',
    ruleId: '355',
    ruleType: 'Global',
    scrubType: 'CLAIM',
  };
  const Updated_record = {
    contextId: '1',
    created: '08/14/2020',
    createdBy: 'DBA_PATCH_20200814',
    id: '0',
    lastModified: '02/18/2021',
    lastModifiedBy: 'abcd',
    ordering: '10',
    pattern: 'Global - Unused/ Expired Claimformat - Slice 1.',
    rationalizationType: 'Rule Rationalization 1',
    reviewedBy: 'John Doe',
    reviewerComments:
      'Fires on format "NYMcaidHCFA (old)". Old format, confirmed by R&D. Hasn\'t been batched since before 2018',
    rtTaskId: '136525',
    rtTaskStatus: 'COMPLETED',
    ruleId: '355',
    ruleType: 'Global',
    scrubType: 'CLAIM',
  };
  beforeEach(() => {
    updateEditedRecord = jest.fn();
    wrapper = mount(
      <EditRationalizedRules
        data={record}
        updateEditedRecord={updateEditedRecord}
      />
    );
  });

  it('should render 1 <Button> with no changes', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should enable  save Button if anything changed', () => {
    const event = {
      target: {
        id: '1',
        value: 'Rule Rationalization 1',
      },
    };
    wrapper.instance().handleChange('rationalizationType', event, 'value');
    expect(wrapper.state('disable')).toBe(false);
    expect(wrapper.state('selected').rationalizationType).toBe(
      Updated_record.rationalizationType
    );
  });

  it('should disable save Button and show error message, if reviewedBy is null ', () => {
    const event = {
      target: {
        id: '1',
        value: '',
      },
    };
    wrapper.instance().handleChange('reviewedBy', event, 'value');
    expect(wrapper.state('disable')).toBe(true);
    expect(wrapper.state('error')).toBe(
      Messages.RULES_MIGRATION.REVIEWED_BY_REQUIRED
    );
  });

  it('should save the changes and show success toast message', async () => {
    updateRationalizationRules.mockImplementation(() =>
      Promise.resolve({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : 0',
        TOTALAFFECTEDROWS: 1,
      })
    );
    await act(async () => {
      const event = {
        target: {
          id: '1',
          value: 'Rule Rationalization 1',
        },
      };
      wrapper.setState({
        showPopup: true,
      });
      wrapper.instance().handleChange('rationalizationType', event, 'value');
      wrapper.instance().handleSubmit();
      await sleep(2);
      expect(addSuccessToast).toHaveBeenCalled;
    });
  });

  it('should show failure toast message when update failed', async () => {
    updateRationalizationRules.mockImplementation(() =>
      Promise.reject({
        ERRORMESSAGE: '',
        MESSAGE: 'Update successful for the row with the ID : .',
        TOTALAFFECTEDROWS: 1,
      })
    );
    await act(async () => {
      const event = {
        target: {
          id: '1',
          value: 'Rule Rationalization 1',
        },
      };
      wrapper.setState({
        showPopup: true,
      });
      wrapper.instance().handleChange('rationalizationType', event, 'value');
      wrapper.instance().handleSubmit();
      await sleep(2);
      expect(addAttentionToast).toHaveBeenCalled;
    });
  });

  it('should rest the changes on state when cancelled', () => {
    const event = {
      target: {
        id: '1',
        value: 'Rule Rationalization 1',
      },
    };
    wrapper.instance().handleChange('rationalizationType', event, 'value');
    wrapper.instance().refreshCurrentPage();
    expect(wrapper.state('selected')).toBe(record);
  });
});
