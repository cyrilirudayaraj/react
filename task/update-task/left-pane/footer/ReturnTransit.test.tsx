import React from 'react';
import { configure, mount } from 'enzyme';
import ReturnTransit from './ReturnTransit';

import Adapter from 'enzyme-adapter-react-16';
import { TaskDetail } from '../../../../../types';
import { Select } from '@athena/forge';
import { act } from 'react-dom/test-utils';
import { sleep, findById } from '../../../../../utils/TestUtils';

configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');
import { getTaskDetails } from '../../../../../services/CommonService';

let wrapper: any;
let onReturn: any;
let onCancel: any;
let taskDetails: TaskDetail;

beforeEach(async () => {
  onReturn = jest.fn();
  onCancel = jest.fn();
  taskDetails = await getTaskDetails('1');
  wrapper = mount(
    <ReturnTransit
      task={taskDetails}
      onConfirm={onReturn}
      onCancel={onCancel}
    />
  );
});

describe('ReturnTransit', () => {
  it('should render', () => {
    expect(wrapper.find(Select).length).toEqual(2);
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
      expect(onReturn).toHaveBeenCalledTimes(0);
    });
  });

  it('should call task return api if form is valid', async () => {
    await act(async () => {
      findById(wrapper, 'returnTo').simulate('change', {
        target: { name: 'returnTo', value: '1', selectedIndex: 1 },
      });

      findById(wrapper, 'assignedTo').simulate('change', {
        target: { name: 'assignedTo', value: 'siva', selectedIndex: 1 },
      });

      findById(wrapper, 'reason').simulate('change', {
        target: { name: 'reason', value: 'areason' },
      });

      await sleep(10);
      wrapper.find('.fe_c_button--primary').last().simulate('click');
      await sleep(10);
      expect(onReturn).toHaveBeenCalledTimes(1);
    });
  });
});
