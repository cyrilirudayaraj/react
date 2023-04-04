import React from 'react';
import { configure, mount } from 'enzyme';
import AlertBtn from './AlertBtn';

import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Labels from '../../constants/Labels';
import { FormikProps } from 'formik';
configure({ adapter: new Adapter() });

let wrapper: any;
let deleteAttachment: any;
let formikProps: FormikProps<any>;
beforeEach(() => {
  deleteAttachment = jest.fn();
  formikProps = {} as FormikProps<any>;
  formikProps = {
    ...formikProps,
    values: '',
    touched: {},
    errors: {},
    handleChange: (a: any) => a,
    handleBlur: (a: any) => a,
    handleSubmit: (a) => a,
    setValues: (a: any) => a,
    resetForm: jest.fn(),
    getFieldProps: jest.fn(),
    setFieldValue: jest.fn(),
  };
  wrapper = mount(
    <AlertBtn
      className="delete-button"
      primaryModalText={Labels.DOCUMENTS.PRIMARY_MODAL_TEXT_DELETE}
      messageText={Labels.DOCUMENTS.MESSAGE_TEXT_DELETE}
      headerText={Labels.DOCUMENTS.HEADER_TEXT_DELETE}
      action={deleteAttachment}
      variant="tertiary"
      disabled={false}
      icon={Labels.DOCUMENTS.ICON_DELETE}
      attachmentid="1"
      version="1"
    />
  );
  wrapper.setState({ shown: true });
});

describe('AlertBtn', () => {
  it('basic snapshot', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  //   it('should close the dialog when close button clicked', () => {
  //     act(() => {
  //       wrapper.find('.my-close-button').last().simulate('click');
  //       wrapper.instance().hideLightBox;
  //       expect(wrapper.state().shown).toEqual(true);
  //     });
  //   });
  it('should show the edit dialog when edit button clicked', () => {
    act(() => {
      wrapper.find('button.delete-button').last().simulate('click');
      wrapper.instance().showModal();
      expect(wrapper.state().shown).toEqual(true);
    });
  });
  it('should close the dialog when cancel button clicked', () => {
    act(() => {
      wrapper.find('.fe_c_button--secondary').last().simulate('click');
      wrapper.instance().hideModal();
      expect(wrapper.state().shown).toEqual(true);
    });
  });

  it('should fill the form and submit', async () => {
    await act(async () => {
      wrapper.find('.fe_c_button--primary').simulate('click');
    });
  });
});
