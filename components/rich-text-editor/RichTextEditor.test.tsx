import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import RichTextEditor from './RichTextEditor';
import { findById } from '../../utils/TestUtils';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockData } from '../../services/__mocks__/MockData';

configure({ adapter: new Adapter() });
jest.mock('draft-js/lib/generateRandomKey', () => () => '123');

describe('test <RichTextEditor>', () => {
  let wrapper: any;
  const id = 'description';
  const wrapperId = 1;
  const eleWrapperId = 'rdw-wrapper-' + wrapperId;
  const formik: any = {
    values: { description: 'Testing value' },
    touched: {},
    errors: {},
    setFieldValue: jest.fn(),
  };

  beforeEach(() => {
    const store = configureStore([])({
      masterData: {
        users: MockData.USERS,
      },
      fetchUsersInfoOnce: jest.fn(),
    });
    store.dispatch = jest.fn();
    wrapper = mount(
      <Provider store={store}>
        <RichTextEditor
          id={id}
          wrapperId={wrapperId}
          labelText="Description"
          formik={formik}
          isDisabled={true}
          isRequired={true}
        ></RichTextEditor>
      </Provider>
    );
  });

  it('should render as expected', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('execute events', () => {
    findById(wrapper, eleWrapperId).simulate('blur');
    findById(wrapper, eleWrapperId).simulate('click');
    findById(wrapper, 'showmoreless-description').simulate('click');
  });

  it('Should set text color', () => {
    const textarea = wrapper.find('.public-DraftEditor-content').last();
    textarea.simulate('focus');
    const colorPickerIcon = wrapper.find('.text-color-picker');
    expect(colorPickerIcon.length).toBeGreaterThanOrEqual(1);

    colorPickerIcon.last().simulate('click');
    const colorPickerModal = wrapper.find('.rdw-colorpicker-modal.color');
    expect(colorPickerModal.length).toEqual(1);
    const colorPickerOption = colorPickerModal
      .find('.rdw-colorpicker-option')
      .first(); // #E25041
    colorPickerOption.simulate('click');

    findById(wrapper, eleWrapperId).simulate('blur');
  });

  it('Should set backgroud color', () => {
    const textarea = wrapper.find('.public-DraftEditor-content').last();
    textarea.simulate('focus');
    const bgcolorPickerIcon = wrapper.find('.bg-color-picker');
    expect(bgcolorPickerIcon.length).toBeGreaterThanOrEqual(1);

    bgcolorPickerIcon.last().simulate('click');
    const colorPickerModal = wrapper.find('.rdw-colorpicker-modal.bgcolor');
    expect(colorPickerModal.length).toEqual(1);
    const colorPickerOption = colorPickerModal
      .find('.rdw-colorpicker-option')
      .first(); // #E25041
    colorPickerOption.simulate('click');

    findById(wrapper, eleWrapperId).simulate('blur');
  });

  it('Should not close color picker modal dialog when switching between color and bgcolor', () => {
    const textarea = wrapper.find('.public-DraftEditor-content').last();
    textarea.simulate('focus');

    const colorPickerIcon = wrapper.find('.text-color-picker').last();
    const bgcolorPickerIcon = wrapper.find('.bg-color-picker').last();

    colorPickerIcon.simulate('click');
    expect(
      wrapper.find('.rdw-colorpicker-modal.color').length
    ).toBeGreaterThanOrEqual(1);

    bgcolorPickerIcon.simulate('click');
    expect(
      wrapper.find('.rdw-colorpicker-modal.bgcolor').length
    ).toBeGreaterThanOrEqual(1);

    colorPickerIcon.simulate('click');
    expect(
      wrapper.find('.rdw-colorpicker-modal.color').length
    ).toBeGreaterThanOrEqual(1);

    findById(wrapper, eleWrapperId).simulate('blur');
  });
});
