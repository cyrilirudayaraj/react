import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Lightbox } from '@athena/forge';
import RejectDeployment from './RejectDeployment';
import { findById, sleep } from '../../../utils/TestUtils';

configure({ adapter: new Adapter() });

describe('test <RejectDeployment>', () => {
  let wrapper: any;
  let props: any;

  beforeEach(() => {
    props = {
      onReject: jest.fn(),
    };
    wrapper = mount(<RejectDeployment {...props} />);
  });

  it('should render RejectDeployment element', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should open confirm Reject dialog when Reject clicked', () => {
    findById(wrapper, 'reject-deployment').simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(1);
  });

  it('should close confirm Reject dialog when close button clicked', () => {
    findById(wrapper, 'reject-deployment').simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(1);
    wrapper.find('.my-close-button').last().simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(0);
  });

  it('should close confirm Reject dialog when cancel button clicked', () => {
    findById(wrapper, 'reject-deployment').simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(1);
    wrapper.find('.fe_c_button__text--secondary').last().simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(0);
  });

  it('should not call onReject callback if form is invalid', async () => {
    findById(wrapper, 'reject-deployment').simulate('click');
    wrapper.find('.fe_c_button--primary').last().simulate('click');
    await sleep(5);
    expect(props.onReject).toHaveBeenCalledTimes(0);
  });

  it('should call onReject callback if form is valid', async () => {
    findById(wrapper, 'reject-deployment').simulate('click');

    expect(wrapper.find(Lightbox)).toHaveLength(1);
    findById(wrapper, 'reason').simulate('change', {
      target: { name: 'reason', value: 'reason' },
    });
    wrapper.find('.fe_c_button--primary').last().simulate('click');
    await sleep(5);
    expect(props.onReject).toHaveBeenCalledTimes(1);
  });
});
