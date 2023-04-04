import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WFTextarea from './WFTextarea';
import { FormField } from '@athena/forge';

configure({ adapter: new Adapter() });

let wrapper: any;
const formik: any = {
  values: { target: 'Test value' },
  touched: {},
  errors: {},
  setFieldValue: jest.fn(),
  getFieldProps: jest.fn(() => {
    return { value: 'test' };
  }),
};
const props = {
  formik: formik,
  mandatoryFields: {},
  label: 'Example',
  name: 'testExample',
  maxlength: 200,
  istextarea: true,
  disabled: false,
};
beforeEach(() => {
  wrapper = shallow(<WFTextarea {...props} />);
});

describe('test <WFTextarea>', () => {
  it('should render as expected', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });
  it('execute events', () => {
    const event: any = {
      target: {
        value: 'Change function',
        name: 'test',
        id: 'testClaimExample',
      },
    };
    wrapper.find(FormField).simulate('change', event);
    wrapper.find(FormField).simulate('focus', event);
    wrapper.find(FormField).simulate('blur', event);
  });
});
