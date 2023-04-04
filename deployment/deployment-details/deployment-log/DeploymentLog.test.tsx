import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Table } from '@athena/forge';
import DeploymentLog from './DeploymentLog';
import { DeploymentData1 } from '../../../../services/__mocks__/DeploymentMockData';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

configure({ adapter: new Adapter() });

describe('test <DeploymentLog>', () => {
  let wrapper: any;
  let store: any;

  beforeEach(() => {
    store = configureStore([])({
      userPermission: {
        userPermissions: ['task.deploy'],
      },
    });
    store.dispatch = jest.fn();

    wrapper = mount(
      <Provider store={store}>
        <DeploymentLog response={DeploymentData1} />
      </Provider>
    );
  });

  it('should render DeploymentLog element', () => {
    expect(wrapper.find(Table)).toHaveLength(1);
  });
});
