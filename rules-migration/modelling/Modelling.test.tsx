import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import ModellingActions from './ModellingActions';
import Modelling from './Modelling';
import PaginationTable from '../pagination/PaginationTable';
import * as ToastSlice from '../../../slices/ToastSlice';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { Signpost } from '@athena/forge';

configure({ adapter: new Adapter() });

const addAttentionToast = jest.spyOn(ToastSlice, 'addAttentionToast');

let wrapper: any;
let store: any;
let wrappingComponent: any;
const rows = [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }];

describe('test <Modelling>', () => {
  beforeEach(() => {
    store = configureStore([])({
      userPermission: {
        userPermissions: [],
      },
    });
    store.dispatch = jest.fn();

    wrappingComponent = mount(
      <Provider store={store}>
        <Modelling />
      </Provider>
    );
    wrapper = wrappingComponent.find(Modelling);
  });

  it('should render <Signpost>', () => {
    expect(wrapper.find(Signpost)).toHaveLength(1);
  });

  it('should render <ModellingActions>', () => {
    wrapper.setState({ isParsed: true });
    expect(wrappingComponent.find(ModellingActions)).toHaveLength(1);
  });

  it('should render <PaginationTable>', () => {
    wrapper.setState({
      filename: 'archivedrules',
      data: rows,
      error: '',
      ruleid: '',
      toastMessage: {
        showToast: false,
        alertType: 'attention',
        headerText: '',
        message: '',
      },
    });
    expect(wrappingComponent.find(PaginationTable)).toHaveLength(1);
  });

  it('resetting state through handleChange() with a valid param', () => {
    const event = {
      target: {
        value: '1.2',
      },
    };
    wrapper.instance().handleChange(event);
    expect(wrapper.state('ruleid')).toBe('1.2');
  });

  it('resetting state through handleDate() with a valid param', () => {
    const date = new Date();
    const event = {
      target: {
        value: date,
      },
    };
    wrapper.instance().handleDate(event);
    expect(wrapper.state('startDate')).toBe(date);
  });

  it('resetting state through handleChange() with a null param', () => {
    const event = {
      target: {
        value: '',
      },
    };
    wrapper.instance().handleChange(event);
    expect(wrapper.state('ruleid')).toBeNull;
  });

  it('resetting state through handleClick() with a valid param', () => {
    wrapper.setState({
      ruleid: '1.234',
    });
    wrapper.instance().handleClick();
    expect(wrapper.state('ruleid')).toBe('1.234');
  });

  it('resetting state through handleClick() with a valid param', () => {
    wrapper.setState({
      ruleid: '',
      toastMessage: {
        showToast: false,
        alertType: 'attention',
        headerText: '',
        message: '',
      },
    });
    wrapper.instance().handleClick();
    expect(addAttentionToast).toHaveBeenCalled();
  });

  it('resetting state through handleClick() with a valid param', () => {
    wrapper.setState({
      ruleid: '1.234',
    });
    wrapper.instance().handleClick();
    expect(wrapper.state('ruleid')).toBe('1.234');
  });

  it('resetting state through handleDateSearch() with a valid param', () => {
    const date = new Date();
    wrapper.setState({
      startDate: date,
    });
    wrapper.instance().handleDateSearch();
    expect(wrapper.state('startDate')).toBe(date);
  });

  it('clearing state data with clearFilters()', () => {
    const date = new Date();
    wrapper.setState({
      ruleid: '1.1234',
      startDate: date,
    });
    wrapper.instance().clearFilters();
    expect(wrapper.state('ruleid')).toBeNull;
    expect(wrapper.state('startDate')).toBeNull;
  });

  it('resetting state through parseResponse() with a valid param', () => {
    const response = {
      total: 1,
      result: [{ id: 1 }],
    };
    wrapper.instance().parseResponse(response);
    expect(wrapper.state('data')).not.toBeNull();
  });

  it('resetting state through parseResponse() with a null param', () => {
    const response = {
      total: '0',
    };
    wrapper.instance().parseResponse(response);
    expect(wrapper.state('data')).toBeNull;
  });

  it('Open/Close File Chooser', () => {
    wrapper.instance().openFileChooserDialog();
    expect(wrapper.state('isFileChooserDialogEnabled')).toBe(true);

    wrapper.instance().hideFileChooserDialog();
    expect(wrapper.state('isFileChooserDialogEnabled')).toBe(false);
  });

  it('File chooser should be closed when upload file ', () => {
    wrapper.instance().openFileChooserDialog();
    expect(wrapper.state('isFileChooserDialogEnabled')).toBe(true);

    wrapper.instance().uploadFile(new Blob());
    expect(wrapper.state('isFileChooserDialogEnabled')).toBe(false);
  });
});
