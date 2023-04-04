import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BRDetails } from '../../../../types';
import { BRDetailsMockData1 } from '../../../../services/__mocks__/BRDetailsMockData';
import ViewAssociatedTaskConnector, {
  ViewAssociatedTask,
} from './ViewAssociatedTask';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';
import { sleep } from '../../../../utils/TestUtils';

configure({ adapter: new Adapter() });
jest.mock('../../../../services/CommonService');
let wrapper: any;
let wrappingComponent: any;
let store: any;
let brDetails: BRDetails;

describe('ViewAssociatedTask', () => {
  brDetails = BRDetailsMockData1;

  store = configureStore([])({
    userPermission: {
      userPermissions: [],
    },
    businessRequirement: {
      businessRequirementDetails: brDetails,
    },
  });

  store.dispatch = jest.fn();

  beforeEach(() => {
    act(() => {
      wrappingComponent = mount(
        <Provider store={store}>
          <Router>
            <ViewAssociatedTaskConnector />
          </Router>
        </Provider>
      );

      wrapper = wrappingComponent.find(ViewAssociatedTask);
    });
  });
  it('should call onchange function if any filter changes', async () => {
    const statusFilter = wrapper.find('#statusFilter').first();

    statusFilter.props().onFocus('statusFilter');

    statusFilter.props().onBlur('statusFilter');
    await act(async () => {
      statusFilter.props().onChange(
        {
          target: {
            value: ['All'],
            id: 'statusFilter',
          },
        },
        {}
      );
      await sleep(10);
    });
  });
  it('should call onchange function for status filter and cover all the filter condition ', async () => {
    const statusFilter = wrapper.find('#statusFilter').first();
    await act(async () => {
      statusFilter.props().onChange(
        {
          target: {
            value: ['Assigned'],
            id: 'statusFilter',
          },
        },
        {}
      );

      statusFilter.props().onChange(
        {
          target: {
            value: [''],
            id: 'statusFilter',
          },
        },
        {}
      );
      await sleep(10);
      wrapper.find('.fe_c_table__header--sortable').last().simulate('click');
      await sleep(10);
    });
  });
});
