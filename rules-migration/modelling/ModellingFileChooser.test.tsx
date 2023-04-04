import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import ModellingFileChooser from './ModellingFileChooser';
import { Lightbox } from '@athena/forge';
import { act } from 'react-dom/test-utils';
import { sleep } from '../../../utils/TestUtils';

configure({ adapter: new Adapter() });

describe('test <ModellingFileChooser>', () => {
  let wrapper: any;
  let onFileChose: any;
  let onCancel: any;
  beforeEach(() => {
    onFileChose = jest.fn();
    onCancel = jest.fn();
    wrapper = mount(
      <ModellingFileChooser
        show={true}
        onPrimaryClick={onFileChose}
        onHide={onCancel}
      />
    );
  });

  it('should render Lightbox', () => {
    expect(wrapper.find(Lightbox)).toHaveLength(1);
  });

  it('should close the dialog when close button clicked', () => {
    act(() => {
      wrapper.find('.close-button').last().simulate('click');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should close the dialog when cancel button clicked', () => {
    act(() => {
      wrapper.find('.fe_c_button--secondary').last().simulate('click');
      expect(onCancel).toHaveBeenCalled();
    });
  });

  it('should not call file choose callack  on submit if no file is slected', () => {
    act(() => {
      wrapper.find('.fe_c_button--primary').last().simulate('click');
      expect(onFileChose).toHaveBeenCalledTimes(0);
    });
  });

  it('should not call file choose callack  on submit if  Form is valid', async () => {
    await act(async () => {
      wrapper.find("input[type='file']").simulate('change', {
        target: { files: [new Blob()] },
      });

      await sleep(10);
      wrapper.find('.fe_c_button--primary').last().simulate('click');
      await sleep(10);
      expect(onFileChose).toHaveBeenCalledTimes(1);
    });
  });
});
