import { configure, mount } from 'enzyme';
import React from 'react';
import Adapter from 'enzyme-adapter-react-16';
import DecisionTable from './DecisionTable';
import { Accordion, AccordionItem, Button, Modal } from '@athena/forge';
import { Formik } from 'formik';
import DecisionTableItem from './decision-table-item/DecisionTableItem';
import { TaskDetail } from '../../../../../types';
import configureStore from 'redux-mock-store';
import { Provider } from 'react-redux';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });

const taskDetails = {} as TaskDetail;
taskDetails.activeTaskStepId = '1';
const store = configureStore([])({
  task: {
    taskDetails: taskDetails,
  },
  masterData: { users: [] },
  userPermission: {
    userPermissions: ['task.update'],
  },
  updateTaskDetails: jest.fn(),
});
store.dispatch = jest.fn();

describe('DecisionTable', () => {
  let wrapper: any;
  const props: any = {
    taskDecisionTableDetails: [
      {
        description: '<p></p>↵',
        id: '5571',
        lastModified: null,
        lastModifiedBy: null,
        modelName: 'Test',
        name: 'Test',
        ordering: null,
        refId: '82',
        refUrl: 'www.test.com',
        taskId: '2093',
        version: '1',
      },
    ],
  };
  const mandatoryFields: any = {
    description: true,
    modelDesignChanges: true,
    name: true,
    testClaimExample: true,
  };

  beforeEach(() => {
    let outerProps;
    const { taskDecisionTableDetails } = props;

    wrapper = mount(
      <Provider store={store}>
        <Formik
          initialValues={{
            taskDecisionTableDetails,
          }}
          onSubmit={jest.fn()}
          validate={jest.fn()}
        >
          {(formik) => {
            outerProps = {
              formik,
              mandatoryFields,
              onSave: jest.fn(),
              onReturn: jest.fn(),
            };
            return <DecisionTable {...outerProps} />;
          }}
        </Formik>
      </Provider>
    );
  });
  it('should render as expected', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('it should have button', () => {
    expect(wrapper.find(Button)).toHaveLength(3);
  });

  it('it should have Accordion', () => {
    expect(wrapper.find(Accordion)).toHaveLength(1);
  });

  it('it should have AccordionItem', () => {
    expect(wrapper.find(AccordionItem)).toHaveLength(1);
  });

  it('it should have DecisionTableItem', () => {
    expect(wrapper.find(DecisionTableItem)).toHaveLength(1);
  });

  it('it should expand toggle', () => {
    act(() => {
      wrapper.find(Button).first().simulate('click');
    });
  });

  it('it should add and delete DecisionTableItem', async () => {
    await act(async () => {
      wrapper.find('.add-button').last().simulate('click');

      const event = { stopPropagation: jest.fn() };
      wrapper.find(DecisionTableItem).first().props().deleteAction(event);

      expect(wrapper.find(Modal)).toHaveLength(1);
      wrapper.find(Modal).props().onPrimaryClick();
    });
  });
});
