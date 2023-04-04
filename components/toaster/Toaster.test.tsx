import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import Toaster from './Toaster';
import { Toast } from '@athena/forge';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import toastReducer, {
  addSuccessToast,
  addAttentionToast,
} from '../../slices/ToastSlice';

configure({ adapter: new Adapter() });

describe('test <Toaster>', () => {
  let wrapper: any;
  let store: any;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        toast: toastReducer,
      },
    });

    addAttentionToast({
      headerText: 'Task Not Created',
      message: 'An error occurred creating the task. Please try again.',
    })(store.dispatch);

    wrapper = mount(
      <Provider store={store}>
        <Toaster />
      </Provider>
    );
  });

  it('should render Toast element', () => {
    addSuccessToast({
      headerText: 'Task Created',
      message: 'This task was created.',
    })(store.dispatch);
    expect(wrapper.find(Toast)).toHaveLength(1);
  });

  it('should close Toast element', () => {
    expect(wrapper.find(Toast)).toHaveLength(1);
    wrapper.find(Toast).props().onDismiss();
    expect(store.getState().toast.length).toEqual(0);
  });
});
