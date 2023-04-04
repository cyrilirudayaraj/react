import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { sleep, findById } from '../../../utils/TestUtils';
import { RulesMigrationSearch } from '../rulesmigration-search/RulesMigrationSearch';
jest.mock('../../../services/CommonService');

configure({ adapter: new Adapter() });

let wrapper: any;
let outerProps: any;
beforeEach(() => {
  outerProps = {
    onSearch: jest.fn(),
  };
  wrapper = mount(<RulesMigrationSearch {...outerProps} />);
});

describe('test <RuleMigration>: ', () => {
  it('should set values for default search fields', async () => {
    const searchData: any = {
      searchText: '5.88',
    };
    await act(async () => {
      await act(async () => {
        findById(wrapper, 'searchText')
          .last()
          .find('input')
          .simulate('change', {
            target: { name: 'searchText', value: searchData.searchText },
          });
      });
      await sleep(5);
      findById(wrapper, 'searchText').find('input').simulate('keypress', {
        key: 'Enter',
      });
      await sleep(5);
      findById(wrapper, 'searchText')
        .last()
        .find('input')
        .simulate('focus', {
          target: { name: 'searchText', value: '' },
        });
      await sleep(5);
    });
    expect(outerProps.onSearch).toBeCalledTimes(1);
  });
});
