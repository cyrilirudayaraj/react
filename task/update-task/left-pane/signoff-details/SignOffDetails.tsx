import React from 'react';
import { Table } from '@athena/forge';
import { TaskDetail } from '../../../../../types';
import Labels from '../../../../../constants/Labels';
import StringUtil from '../../../../../utils/StringUtil';

const labels = Labels.TASK_SIGNOFF_DETAILS;
interface SignOffDetailsProps {
  task?: TaskDetail;
}

export default function SignOffDetails(
  props: SignOffDetailsProps
): JSX.Element {
  const dataSource = props.task?.taskSteps ? props.task.taskSteps : [];

  const getColumnTemplate = (value: string) => {
    return value ? value : labels.HYPHEN;
  };

  const getSignedOffByTemplate = (value: string, { rowData }: any) => {
    return value &&
      !StringUtil.isNullOrEmpty(rowData.signedOffYn) &&
      rowData.signedOffYn.toLowerCase() === labels.TXT_YES
      ? value
      : labels.HYPHEN;
  };
  return (
    <div className="sign-off">
      <div className="panel">
        <div className="panel-content signoff-content">
          <div className="fe_u_flex-container">
            <Table
              layout="compact"
              className="full-width"
              rows={dataSource}
              rowKey="id"
              columns={[
                {
                  key: 'name',
                  displayName: labels.WORKFLOW_STEP,
                },
                {
                  key: 'plannedCompletion',
                  displayName: labels.NEXT_ACTION_DUE,
                  template: getColumnTemplate,
                },
                {
                  key: 'assignedTo',
                  displayName: labels.SIGNED_OFF_BY,
                  template: getSignedOffByTemplate,
                },
                {
                  key: 'actualCompletion',
                  displayName: labels.SIGNED_OFF_DATE,
                  template: getColumnTemplate,
                },
              ]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
