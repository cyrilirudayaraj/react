import React, { Component } from 'react';
import { connect } from 'react-redux';

import { TaskDetail } from '../../../../../types';
import { getTaskDetail } from '../../../../../slices/TaskSlice';
import { fetchEventDetails } from '../../../../../slices/TaskHistorySlice';
import TaskHistoryList from './TaskHistoryList';

export interface TaskHistoryProps {
  task: TaskDetail;
  fetchEventDetails: any;
}

class TaskHistory extends Component<TaskHistoryProps> {
  constructor(props: TaskHistoryProps) {
    super(props);
    const { id } = this.props.task;
    if (id) {
      this.props.fetchEventDetails(id);
    }
  }

  render(): JSX.Element {
    return <TaskHistoryList taskdetails={this.props.task} />;
  }
}

const mapStateToProps = (state: any) => ({
  task: getTaskDetail(state),
});

export default connect(mapStateToProps, { fetchEventDetails })(TaskHistory);
