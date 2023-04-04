import React, { useState } from 'react';
import {
  GridRow,
  GridCol,
  Heading,
  Button,
  Icon,
  Modal,
  FormField,
  FormError,
} from '@athena/forge';
import { FieldArray, FormikProps } from 'formik';
import './DecisionTable.scss';
import Labels from '../../../../../constants/Labels';
import Messages from '../../../../../constants/Messages';
import DecisionTableItem from './decision-table-item/DecisionTableItem';
import StringUtil from '../../../../../utils/StringUtil';
import { TaskDetail, TaskDTDetails } from '../../../../../types';
import { isTaskEditable } from '../../UpdateTask';
import { UpdateTaskProps } from '../../UpdateTaskProps';
import Acl from '../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';

interface TaskDecisionTableProps extends UpdateTaskProps {
  formik: FormikProps<any>;
  mandatoryFields?: any;
  task?: TaskDetail;
}

export default function DecisionTable(
  props: TaskDecisionTableProps
): JSX.Element {
  const labels = Labels.TASK_DT_DETAILS;
  const { formik } = props;
  const [shown, setShown] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [deleteHeaderMsg, setDeleteHeaderMsg] = useState('Delete');
  const [dtArray, setDtArray] = useState({
    remove: (index: number) => ({}),
    replace: (index: number, obj: TaskDTDetails) => ({}),
  });
  const isDisabled = !isTaskEditable(props.task);

  const getFormFieldProps = (fieldName: string, formik: any) => {
    const fieldProps = {
      ...formik.getFieldProps(fieldName),
      required: props.mandatoryFields[fieldName],
      labelWidth: 1,
      autoComplete: 'off',
      error: formik.errors[fieldName],
      id: fieldName,
      disabled: !isTaskEditable(props.task),
    };
    return fieldProps;
  };

  const addDecisionTableDetails = (dtArray: any): void => {
    const taskDTDetails: TaskDTDetails = {
      description: '',
      id: '',
      modelName: '',
      name: '',
      refId: '',
      refUrl: '',
      taskId: '',
      version: '',
      expanded: true,
    };
    dtArray.push(taskDTDetails);
    setExpanded(false);
  };

  const hidePopup = (): void => {
    setShown(false);
  };

  const deleteDecisionTableDetails = (): void => {
    hidePopup();
    const dt = {
      ...formik.getFieldProps('taskDecisionTableDetails').value[selectedIndex],
    };
    if (!dt.id) {
      dtArray.remove(selectedIndex);
      return;
    }
    dt.deleted = StringUtil.formatDate(new Date());
    dtArray.replace(selectedIndex, dt);
  };

  const getDeletePopupHeaderMsg = (index: number): string => {
    const msg = formik.getFieldProps('taskDecisionTableDetails').value[index]
      .refId
      ? Labels.TASK_DT_DETAILS.DELETE_WITH_SPACE +
        StringUtil.formatDecisionTableId(
          formik.getFieldProps('taskDecisionTableDetails').value[index].refId
        )
      : Labels.TASK_DT_DETAILS.DELETE_WITHOUT_ID;
    return msg + Messages.QUESTION_MARK;
  };

  const deleteConfirmationPopup = (
    dtArray: any,
    index: number,
    event: any
  ): void => {
    event.stopPropagation();
    setDtArray(dtArray);
    setSelectedIndex(index);
    setDeleteHeaderMsg(getDeletePopupHeaderMsg(index));
    setShown(true);
  };

  const getUrlTemplate = (url: string): JSX.Element => {
    url = StringUtil.getValidUrl(url);
    return (
      <div className="dt-url padding-bottom">
        <a href={url} target="_blank" rel="noopener noreferrer">
          <div>
            <Icon icon="NavigateAway" />
          </div>
          <div className="dt-url-text">
            <span>{Labels.TASK_DT_DETAILS.GO}</span>
          </div>
        </a>
      </div>
    );
  };

  const getModalTemplate = (): JSX.Element => {
    return (
      <Modal
        show={shown}
        headerText={deleteHeaderMsg}
        alertType="attention"
        width="small"
        onHide={hidePopup}
        onPrimaryClick={deleteDecisionTableDetails}
        primaryButtonText={Labels.TASK_DT_DETAILS.DELETE}
      >
        <p>{Messages.DELETE_DT_MSG}</p>
      </Modal>
    );
  };

  const { EXPAND_ALL, COLLAPSE_ALL } = Labels.TASK_DT_DETAILS;

  const toggleExpand = (formik: any): void => {
    formik.values.taskDecisionTableDetails.forEach(function (
      obj: TaskDTDetails
    ) {
      if (obj.expanded) {
        obj.expanded = !expanded;
      }
    });
    setExpanded(!expanded);
  };

  const getDecisionTableHeaderTemplate = (
    dtArray: any,
    formik: any
  ): JSX.Element => {
    return (
      <div className="dt-header">
        <div>
          <Heading
            headingTag="h3"
            variant="subsection"
            text={Labels.TASK_DT_DETAILS.DECISION_TABLE_CHANGES}
          />
        </div>
        <div>
          <Button
            className="expand-all-button"
            text={expanded ? COLLAPSE_ALL : EXPAND_ALL}
            variant="tertiary"
            onClick={() => toggleExpand(formik)}
          />
          <WFEnableForPermission
            permission={Acl.TASK_DECISION_TABLE_CHANGES_UPDATE}
          >
            <Button
              className="add-button"
              text={Labels.TASK_DT_DETAILS.ADD}
              icon={Labels.TASK_DT_DETAILS.ADD}
              variant="tertiary"
              onClick={() => addDecisionTableDetails(dtArray)}
              disabled={isDisabled}
            />
          </WFEnableForPermission>
        </div>
      </div>
    );
  };

  const getTaskDTDetailsTemplate = (): any => {
    let content = null;
    if (formik.getFieldProps('taskDecisionTableDetails').value) {
      content = (
        <FieldArray
          name="taskDecisionTableDetails"
          render={(dtArray) => (
            <div>
              {getDecisionTableHeaderTemplate(dtArray, formik)}
              {formik.errors['taskDecisionTableDetails'] && (
                <FormError className="margin-top-small">
                  {Messages.DT_VALIDATION_MSG.DT_REQUIRED}
                </FormError>
              )}
              {formik.values.taskDecisionTableDetails.map(
                (obj: TaskDTDetails, index: number) => (
                  <div key={index}>
                    <DecisionTableItem
                      deleted={obj.deleted ? true : false}
                      index={index}
                      {...props}
                      expanded={obj.expanded ? obj.expanded : expanded}
                      deleteAction={(event) =>
                        deleteConfirmationPopup(dtArray, index, event)
                      }
                    />
                  </div>
                )
              )}
              {formik.values.taskDecisionTableDetails.filter(
                (obj: TaskDTDetails) => obj.deleted
              ).length == formik.values.taskDecisionTableDetails.length ? (
                <div className="no-records-txt">
                  {Labels.TASK_DT_DETAILS.DT_NO_RECORDS}
                </div>
              ) : null}
            </div>
          )}
        />
      );
    }
    return content;
  };

  const getTaskDTUrlsTemplate = (): JSX.Element => {
    return (
      <div>
        <GridRow>
          <GridCol width={{ small: 10, medium: 10, large: 10 }}>
            <WFEnableForPermission
              permission={Acl.TASK_MODEL_BRANCH_URL_UPDATE}
            >
              <FormField
                maxlength="500"
                labelText={labels.DFM_LINK}
                labelWidth={12}
                {...getFormFieldProps('modelBranchUrl', formik)}
                className="branch-url padding-bottom"
              />
            </WFEnableForPermission>
          </GridCol>
          <GridCol width={{ small: 2, medium: 2, large: 2 }}>
            {getUrlTemplate(formik.getFieldProps('modelBranchUrl').value)}
          </GridCol>
        </GridRow>
        <GridRow>
          <GridCol width={{ small: 10, medium: 10, large: 10 }}>
            <WFEnableForPermission permission={Acl.TASK_DT_BRANCH_URL_UPDATE}>
              <FormField
                maxlength="500"
                labelText={labels.ODM_LINK}
                labelWidth={12}
                {...getFormFieldProps('dtBranchUrl', formik)}
                className="branch-url padding-bottom"
              />
            </WFEnableForPermission>
          </GridCol>
          <GridCol width={{ small: 2, medium: 2, large: 2 }}>
            {getUrlTemplate(formik.getFieldProps('dtBranchUrl').value)}
          </GridCol>
        </GridRow>
      </div>
    );
  };

  return (
    <div className="task-decision-table">
      {getModalTemplate()}
      <div className="dt-details">{getTaskDTDetailsTemplate()}</div>
      {getTaskDTUrlsTemplate()}
    </div>
  );
}
