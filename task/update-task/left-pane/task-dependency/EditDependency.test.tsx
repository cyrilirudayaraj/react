import { configure, mount } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { Formik } from 'formik';
import { cloneDeep } from 'lodash';
import { sleep } from '../../../../../utils/TestUtils';
import DependencyReason from './DependencyReason';
import { Select } from '@athena/forge';
import EditDependency from './EditDependency';
import { TaskDependencyDetails, TaskDetail } from '../../../../../types';
import { TaskDetailsMockData3 } from '../../../../../services/__mocks__/TaskDetailsMockData';

configure({ adapter: new Adapter() });

jest.mock('../../../../../services/CommonService');

const taskDependency: TaskDependencyDetails = {
  deploymentDate: '',
  dependencyName: 'Client/Internal communication',
  dependencyId: '',
  taskId: '71',
  dependencyDate: '',
  version: '10',
  dependencyCondition: 'blocked by',
  dependencySystemName: '',
  description: '',
  ordering: '',
  dependencySystemId: '',
  notes: 'test',
  id: '5',
  completedYn: '',
  statusName: 'Pending',
};

describe('EditDependency', () => {
  let wrapper: any;
  let outerProps: any;
  let taskDetails: TaskDetail;

  beforeEach(() => {
    function WrappingComponent(props: any) {
      const { children } = props;
      return (
        <Formik initialValues={{}} onSubmit={jest.fn()} validate={jest.fn()}>
          {children}
        </Formik>
      );
    }

    taskDetails = cloneDeep(TaskDetailsMockData3);
    taskDetails.taskDependencies.push(taskDependency);

    outerProps = {
      show: true,
      taskDependency: taskDependency,
      task: taskDetails,
      onSave: jest.fn(),
      onCancel: jest.fn(),
    };

    wrapper = mount(<EditDependency {...outerProps} />, {
      wrappingComponent: WrappingComponent,
    });
  });

  it('should render', () => {
    expect(wrapper.find(EditDependency)).toHaveLength(1);
  });

  it('should close the dialog when confirmation get cancelled', async () => {
    wrapper.find('.fe_c_button--secondary').first().simulate('click');
    await sleep(10);

    expect(outerProps.onCancel).toBeCalled();
  });

  it('should save blocked by dependencies to the task details when confirmed', async () => {
    const dependencyReason = wrapper.find(DependencyReason).first();

    dependencyReason
      .find(Select)
      .first()
      .simulate('change', {
        target: {
          name: 'taskDependencies.0.dependencyName',
          value: 'CRMT-2',
        },
      });

    await sleep(10);

    wrapper.find('.fe_c_button--primary').first().simulate('click');
    await sleep(10);

    expect(outerProps.onSave).toBeCalled();
  });

  it('should not call save when form contain errors', async () => {
    const dependencyReason = wrapper.find(DependencyReason).first();
    dependencyReason
      .find(Select)
      .first()
      .simulate('change', {
        target: {
          name: 'taskDependencies.0.dependencyName',
          value: '',
        },
      });
    await sleep(10);

    wrapper.find('.fe_c_button--primary').first().simulate('click');
    await sleep(10);

    expect(outerProps.onSave).toBeCalledTimes(0);
  });
});
