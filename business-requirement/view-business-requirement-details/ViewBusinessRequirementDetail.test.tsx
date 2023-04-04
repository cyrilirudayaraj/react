import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { BRDetails } from '../../../types';
import { BRDetailsMockData1 } from '../../../services/__mocks__/BRDetailsMockData';
import ViewBusinessRequirementDetailConnector, {
  ViewBusinessRequirementDetail,
} from './ViewBusinessRequirementDetail';
import { act } from 'react-dom/test-utils';
import { BrowserRouter as Router } from 'react-router-dom';

configure({ adapter: new Adapter() });
jest.mock('../../../services/CommonService');
let wrapper: any;
let wrappingComponent: any;
let store: any;
let brDetails: BRDetails;

describe('ViewBusinessRequirementDetail', () => {
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
      const match = {
        params: {
          id: 1251,
        },
      };
      wrappingComponent = mount(
        <Provider store={store}>
          <Router>
            <ViewBusinessRequirementDetailConnector match={match} />
          </Router>
        </Provider>
      );

      wrapper = wrappingComponent.find(ViewBusinessRequirementDetail);
    });
  });

  it('should render', () => {
    expect(wrapper.find('.header-name').last().text()).toEqual('BR-001251');
  });
});
