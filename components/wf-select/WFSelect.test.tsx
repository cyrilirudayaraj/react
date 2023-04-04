import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WFSelect from './WFSelect';

configure({ adapter: new Adapter() });
let wrapper: any;

const options = [
  {
    text: 'Apple',
    value: 'apple',
  },
  {
    text: 'Orange',
    value: 'orange',
  },
  {
    text: 'Banana',
    value: 'banana',
  },
];

describe('snapshot test <WFSelect>', () => {
  it('should render as expected', () => {
    wrapper = shallow(
      <WFSelect label="Fruits" name="fruit" options={options} />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render with other', () => {
    wrapper = shallow(
      <WFSelect
        label="Fruits"
        name="fruit"
        options={options}
        required={false}
        showError={true}
      />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render with show as false', () => {
    wrapper = shallow(
      <WFSelect
        label="Fruits"
        name="fruit"
        options={options}
        required={false}
        showError={false}
      />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
