import React, { Component } from 'react';
import { connect } from 'react-redux';
import { WorkLogProps } from '../../../../../types';
import { getTaskDetail } from '../../../../../slices/TaskSlice';
import WorkLogList from './WorkLogList';
import { fetchTimeEntryLogs } from '../../../../../slices/TimeEntrySlice';
import './WorkLog.scss';
class WorkLog extends Component<WorkLogProps, any> {
  constructor(props: WorkLogProps) {
    super(props);
    this.props.fetchTimeEntryLogs(this.props.task.id);
  }

  render(): JSX.Element {
    return (
      <div className="work-log">
        <WorkLogList />
      </div>
    );
  }
}

const mapTaskStateToProps = (state: any) => ({
  task: getTaskDetail(state),
});

export default connect(mapTaskStateToProps, {
  fetchTimeEntryLogs,
})(WorkLog);
