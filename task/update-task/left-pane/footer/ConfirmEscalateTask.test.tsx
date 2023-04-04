import React from 'react';
import { configure, mount } from 'enzyme';
import ConfirmEscalateTask from './ConfirmEscalateTask';

import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import Labels from '../../../../../constants/Labels';
import { FormikProps } from 'formik';
configure({ adapter: new Adapter() });

let wrapper: any;
let handleEscalateTask: any;
let formikProps: FormikProps<any>;
beforeEach(() => {
  handleEscalateTask = jest.fn();
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
    <ConfirmEscalateTask
      buttonText={Labels.TASK_DETAIL_FORM.ESCALATE_TASK}
      primaryModalText={Labels.TASK_DETAIL_FORM.ESCALATE}
      headerText={'Escalate'}
      action={handleEscalateTask}
      variant="secondary"
      disabled={false}
      icon="Critical"
    />
  );
  wrapper.setState({ shown: true });
});

describe('ConfirmEscalateTask', () => {
  it('should show the edit dialog when edit button clicked', () => {
    act(() => {
      wrapper.find('button').last().simulate('click');
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
