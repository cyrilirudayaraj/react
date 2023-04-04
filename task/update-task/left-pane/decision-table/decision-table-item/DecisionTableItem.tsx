import React, { useState, useEffect } from 'react';
import {
  Accordion,
  AccordionItem,
  Icon,
  GridRow,
  GridCol,
  FormField,
  Button,
} from '@athena/forge';
import { FormikProps } from 'formik';
import './DecisionTableItem.scss';
import Labels from '../../../../../../constants/Labels';
import { get, isArray } from 'lodash';
import StringUtil from '../../../../../../utils/StringUtil';
import WFTextarea from '../../../../../../components/wf-textarea/WFTextarea';
import { isTaskEditable } from '../../../UpdateTask';
import { TaskDetail } from '../../../../../../types';
import Acl from '../../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../../components/wf-enableforpermission/WFEnableForPermission';
import RichTextEditor from '../../../../../../components/rich-text-editor/RichTextEditor';

interface TaskDecisionTableItemProps {
  index: number;
  formik: FormikProps<any>;
  deleteAction: (event: any) => void;
  deleted: boolean;
  mandatoryFields?: any;
  expanded: boolean;
  task?: TaskDetail;
}

const getFormFieldProps = (fieldName: string, formik: any) => {
  const props = {
    ...formik.getFieldProps(fieldName),
    required: true,
    labelWidth: 1,
    autoComplete: 'off',
    error: get(formik.errors, fieldName),
    id: fieldName,
  };
  return props;
};

export default function DecisionTableItem(
  props: TaskDecisionTableItemProps
): JSX.Element {
  const labels = Labels.TASK_DT_DETAILS;
  const [expanded, setExpanded] = useState(props.expanded);
  useEffect(() => {
    setExpanded(props.expanded);
  }, [props.expanded]);
  const { index, formik, deleteAction } = props;
  const isDisabled = !isTaskEditable(props.task);

  const getDeleteDTTemplate = (): JSX.Element => {
    return (
      <div className="delete_dt">
        <WFEnableForPermission
          permission={Acl.TASK_DECISION_TABLE_CHANGES_UPDATE}
        >
          <Button
            className="delete-icon"
            onClick={(event) => {
              if (!isDisabled) deleteAction(event);
            }}
            icon={Labels.TASK_DT_DETAILS.DELETE}
            variant="tertiary"
            disabled={isDisabled}
          />
        </WFEnableForPermission>
      </div>
    );
  };

  const getHeaderText = (): string => {
    let headerText = formik.getFieldProps(
      `taskDecisionTableDetails.${index}.refId`
    ).value;
    if (headerText === 0) {
      headerText = headerText.toString();
    }
    return headerText ? StringUtil.formatDecisionTableId(headerText) : '';
  };

  const getModelNameTemplate = (): JSX.Element => {
    return (
      <GridCol width={{ small: 8, medium: 8, large: 8 }}>
        <WFEnableForPermission
          permission={Acl.TASK_DECISION_TABLE_CHANGES_UPDATE}
        >
          <WFTextarea
            {...props}
            label={labels.DT_MODEL_NAME}
            labelWidth={12}
            name={`taskDecisionTableDetails.${index}.modelName`}
            maxlength={200}
            className="max-width padding-bottom"
            disabled={isDisabled}
          />
        </WFEnableForPermission>
      </GridCol>
    );
  };

  const getDesisionTableNameTemplate = (): JSX.Element => {
    return (
      <GridCol width={{ small: 6, medium: 6, large: 6 }}>
        <WFEnableForPermission
          permission={Acl.TASK_DECISION_TABLE_CHANGES_UPDATE}
        >
          <WFTextarea
            {...props}
            label={labels.DT_NAME}
            labelWidth={12}
            name={`taskDecisionTableDetails.${index}.name`}
            maxlength={400}
            className="max-width padding-bottom"
            disabled={isDisabled}
          />
        </WFEnableForPermission>
      </GridCol>
    );
  };

  const getDecisionTableRefIdTemplate = (): JSX.Element => {
    return (
      <GridCol width={{ small: 2, medium: 2, large: 2 }}>
        <WFEnableForPermission
          permission={Acl.TASK_DECISION_TABLE_CHANGES_UPDATE}
        >
          <FormField
            labelText={labels.DT_ID}
            labelWidth={12}
            type="number"
            max="999999"
            {...getFormFieldProps(
              `taskDecisionTableDetails.${index}.refId`,
              formik
            )}
            className="max-width padding-bottom"
            disabled={isDisabled}
          />
        </WFEnableForPermission>
      </GridCol>
    );
  };

  const getUrlLinkTemplate = (): JSX.Element => {
    let url = formik.getFieldProps(`taskDecisionTableDetails.${index}.refUrl`)
      .value;
    url = StringUtil.getValidUrl(url);
    return (
      <GridCol width={{ small: 2, medium: 2, large: 2 }}>
        <div className="dt-url">
          <a href={url} target="_blank" rel="noopener noreferrer">
            <div>
              <Icon icon="NavigateAway" />
            </div>
            <div className="dt-url-text">
              <span>{Labels.TASK_DT_DETAILS.GO}</span>
            </div>
          </a>
        </div>
      </GridCol>
    );
  };

  const getClassName = (): string => {
    let className = 'task-dt';
    if (props.deleted) {
      className = 'hide';
    }
    return className;
  };

  const getUrlTemplate = (): JSX.Element => {
    return (
      <GridCol width={{ small: 10, medium: 10, large: 10 }}>
        <WFEnableForPermission
          permission={Acl.TASK_DECISION_TABLE_CHANGES_UPDATE}
        >
          <FormField
            labelText={labels.DT_Link}
            labelWidth={12}
            {...getFormFieldProps(
              `taskDecisionTableDetails.${index}.refUrl`,
              formik
            )}
            className="ref-url padding-bottom"
            disabled={isDisabled}
          />
        </WFEnableForPermission>
      </GridCol>
    );
  };

  const getTaskDTDescriptionTemplate = (): JSX.Element => {
    const descriptionId = `taskDecisionTableDetails.${index}.description`;
    return (
      <GridCol width={{ small: 11, medium: 11, large: 11 }}>
        <WFEnableForPermission
          permission={Acl.TASK_DECISION_TABLE_CHANGES_UPDATE}
        >
          <RichTextEditor
            id={descriptionId}
            // Starting wrapper id from 30+ because other editor fields will start from 1.
            // Just to avoid conflict added 30 to index
            wrapperId={index + 30}
            labelText={labels.DT_CHANGE_DESCRIPTION}
            formik={formik}
            isDisabled={isDisabled}
            maxLength={2000}
            isRequired={props?.mandatoryFields[descriptionId] || false}
          ></RichTextEditor>
        </WFEnableForPermission>
      </GridCol>
    );
  };

  const handleAccordionClick = (event: any) => {
    if (
      event.target.className !== 'fe_c_accordion-item__header' &&
      event.target.className !== 'fe_c_accordion-item__header fe_is-expanded' &&
      event.target.className !==
        'fe_c_heading fe_c_heading--section fe_c_accordion-item__heading-text'
    ) {
      return;
    }
    setExpanded(!expanded);
  };

  const error = isArray(formik.errors?.taskDecisionTableDetails)
    ? formik.errors?.taskDecisionTableDetails[index]
    : undefined;
  if (error && !expanded && formik.isSubmitting) {
    setExpanded(true);
  }

  return (
    <Accordion className={getClassName()}>
      <AccordionItem
        onClick={handleAccordionClick}
        headingText={getHeaderText()}
        headerSlot={getDeleteDTTemplate()}
        expanded={expanded}
      >
        <GridRow>{getModelNameTemplate()}</GridRow>
        <GridRow>
          {getDesisionTableNameTemplate()}
          {getDecisionTableRefIdTemplate()}
        </GridRow>
        <GridRow>{getTaskDTDescriptionTemplate()}</GridRow>
        <GridRow>
          {getUrlTemplate()}
          {getUrlLinkTemplate()}
        </GridRow>
      </AccordionItem>
    </Accordion>
  );
}
