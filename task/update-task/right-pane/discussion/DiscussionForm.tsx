import { Formik } from 'formik';
import React from 'react';
import { connect } from 'react-redux';
import {
  DiscussionFormProps,
  UserComment,
  TaskDetail,
} from '../../../../../types/index';
import {
  createUserComment,
  getComments,
} from '../../../../../slices/UserCommentSlice';
import UserCommentList from './UserCommentList';
import UserCommentForm from './UserCommentForm';
import SortingGrouping from '../../../../../utils/SortingGrouping';
import StringUtil from '../../../../../utils/StringUtil';
import ConversionUtil from '../../../../../utils/ConversionUtil';

const initialValues = (taskDetails: TaskDetail): any => {
  const initValues = {
    taskId: taskDetails.id,
    content: '',
    taskStepId: taskDetails.activeTaskStepId,
  };
  return initValues;
};

const validationSchema = (comments: UserComment[]) => {
  // TODO
};

function DiscussionForm(props: DiscussionFormProps): JSX.Element {
  const onSubmit = (values: any) => {
    if (
      !StringUtil.isNullOrEmpty(
        ConversionUtil.convertHtmlToPlainText(values.content)?.trim()
      )
    ) {
      props.resetCommentId();
      props.createUserComment(values);
    }
  };

  return (
    <Formik
      enableReinitialize={true}
      initialValues={initialValues(props.taskdetails)}
      onSubmit={(values, { resetForm }) => {
        onSubmit(values);
        resetForm({ values: '' });
      }}
      validationSchema={validationSchema(props.comments)}
      validateOnChange={false}
      validateOnBlur={false}
      validateOnMount={false}
    >
      {(formik) => {
        return (
          <React.Fragment>
            <UserCommentList
              usercomment={SortingGrouping.sortAndGroupByCreatedDate(
                props.comments
              )}
              {...props}
            />
            <UserCommentForm formik={formik} />
          </React.Fragment>
        );
      }}
    </Formik>
  );
}
const mapStateToProps = (state: any) => {
  return { comments: getComments(state) };
};

export default connect(mapStateToProps, { createUserComment })(DiscussionForm);
