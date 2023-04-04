import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Button, Lightbox } from '@athena/forge';
import { sleep } from '../../../utils/TestUtils';
import NewDeployment from './NewDeployment';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });

describe('test <NewDeployment>', () => {
  let wrapper: any;
  let props: any;
  beforeEach(() => {
    props = {
      onDeploy: jest.fn(),
      disabled: false,
      selectedTasks: ['1', '2'],
      decisionServiceName: 'claims service',
    };
    wrapper = mount(<NewDeployment {...props} />);
  });

  it('should render NewDeployment element', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('should open create deeployment dialog', () => {
    act(async () => {
      wrapper.instance().showConfirmDeployDialog();
      await sleep(10);
      expect(wrapper.find(Lightbox)).toHaveLength(1);
    });
  });

  it('should hide create deeployment dialog', () => {
    wrapper.instance().hideConfirmDeployDialog();
    expect(wrapper.find(Lightbox)).toHaveLength(0);
  });

  it('should trigger on deploy ', () => {
    wrapper.instance().onConfirmDeploy();
    expect(props.onDeploy).toHaveBeenCalledTimes(1);
  });

  it('should trigger  handleEnter', () => {
    wrapper.instance().handleEnter(
      {
        key: 'Enter',
        preventDefault: () => {
          jest.fn;
        },
      },
      {
        handleChange: () => {
          jest.fn;
        },
        submitForm: () => {
          jest.fn;
        },
      }
    );
    expect(wrapper.find(Lightbox)).toHaveLength(0);
  });

  it('should trigger  getFormFieldProps', () => {
    wrapper.instance().getFormFieldProps('username', {
      getFieldProps: () => {
        jest.fn;
      },
      errors: [],
    });
    expect(wrapper.find(Lightbox)).toHaveLength(0);
  });
});
