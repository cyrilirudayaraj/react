import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskDiscusisonProps } from '../../../../../types';
import { getTaskDetail } from '../../../../../slices/TaskSlice';
import DiscussionForm from './DiscussionForm';
import { fetchUserCommentDetails } from '../../../../../slices/UserCommentSlice';
import './TaskDiscussion.scss';

class TaskDiscussion extends Component<TaskDiscusisonProps, any> {
  // TODO Use row component
  constructor(props: TaskDiscusisonProps) {
    super(props);
    this.props.fetchUserCommentDetails(this.props.taskId);
  }

  render(): JSX.Element {
    return (
      <div className="create-comment">
        <DiscussionForm taskdetails={this.props.task} {...this.props} />
      </div>
    );
  }
}

const mapTaskStateToProps = (state: any) => ({
  task: getTaskDetail(state),
});

export default connect(mapTaskStateToProps, {
  fetchUserCommentDetails,
})(TaskDiscussion);
