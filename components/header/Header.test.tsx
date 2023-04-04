import React from 'react';
import { configure, shallow } from 'enzyme';
import UserInfo from '../userinfo/UserInfo';
import Header from './Header';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('test <Header>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<Header />);
  });
  it('should render userInfo element', () => {
    window['globalVars'] = {
      environment: 'stage',
    };
    expect(wrapper.find(UserInfo)).toHaveLength(1);
  });
  it('should render img element', () => {
    expect(wrapper.find('img')).toHaveLength(1);
  });
  it('should render heading', () => {
    expect(wrapper.find('Heading')).toHaveLength(2);
  });
});
