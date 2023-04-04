import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WFReadOnlyInput from './WFReadOnlyInput';

configure({ adapter: new Adapter() });
let wrapper: any;

describe('snapshot test <WFReadOnlyInput>', () => {
  it('should render as label', () => {
    wrapper = shallow(<WFReadOnlyInput labelText="Patient Name" text="Roby" />);
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render as anchor', () => {
    wrapper = shallow(
      <WFReadOnlyInput labelText="Rule Id" text="1.1233" showAsLink={true} />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
