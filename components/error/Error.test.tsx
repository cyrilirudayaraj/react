import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';
import { Error } from './Error';
import { FormError } from '@athena/forge';

configure({ adapter: new Adapter() });

describe('test <CreateTask>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<Error />);
  });

  it('should render userInfo element', () => {
    expect(wrapper.find(FormError)).toHaveLength(1);
  });
});
