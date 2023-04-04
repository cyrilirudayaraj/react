import { configure, mount, ReactWrapper } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import DashboardPaginator from './DashboardPaginator';
import { Paginator } from '@athena/forge';

configure({ adapter: new Adapter() });

let wrapper: ReactWrapper;

const props = {
  total: 35,
  pageSize: 10,
  currentPage: 0,
};
describe('DashboardPaginator', () => {
  beforeAll(() => {
    wrapper = mount(<DashboardPaginator {...props} onPageChange={jest.fn} />);
  });

  it('renders properly', () => {
    expect(wrapper.find(Paginator)).toHaveLength(1);
  });
});
