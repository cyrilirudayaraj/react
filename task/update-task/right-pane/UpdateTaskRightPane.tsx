import { TabPane, Tabs, Tooltip, Icon } from '@athena/forge';
import React, { useEffect, useState } from 'react';
import Labels from '../../../../constants/Labels';
import TaskOverview from './overview/TaskOverview';
import TaskDiscussion from './discussion/TaskDiscussion';
import TaskDocument from './document/TaskDocument';
import WorkLog from './timeentry/WorkLog';
import { getFormValidity } from '../../../../slices/ValidationSlice';
import { connect } from 'react-redux';
import { UpdateTaskRightPaneProps } from '../UpdateTaskProps';
import {
  setRightFormAction,
  setRightDropdownVal,
  resetPopupActions,
  updateEditBtnAction,
  getLeftFormAction,
  setLeftFormAction,
  getLeftSectionActive,
  getRightSectionActive,
  setLeftSectionActiveAction,
  getRightDropdownVal,
  setRightSectionSelectedTabIndex,
} from '../../../../slices/TaskSlice';
import TaskHistory from './history/TaskHistory';
export const Warning = (props: any): JSX.Element => {
  return (
    <>
      {props.label}
      {props.warning && (
        <Tooltip
          text={props.tooltip}
          id={props.label}
          placement="bottom"
          className="requirement-tip"
        >
          <Icon icon="Attention" className="requirement-icon" />
        </Tooltip>
      )}
    </>
  );
};
function UpdateTaskRightPane(props: UpdateTaskRightPaneProps): JSX.Element {
  const labels = Labels.TASK_SUMMARY;

  useEffect(() => {
    if (props.commentId) {
      setSelectedIndex(1);
    } else {
      setSelectedIndex(tabIndexVal);
    }
  }, [props.dropdownVal]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [tabIndexVal, setTabIndexVal] = useState(0);
  const handleTabsChange = (e: any) => {
    props.resetCommentId();
    const value = e.target.value;
    if (props.rightSectionActive) {
      props.setRightFormAction(true);
    } else {
      setSelectedIndex(parseInt(value, 10));
    }
    setTabIndexVal(parseInt(value, 10));
    props.setRightSectionSelectedTabIndex(parseInt(value));
  };
  return (
    <div className="fe_u_padding--top-large task-summary">
      <Tabs selectedIndex={selectedIndex} onTabsChange={handleTabsChange}>
        <TabPane
          label={labels.OVERVIEW}
          padded={false}
          mountedWhileHidden={true}
        >
          <TaskOverview />
        </TabPane>
        <TabPane label={labels.DISCUSSION} padded>
          <TaskDiscussion
            taskId={props.taskId}
            commentId={props.commentId}
            resetCommentId={props.resetCommentId}
          />
        </TabPane>
        <TabPane label={labels.DOCUMENTS} padded>
          <TaskDocument />
        </TabPane>
        <TabPane label={labels.HISTORY} padded>
          <TaskHistory />
        </TabPane>
        <TabPane
          label={
            props.rightPaneFormvalidity.isWorkLogFormValid ? (
              <Warning
                warning={props.rightPaneFormvalidity.isWorkLogFormValid}
                label={labels.WORK_LOG}
                tooltip={Labels.WORKLOG.WORK_LOG_REQUIRED}
              />
            ) : (
              labels.WORK_LOG
            )
          }
          padded
        >
          <WorkLog />
        </TabPane>
      </Tabs>
    </div>
  );
}

const mapStateToProps = (state: any) => {
  return {
    leftSectionActive: getLeftSectionActive(state),
    rightSectionActive: getRightSectionActive(state),
    leftFormFlag: getLeftFormAction(state),
    dropdownVal: getRightDropdownVal(state),
    rightPaneFormvalidity: getFormValidity(state),
  };
};

export default connect(mapStateToProps, {
  setLeftFormAction,
  setRightFormAction,
  resetPopupActions,
  setLeftSectionActiveAction,
  updateEditBtnAction,
  setRightDropdownVal,
  setRightSectionSelectedTabIndex,
})(UpdateTaskRightPane);
