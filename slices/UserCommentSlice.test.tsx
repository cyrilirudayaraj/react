import store from '../store/store';
import { MockData } from '../services/__mocks__/MockData';
import { sleep } from '../utils/TestUtils';
import { createUserComment, fetchUserCommentDetails } from './UserCommentSlice';

jest.mock('../services/CommonService');

describe('user comment slice testing', () => {
  it('test fetchUserCommentDetails', async () => {
    const taskId = '2093';
    fetchUserCommentDetails(taskId)(store.dispatch);
    await sleep(10);
    expect(store.getState().userComment.userCommentDetails).toEqual(
      MockData.USERCOMMENTS
    );
  });

  it('test createUserComment', async () => {
    const values = {
      content: '<p>Test  comment</p>↵',
      taskId: '2093',
      taskStepId: '14653',
    };
    createUserComment(values)(store.dispatch);
    await sleep(10);
    expect(store.getState().userComment.userCommentDetails).toEqual(
      MockData.USERCOMMENTS
    );
  });
});
