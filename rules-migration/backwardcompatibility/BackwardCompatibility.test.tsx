import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import BackwardCompatibility from './BackwardCompatibility';
import PaginationTable from '../pagination/PaginationTable';
import configureStore from 'redux-mock-store';
import { Signpost } from '@athena/forge';
import { Provider } from 'react-redux';

configure({ adapter: new Adapter() });

let wrapper: any;
let store: any;
let wrappingComponent: any;
const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

beforeEach(() => {
  store = configureStore([])({
    userPermission: {
      userPermissions: [],
    },
  });
  store.dispatch = jest.fn();
  wrappingComponent = mount(
    <Provider store={store}>
      <BackwardCompatibility />
    </Provider>
  );
  wrapper = wrappingComponent.find(BackwardCompatibility);
});
describe('test <BackwardCompatibility>', () => {
  it('should render <Objective>', () => {
    expect(wrapper.find(Signpost)).toHaveLength(1);
  });

  it('should render <PaginationTable>', () => {
    wrapper.setState({
      filename: 'backwardcompatibilityrules',
      data: rows,
      error: '',
      ruleid: '',
      toastMessage: {
        showToast: false,
        alertType: 'attention',
        headerText: '',
        message: '',
      },
    });
    expect(wrappingComponent.find(PaginationTable)).toHaveLength(1);
  });

  it('resetting state through parseResponse() with a valid param', () => {
    const response = {
      total: 1,
      result: [{ id: 1 }],
    };
    wrapper.instance().parseResponse(response);
    expect(wrapper.state('data')).not.toBeNull();
  });

  it('resetting state through parseResponse() with a null param', () => {
    const response = {
      total: '0',
    };
    wrapper.instance().parseResponse(response);
    expect(wrapper.state('data')).toBeNull;
  });
});
