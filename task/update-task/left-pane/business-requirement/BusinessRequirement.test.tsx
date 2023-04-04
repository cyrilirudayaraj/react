import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail, TaskStep } from '../../../../../types';
import BusinessRequirement from './BusinessRequirement';
import { FormikProps } from 'formik';
import { findById, findByName } from '../../../../../utils/TestUtils';
import { MockData } from '../../../../../services/__mocks__/MockData';

configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');
jest.mock('draft-js/lib/generateRandomKey', () => () => '123');
let wrapper: any;
let store: any;
let taskDetails: TaskDetail;
let formikProps: FormikProps<any>;

beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '1';
  const taskStep: TaskStep = {} as TaskStep;
  taskDetails.taskSteps = [] as TaskStep[];
  taskDetails.taskSteps[0] = taskStep;
  taskDetails.taskSteps[0].id = '1';
  taskDetails.taskSteps[0].assignedTo = 'Prem';
  taskDetails.taskSteps[0].version = '100';

  store = configureStore([])({
    task: {
      taskDetails: taskDetails,
    },
    userPermission: {
      userPermissions: ['task.update'],
    },
    masterData: {
      businessRequirementTypes: MockData.BUSINESSREQUIREMENTTYPES,
      ruleReportingCategories: MockData.RULEREPORTINGCATEGORIES,
      localRuleUseCaseList: MockData.LOCALRULEUSECASES,
      ruleTypes: MockData.RULETYPES,
      visitRuleDisplayLocations: MockData.VISITRULEDISPLAYLOCATIONS,
      users: MockData.USERS,
    },
    updateTaskDetails: jest.fn(),
  });
  store.dispatch = jest.fn();

  formikProps = {} as FormikProps<any>;
  formikProps = {
    ...formikProps,
    values: { businessRequirementTypeId: '2' },
    touched: {},
    errors: {},
    handleChange: (a: any) => a,
    handleBlur: (a: any) => a,
    handleSubmit: (a) => a,
    getFieldProps: jest.fn(),
    setFieldValue: jest.fn(),
  };
});

describe('BusinessRequirement', () => {
  it('basic snapshot', () => {
    wrapper = mount(
      <Provider store={store}>
        <BusinessRequirement formik={formikProps} />
      </Provider>
    );

    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('fetch context list', () => {
    wrapper = mount(
      <Provider store={store}>
        <BusinessRequirement formik={formikProps} />
      </Provider>
    );

    findByName(wrapper, 'context').simulate('change', {
      target: { name: 'context', value: '98' },
    });

    findByName(wrapper, 'claimRuleCategory').simulate('change', {
      target: { name: 'claimRuleCategory', value: '1' },
    });

    findById(wrapper, 'businessRequirementTypeId').simulate('change', {
      target: { name: 'Global', value: '1' },
    });

    findById(wrapper, 'businessRequirementTypeId').simulate('change', {
      target: { name: 'Local', value: '2' },
    });

    wrapper
      .find('Autosuggest')
      .first()
      .props()
      .onSuggestionSelected(
        {},
        { suggestion: { value: '987 - WV Bolevd hospital' } }
      );

    wrapper
      .find('Autosuggest')
      .last()
      .props()
      .onSuggestionSelected(
        {},
        { suggestion: { value: '1 - Format: Institutional' } }
      );
  });
});
