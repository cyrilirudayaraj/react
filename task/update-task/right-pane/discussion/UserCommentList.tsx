import React, { useEffect } from 'react';
import moment from 'moment';
import Labels from '../../../../../constants/Labels';
import AppConstants from '../../../../../constants/AppConstants';
import { GridCol, GridRow } from '@athena/forge';
import StringUtil from '../../../../../utils/StringUtil';

const classNames = StringUtil.classNames;
const TODAY = moment().clone().startOf('day');
const YESTERDAY = moment().clone().subtract(1, 'days').startOf('day');
const UserCommentList = (props: any) => {
  useEffect(() => {
    const commentId = props.commentId;
    if (!commentId) {
      const messageBody = document.getElementById(
        'user-comment-list-container'
      );
      if (messageBody) {
        messageBody.scrollTop =
          messageBody.scrollHeight - messageBody.clientHeight;
      }
    }
    const commentElement = document.getElementById(commentId);
    if (commentElement) {
      commentElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  });
  return (
    <div
      id="user-comment-list-container"
      className="user-comment-list-container"
    >
      <ul className="user-comment-list-group">
        {props.usercomment &&
          Object.entries(props.usercomment).map(([key, value]) => (
            <li className="user-container" key={key}>
              <GridRow
                className="comment-date-container"
                removeGuttersSmall={true}
              >
                <GridCol className="borderleft" width={{ small: 5 }}></GridCol>
                <GridCol
                  className="user-comment-list-group_date"
                  width={{ small: 2 }}
                >
                  {getTodayOrYesterday(key)}
                </GridCol>
                <GridCol className="borderright" width={{ small: 5 }}></GridCol>
              </GridRow>
              <div className="user-comment-result-list">
                {getListOfComments(value, props)}
              </div>
            </li>
          ))}
      </ul>
    </div>
  );
};
const getListOfComments = (comments: any, props: any) => {
  return comments.map((comment: any) => {
    return (
      <div
        id={comment.id}
        key={comment.id}
        className={classNames('fe-center', {
          highlight: comment.id == props.commentId,
        })}
      >
        <span className="user-comment-result-name">{comment.createdBy}</span>
        <span className="user-comment-result-date">
          {getTodayOrYesterdayWithTimestamp(comment.createdTimestamp)}
        </span>
        <div
          className="user-comment-result-content"
          dangerouslySetInnerHTML={{ __html: comment.content }}
        ></div>
      </div>
    );
  });
};

const isToday = (date: any) => {
  return moment(date).isSame(TODAY, 'd');
};
const isYesterday = (date: any) => {
  return moment(date).isSame(YESTERDAY, 'd');
};

const formatDate = (date: any) => {
  return moment(date).format(AppConstants.UI_CONSTANTS.DATE_FORMAT);
};

const formatDateWithTimeStamp = (date: any) => {
  return moment(date).format(
    AppConstants.UI_CONSTANTS.DATE_WITH_TIMESTAMP_FORMAT
  );
};

const getTimestamp = (date: any) => {
  return moment(date).format(AppConstants.UI_CONSTANTS.TIMESTAMP_FORMAT);
};

const getTodayOrYesterdayWithTimestamp = (date: any) => {
  return isToday(date)
    ? getTimestamp(date)
    : isYesterday(date)
    ? Labels.USER_COMMENT.YESTERDAY + ' ' + getTimestamp(date)
    : formatDateWithTimeStamp(date);
};

const getTodayOrYesterday = (date: any) => {
  return isToday(moment(date))
    ? Labels.USER_COMMENT.TODAY
    : isYesterday(moment(date))
    ? Labels.USER_COMMENT.YESTERDAY
    : formatDate(date);
};
export default UserCommentList;
