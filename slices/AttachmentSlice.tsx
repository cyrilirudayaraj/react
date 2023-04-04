import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import {
  getAttachmentDetails,
  createAttachment,
  updateAttachmentDetails,
  deleteAttachmentDetails,
} from '../services/CommonService';
import { AttachmentDetail } from '../types';
import ConversionUtil from '../utils/ConversionUtil';

const attachmentSlice = createSlice({
  name: 'attachment',
  initialState: {
    attachmentDetail: [],
  },
  reducers: {
    setAttachmentDetail(state, action) {
      state.attachmentDetail = action.payload.attachmentDetail;
    },
  },
});

export const { setAttachmentDetail } = attachmentSlice.actions;

export const fetchAttachmentDetails = (taskId: string) => (
  dispatch: Dispatch
): void => {
  getAttachmentDetails(taskId).then((attachmentDetail) => {
    dispatch(setAttachmentDetail({ attachmentDetail }));
  });
};

export const createAttachmentDetail = (values: any) => (
  dispatch: Dispatch
): void => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  createAttachment(payload).then((attachmentDetail) => {
    dispatch(setAttachmentDetail({ attachmentDetail }));
  });
};

export const updateAttachmentDetail = (values: any) => (
  dispatch: Dispatch
): void => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  updateAttachmentDetails(payload).then((attachmentDetail) => {
    dispatch(setAttachmentDetail({ attachmentDetail }));
  });
};

export const deleteAttachmentDetail = (values: any) => (
  dispatch: Dispatch
): void => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  deleteAttachmentDetails(payload).then((attachmentDetail) => {
    dispatch(setAttachmentDetail({ attachmentDetail }));
  });
};
export const getAttachments = (state: any): AttachmentDetail[] =>
  state.attachment.attachmentDetail;

export default attachmentSlice.reducer;
