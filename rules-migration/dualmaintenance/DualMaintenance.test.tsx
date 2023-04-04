import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import DualMaintenance from './DualMaintenance';
import PaginationTable from '../pagination/PaginationTable';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Signpost } from '@athena/forge';

configure({ adapter: new Adapter() });

let wrapper: any;
let store: any;
let wrappingComponent: any;
const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

describe('test <DualMaintenance>', () => {
  beforeEach(() => {
    store = configureStore([])({
      userPermission: {
        userPermissions: [],
      },
    });
    store.dispatch = jest.fn();

    wrappingComponent = mount(
      <Provider store={store}>
        <DualMaintenance />
      </Provider>
    );
    wrapper = wrappingComponent.find(DualMaintenance);
  });

  it('should render <Signpost>', () => {
    expect(wrapper.find(Signpost)).toHaveLength(1);
  });

  it('should render <PaginationTable>', () => {
    wrapper.setState({
      filename: 'archivedrules',
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
