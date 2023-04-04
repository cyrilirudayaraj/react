import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WarningIcon from './WarningIcon';

configure({ adapter: new Adapter() });
let wrapper: any;

describe('snapshot test <WFInput>', () => {
  it('should render as expected', () => {
    wrapper = shallow(
      <WarningIcon
        warning={true}
        label={'Task ID'}
        tooltip={'Escalated P0 Task'}
        height={22}
        width={25}
      />
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
