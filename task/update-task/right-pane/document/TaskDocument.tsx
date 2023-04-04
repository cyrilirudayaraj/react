import React, { Component } from 'react';
import { connect } from 'react-redux';
import { TaskDocumentProps } from '../../../../../types';
import { getTaskDetail } from '../../../../../slices/TaskSlice';
import AttachmentList from './AttachmentList';
import { fetchAttachmentDetails } from '../../../../../slices/AttachmentSlice';
import './TaskDocument.scss';
class TaskDocument extends Component<TaskDocumentProps, any> {
  constructor(props: TaskDocumentProps) {
    super(props);
    this.props.fetchAttachmentDetails(this.props.task.id);
  }

  render(): JSX.Element {
    return (
      <div className="task-document">
        <AttachmentList taskdetails={this.props.task} />
      </div>
    );
  }
}

const mapTaskStateToProps = (state: any) => ({
  task: getTaskDetail(state),
});

export default connect(mapTaskStateToProps, {
  fetchAttachmentDetails,
})(TaskDocument);
