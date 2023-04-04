import { configure, mount } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import { Formik } from 'formik';
import AddDependency from './AddDependency';
import { findById, sleep } from '../../../../../utils/TestUtils';
import DependencyReason from './DependencyReason';
import { Select } from '@athena/forge';
import AppConstants from '../../../../../constants/AppConstants';
import DependencySystem from './DependencySystem';
import { TaskDetail } from '../../../../../types';
import { TaskDetailsMockData1 } from '../../../../../services/__mocks__/TaskDetailsMockData';

configure({ adapter: new Adapter() });

jest.mock('../../../../../services/CommonService');

const TASK_DEPENDENCY = AppConstants.UI_CONSTANTS.TASK_DEPENDENCY;

describe('AddDependency', () => {
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

    taskDetails = TaskDetailsMockData1;

    outerProps = {
      show: true,
      task: taskDetails,
      onSave: jest.fn(),
      onCancel: jest.fn(),
    };

    wrapper = mount(<AddDependency {...outerProps} />, {
      wrappingComponent: WrappingComponent,
    });
  });

  describe('AddDependency', () => {
    it('should render', () => {
      expect(wrapper.find(AddDependency)).toHaveLength(1);
    });

    it('should close the dialog when confirmation get cancelled', async () => {
      wrapper.find('.fe_c_button--secondary').first().simulate('click');
      await sleep(10);

      expect(outerProps.onCancel).toBeCalled();
    });

    it('should save blocked by dependencies to the task details when confirmed', async () => {
      findById(wrapper, 'dependencyCondition').simulate('change', {
        target: {
          name: 'dependencyCondition',
          value: TASK_DEPENDENCY.BLOCKED_BY,
        },
      });
      await sleep(10);

      const dependencyReason = wrapper.find(DependencyReason).first();

      dependencyReason.find('.add-button').first().simulate('click');
      await sleep(10);
      dependencyReason.find('.delete-button').first().simulate('click');
      await sleep(10);

      dependencyReason.find(Select).simulate('change', {
        target: {
          name: 'taskDependencies.0.dependencyName',
          value: 'CRMT',
        },
      });

      await sleep(10);

      wrapper.find('.fe_c_button--primary').first().simulate('click');
      await sleep(10);

      expect(outerProps.onSave).toBeCalled();
    });

    it('should not call save when form contain errors', async () => {
      findById(wrapper, 'dependencyCondition').simulate('change', {
        target: {
          name: 'dependencyCondition',
          value: TASK_DEPENDENCY.BLOCKED_BY,
        },
      });
      await sleep(10);

      wrapper.find('.fe_c_button--primary').first().simulate('click');
      await sleep(10);

      expect(outerProps.onSave).toBeCalledTimes(0);
    });

    it('should not allow to add test with dependencies post "Test Changes" step', async () => {
      findById(wrapper, 'dependencyCondition').simulate('change', {
        target: {
          name: 'dependencyCondition',
          value: TASK_DEPENDENCY.TEST_WITH,
        },
      });
      await sleep(10);

      const dependencySystem = wrapper.find(DependencySystem).first();
      dependencySystem.find(Select).simulate('change', {
        target: {
          name: 'taskDependencies.0.dependencySystemId',
          value: '3',
        },
      });
      dependencySystem.find(Select).simulate('change', {
        target: {
          name: 'taskDependencies.0.dependencyId',
          value: '1',
        },
      });

      await sleep(10);

      wrapper.find('.fe_c_button--primary').first().simulate('click');
      await sleep(10);

      expect(outerProps.onSave).toBeCalledTimes(0);
    });

    it('should save test with dependencies to the task details when confirmed', async () => {
      findById(wrapper, 'dependencyCondition').simulate('change', {
        target: {
          name: 'dependencyCondition',
          value: TASK_DEPENDENCY.DEPLOY_WITH,
        },
      });
      await sleep(10);

      const dependencySystem = wrapper.find(DependencySystem).first();
      dependencySystem.find('.add-button').first().simulate('click');
      await sleep(10);
      dependencySystem.find('.delete-button').first().simulate('click');
      await sleep(10);

      dependencySystem.find(Select).simulate('change', {
        target: {
          name: 'taskDependencies.0.dependencySystemId',
          value: '3',
        },
      });
      dependencySystem.find(Select).simulate('change', {
        target: {
          name: 'taskDependencies.0.dependencyId',
          value: '3',
        },
      });

      await sleep(10);

      wrapper.find('.fe_c_button--primary').first().simulate('click');
      await sleep(10);

      expect(outerProps.onSave).toBeCalled();
    });
  });
});
