import React from 'react';
import { Form, Button } from '@athena/forge';
import { UserCommentFormProps } from '../../../../../types';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import Acl from '../../../../../constants/Acl';
import RichTextEditor from '../../../../../components/rich-text-editor/RichTextEditor';

export default function UserCommentForm(
  props: UserCommentFormProps
): JSX.Element {
  const formik = props.formik;
  return (
    <Form
      labelAlwaysAbove={true}
      includeSubmitButton={false}
      className="comment-list"
    >
      <div className="form-group">
        <RichTextEditor
          id="content"
          wrapperId={5}
          formik={formik}
          className="discussion_text_box"
          enableShowMore={false}
          enableTagging={true}
        ></RichTextEditor>
      </div>
      <div className="sendBtn">
        <WFEnableForPermission permission={Acl.DISCUSSION_CREATE}>
          <Button
            id="sendcomment"
            className="primary-button"
            text="Send"
            onClick={formik.handleSubmit}
          />
        </WFEnableForPermission>
      </div>
    </Form>
  );
}
