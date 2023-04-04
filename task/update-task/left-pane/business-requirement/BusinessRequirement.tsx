import React from 'react';
import Labels from '../../../../../constants/Labels';
import {
  Form,
  FormField,
  Select,
  GridCol,
  GridRow,
  Typeahead,
  Banner,
  BannerItem,
  Accordion,
  AccordionItem,
} from '@athena/forge';
import { FormikProps } from 'formik';
import { getTaskDetail } from '../../../../../slices/TaskSlice';
import { TaskDetail } from '../../../../../types';
import { connect } from 'react-redux';
import WFReadOnlyInput from '../../../../../components/wf-readonlyinput/WFReadOnlyInput';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import {
  getContextList,
  getClaimRuleCategoryList,
} from '../../../../../services/CommonService';
import AppConstants from '../../../../../constants/AppConstants';
import Messages from '../../../../../constants/Messages';
import StringUtil from '../../../../../utils/StringUtil';
import './BusinessRequirement.scss';
import WFTextarea from '../../../../../components/wf-textarea/WFTextarea';
import { isTaskEditable } from '../../UpdateTask';
import Acl from '../../../../../constants/Acl';
import WFEnableForPermission from '../../../../../components/wf-enableforpermission/WFEnableForPermission';
import RichTextEditor from '../../../../../components/rich-text-editor/RichTextEditor';
import {
  getBusinessRequirementTypes,
  getRuleReportingCategories,
  getLocalRuleUseCaseList,
  getRuleTypeList,
  getScrubTypes,
  getVisitRuleDisplayLocationList,
  fetchBusinessRequirementTypesOnce,
  fetchRuleReportingCategoriesOnce,
  fetchLocalRuleUseCaseListOnce,
  fetchRuleTypesOnce,
  fetchVisitRuleDisplayLocationsOnce,
  fetchScrubTypesOnce,
} from '../../../../../slices/MasterDataSlice';

interface BusinessRequirementState {
  contextList: string[];
  claimRuleCategoryList: string[];
}

interface BusinessRequirementProps {
  task: TaskDetail;
  formik: FormikProps<any>;
  businessRequirementTypes?: any[];
  ruleReportingCategories?: any[];
  localRuleUseCaseList?: any[];
  ruleTypes?: any[];
  visitRuleDisplayLocations?: any[];
  scrubTypes?: any[];

  fetchBusinessRequirementTypesOnce?: any;
  fetchRuleReportingCategoriesOnce?: any;
  fetchLocalRuleUseCaseListOnce?: any;
  fetchRuleTypesOnce?: any;
  fetchVisitRuleDisplayLocationsOnce?: any;
  fetchScrubTypesOnce?: any;
}

const getFormFieldProps = (
  fieldName: string,
  formik: any,
  isRequired: boolean
) => {
  const props = {
    ...formik.getFieldProps(fieldName),
    required: isRequired,
    labelWidth: 1,
    autoComplete: 'off',
    error: formik.errors[fieldName],
    id: fieldName,
  };
  return props;
};

class BusinessRequirement extends React.Component<
  BusinessRequirementProps,
  BusinessRequirementState
> {
  constructor(props: any) {
    super(props);
    this.state = {
      contextList: [],
      claimRuleCategoryList: [],
    };
    this.fetchFormDetails();
  }

  fetchFormDetails(): void {
    this.props.fetchBusinessRequirementTypesOnce();
    this.props.fetchRuleReportingCategoriesOnce();
    this.props.fetchLocalRuleUseCaseListOnce();
    this.props.fetchRuleTypesOnce();
    this.props.fetchVisitRuleDisplayLocationsOnce();
    this.props.fetchScrubTypesOnce();
  }

  render(): React.ReactNode {
    const labels = Labels.TASK_BUSINESS_REQUIREMENT_FIELD_LABEL;
    const { task, formik } = this.props;
    const activeWorkflowStepId = (task: TaskDetail): string => {
      const index = task?.taskSteps?.findIndex(
        (step) => step.id === task?.activeTaskStepId
      );
      return task?.taskSteps?.[index]?.workflowStepId;
    };
    const isDisabled = !isTaskEditable(task);

    return (
      <Form
        labelAlwaysAbove={true}
        includeSubmitButton={false}
        className="business-requirement"
      >
        {task.statusId !==
          AppConstants.SERVER_CONSTANTS.STATUSES.IN_PRODUCTION && (
          <Banner className="br-banner-info">
            <BannerItem>
              {Messages.BUSINESS_REQUIREMENT_DETAIL_BANNER}
            </BannerItem>
          </Banner>
        )}
        <div className="panel top-margin">
          <div className="heading">
            <h1 className="content">
              {
                Labels.TASK_BUSINESS_REQUIREMENT_FIELD_LABEL
                  .BUSINESS_REQUIREMENT_INFORMATION
              }
            </h1>
          </div>
          <div className="panel-content">
            <GridRow className="fe_u_padding--top-medium">
              <GridCol>
                <WFReadOnlyInput
                  labelText={labels.BUSINESS_REQUIREMENT_ID}
                  text={StringUtil.formatBRID(task?.businessRequirementId)}
                />
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-medium">
              <GridCol>
                <WFEnableForPermission
                  permission={Acl.BUSINESS_REQUIREMENT_NAME_UPDATE}
                >
                  <WFTextarea
                    {...this.props}
                    label={labels.BUSINESS_REQUIREMENT_NAME}
                    name="businessRequirementName"
                    maxlength={200}
                    disabled={isDisabled}
                  />
                </WFEnableForPermission>
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-medium">
              <GridCol>
                <WFEnableForPermission
                  permission={Acl.BUSINESS_REQUIREMENT_DESCRIPTION_UPDATE}
                >
                  <RichTextEditor
                    id="businessRequirementDesc"
                    wrapperId={4}
                    labelText={labels.DESCRIPTION}
                    formik={this.props.formik}
                    isDisabled={isDisabled}
                    isRequired={true}
                  ></RichTextEditor>
                </WFEnableForPermission>
              </GridCol>
            </GridRow>
            <GridRow className="fe_u_padding--top-medium ">
              <GridCol>
                <WFEnableForPermission
                  permission={Acl.BUSINESS_REQUIREMENT_TYPE_UPDATE}
                >
                  <FormField
                    id="businessRequirementTypeId"
                    inputAs={Select}
                    labelText={labels.BUSINESS_REQUIREMENT_TYPE}
                    {...getFormFieldProps(
                      'businessRequirementTypeId',
                      formik,
                      true
                    )}
                    options={ConversionUtil.convertMapToDropDownList(
                      this.props.businessRequirementTypes
                    )}
                    labelWidth={8}
                    disabled={isDisabled}
                    onChange={(event: any) =>
                      this.handleBrTypeChange(event, formik)
                    }
                  />
                </WFEnableForPermission>
              </GridCol>
            </GridRow>
            {(formik.values.businessRequirementTypeId ===
              AppConstants.SERVER_CONSTANTS.BUSINESS_REQUIREMENT_TYPES.LOCAL ||
              formik.values.businessRequirementTypeId ===
                AppConstants.SERVER_CONSTANTS.BUSINESS_REQUIREMENT_TYPES
                  .NETWORK) && (
              <GridRow className="fe_u_padding--top-medium">
                <GridCol>
                  <WFEnableForPermission
                    permission={Acl.BUSINESS_REQUIREMENT_CONTEXT_UPDATE}
                  >
                    <FormField
                      inputAs={Typeahead}
                      required
                      labelText={labels.CONTEXT_NAME}
                      {...getFormFieldProps('context', formik, true)}
                      onChange={(
                        event: React.ChangeEvent<HTMLInputElement>
                      ) => {
                        this.handleContextChange(event, formik);
                      }}
                      alwaysRenderSuggestions={false}
                      suggestions={this.state.contextList}
                      onSuggestionSelected={(
                        event: React.ChangeEvent<HTMLInputElement>,
                        value: any
                      ) => {
                        this.handleContextSelection(value, formik);
                      }}
                      disabled={isDisabled}
                    ></FormField>
                  </WFEnableForPermission>
                </GridCol>
                <GridCol>
                  <WFEnableForPermission
                    permission={
                      Acl.BUSINESS_REQUIREMENT_LOCAL_RULE_USECASE_UPDATE
                    }
                  >
                    <FormField
                      inputAs={Select}
                      labelText={labels.LOCAL_RULES_USE_CASE}
                      {...getFormFieldProps('localRuleUseCaseId', formik, true)}
                      options={ConversionUtil.convertMapToDropDownList(
                        this.props.localRuleUseCaseList
                      )}
                      disabled={isDisabled}
                    />
                  </WFEnableForPermission>
                </GridCol>
              </GridRow>
            )}
            <GridRow className="fe_u_padding--top-medium">
              <GridCol>
                <WFEnableForPermission
                  permission={
                    Acl.BUSINESS_REQUIREMENT_RULE_REPORTING_CATEGORY_UPDATE
                  }
                >
                  <FormField
                    inputAs={Select}
                    labelText={labels.RULE_REPORTING_CATEGORY}
                    hintText={
                      activeWorkflowStepId(task) !==
                      AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS
                        .ANALYZE_TASK_STEP
                        ? Messages.RRC_EDIT_MSG
                        : ''
                    }
                    disabled={
                      activeWorkflowStepId(task) !==
                        AppConstants.SERVER_CONSTANTS.WORKFLOW_STEPS
                          .ANALYZE_TASK_STEP || isDisabled
                    }
                    {...getFormFieldProps(
                      'ruleReportingCategoryId',
                      formik,
                      true
                    )}
                    options={ConversionUtil.convertMapToDropDownListInIdNameFormat(
                      this.props.ruleReportingCategories
                    )}
                  />
                </WFEnableForPermission>
              </GridCol>
              <GridCol>
                <WFEnableForPermission
                  permission={Acl.BUSINESS_REQUIREMENT_RULE_TYPE_UPDATE}
                >
                  <FormField
                    inputAs={Select}
                    labelText={labels.RULE_TYPE}
                    {...getFormFieldProps('ruleTypeId', formik, true)}
                    options={ConversionUtil.convertMapToDropDownList(
                      this.props.ruleTypes
                    )}
                    disabled={isDisabled}
                  />
                </WFEnableForPermission>
              </GridCol>
              <GridCol className="padding-right-medium">
                <WFEnableForPermission
                  permission={
                    Acl.BUSINESS_REQUIREMENT_VISIT_RULE_DISPLAY_LOCATION_UPDATE
                  }
                >
                  <FormField
                    inputAs={Select}
                    labelText={labels.VISIT_RULE_DISPLAY_LOCATION}
                    {...getFormFieldProps(
                      'visitRuleDisplayLocationId',
                      formik,
                      false
                    )}
                    options={ConversionUtil.convertMapToDropDownList(
                      this.props.visitRuleDisplayLocations
                    )}
                    disabled={isDisabled}
                  />
                </WFEnableForPermission>
              </GridCol>
            </GridRow>
            <GridRow>
              <GridCol className="width-medium">
                <WFEnableForPermission
                  permission={Acl.BUSINESS_REQUIREMENT_SCRUB_TYPE_UPDATE}
                >
                  <FormField
                    inputAs={Select}
                    labelText={labels.USER_OVERRIDE_AVALIABLE}
                    {...getFormFieldProps('scrubTypeId', formik, true)}
                    options={ConversionUtil.convertMapToDropDownListInIdNameFormat(
                      this.props.scrubTypes
                    )}
                  />
                </WFEnableForPermission>
              </GridCol>
              <GridCol>
                <WFEnableForPermission
                  permission={
                    Acl.BUSINESS_REQUIREMENT_CLAIM_RULE_CATEGORY_UPDATE
                  }
                >
                  <FormField
                    inputAs={Typeahead}
                    required
                    labelText={labels.CLAIM_RULE_CATEGORY}
                    {...getFormFieldProps('claimRuleCategory', formik, true)}
                    onChange={(event: React.ChangeEvent<HTMLInputElement>) => {
                      this.handleClaimRuleCategoryChange(event, formik);
                    }}
                    alwaysRenderSuggestions={false}
                    suggestions={this.state.claimRuleCategoryList}
                    onSuggestionSelected={(
                      event: React.ChangeEvent<HTMLInputElement>,
                      value: any
                    ) => {
                      this.handleClaimRuleCategorySelection(value, formik);
                    }}
                    disabled={isDisabled}
                  ></FormField>
                </WFEnableForPermission>
              </GridCol>
            </GridRow>
          </div>
        </div>
        <div>
          <Accordion className="taskgroup">
            <AccordionItem
              headingText={
                Labels.TASK_BUSINESS_REQUIREMENT_FIELD_LABEL.INTERNAL_FIXTEXT
              }
            >
              <WFEnableForPermission
                permission={Acl.BUSINESS_REQUIREMENT_INTERNAL_FIX_TEXT1_UPDATE}
              >
                <RichTextEditor
                  id="internalFixText1"
                  wrapperId={6}
                  labelText={labels.INTERNAL_FIX_TEXT1}
                  formik={this.props.formik}
                  isDisabled={isDisabled}
                  maxLength={2000}
                ></RichTextEditor>
              </WFEnableForPermission>
              <WFEnableForPermission
                permission={Acl.BUSINESS_REQUIREMENT_INTERNAL_FIX_TEXT2_UPDATE}
              >
                <RichTextEditor
                  id="internalFixText2"
                  wrapperId={7}
                  labelText={labels.INTERNAL_FIX_TEXT2}
                  formik={this.props.formik}
                  isDisabled={isDisabled}
                  maxLength={2000}
                ></RichTextEditor>
              </WFEnableForPermission>
            </AccordionItem>
          </Accordion>
        </div>
      </Form>
    );
  }

  handleContextChange(
    event: React.ChangeEvent<HTMLInputElement>,
    formik: FormikProps<any>
  ) {
    if (event.type === undefined) {
      return;
    }
    const contextInput = event.target.value;
    getContextList(contextInput).then((data: any) => {
      const contextList = data.map((context: any) => {
        context['value'] = context['refId'] + ' - ' + context['name'];
        return context;
      });
      this.setState({
        contextList: contextList,
      });
    });
    formik.setFieldValue('context', contextInput);
    formik.setFieldValue('contextId', '');
  }

  handleBrTypeChange(event: any, formik: FormikProps<any>) {
    let contextId = '';
    if (
      event.target.value ===
      AppConstants.SERVER_CONSTANTS.BUSINESS_REQUIREMENT_TYPES.GLOBAL
    ) {
      contextId = AppConstants.SERVER_CONSTANTS.GLOBAL_CONTEXT_ID;
    }
    formik.setFieldValue('businessRequirementTypeId', event.target.value);
    formik.setFieldValue('context', '');
    formik.setFieldValue('contextId', contextId);
  }

  handleClaimRuleCategoryChange(
    event: React.ChangeEvent<HTMLInputElement>,
    formik: FormikProps<any>
  ) {
    if (event.type === undefined) {
      return;
    }
    const claimRuleCategoryInput = event.target.value;
    getClaimRuleCategoryList({
      claimRuleCategoryPrefix: claimRuleCategoryInput,
    }).then((data: any) => {
      const claimRuleCategoryList = data.map((claimRuleCategory: any) => {
        claimRuleCategory['value'] =
          claimRuleCategory['refId'] + ' - ' + claimRuleCategory['name'];
        return claimRuleCategory;
      });
      this.setState({
        claimRuleCategoryList: claimRuleCategoryList,
      });
    });
    formik.setFieldValue('claimRuleCategory', claimRuleCategoryInput);
    formik.setFieldValue('claimRuleCategoryId', '');
  }

  handleContextSelection(value: any, formik: FormikProps<any>) {
    formik.setFieldValue('contextId', value.suggestion.id);
    formik.setFieldValue('context', value.suggestionValue);
  }

  handleClaimRuleCategorySelection(value: any, formik: FormikProps<any>) {
    formik.setFieldValue('claimRuleCategoryId', value.suggestion.id);
    formik.setFieldValue('claimRuleCategory', value.suggestionValue);
  }
}

const mapStateToProps = (state: any) => {
  return {
    task: getTaskDetail(state),
    businessRequirementTypes: getBusinessRequirementTypes(state),
    ruleReportingCategories: getRuleReportingCategories(state),
    localRuleUseCaseList: getLocalRuleUseCaseList(state),
    ruleTypes: getRuleTypeList(state),
    scrubTypes: getScrubTypes(state),
    visitRuleDisplayLocations: getVisitRuleDisplayLocationList(state),
  };
};

const dispatchToProps = {
  fetchBusinessRequirementTypesOnce,
  fetchRuleReportingCategoriesOnce,
  fetchLocalRuleUseCaseListOnce,
  fetchRuleTypesOnce,
  fetchVisitRuleDisplayLocationsOnce,
  fetchScrubTypesOnce,
};

export default connect(mapStateToProps, dispatchToProps)(BusinessRequirement);
