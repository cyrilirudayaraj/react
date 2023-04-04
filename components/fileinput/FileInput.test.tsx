import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, shallow } from 'enzyme';

import FileInput from './FileInput';

configure({ adapter: new Adapter() });

describe('test <FileInput>', () => {
  let wrapper: any;

  beforeEach(() => {
    wrapper = shallow(<FileInput />);
  });

  it('should render file input element', () => {
    expect(wrapper.find("input[type='file']")).toHaveLength(1);
  });
});
