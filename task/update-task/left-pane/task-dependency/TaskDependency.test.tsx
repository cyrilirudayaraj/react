import { configure, mount } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import TaskDependency from './TaskDependency';
import { Formik, FormikValues } from 'formik';
import { sleep } from '../../../../../utils/TestUtils';
import AddDependency from './AddDependency';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail, TaskStep } from '../../../../../types/index';

jest.mock('../../../../../services/CommonService');
configure({ adapter: new Adapter() });
let store: any;
let taskDetails: TaskDetail;
beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '1';
  const taskStep: TaskStep = {} as TaskStep;
  taskDetails.taskSteps = [] as TaskStep[];
  taskDetails.taskSteps[0] = taskStep;
  taskDetails.taskSteps[0].name = 'Analyze Task';
  taskDetails.taskSteps[0].workflowStepId = '1';
  store = configureStore([])({
    task: {
      taskDetails: taskDetails,
    },
    userPermission: {
      userPermissions: ['task.update'],
    },
  });
});
describe('TaskDependency', () => {
  const props: FormikValues = {
    values: {
      index: 0,
      taskDependencies: [
        {
          deploymentDate: null,
          dependencyName: 'provi"der" number, missing, test 2',
          dependencyId: '30',
          taskId: '32',
          dependencyDate: '12/10/2020',
          version: '3',
          status: 'Pending Deployment',
          dependencySystemName: 'Atlas',
          description: null,
          ordering: null,
          dependencySystemId: '3',
          notes: 'test messages',
          type: 'deploy with',
          id: '1',
          completedYn: null,
        },
        {
          deploymentDate: null,
          dependencyName: 'FCN - Task Dependencies (View)',
          dependencyId: 'COLRDD-19169',
          taskId: '32',
          dependencyDate: null,
          version: '3',
          status: 'Code Review',
          dependencySystemName: 'Jira',
          description: null,
          ordering: null,
          dependencySystemId: '2',
          notes: null,
          type: 'deploy with',
          id: '2',
          completedYn: null,
        },
        {
          deploymentDate: '11/17/2020',
          dependencyName: 'provider number missing test 3',
          dependencyId: '33',
          taskId: '32',
          dependencyDate: null,
          version: '10',
          status: 'Deployed',
          dependencySystemName: 'Atlas',
          description: null,
          ordering: null,
          dependencySystemId: '3',
          notes: 'test message',
          type: 'test with',
          id: '3',
          completedYn: null,
        },
        {
          deploymentDate: null,
          dependencyName: 'UI changes',
          dependencyId: 'COLRDD-19488',
          taskId: '32',
          dependencyDate: null,
          version: '2',
          status: 'New',
          dependencySystemName: 'Jira',
          description: null,
          ordering: null,
          dependencySystemId: '2',
          notes: 'blocked by test message',
          type: 'blocked by',
          id: '4',
          completedYn: null,
        },
        {
          deploymentDate: null,
          dependencyName:
            'Local GA - Columbus Regional (FPC/OPC) [226] - Insurance Default - Override 195 for package 17045',
          dependencyId: '12356',
          taskId: '32',
          dependencyDate: null,
          version: '2',
          status: 'INPRODUCTION',
          dependencySystemName: 'Rule Tracker',
          description: null,
          ordering: null,
          dependencySystemId: '1',
          notes: null,
          type: 'deploy with',
          id: '5',
          completedYn: null,
        },
        {
          deploymentDate: '11/17/2020',
          dependencyName: 'provider number missing test 3',
          dependencyId: '33',
          taskId: '32',
          dependencyDate: null,
          version: '2',
          status: 'In Progres',
          dependencySystemName: 'Atlas',
          description: null,
          ordering: null,
          dependencySystemId: '3',
          notes: 'Specific deployment date test',
          type: 'blocked by',
          id: '6',
          completedYn: null,
        },
      ],
    },
    touched: {},
    errors: {},
    handleChange: (a: any) => a,
    handleBlur: (a: any) => a,
    handleSubmit: (a: any) => a,
    getFormFieldProps: jest.fn((fieldName: string, formik: any) => {
      return { value: 'test' };
    }),
    getFieldProps: jest.fn(() => {
      return { value: 'tets' };
    }),
  };

  let wrapper: any;
  let outerProps: any;

  beforeEach(() => {
    const { taskDependencies } = props.values;

    wrapper = mount(
      <Formik
        initialValues={{
          taskDependencies,
        }}
        onSubmit={jest.fn()}
        validate={jest.fn()}
      >
        {(formik) => {
          outerProps = {
            formik,
          };
          return (
            <Provider store={store}>
              <TaskDependency {...outerProps} />
            </Provider>
          );
        }}
      </Formik>
    );
  });

  it('should render as expected', () => {
    //@ts-ignore
    wrapper = mount(
      <Provider store={store}>
        <TaskDependency formik={props}></TaskDependency>
      </Provider>
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should open create dependency dialog when add clicked', async () => {
    wrapper.find('.root-add-button').last().simulate('click');
    await sleep(10);

    expect(wrapper.find(AddDependency).length).toEqual(1);
  });

  it('should close create dependency dialog when cancel clicked', async () => {
    wrapper.find('.root-add-button').last().simulate('click');
    await sleep(10);

    expect(wrapper.find(AddDependency).length).toEqual(1);
    wrapper.find('.fe_c_button--secondary').first().simulate('click');
    await sleep(10);
    expect(wrapper.find(AddDependency).length).toEqual(0);
  });
});
