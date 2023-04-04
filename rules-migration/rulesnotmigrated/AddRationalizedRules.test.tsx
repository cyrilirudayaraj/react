import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { act } from 'react-dom/test-utils';
import { sleep } from '../../../utils/TestUtils';
import * as CommonService from '../../../services/CommonService';
import AddRationalizedRules from './AddRationalizedRules';
import { addAttentionToast, addSuccessToast } from '../../../slices/ToastSlice';

configure({ adapter: new Adapter() });

const addRationalizationRules = jest.spyOn(
  CommonService,
  'addRationalizationRules'
);

describe('test <AddRationalizedRules>', () => {
  let wrapper: any;

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
    const baseProps = {
      onAfterAdd: jest.fn(),
      onClose: jest.fn(),
    };

    wrapper = mount(<AddRationalizedRules {...baseProps} />);
  });

  it('should enable  save Button if anything changed', () => {
    const event = {
      target: {
        id: '1',
        value: 'John Doe',
      },
    };
    wrapper.instance().handleChange('reviewedBy', event, 'value');
    wrapper.instance().handleChange('contextId', event, 'value');
    wrapper.instance().handleChange('ruleId', event, 'value');
    expect(wrapper.state('disable')).toBe(false);
    expect(wrapper.state('datatoadd').reviewedBy).toBe(
      Updated_record.reviewedBy
    );
  });

  it('should disable save Button and show error message, if REVIEWEDBY is null ', () => {
    const event = {
      target: {
        id: '1',
        value: '',
      },
    };
    wrapper.instance().handleChange('reviewedBy', event, 'value');
    expect(wrapper.state('disable')).toBe(true);
  });

  it('should disable save Button and show error message, if REVIEWEDBY is null ', () => {
    const event = {
      target: {
        id: '1',
        value: '',
      },
    };
    wrapper.instance().handleChange('contextId', event, 'value');
    expect(wrapper.state('disable')).toBe(true);
  });

  it('should disable save Button and show error message, if REVIEWEDBY is null ', () => {
    const event = {
      target: {
        id: '1',
        value: '',
      },
    };
    wrapper.instance().handleChange('ruleId', event, 'value');
    expect(wrapper.state('disable')).toBe(true);
  });

  it('should disable save Button and show error message, if REVIEWEDBY is having initial space only ', () => {
    const event = {
      target: {
        id: '1',
        value: ' ',
      },
    };
    wrapper.instance().handleChange('ruleId', event, 'value');
    expect(wrapper.state('disable')).toBe(true);
  });

  it('should save the changes and show success toast message', async () => {
    addRationalizationRules.mockImplementation(() =>
      Promise.resolve({
        ERRORMESSAGE: '',
        MESSAGE: 'Add successful for the row with the ID : 0',
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
    addRationalizationRules.mockImplementation(() =>
      Promise.reject({
        ERRORMESSAGE: '',
        MESSAGE: 'Add successful for the row with the ID : .',
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
    wrapper.instance().handleClosure();
    expect(wrapper.state('datatoadd')).tobeEmpty;
  });
});
