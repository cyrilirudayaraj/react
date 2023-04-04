import { configure, shallow } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import TaskTestingDetail from './TaskTestingDetail';

configure({ adapter: new Adapter() });
import { FormikValues } from 'formik';

describe('TaskTestingDetail', () => {
  const props: FormikValues = {
    values: {},
    touched: {},
    errors: {},
    handleChange: (a) => a,
    handleBlur: (a) => a,
    handleSubmit: (a) => a,
    getFormFieldPRops: jest.fn(),
    getFieldProps: jest.fn(),
  };

  const testDetailComponent = shallow(
    <TaskTestingDetail mandatoryFields={jest.fn()} formik={props} />
  );
  it('should render as expected', () => {
    expect(testDetailComponent.debug()).toMatchSnapshot();
  });
});
