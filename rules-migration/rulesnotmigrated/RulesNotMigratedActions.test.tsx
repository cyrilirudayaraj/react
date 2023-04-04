import React from 'react';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RulesNotMigratedActions from './RulesNotMigratedActions';
import AddNewRationalizedRules from './AddNewRationalizedRules';

configure({ adapter: new Adapter() });

let wrapper: any;

describe('test <RulesNotMigratedActions>: ', () => {
  it('should render <Button>', () => {
    wrapper = shallow(<RulesNotMigratedActions onAfterAdd={jest.fn()} />);
    expect(wrapper.find(AddNewRationalizedRules)).toHaveLength(1);
  });
});
