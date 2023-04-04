import React from 'react';
import { configure, mount } from 'enzyme';
import RejectTransit from './RejectTransit';

import Adapter from 'enzyme-adapter-react-16';
import { Select } from '@athena/forge';
import { act } from 'react-dom/test-utils';
import { sleep, findById } from '../../../../../utils/TestUtils';
import configureStore from 'redux-mock-store';
import { MockData } from '../../../../../services/__mocks__/MockData';
import { Provider } from 'react-redux';
configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');

let wrapper: any;
let onReject: any;
let onCancel: any;

beforeEach(async () => {
  onReject = jest.fn();
  onCancel = jest.fn();
  const store = configureStore([])({
    masterData: {
      rejectionReasons: MockData.REJECTION_REASONS,
    },
    fetchRejectionReasonsOnce: jest.fn(),
  });
  store.dispatch = jest.fn();
  wrapper = mount(
    <Provider store={store}>
      <RejectTransit onConfirm={onReject} onCancel={onCancel} />
    </Provider>
  );
});

describe('ReturnTransit', () => {
  it('should render', () => {
    expect(wrapper.find(Select).length).toEqual(1);
  });

  it('should close the dialog when close button clicked', () => {
    act(() => {
      wrapper.find('.my-close-button').last().simulate('click');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should close the dialog when cancel button clicked', () => {
    act(() => {
      wrapper.find('.fe_c_button--secondary').last().simulate('click');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should not call on task return api if form is invalid', () => {
    act(() => {
      wrapper.find('.fe_c_button--primary').last().simulate('click');
      expect(onReject).toHaveBeenCalledTimes(0);
    });
  });

  it('should call task reject api if form is valid', async () => {
    await act(async () => {
      findById(wrapper, 'reason').simulate('change', {
        target: { name: 'reason', value: '1', selectedIndex: 1 },
      });

      findById(wrapper, 'description').simulate('change', {
        target: { name: 'description', value: 'test reject reason' },
      });

      await sleep(10);
      wrapper.find('.fe_c_button--primary').last().simulate('click');
      await sleep(10);
    });
  });
});
