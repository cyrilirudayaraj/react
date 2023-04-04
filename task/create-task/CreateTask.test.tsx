import React from 'react';
import CreateTaskConnector, { CreateTask } from './CreateTask';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { Lightbox } from '@athena/forge';
import { act } from 'react-dom/test-utils';
import { findByName, findById } from '../../../utils/TestUtils';
import { createMemoryHistory } from 'history';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { MockData } from '../../../services/__mocks__/MockData';

configure({ adapter: new Adapter() });
jest.mock('../../../services/CommonService');
let wrapper: any;
let store: any;
const history = createMemoryHistory();

describe('test <CreateTask>', () => {
  store = configureStore([])({
    toast: [],
    masterData: {
      taskTypes: MockData.TASKTYPES,
      users: MockData.USERS,
      prioritiesWithSla: MockData.PRIORITIES,
      originatingSystems: MockData.ORGINATINGSYSTEMS,
      departmentOrigins: MockData.DEPARTMENTORIGINS,
      brUpdateReasons: MockData.BRUPDATEREASONS,
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
        <CreateTaskConnector onCloseCreateTask={jest.fn()} history={history} />,
        {
          wrappingComponent: WrappingComponent,
        }
      );
      wrapper = wrapperConnecter;
    });
  });

  it('title should exist', () => {
    expect(wrapper.find('.fe_c_lightbox__header h1').text()).toEqual(
      'New Task'
    );
  });

  it('Should render lightbox', (done) => {
    expect(wrapper.find(Lightbox)).toHaveLength(1);
    done();
  });

  it('Should have fields', (done) => {
    expect(findByName(wrapper, 'name')).toHaveLength(1);
    expect(findById(wrapper, 'priorityId')).toHaveLength(1);
    expect(findById(wrapper, 'originatingSystemId')).toHaveLength(1);
    expect(findById(wrapper, 'departmentOriginId')).toHaveLength(1);
    displayErrorForField('taskTypeId', '#taskTypeId');
    displayErrorForField('businessRequirementName', '#businessRequirementName');
    setTaskTypeAsBusinessRequirementUpdate();
    displayErrorForField('businessRequirementValue');
    setTaskTypeAsNewBusinessRequirement();
    setTaskTypeAsDualUpdate();
    expect(findById(wrapper, 'originatingCaseId')).toHaveLength(1);
    expect(findById(wrapper, 'taskTypeId')).toHaveLength(1);
    expect(findByName(wrapper, 'legacyRuleId')).toHaveLength(1);
    expect(findById(wrapper, 'businessRequirementId')).toHaveLength(1);

    displayErrorForField('name');
    displayErrorForField('priorityId', '#priorityId');
    displayErrorForField('departmentOriginId', '#departmentOriginId');
    displayErrorForField('originatingCaseId');
    displayErrorForField('originatingSystemId', '#originatingSystemId');
    displayErrorForField('legacyRuleId');
    displayErrorForField('businessRequirementId');
    displayErrorForField('dueDate', '#dueDate');
    displayErrorForField('assignedTo', '#assignedTo');
    displayErrorForField('legacyTaskId', '#legacyTaskId');
    expect(findById(wrapper, 'businessRequirementName')).toHaveLength(1);
    expect(findById(wrapper, 'dueDate')).toHaveLength(1);
    expect(findById(wrapper, 'assignedTo')).toHaveLength(1);
    done();
  });

  it('form should submit and get success response', () => {
    const formValues = {
      name: 'test',
      priorityId: 1,
      dueDate: new Date(),
    };
    const history = createMemoryHistory();
    wrapper.setProps({ history: history });
    wrapper
      .find(CreateTask)
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
      priorityId: 2,
    };
    const history = createMemoryHistory();
    wrapper.setProps({ history: history });
    wrapper
      .find(CreateTask)
      .instance()
      .onSubmit(formValues, {
        setSubmiting: (isSubmitting: boolean) => {
          // isSubmitting
        },
      });
  });

  it('should trigger all legacyRuleId events', () => {
    setTaskTypeAsDualUpdate();
    setPrioritiesAs1();
    // If user enters less than 3 characters with not in pattern of
    // start with digit and second char "." and allow numbers
    findByName(wrapper, 'legacyRuleId').simulate('change', {
      target: { name: 'legacyRuleId', value: '1.' },
    });
    expect(findByName(wrapper, 'legacyRuleId').props().value).toBe('1.');
    expect(findById(wrapper, 'priorityId').props().value).toBe('1');

    findByName(wrapper, 'legacyRuleId').simulate('change', {
      target: { name: 'legacyRuleId', value: '1.0000' },
    });
    expect(findByName(wrapper, 'legacyRuleId').props().value).toBe('1.0000');

    findByName(wrapper, 'legacyRuleId').simulate('change', {
      target: { name: 'legacyRuleId', value: '1.166' },
    });

    expect(findByName(wrapper, 'legacyRuleId').props().value).toBe('1.166');

    findByName(wrapper, 'legacyRuleId')
      .props()
      .onBlur({ target: { name: 'legacyRuleId' } }, {});

    const businessRequirements = [
      {
        id: '1',
        name: 'Remove WAIVER before billing',
        legacyRuleId: '1.166',
      },
    ];
    wrapper
      .find('Autosuggest')
      .props()
      .onSuggestionSelected({}, { suggestion: businessRequirements[0] });
    expect(findByName(wrapper, 'legacyRuleId').props().value).toBe('1.166');
  });

  it('should trigger Priorities Change events', () => {
    setPrioritiesAs1();
    setTaskTypeAsDualUpdate();
    setPrioritiesAs1();

    expect(findById(wrapper, 'priorityId').props().value).toBe('1');
  });

  it('should trigger all businessRequirement events', () => {
    setTaskTypeAsBusinessRequirementUpdate();

    findByName(wrapper, 'businessRequirementValue').simulate('change', {
      target: { name: 'businessRequirementValue', value: 'Remo' },
    });
    expect(findByName(wrapper, 'businessRequirementValue').props().value).toBe(
      'Remo'
    );
  });

  it('should trigger dueDate onChange event', () => {
    setTaskTypeAsDualUpdate();
    wrapper
      .find('#dueDate')
      .last()
      .simulate('change', {
        target: { name: 'dueDate', value: new Date().toDateString() },
      });
    expect(findByName(wrapper, 'dueDate').props().value).toHaveLength(10);
  });

  it('should trigger legacyRuleId onChange event', () => {
    setTaskTypeAsDualMaintenanceNewBr();
    findByName(wrapper, 'legacyRuleId')
      .props()
      .onBlur({ target: { value: '1.166' } }, {});
    expect(findByName(wrapper, 'legacyRuleId')).toHaveLength(1);
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

    // TODO expect errormessages here
  }
});

describe('snapshot based testing', () => {
  it('CreateTask component', () => {
    wrapper = mount(
      <Provider store={store}>
        <CreateTaskConnector onCloseCreateTask={jest.fn()} history={history} />
      </Provider>
    );
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('CreateTask component during dual update', () => {
    wrapper = mount(
      <Provider store={store}>
        <CreateTaskConnector onCloseCreateTask={jest.fn()} history={history} />
      </Provider>
    );
    setTaskTypeAsDualUpdate();
    expect(findById(wrapper, 'taskTypeId').props().value).toBe('3');
  });
});

function setTaskTypeAsDualMaintenanceNewBr(): void {
  wrapper
    .find('#taskTypeId')
    .last()
    .simulate('change', {
      target: { name: 'taskTypeId', value: '4', selectedIndex: 1 },
    });
}

function setTaskTypeAsDualUpdate(): void {
  wrapper
    .find('#taskTypeId')
    .last()
    .simulate('change', {
      target: { name: 'taskTypeId', value: '3', selectedIndex: 1 },
    });
}

function setTaskTypeAsNewBusinessRequirement(): void {
  wrapper
    .find('#taskTypeId')
    .last()
    .simulate('change', {
      target: { name: 'taskTypeId', value: '2', selectedIndex: 1 },
    });
}

function setPrioritiesAs1(): void {
  wrapper
    .find('#priorityId')
    .last()
    .simulate('change', {
      target: { name: 'taskTypeId', value: '1', selectedIndex: 1 },
    });
}

function setTaskTypeAsBusinessRequirementUpdate(): void {
  wrapper
    .find('#taskTypeId')
    .last()
    .simulate('change', {
      target: { name: 'taskTypeId', value: '1', selectedIndex: 1 },
    });
}
