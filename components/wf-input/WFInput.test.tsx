import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WFInput from './WFInput';

configure({ adapter: new Adapter() });
let wrapper: any;

describe('snapshot test <WFInput>', () => {
  it('should render as expected', () => {
    wrapper = shallow(<WFInput label="Title" name="title" />);
    expect(wrapper.debug()).toMatchSnapshot();
  });
  it('should render required property', () => {
    wrapper = shallow(
      <WFInput label="Title" name="title" required={false} showError={true} />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });
  it('should render with show error as false', () => {
    wrapper = shallow(
      <WFInput label="Title" name="title" required={false} showError={false} />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
