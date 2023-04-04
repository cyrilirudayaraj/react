import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import GenerateReportConnector, { GenerateReport } from './GenerateReport';
import { Lightbox } from '@athena/forge';
import { act } from 'react-dom/test-utils';
import { findById, findByName } from '../../utils/TestUtils';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockData } from '../../services/__mocks__/MockData';

configure({ adapter: new Adapter() });
jest.mock('../../services/CommonService');
let wrapper: any;
let store: any;
const history = createMemoryHistory();
const DATE_TO_USE = new Date('2020');
const _Date = Date;
// @ts-ignore
global.Date = jest.fn(() => DATE_TO_USE);
global.Date.UTC = _Date.UTC;
global.Date.parse = _Date.parse;
global.Date.now = _Date.now;

describe('test <GenerateReport>', () => {
  store = configureStore([])({
    toast: [],
    masterData: {
      reportTypes: MockData.REPORTTYPES,
    },
  });
  store.dispatch = jest.fn();

  beforeEach(() => {
    act(() => {
      function WrappingComponent(props: any) {
        const { children } = props;
        return <Provider store={store}>{children}</Provider>;
      }
      //@ts-ignore
      const wrapperConnecter = mount(
        <GenerateReportConnector onCloseReport={jest.fn()} history={history} />,
        {
          wrappingComponent: WrappingComponent,
        }
      );
      wrapper = wrapperConnecter;
    });
  });

  it('title should exist', () => {
    expect(wrapper.find('h1').text()).toEqual('Reports');
  });
  it('Should render lightbox', (done) => {
    expect(wrapper.find(Lightbox)).toHaveLength(1);
    done();
  });
  it('Should have fields', (done) => {
    expect(findById(wrapper, 'reportTypeId')).toHaveLength(1);
    expect(findById(wrapper, 'startDate')).toHaveLength(1);
    expect(findById(wrapper, 'endDate')).toHaveLength(1);
    displayErrorForField('reportTypeId', '#reportTypeId');
    displayErrorForField('startDate', '#startDate');
    displayErrorForField('endDate', '#endDate');
    done();
  });

  it('form should submit and get success response', () => {
    const formValues = {
      name: 'test',
      reportTypeId: 1,
      endDate: new Date(),
    };
    const history = createMemoryHistory();
    wrapper.setProps({ history: history });
    wrapper
      .find(GenerateReport)
      .instance()
      .onSubmit(formValues, {
        setSubmiting: (isSubmitting: boolean) => {
          // isSubmitting
        },
      });
  });

  it('form should submit and failed', () => {
    const formValues = {
      name: 'test',
      reportTypeId: 2,
    };
    const history = createMemoryHistory();
    wrapper.setProps({ history: history });
    wrapper
      .find(GenerateReport)
      .instance()
      .onSubmit(formValues, {
        setSubmiting: (isSubmitting: boolean) => {
          // isSubmitting
        },
      });
  });

  it('should trigger Date onChange event', () => {
    wrapper
      .find('#endDate')
      .last()
      .simulate('change', {
        target: { name: 'endDate', value: new Date().toDateString() },
      });
    expect(findByName(wrapper, 'endDate').props().value).toBeDefined();
    wrapper
      .find('#startDate')
      .last()
      .simulate('change', {
        target: { name: 'startDate', value: new Date().toDateString() },
      });
    expect(findByName(wrapper, 'startDate').props().value).toBeDefined();
  });

  function displayErrorForField(name: string, id?: string, value = ''): void {
    const selector = id ? id : "input[name='" + name + "']";
    wrapper
      .find(selector)
      .last()
      .simulate('focus', {
        target: { name: name },
      })
      .simulate('blur', {
        target: { name: name, value: '' },
      });
  }
});

describe('snapshot based testing', () => {
  it('GenerateReport component', () => {
    wrapper = mount(
      <Provider store={store}>
        <GenerateReportConnector onCloseReport={jest.fn()} history={history} />
      </Provider>
    );
  });
});
