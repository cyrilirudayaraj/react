import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import PriorityPolicy from './PriorityPolicy';
import { Popover } from '@athena/forge';

configure({ adapter: new Adapter() });
let wrapper: any;

describe('PriorityPolicy', () => {
  beforeEach(() => {
    wrapper = mount(<PriorityPolicy priorityPolicies={[]} />);
  });

  it('should render PriorityPolicy', () => {
    expect(wrapper.find('button.priority-policy-icon')).toHaveLength(1);
  });

  it('should render priortiy policy dialog when info icon clicked', () => {
    wrapper.find('.priority-policy-icon').last().simulate('click');
    act(() => {
      expect(wrapper.find(Popover).props().isOpen).toEqual(true);
    });
  });

  it('should close priortiy policy dialog when close icon clicked', () => {
    wrapper.find('.priority-policy-icon').last().simulate('click');

    expect(wrapper.find(Popover).props().isOpen).toEqual(true);
    wrapper.find('.fe_c_popup__close-button button').last().simulate('click');
    act(() => {
      expect(wrapper.find(Popover).props().isOpen).toEqual(false);
    });
  });
});
