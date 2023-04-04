import React from 'react';
import { Form } from '@athena/forge';
import Labels from '../../../../../constants/Labels';
import { TaskTestingDetailProps } from '../../UpdateTaskProps';
import { isTaskEditable } from '../../UpdateTask';
import Acl from '../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import RichTextEditor from '../../../../../components/rich-text-editor/RichTextEditor';

export default function TaskTestingDetail(
  props: TaskTestingDetailProps
): JSX.Element {
  const labels = Labels.TASK_TESTING_DETAILS;

  return (
    <Form
      labelAlwaysAbove={true}
      includeSubmitButton={false}
      className="task-detail"
    >
      <WFEnableForPermission permission={Acl.TASK_TEST_NOTES_UPDATE}>
        <RichTextEditor
          id="testNote"
          wrapperId={3}
          labelText={labels.TEST_NOTE}
          formik={props.formik}
          isDisabled={!isTaskEditable(props.task)}
          isRequired={props?.mandatoryFields['testNote'] || false}
        ></RichTextEditor>
      </WFEnableForPermission>
    </Form>
  );
}
