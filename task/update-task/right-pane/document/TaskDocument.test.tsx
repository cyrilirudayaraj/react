import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import React from 'react';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { TaskDetail } from '../../../../../types/index';
import TaskDocument from './TaskDocument';
import AddDocument from './AddDocument';
import { AttachmentList } from './AttachmentList';
import { Formik } from 'formik';
configure({ adapter: new Adapter() });

let wrapper: any;
let wrapperConnector: any;
let taskDetails: TaskDetail;
let store: any;
const attachments: any = [];
let attachmentType: any = [];
let payload: any;
let deletePayload: any;
beforeEach(() => {
  taskDetails = {} as TaskDetail;
  taskDetails.activeTaskStepId = '16';
  taskDetails.id = '1';
  attachments[0] = {
    id: '1',
    taskId: '1',
    taskStepId: '16',
    description: 'Test cyril content 1',
    fileName: 'Marksheet',
    filePath: 'https://www.drive.in/cover',
    attachmentName: 'Local Rule Authorization',
    attachmentTypeId: '1',
    createdBy: 'jcyril',
    created: '08/15/2020 03:22:13',
  };
  attachments[1] = {
    id: '2',
    taskId: '1',
    taskStepId: '16',
    description: 'Test cyril content 2',
    fileName: 'excelsheet',
    filePath: 'https://www.drive.in/cover',
    attachmentName: 'Payer Documentation',
    attachmentTypeId: '2',
    createdBy: 'jcyril',
    created: '08/15/2020 03:22:13',
  };
  attachments[2] = {
    id: '4',
    taskId: '1',
    taskStepId: '16',
    description: 'Test cyril content 3',
    fileName: 'rule documents',
    filePath: 'https://www.drive.in/cover',
    attachmentName: 'Data Support',
    attachmentTypeId: '3',
    createdBy: 'jcyril',
    created: '08/15/2020 03:22:13',
  };
  attachments[3] = {
    id: '5',
    taskId: '1',
    taskStepId: '16',
    description: 'Test cyril content 4',
    fileName: 'task types',
    filePath: 'https://www.drive.in/cover',
    attachmentName: 'Athenanet Screenshot',
    attachmentTypeId: '4',
    createdBy: 'jcyril',
    created: '08/15/2020 03:22:13',
  };
  attachments[4] = {
    id: '6',
    taskId: '1',
    taskStepId: '16',
    description: 'Test cyril content 5',
    fileName: 'attachments',
    filePath: 'https://www.drive.in/cover',
    attachmentName: 'Client clarification',
    attachmentTypeId: '5',
    createdBy: 'jcyril',
    created: '08/15/2020 03:22:13',
  };
  attachmentType = [
    { value: '1', text: 'Local Rule Authorization' },
    { value: '2', text: 'Payer Documentation' },
    { value: '3', text: 'Data Support' },
    { value: '4', text: 'Athenanet Screenshot' },
    { value: '5', text: 'Client clarification' },
  ];
  store = configureStore([])({
    task: {
      taskDetails: taskDetails,
    },
    userPermission: {
      userPermissions: ['task.update'],
    },
    attachment: {
      attachmentDetail: attachments,
    },
    fetchAttachementDetails: jest.fn(),
    setAttachmentDetail: jest.fn(),
  });
  store.dispatch = jest.fn();
  wrapperConnector = mount(
    <Provider store={store}>
      <Formik initialValues={{}} onSubmit={jest.fn()} validate={jest.fn()}>
        <TaskDocument />
      </Formik>
    </Provider>
  );
  wrapper = wrapperConnector.find(AttachmentList);
  wrapper.setState({ attachmentType: attachmentType });
  payload = {
    id: '1',
    taskId: '1',
    taskStepId: '16',
    description: 'Test cyril content 1',
    fileName: 'Marksheet',
    filePath: 'https://www.drive.in/cover',
    attachmentName: 'Local Rule Authorization',
    attachmentTypeId: '1',
    createdBy: 'jcyril',
    version: '1',
  };
  deletePayload = {
    id: '1',
    taskId: '1',
    deleted: '09/16/2020',
    version: '1',
  };
});

describe('Task Document', () => {
  it('basic snapshot', () => {
    expect(wrapper.debug()).toMatchSnapshot();
    wrapper.instance().addAttachment(payload);
    wrapper.instance().updateAttachment(payload);
    wrapper.instance().deleteAttachment(deletePayload);
  });

  it('dialog boxes renders properly', () => {
    expect(wrapper.find(AddDocument)).toHaveLength(6);
  });
});
