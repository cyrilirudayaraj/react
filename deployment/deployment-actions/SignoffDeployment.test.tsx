import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Lightbox } from '@athena/forge';
import { findById, sleep } from '../../../utils/TestUtils';
import SignoffDeployment from './SignoffDeployment';
import { DeploymentData1 } from '../../../services/__mocks__/DeploymentMockData';

jest.mock('../../../services/CommonService');

configure({ adapter: new Adapter() });

describe('test <SignoffDeployment>', () => {
  let wrapper: any;
  let props: any;

  beforeEach(() => {
    props = {
      deployResponse: DeploymentData1,
      onSignoff: jest.fn(),
    };
    wrapper = mount(<SignoffDeployment {...props} />);
  });

  it('should render SignoffDeployment element', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should open confirm Reject dialog when verify clicked', () => {
    findById(wrapper, 'signoff-deployment').simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(1);
  });

  it('should close confirm signoff dialog when close button clicked', () => {
    findById(wrapper, 'signoff-deployment').simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(1);
    wrapper.find('.my-close-button').last().simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(0);
  });

  it('should close confirm signoff dialog when cancel button clicked', () => {
    findById(wrapper, 'signoff-deployment').simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(1);
    wrapper.find('.fe_c_button__text--secondary').last().simulate('click');
    expect(wrapper.find(Lightbox)).toHaveLength(0);
  });

  it('should not call onSignoff callback if form is invalid', async () => {
    findById(wrapper, 'signoff-deployment').simulate('click');
    wrapper.find('.fe_c_button--primary').last().simulate('click');
    await sleep(5);
    expect(props.onSignoff).toHaveBeenCalledTimes(0);
  });

  it('should call onSignoff callback if form is valid', async () => {
    findById(wrapper, 'signoff-deployment').simulate('click');

    expect(wrapper.find(Lightbox)).toHaveLength(1);
    findById(wrapper, 'signoff1').simulate('change', {
      target: { name: 'signoff1', value: true },
    });

    findById(wrapper, 'signoff2').simulate('change', {
      target: { name: 'signoff2', value: true },
    });

    findById(wrapper, 'releaseVersion').simulate('change', {
      target: { name: 'releaseVersion', value: '3.0.3' },
    });
    wrapper.find('.fe_c_button--primary').last().simulate('click');
    await sleep(5);
    expect(props.onSignoff).toHaveBeenCalledTimes(1);
  });
});
