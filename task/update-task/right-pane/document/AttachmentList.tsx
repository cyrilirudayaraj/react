import React, { Component } from 'react';
import { AttachmentDetail, TaskDetail } from '../../../../../types';
import { Button } from '@athena/forge';
import { connect } from 'react-redux';
import {
  createAttachmentDetail,
  updateAttachmentDetail,
  deleteAttachmentDetail,
  getAttachments,
} from '../../../../../slices/AttachmentSlice';
import AlertBtn from '../../../../../components/alert-button/AlertBtn';
import AddDocument from './AddDocument';
import { getAttachmentTypes } from '../../../../../services/CommonService';
import Labels from '../../../../../constants/Labels';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import moment from 'moment';
import StringUtil from '../../../../../utils/StringUtil';
import { isTaskEditable } from '../../UpdateTask';
import Acl from '../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';

interface AttachmentListProps {
  attachments: AttachmentDetail[];
  createAttachmentDetail: (values: any) => void;
  updateAttachmentDetail: (values: any) => void;
  deleteAttachmentDetail: (values: any) => void;
  taskdetails: TaskDetail;
}

export class AttachmentList extends Component<AttachmentListProps> {
  state = {
    attachmentType: [],
  };
  constructor(props: AttachmentListProps) {
    super(props);
    getAttachmentTypes().then((data) => {
      this.setState({
        attachmentType: ConversionUtil.convertMapToDropDownList(data),
      });
    });
  }
  deleteAttachment = (id?: string, versionNumber?: string): any => {
    const payload = {
      id: id,
      taskId: this.props.taskdetails.id,
      deleted: moment().clone().startOf('day').format('MM/DD/YYYY'),
      version: versionNumber,
    };
    this.props.deleteAttachmentDetail(payload);
  };

  addAttachment = (payload: any): void => {
    this.props.createAttachmentDetail({
      ...payload,
      taskId: this.props.taskdetails.id,
      taskStepId: this.props.taskdetails.taskTypeId,
    });
  };
  updateAttachment = (payload: any): void => {
    delete payload.attachmentName;
    this.props.updateAttachmentDetail({
      ...payload,
      taskId: this.props.taskdetails.id,
    });
  };
  render(): JSX.Element {
    const canEdit = isTaskEditable(this.props.taskdetails);
    return (
      <>
        <WFEnableForPermission permission={Acl.DOCUMENT_CREATE}>
          <AddDocument
            className="add-button add-document"
            id="add-button"
            headerText={Labels.DOCUMENTS.HEADER_TEXT_ADD}
            context={Labels.DOCUMENTS.CONTEXT_ADD}
            icon={Labels.DOCUMENTS.ICON_ADD}
            text={Labels.DOCUMENTS.TEXT_ADD}
            disabled={!canEdit}
            variant="tertiary"
            onConfirm={this.addAttachment}
            type={this.state.attachmentType}
          />
        </WFEnableForPermission>
        <div className="document-list-container">
          <ul className="document-list-group">
            {this.props.attachments &&
              Object.entries(this.props.attachments).map(([key, value]) => (
                <li className="document-container" key={value.id}>
                  <div className="filename-container">
                    <div className="file">
                      <Button
                        className="document-file-path"
                        text={value.fileName}
                        icon="Document"
                        variant="tertiary"
                        useLink={true}
                        href={StringUtil.getValidUrl(value.filePath)}
                        target="_blank"
                      />
                    </div>
                    <WFEnableForPermission permission={Acl.DOCUMENT_UPDATE}>
                      <AddDocument
                        className="edit-button"
                        id="edit-button"
                        headerText={Labels.DOCUMENTS.HEADER_TEXT_EDIT}
                        context={Labels.DOCUMENTS.CONTEXT_EDIT}
                        icon={Labels.DOCUMENTS.ICON_EDIT}
                        variant="tertiary"
                        disabled={!canEdit}
                        onConfirm={this.updateAttachment}
                        attachment={value}
                        type={this.state.attachmentType}
                      />
                    </WFEnableForPermission>
                    <WFEnableForPermission permission={Acl.DOCUMENT_DELETE}>
                      <AlertBtn
                        className="delete-button"
                        primaryModalText={
                          Labels.DOCUMENTS.PRIMARY_MODAL_TEXT_DELETE
                        }
                        messageText={Labels.DOCUMENTS.MESSAGE_TEXT_DELETE}
                        headerText={Labels.DOCUMENTS.HEADER_TEXT_DELETE}
                        action={this.deleteAttachment}
                        variant="tertiary"
                        disabled={!canEdit}
                        icon={Labels.DOCUMENTS.ICON_DELETE}
                        attachmentid={value.id}
                        version={value.version}
                      />
                    </WFEnableForPermission>
                  </div>
                  <div className="document-result-list">
                    <div className="fe-center" key={value.id}>
                      <div className="row1-content">
                        <div className="type-container">
                          <span className="content-label">
                            {Labels.DOCUMENTS.ATTACHMENTTYPE_READ_ONLY}
                          </span>
                          <span className="document-type">
                            {value.attachmentName}
                          </span>
                        </div>
                        <div className="created-by-container">
                          <span className="content-label">
                            {Labels.DOCUMENTS.CREATED_BY_READ_ONLY}
                          </span>
                          <span className="document-created-by">
                            {value.createdBy}
                          </span>
                        </div>
                      </div>
                      <div className="row2-content">
                        <div className="notes-container">
                          <span className="content-label">
                            {Labels.DOCUMENTS.NOTES_READ_ONLY}
                          </span>
                          <span className="document-notes">
                            {value.description}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>
              ))}
          </ul>
        </div>
      </>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { attachments: getAttachments(state) };
};

export default connect(mapStateToProps, {
  createAttachmentDetail,
  updateAttachmentDetail,
  deleteAttachmentDetail,
})(AttachmentList);
