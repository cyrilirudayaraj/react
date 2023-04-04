import { configure, shallow } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import DependencyReason from './DependencyReason';
import { FormField, Button } from '@athena/forge';
import { TaskDetail } from '../../../../../types';
import { TaskDetailsMockData1 } from '../../../../../services/__mocks__/TaskDetailsMockData';

configure({ adapter: new Adapter() });

describe('test DependencyReason', () => {
  let wrapper: any;

  const taskDetails = TaskDetailsMockData1 as TaskDetail;

  const props = {
    index: 0,
    autoComplete: 'off',
    required: true,
  };

  const formikOne: any = {
    values: {
      taskDependencies: [
        {
          dependencyName: 'Specific deployment date',
          dependencyDate: '12-01-2020',
        },
      ],
    },
    getFieldProps: jest.fn(),
    setFieldValue: jest.fn(),
  };

  const formikTwo: any = {
    values: {
      taskDependencies: [
        {
          dependencyName: 'Client/Internal communication',
          notes: 'test',
          statusName: 'pending',
          completedYn: '',
        },
      ],
    },
    getFieldProps: jest.fn(),
    setFieldValue: jest.fn(),
  };

  it('should handle reasonChange and dependencyDateChange', () => {
    wrapper = shallow(
      <DependencyReason
        {...props}
        formik={formikOne}
        hideActionButtons={false}
        task={taskDetails}
      />
    );
    const dateChangeEvent: any = {
      target: {
        value: {
          dependencyDate: '12-01-2020',
        },
      },
    };
    wrapper.find(FormField).last().simulate('blur', dateChangeEvent);

    const reasonChangeEvent: any = {
      target: {
        value: {
          dependencyCondition: 'blocked by',
          taskDependencies: [
            {
              dependencyName: 'Client/Internal communication',
              notes: 'test',
            },
          ],
        },
      },
      index: 0,
      id: 'taskDependencies.0.dependencyName',
    };
    wrapper.find(FormField).first().simulate('change', reasonChangeEvent);
    expect(wrapper.find(FormField)).toHaveLength(2);
    expect(wrapper.find(Button)).toHaveLength(2);
    wrapper.find(Button).first().simulate('click');
    wrapper.find(Button).last().simulate('click');
  });

  it('should handle statusChange', () => {
    wrapper = shallow(
      <DependencyReason
        {...props}
        formik={formikTwo}
        hideActionButtons={true}
        task={taskDetails}
      />
    );
    const statusChangeEvent: any = {
      target: {
        value: { statusName: 'completed' },
      },
      id: 'taskDependencies.0.dependencyName',
      tarId: 'taskDependencies.0.completedYn',
      index: 0,
    };
    wrapper.find(FormField).at(1).simulate('change', statusChangeEvent);
    expect(wrapper.find(FormField)).toHaveLength(3);
  });
});
