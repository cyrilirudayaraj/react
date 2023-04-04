import React from 'react';
import { configure, mount } from 'enzyme';

import Adapter from 'enzyme-adapter-react-16';
import { act } from 'react-dom/test-utils';
import { Formik, connect } from 'formik';

jest.mock('../../../../../services/CommonService');
import UpdateTaskFooterConnecter, {
  UpdateTaskFooter,
} from './UpdateTaskFooter';

import { Provider } from 'react-redux';

import store from '../../../../../store/store';
import { fetchTaskDetails } from '../../../../../slices/TaskSlice';
store.dispatch(fetchTaskDetails('1'));

configure({ adapter: new Adapter() });

let wrapper: any;

let outerProps: any;
let wrapperConnecter: any;

beforeEach(() => {
  function WrappingComponent(props: any) {
    const { children } = props;

    return (
      <Provider store={store}>
        <Formik initialValues={{}} onSubmit={jest.fn()} validate={jest.fn()}>
          {children}
        </Formik>
      </Provider>
    );
  }

  outerProps = {
    onSave: jest.fn(),
  };
  const FooterElement = connect<any, any>(UpdateTaskFooterConnecter);

  wrapperConnecter = mount(<FooterElement {...outerProps} />, {
    wrappingComponent: WrappingComponent,
  });

  wrapper = wrapperConnecter.find(UpdateTaskFooter);
});

describe('UpdateTaskFooter', () => {
  it('should render', () => {
    expect(wrapper.find('.update-task-footer')).toHaveLength(1);
  });

  it('should render confirm dialog when onsubmit button clicked', async () => {
    expect(wrapper.state().shown).toEqual(false);
    await act(async () => {
      wrapper.find('button#nextbtn').simulate('click');
      await setImmediate(() => {
        expect(wrapper.state().shown).toEqual(true);
      });
    });
  });

  it('should close the dialog when confirmation get cancelled', async () => {
    await act(async () => {
      wrapper.find('button#nextbtn').simulate('click');
      await setImmediate(() => {
        expect(wrapper.state().shown).toEqual(true);
        wrapper.instance().closeConfirmDialog();
        expect(wrapper.state().shown).toEqual(false);
      });
    });
  });

  it('should close the dialog and submit the form when confirmed', async () => {
    await act(async () => {
      wrapper.find('button#nextbtn').simulate('click');
      await setImmediate(() => {
        expect(wrapper.state().shown).toEqual(true);
        wrapper.instance().onConfirm({});
        expect(wrapper.state().shown).toEqual(false);
      });
    });
  });
});
