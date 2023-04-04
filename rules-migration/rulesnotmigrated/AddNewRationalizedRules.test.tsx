import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { configure, mount } from 'enzyme';
import { Button } from '@athena/forge';
import AddNewRationalizedRules from './AddNewRationalizedRules';

configure({ adapter: new Adapter() });

describe('test <AddNewRationalizedRules>', () => {
  let wrapper: any;

  beforeEach(() => {
    const baseProps = {
      onAfterAdd: jest.fn(),
    };

    wrapper = mount(<AddNewRationalizedRules {...baseProps} />);
  });

  it('should render 1 <Button>', () => {
    expect(wrapper.find(Button)).toHaveLength(1);
  });

  it('toggle Lightbox', () => {
    wrapper.setState({
      showPopup: false,
    });
    wrapper.instance().toggleLightbox();
    expect(wrapper.state('showPopup')).toBe(true);
  });
});
