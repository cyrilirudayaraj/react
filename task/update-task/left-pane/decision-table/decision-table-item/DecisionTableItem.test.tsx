import { configure, mount } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import DecisionTableItem from './DecisionTableItem';
import { AccordionItem } from '@athena/forge';
import { FormikValues } from 'formik';
import { Provider } from 'react-redux';
import { TaskDetail } from '../../../../../../types';
import configureStore from 'redux-mock-store';

configure({ adapter: new Adapter() });

const taskDetails = {} as TaskDetail;
taskDetails.activeTaskStepId = '1';

const store = configureStore([])({
  task: {
    taskDetails: taskDetails,
  },
  userPermission: {
    userPermissions: ['task.update'],
  },
  updateTaskDetails: jest.fn(),
});
store.dispatch = jest.fn();
describe('DecisionTableItem', () => {
  const props: FormikValues = {
    values: {
      index: 0,
      formik: {},
    },
    touched: {},
    errors: {},
    handleChange: (a) => a,
    handleBlur: (a) => a,
    handleSubmit: (a) => a,
    getFormFieldProps: jest.fn((fieldName: string, formik: any) => {
      return { value: 'test' };
    }),
    getFieldProps: jest.fn(() => {
      return 'tets';
    }),
    deleteAction: (a) => a,
  };

  const wrapper = mount(
    <Provider store={store}>
      <DecisionTableItem formik={props} mandatoryFields={jest.fn()} />
    </Provider>
  );
  it('should render as expected', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('AccordionItem renders properly', () => {
    expect(wrapper.find(AccordionItem)).toHaveLength(1);
  });
});
