import {
  createAttachmentDetail,
  deleteAttachmentDetail,
  fetchAttachmentDetails,
  updateAttachmentDetail,
} from './AttachmentSlice';
import store from '../store/store';
import { MockData } from '../services/__mocks__/MockData';
import { sleep } from '../utils/TestUtils';

jest.mock('../services/CommonService');

describe('attachment slice testing', () => {
  it('test fetchAttachmentDetails', async () => {
    const taskId = '43';
    fetchAttachmentDetails(taskId)(store.dispatch);
    await sleep(10);
    expect(store.getState().attachment.attachmentDetail).toEqual(
      MockData.ATTACHMENTS
    );
  });

  it('test createAttachmentDetail', async () => {
    const values = {
      attachmentName: 'Payer Documentation',
      attachmentTypeId: '2',
      description: 'test',
      fileName: 'Google',
      filePath: 'www.google.com',
      id: undefined,
      taskId: '43',
      taskStepId: '3',
      version: undefined,
    };
    createAttachmentDetail(values)(store.dispatch);
    await sleep(10);
    expect(store.getState().attachment.attachmentDetail).toEqual(
      MockData.ATTACHMENTS
    );
  });
  it('test updateAttachmentDetail', async () => {
    const values = {
      attachmentName: 'Payer Documentation',
      attachmentTypeId: '2',
      createdBy: 'nsenthilkumar',
      description: 'test',
      fileName: 'Google',
      filePath: 'www.google.com',
      id: '90',
      taskId: '43',
      version: '2',
    };
    updateAttachmentDetail(values)(store.dispatch);
    await sleep(10);
    expect(store.getState().attachment.attachmentDetail).toEqual(
      MockData.ATTACHMENTS
    );
  });
  it('test deleteAttachmentDetail', async () => {
    const values = {
      deleted: '03/29/2021',
      id: '90',
      taskId: '43',
      version: '2',
    };
    deleteAttachmentDetail(values)(store.dispatch);
    await sleep(10);
    expect(store.getState().attachment.attachmentDetail).toEqual(
      MockData.ATTACHMENTS
    );
  });
});
