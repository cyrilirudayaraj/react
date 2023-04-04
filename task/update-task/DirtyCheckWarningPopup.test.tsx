import { Button, Lightbox } from '@athena/forge';
import { configure, shallow } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { DirtyCheckWarningPopup } from './DirtyCheckWarningPopup';

configure({ adapter: new Adapter() });

const props: any = {
  show: true,
  onRejectBtn: jest.fn(),
  onCancelBtn: jest.fn(),
  onSaveBtn: jest.fn(),
};
describe('test DirtyCheckWarningPopup', () => {
  it('should render properly', () => {
    const wrapper = shallow(<DirtyCheckWarningPopup {...props} />);

    expect(wrapper.find(Lightbox)).toHaveLength(1);
    expect(wrapper.find(Button)).toHaveLength(3);

    wrapper.find(Button).at(0).simulate('click');
    wrapper.find(Button).at(1).simulate('click');
    wrapper.find(Button).at(2).simulate('click');
  });
});
