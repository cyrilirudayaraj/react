import React from 'react';
import { configure, shallow } from 'enzyme';
import Layout from './components/layout/Layout';
import App from './App';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });

describe('test <App>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<App title="Rules2Workflow" />);
  });
  it('should render Layout element', () => {
    expect(wrapper.find(Layout)).toHaveLength(1);
  });
});
