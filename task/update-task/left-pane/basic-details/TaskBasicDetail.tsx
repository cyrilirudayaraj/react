import {
  Checkbox,
  Form,
  Accordion,
  AccordionItem,
  StatusTag,
} from '@athena/forge';
import React from 'react';
import Labels from '../../../../../constants/Labels';
import DecisionTable from '../decision-table/DecisionTable';
import TaskDependency from '../task-dependency/TaskDependency';
import { TaskBasicDetailProps } from '../../UpdateTaskProps';
import TaskTestingDetail from '../testing-details/TaskTestingDetail';
import WFTextarea from '../../../../../components/wf-textarea/WFTextarea';
import { isTaskEditable } from '../../UpdateTask';
import Acl from '../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import RichTextEditor from '../../../../../components/rich-text-editor/RichTextEditor';
import AppConstants from '../../../../../constants/AppConstants';

export default function TaskBasicDetail(
  props: TaskBasicDetailProps
): JSX.Element {
  const labels = Labels.TASK_BASIC_DETAILS;
  const { formik } = props;
  const isDisabled = !isTaskEditable(props.task);
  const values = props.task?.taskDependencies;
  const actualDependencies = values?.filter(function (taskDependency) {
    return !taskDependency.deleted;
  });
  const totalDependencies = actualDependencies?.length;
  let completedDependenciesCount = 0;
  let pendingDependenciesCount = 0;
  actualDependencies?.forEach(function (taskDependency: any) {
    if (
      taskDependency.completedYn === 'Y' ||
      taskDependency.statusName ===
        AppConstants.UI_CONSTANTS.TASK_DEPENDENCIES.DEPENDENCY_BLOCKING_STATUS
          .COMPLETED
    ) {
      completedDependenciesCount = completedDependenciesCount + 1;
    } else {
      pendingDependenciesCount = pendingDependenciesCount + 1;
    }
  });
  function getOverallDependencyStatus(): string {
    return (
      completedDependenciesCount +
      '/' +
      totalDependencies +
      AppConstants.UI_CONSTANTS.WHITE_SPACE +
      AppConstants.UI_CONSTANTS.COMPLETE
    );
  }
  const getStatusCss = (): string => {
    let style = '';
    if (pendingDependenciesCount === 0 && completedDependenciesCount > 0) {
      style += ' completed';
    }
    return style;
  };
  return (
    <Form
      labelAlwaysAbove={true}
      includeSubmitButton={false}
      className="task-detail"
      requiredVariation="blueBarWithLegend"
    >
      <div className="panel">
        <div className="heading">
          <h1 className="content">
            {Labels.TASK_DETAIL_FORM.TASK_INFORMATION}
          </h1>
        </div>
        <div className="panel-content">
          <WFEnableForPermission permission={Acl.TASK_NAME_UPDATE}>
            <WFTextarea
              {...props}
              label={labels.TASK_NAME}
              name="name"
              maxlength={400}
              istextarea={false}
              disabled={isDisabled}
            />
          </WFEnableForPermission>
          <WFEnableForPermission permission={Acl.TASK_DESCRIPTION_UPDATE}>
            <RichTextEditor
              id="description"
              wrapperId={1}
              labelText={labels.TASK_DESCRIPTION}
              formik={formik}
              isDisabled={isDisabled}
              isRequired={props?.mandatoryFields['description'] || false}
            ></RichTextEditor>
          </WFEnableForPermission>
          <WFEnableForPermission
            permission={Acl.TASK_PRODUCTION_CLAIM_EXAMPLE_UPDATE}
          >
            <WFTextarea
              {...props}
              label={labels.CLAIM_EXAMPLE}
              name="testClaimExample"
              maxlength={200}
              istextarea={false}
              disabled={isDisabled}
            />
          </WFEnableForPermission>
        </div>
      </div>
      <Accordion className="taskgroup dependency">
        <AccordionItem
          headingText={
            Labels.TASK_DEPENDENCY_DETAILS.RELATED_TASKS_AND_DEPENDENCIES
          }
          defaultExpanded={true}
          headerSlot={
            <StatusTag
              className={`status_nowrap_no_transform ${getStatusCss()}`}
              text={getOverallDependencyStatus()}
            />
          }
        >
          <TaskDependency {...props}></TaskDependency>
        </AccordionItem>
      </Accordion>
      <Accordion className="taskgroup">
        <AccordionItem
          headingText={Labels.TASK_DETAIL_FORM.CHANGES}
          defaultExpanded={true}
        >
          <WFEnableForPermission
            permission={Acl.TASK_MODEL_DESIGN_CHANGES_UPDATE}
          >
            <RichTextEditor
              id="modelDesignChanges"
              wrapperId={2}
              labelText={labels.MODEL_DESIGN_CHANGES}
              formik={formik}
              isDisabled={isDisabled}
              isRequired={props?.mandatoryFields['modelDesignChanges'] || false}
            ></RichTextEditor>
          </WFEnableForPermission>
          <DecisionTable {...props}></DecisionTable>
          <div className="fe_c_form-field requires_checkbox">
            <span>Requires:</span>
            <WFEnableForPermission
              permission={Acl.TASK_REQUIRES_ANET_CHANGES_UPDATE}
            >
              <Checkbox
                description={labels.ATHENANET_CHANGES}
                id="athenaNetChangesYn"
                checked={formik.values.athenaNetChangesYn}
                {...formik.getFieldProps('athenaNetChangesYn')}
                disabled={isDisabled}
              >
                {/* <React.Fragment /> */}
              </Checkbox>
            </WFEnableForPermission>
            <WFEnableForPermission
              permission={Acl.TASK_REQUIRES_DT_CHANGES_UPDATE}
            >
              <Checkbox
                description={labels.ODM_CHANGES}
                id="dtChangesYn"
                checked={formik.values.dtChangesYn}
                {...formik.getFieldProps('dtChangesYn')}
                disabled={isDisabled}
              >
                {/* <React.Fragment /> */}
              </Checkbox>
            </WFEnableForPermission>
          </div>
        </AccordionItem>
      </Accordion>
      <Accordion className="taskgroup">
        <AccordionItem
          headingText={Labels.TASK_DETAIL_FORM.TESTING}
          defaultExpanded={true}
        >
          <TaskTestingDetail {...props} />
        </AccordionItem>
      </Accordion>
    </Form>
  );
}
