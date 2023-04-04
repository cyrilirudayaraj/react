import React from 'react';
import { configure, mount, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import WFEnableForPermission from './WFEnableForPermission';
import { Button } from '@athena/forge';

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
describe('snapshot test <WFEnableForPermission>', () => {
  it('should render as expected with permission', () => {
    wrapper = shallow(
      <Provider store={store}>
        <WFEnableForPermission permission={'task.update'} />
      </Provider>
    );
    wrapper.setProps({ userPermissions: ['task.update'] });
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should render the child component with permission', () => {
    wrapper = mount(
      <Provider store={store}>
        <WFEnableForPermission permission={'task.update'}>
          <Button text={'testButton'} />
        </WFEnableForPermission>
      </Provider>
    );
    expect(wrapper.find(Button).props().disabled).toEqual(false);
  });

  it('should disable the child component', () => {
    wrapper = mount(
      <Provider store={store}>
        <WFEnableForPermission permission={'task.create'}>
          <Button text={'testButton'} />
        </WFEnableForPermission>
      </Provider>
    );
    expect(wrapper.find(Button).props().disabled).toEqual(true);
  });
});
