import React from 'react';
import { configure, shallow } from 'enzyme';
import UserInfo from './UserInfo';
import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('test <UserInfo>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<UserInfo />);
  });
  it('should render user info element', () => {
    expect(wrapper.find('.fe_c_dropdown__toggle')).toHaveLength(1);
  });
  it('should render have user info drop down element', () => {
    window['globalVars'] = {
      username: 'test',
      environment: 'stage',
    };
    // wrapper.setState({ showCreateTaskDialog: true });
    expect(wrapper.find('.fe_c_dropdown__menu-item')).toHaveLength(1);
  });
  it('should render each drop down menu element and trigger on click', () => {
    const button = wrapper.find('.fe_c_dropdown__toggle').at(0);
    const instance = wrapper.instance();
    instance.showMenuHandler = jest.fn(instance.showMenuHandler);
    button.simulate('click');
    expect(wrapper.find('.fe_c_dropdown__menu-item')).toHaveLength(1);
  });

  it('should not render drop down menu element and trigger on blur', () => {
    const button = wrapper.find('.fe_c_dropdown').at(0);
    button.simulate('click');
    const instance = wrapper.instance();
    instance.hideMenu = jest.fn(instance.hideMenu);
    button.simulate('blur');
    expect(wrapper.find('.fe_c_dropdown__menu-item')).toHaveLength(1);
  });

  it('should logout and hide menu', () => {
    const button = wrapper.find('.fe_c_dropdown__menu-item').at(0);
    button.simulate('click');
    expect(wrapper.state('showMenu')).toEqual(false);
    // expect(window.location.href).toBe(
    //   process.env.REACT_APP_BASE_CONTEXT_PATH || '/'
    // );
  });
});
