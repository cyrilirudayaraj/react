import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ModellingActions from './ModellingActions';
import { Button } from '@athena/forge';

configure({ adapter: new Adapter() });

let wrapper: any;

describe('test <ModellingActions>: ', () => {
  it('should render <Button>', () => {
    wrapper = shallow(<ModellingActions />);
    expect(wrapper.find(Button)).toHaveLength(1);
  });
});
