import { createSlice } from '@reduxjs/toolkit';
import { Dispatch } from 'redux';
import {
  getUserComments,
  createUserCommentDetail,
} from '../services/CommonService';
import { UserComment } from '../types';
import ConversionUtil from '../utils/ConversionUtil';

const userCommentSlice = createSlice({
  name: 'userComment',
  initialState: {
    userCommentDetails: [],
  },
  reducers: {
    setCommentDetails(state, action) {
      state.userCommentDetails = action.payload.commentDetails;
    },
  },
});

export const { setCommentDetails } = userCommentSlice.actions;

export const fetchUserCommentDetails = (taskId: string) => (
  dispatch: Dispatch
): void => {
  getUserComments(taskId).then((commentDetails) => {
    dispatch(setCommentDetails({ commentDetails }));
  });
};

export const createUserComment = (values: any) => (
  dispatch: Dispatch
): void => {
  const payload: any = ConversionUtil.convertValuesToPayload(values);
  createUserCommentDetail(payload).then((commentDetails) => {
    dispatch(setCommentDetails({ commentDetails }));
  });
};

export const getComments = (state: any): UserComment[] =>
  state.userComment.userCommentDetails;

export default userCommentSlice.reducer;
