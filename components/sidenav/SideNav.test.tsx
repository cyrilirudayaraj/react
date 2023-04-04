import React from 'react';
import { configure, shallow } from 'enzyme';
import SideNav from './SideNav';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('test <SideNav>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<SideNav />);
  });
  it('should render SideMenu element', () => {
    expect(wrapper.find('.menu-link')).toHaveLength(10);
  });
});
