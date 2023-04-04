import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WFShowForPermission from './WFShowForPermission';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';

configure({ adapter: new Adapter() });
let wrapper: any;
let store: any;
beforeEach(() => {
  window['globalVars'] = {
    enablePermission: 1,
  };
  store = configureStore([])({
    userPermission: {
      userPermissions: ['task.update'],
    },
  });
  store.dispatch = jest.fn();
});

describe('snapshot test <WFShowForPermission>', () => {
  it('should render as expected', () => {
    wrapper = mount(
      <Provider store={store}>
        <WFShowForPermission permission={'task.update'} />
      </Provider>
    );
    wrapper.setProps({ userPermissions: ['task.update'] });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render as expected', () => {
    wrapper = mount(
      <Provider store={store}>
        <WFShowForPermission permission={'task.create'} />
      </Provider>
    );
    wrapper.setProps({ userPermissions: ['task.update'] });
    expect(wrapper.debug()).toMatchSnapshot();
  });
});
