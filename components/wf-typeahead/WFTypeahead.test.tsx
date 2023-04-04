import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WFTypeahead from './WFTypeahead';

configure({ adapter: new Adapter() });
let wrapper: any;

const suggestions = ['apple', 'orange', 'banana'];

describe('snapshot test <WFTypeahead>', () => {
  it('should render as expected', () => {
    wrapper = shallow(
      <WFTypeahead label="Fruits" name="fruit" suggestions={suggestions} />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render with error', () => {
    wrapper = shallow(
      <WFTypeahead
        label="Fruits"
        name="fruit"
        suggestions={suggestions}
        showError={true}
      />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render with show error as false', () => {
    wrapper = shallow(
      <WFTypeahead
        label="Fruits"
        name="fruit"
        suggestions={suggestions}
        showError={false}
      />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
