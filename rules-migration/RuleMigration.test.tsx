import React from 'react';
import { configure, shallow, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RuleMigration from './RuleMigration';
import { TabPane } from '@athena/forge';
import RulesNotMigrated from './rulesnotmigrated/RulesNotMigrated';
import Modelling from './modelling/Modelling';
import DualMaintenance from './dualmaintenance/DualMaintenance';
import Archived from './archived/Archived';
import { act } from 'react-dom/test-utils';
import { sleep } from '../../utils/TestUtils';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
jest.mock('../../services/CommonService');

configure({ adapter: new Adapter() });

let wrapper: any;
let wrapperConnector: any;
let ruleMigrationComponent: any;
let store: any;
beforeEach(() => {
  store = configureStore([])({
    userPermission: {
      userPermissions: ['toolbar.rules-migr.read'],
    },
  });
  store.dispatch = jest.fn();
  wrapperConnector = mount(
    <Provider store={store}>
      <RuleMigration />
    </Provider>
  );
  ruleMigrationComponent = wrapperConnector.find(RuleMigration);
});

describe('test <RuleMigration>: ', () => {
  it('should render <RulesNotMigrated>', () => {
    wrapper = shallow(<RuleMigration />);
    expect(wrapper.find(RulesNotMigrated)).toHaveLength(1);
  });

  it('should render <Modelling>', () => {
    wrapper = shallow(<RuleMigration />);
    expect(wrapper.find(Modelling)).toHaveLength(1);
  });

  it('should render <DualMaintenance>', () => {
    wrapper = shallow(<RuleMigration />);
    expect(wrapper.find(DualMaintenance)).toHaveLength(1);
  });

  it('should render <Archived>', () => {
    wrapper = shallow(<RuleMigration />);
    expect(wrapper.find(Archived)).toHaveLength(1);
  });

  it('should render <TabPane>', () => {
    wrapper = shallow(<RuleMigration />);
    expect(wrapper.find(TabPane)).toHaveLength(5);
  });
  it('should set show search result state to false', async () => {
    await act(async () => {
      ruleMigrationComponent.setState({
        showSearchResults: true,
      });
      await sleep(5);
      ruleMigrationComponent.instance().onSearch({ searchText: '58' });
      await sleep(5);
      expect(ruleMigrationComponent.state('isSearchResultEmpty')).toEqual(
        false
      );
    });
  });
  it('should set show search result state to true', async () => {
    await act(async () => {
      ruleMigrationComponent.setState({
        showSearchResults: true,
      });
      await sleep(5);
      ruleMigrationComponent.instance().onSearch('abc');
      await sleep(5);
      expect(ruleMigrationComponent.state('isSearchResultEmpty')).toEqual(true);
    });
  });
});
