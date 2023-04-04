import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';

import Adapter from 'enzyme-adapter-react-16';
import UpdateTaskLeftPane from './UpdateTaskLeftPane';
import { MockData } from '../../../../services/__mocks__/MockData';
import { Tabs } from '@athena/forge';
import { TaskDetailsMockData1 } from '../../../../services/__mocks__/TaskDetailsMockData';
import { Formik } from 'formik';
import { sleep } from '../../../../utils/TestUtils';
import { act } from 'react-dom/test-utils';

jest.mock('../../../../services/CommonService');

configure({ adapter: new Adapter() });

const mockStore = configureStore([]);

let store: any;
let wrapper: any;
let props: any;

beforeEach(() => {
  props = {
    history: {
      action: 'REPLACE',
      location: {
        hash: '',
        key: 'g1tdxz',
        pathname: '/collector/workflowtool/tasks/2093',
        search: '',
        state: '',
      },
      length: 2,
    },
    task: TaskDetailsMockData1,
  };

  store = mockStore({
    task: {
      taskDetails: TaskDetailsMockData1,
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
      originatingSystems: MockData.ORGINATINGSYSTEMS,
    },
  });
  store.dispatch = jest.fn();

  let outerProps;
  const { history } = props.history;
  wrapper = mount(
    <Provider store={store}>
      <Formik
        initialValues={{
          TaskDetailsMockData1,
        }}
        onSubmit={jest.fn()}
        validate={jest.fn()}
      >
        {(formik) => {
          outerProps = {
            formik,
            history,
            onSave: jest.fn(),
            onReturn: jest.fn(),
          };
          return <UpdateTaskLeftPane {...outerProps} />;
        }}
      </Formik>
    </Provider>
  );
});

describe('Update task left pane', () => {
  it('should render properly', () => {
    expect(wrapper.find(UpdateTaskLeftPane)).toHaveLength(1);
  });

  it('should handle tab change', async () => {
    await act(async () => {
      wrapper
        .find(Tabs)
        .props()
        .onTabsChange({ target: { value: 2 } });
      await sleep(10);
    });
  });
});
