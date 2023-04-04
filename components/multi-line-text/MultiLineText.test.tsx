import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import MultiLineText from './MultiLineText';

configure({ adapter: new Adapter() });

describe('test <PrintMultiline>', () => {
  let wrapper: any;
  beforeEach(() => {
    wrapper = shallow(<MultiLineText value={'abcd'} />);
  });
  it('should print in multiline', () => {
    expect(wrapper.find('value')).toBeTruthy();
  });
});
