import React, { Component } from 'react';
import {
  Root,
  Form,
  FormField,
  Button,
  Multiselect,
  DateInput,
  Typeahead,
} from '@athena/forge/';
import { Popover } from '@athena/forge-popover';
import './AdvancedSearch.scss';
import { Formik, FormikProps } from 'formik';
import { toUpper, get, map, snakeCase, isArray } from 'lodash';
import Labels from '../../../constants/Labels';
import moment from 'moment';
import AppConstants from '../../../constants/AppConstants';
import { isEmpty } from 'lodash';
import {
  getUsers,
  fetchUsersOnce,
  fetchPrioritiesOnce,
} from '../../../slices/MasterDataSlice';
import { connect } from 'react-redux';
import CommonUtil from '../../../utils/CommonUtil';
import ConversionUtil from '../../../utils/ConversionUtil';

interface AdvancedSearchProps {
  onSearch: any;
  taskTypeFilter: string[];
  statusFilter: string[];
  workFlowStepFilter: string[];
  users?: any[];
  priorities: any;
  fetchUsersOnce: any;
  fetchPrioritiesOnce: any;
}

const labels = Labels.ADVANCE_TASK_SEARCH;

export class AdvancedSearch extends Component<AdvancedSearchProps, any> {
  unsubscribeClickCallback: any;
  state = {
    showAdvanceSearchForm: false,
    showAdvanceSearchCustomOptions: false,
    advancedOptionsFlags: {
      workflowStepIds: false,
      statusIds: false,
      taskTypeIds: false,
      createdDate: false,
      deploymentDate: false,
      internalDueDate: false,
      assignedToIds: false,
      signedoffByIds: false,
      priorityIds: false,
      modelName: false,
      DTName: false,
      DTId: false,
      modelDesignChanges: false,
    },
    hasMoreAdvancedOptions: true,
    taskTypeFilter: [],
    statusFilter: [],
    workFlowStepFilter: [],
    priorityFilter: [],
    recentSearches: [],
  };

  addAdvancedOption = (id: string): void => {
    const { advancedOptionsFlags } = this.state;
    const data = {
      ...advancedOptionsFlags,
    };
    //@ts-ignore
    data[id] = true;
    this.setState({
      advancedOptionsFlags: data,
      showAdvanceSearchCustomOptions: false,
    });
  };

  renderAdvancedOptions(): JSX.Element[] {
    const options: JSX.Element[] = [];
    const { advancedOptionsFlags } = this.state;
    map(advancedOptionsFlags, (value: string, key: string) => {
      if (!value) {
        options.push(
          <Button
            id={key}
            text={get(labels, toUpper(snakeCase(key)))}
            variant="secondary"
            onClick={() => {
              this.addAdvancedOption(key);
            }}
          />
        );
      }
    });
    return options;
  }

  getAllOptionObj = (): any => {
    return {
      id: Labels.DASHBOARD_GRID.ALL,
      name: Labels.DASHBOARD_GRID.ALL,
      description: Labels.DASHBOARD_GRID.ALL,
    };
  };

  getFilterDetailsObj = (key: string, value: any) => {
    const {
      taskTypeFilter,
      statusFilter,
      workFlowStepFilter,
      priorityFilter,
    } = this.state;
    const obj: any = {
      taskTypeFilter,
      statusFilter,
      workFlowStepFilter,
      priorityFilter,
    };
    obj[key] = value;
    return obj;
  };

  handleChange = (event: any, formik: any) => {
    const key: string = event.target.id;
    const values = event.target.value;
    let filterObj: any = {};
    const ALL = Labels.DASHBOARD_GRID.ALL;
    const {
      TASK_TYPE_FILTER,
      STATUS_FILTER,
      WORK_FLOW_STEP_FILTER,
    } = Labels.DASHBOARD_GRID;
    //@ts-ignore
    const filterDetails = this.state[key];
    if (
      values &&
      values.includes(ALL) &&
      filterDetails &&
      !filterDetails.includes(ALL)
    ) {
      let filterSet: any[] = [];
      if (key.toUpperCase() === TASK_TYPE_FILTER) {
        filterSet = [...this.props.taskTypeFilter];
      } else if (key.toUpperCase() === STATUS_FILTER) {
        filterSet = [...this.props.statusFilter];
      } else if (key.toUpperCase() === WORK_FLOW_STEP_FILTER) {
        filterSet = [...this.props.workFlowStepFilter];
      }
      filterObj = this.getFilterDetailsObj(key, filterSet);
    } else if (
      values &&
      !values.includes(ALL) &&
      filterDetails &&
      filterDetails.includes(ALL)
    ) {
      filterObj = this.getFilterDetailsObj(key, []);
    } else if (
      values &&
      values.includes(ALL) &&
      filterDetails &&
      filterDetails.includes(ALL)
    ) {
      filterObj = this.getFilterDetailsObj(key, values.splice(1));
    } else {
      filterObj = this.getFilterDetailsObj(key, values);
    }
    this.setState(filterObj);
    const forMValue = { ...formik.values };
    forMValue.taskTypeIds = filterObj.taskTypeFilter;
    forMValue.statusIds = filterObj.statusFilter;
    forMValue.workFlowStepIds = filterObj.workFlowStepFilter;
    forMValue.priorityIds = filterObj.priorityFilter;
    formik.setValues(forMValue, true);
  };

  useOnClickOutside(listener: any): any {
    document.addEventListener('mousedown', listener);
    document.addEventListener('touchstart', listener);
    return () => {
      document.removeEventListener('mousedown', listener);
      document.removeEventListener('touchstart', listener);
    };
  }

  componentDidMount() {
    this.props.fetchUsersOnce();
    this.props.fetchPrioritiesOnce();

    this.unsubscribeClickCallback = this.useOnClickOutside((event: any) => {
      const { target } = event;
      if (
        document
          .querySelector('.fe_c_multiselect__menu, .react-datepicker__tab-loop')
          ?.contains(target) ||
        target == document.documentElement
      ) {
        return;
      }
      const options = document.querySelector('.advanced-search-custom-options');
      if (options && !options.contains(target)) {
        this.setState({ showAdvanceSearchCustomOptions: false });
      }
      const form = document.querySelector('.advanced-search-form');

      if (form && !form.contains(target)) {
        if (!options || (options && !options.contains(target))) {
          this.setState({ showAdvanceSearchForm: false });
        }
      }
    });
  }

  componentWillUnmount() {
    // Make sure to remove the DOM listener when the component is unmounted.
    this.unsubscribeClickCallback();
  }

  getFormFieldProps = (fieldName: string, formik: FormikProps<any>): any => {
    const props = {
      ...formik.getFieldProps(fieldName),
      id: fieldName,
    };
    return props;
  };

  renderForm(formik: any): JSX.Element {
    const flags = this.state.advancedOptionsFlags;
    return (
      <div className="fe_u_padding--large">
        <Form
          onSubmit={formik.handleSubmit}
          id="search-advance"
          layout="compact"
          includeSubmitButton={false}
          autoComplete="off"
        >
          <FormField
            labelText={labels.HAS_WORDS}
            {...this.getFormFieldProps('searchKeyword', formik)}
            hintText={labels.MULTI_PHRASE_MATCH_HINT}
          />
          <FormField
            labelText={labels.BR_NAME}
            {...this.getFormFieldProps('brName', formik)}
            hintText={labels.MULTI_PHRASE_MATCH_HINT}
          />
          <FormField
            labelText={labels.BR_ID}
            {...this.getFormFieldProps('brId', formik)}
          />
          <FormField
            labelText={labels.TASK_NAME}
            {...this.getFormFieldProps('taskName', formik)}
            hintText={labels.MULTI_PHRASE_MATCH_HINT}
          />
          <FormField
            labelText={labels.TASK_ID}
            {...this.getFormFieldProps('taskId', formik)}
          />
          <FormField
            labelText={labels.LEGACY_RULE_ID}
            {...this.getFormFieldProps('legacyRuleId', formik)}
          />
          {flags.workflowStepIds && (
            <FormField
              labelText={labels.WORKFLOW_STEP_IDS}
              inputAs={Multiselect}
              {...this.getFormFieldProps('workFlowStepIds', formik)}
              id="workFlowStepFilter"
              onChange={(event: any) => this.handleChange(event, formik)}
              options={this.props.workFlowStepFilter}
            />
          )}
          {flags.statusIds && (
            <FormField
              labelText={labels.STATUS_IDS}
              inputAs={Multiselect}
              {...this.getFormFieldProps('statusIds', formik)}
              id="statusFilter"
              onChange={(event: any) => this.handleChange(event, formik)}
              options={this.props.statusFilter}
            />
          )}
          {flags.taskTypeIds && (
            <FormField
              labelText={labels.TASK_TYPE_IDS}
              inputAs={Multiselect}
              {...this.getFormFieldProps('taskTypeIds', formik)}
              id="taskTypeFilter"
              onChange={(event: any) => this.handleChange(event, formik)}
              options={this.props.taskTypeFilter}
            />
          )}
          {flags.createdDate && (
            <div className="date-header">
              <div className="dateFrom">
                <div className="fe_f_all fe_c_label">{labels.CREATED_DATE}</div>
                <FormField
                  //labelText={labels.CREATED_DATE}
                  className="date-range-from"
                  {...this.getFormFieldProps('createdStartDate', formik)}
                  onBlur={(event: any) => {
                    CommonUtil.handleDateChange(event, formik);
                  }}
                  inputAs={(props: any) => {
                    const dateProps = { ...props, onChange: null };
                    return (
                      <div className="fe_u_flex-container">
                        <DateInput {...dateProps} />
                        {formik.getFieldProps('createdStartDate').value && (
                          <Button
                            variant="tertiary"
                            icon="Close"
                            onClick={() => {
                              formik.setFieldValue(
                                'createdStartDate',
                                undefined,
                                false
                              );
                            }}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
              <div className="dateTo">
                <div className="fe_f_all fe_c_label"> to</div>
                <FormField
                  className="date-range-to"
                  {...this.getFormFieldProps('createdEndDate', formik)}
                  onBlur={(event: any) => {
                    CommonUtil.handleDateChange(event, formik);
                  }}
                  inputAs={(props: any) => {
                    const dateProps = { ...props, onChange: null };
                    return (
                      <div className="fe_u_flex-container">
                        <DateInput {...dateProps} />
                        {formik.getFieldProps('createdEndDate').value && (
                          <Button
                            variant="tertiary"
                            icon="Close"
                            onClick={() => {
                              formik.setFieldValue(
                                'createdEndDate',
                                undefined,
                                false
                              );
                            }}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          )}
          {flags.deploymentDate && (
            <div className="date-header">
              <div className="dateFrom">
                <div className="fe_f_all fe_c_label">
                  {labels.DEPLOYMENT_DATE}
                </div>
                <FormField
                  className="date-range-from"
                  {...this.getFormFieldProps('deploymentStartDate', formik)}
                  onBlur={(event: any) => {
                    CommonUtil.handleDateChange(event, formik);
                  }}
                  inputAs={(props: any) => {
                    const dateProps = { ...props, onChange: null };
                    return (
                      <div className="fe_u_flex-container">
                        <DateInput {...dateProps} />
                        {formik.getFieldProps('deploymentStartDate').value && (
                          <Button
                            variant="tertiary"
                            icon="Close"
                            onClick={() => {
                              formik.setFieldValue(
                                'deploymentStartDate',
                                undefined,
                                false
                              );
                            }}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
              <div className="dateTo">
                <div className="fe_f_all fe_c_label"> {labels.TO}</div>
                <FormField
                  className="date-range-to"
                  {...this.getFormFieldProps('deploymentEndDate', formik)}
                  onBlur={(event: any) => {
                    CommonUtil.handleDateChange(event, formik);
                  }}
                  inputAs={(props: any) => {
                    const dateProps = { ...props, onChange: null };
                    return (
                      <div className="fe_u_flex-container">
                        <DateInput {...dateProps} />
                        {formik.getFieldProps('deploymentEndDate').value && (
                          <Button
                            variant="tertiary"
                            icon="Close"
                            onClick={() => {
                              formik.setFieldValue(
                                'deploymentEndDate',
                                undefined,
                                false
                              );
                            }}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          )}
          {flags.internalDueDate && (
            <div className="date-header">
              <div className="dateFrom">
                <div className="fe_f_all fe_c_label">
                  {labels.INTERNAL_DUE_DATE}
                </div>
                <FormField
                  className="date-range-from"
                  {...this.getFormFieldProps('internalDueStartDate', formik)}
                  onBlur={(event: any) => {
                    CommonUtil.handleDateChange(event, formik);
                  }}
                  inputAs={(props: any) => {
                    const dateProps = { ...props, onChange: null };
                    return (
                      <div className="fe_u_flex-container">
                        <DateInput {...dateProps} />
                        {formik.getFieldProps('internalDueStartDate').value && (
                          <Button
                            variant="tertiary"
                            icon="Close"
                            onClick={() => {
                              formik.setFieldValue(
                                'internalDueStartDate',
                                undefined,
                                false
                              );
                            }}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
              <div className="dateTo">
                <div className="fe_f_all fe_c_label"> {labels.TO}</div>
                <FormField
                  className="date-range-to"
                  {...this.getFormFieldProps('internalDueEndDate', formik)}
                  onBlur={(event: any) => {
                    CommonUtil.handleDateChange(event, formik);
                  }}
                  inputAs={(props: any) => {
                    const dateProps = { ...props, onChange: null };
                    return (
                      <div className="fe_u_flex-container">
                        <DateInput {...dateProps} />
                        {formik.getFieldProps('internalDueEndDate').value && (
                          <Button
                            variant="tertiary"
                            icon="Close"
                            onClick={() => {
                              formik.setFieldValue(
                                'internalDueEndDate',
                                undefined,
                                false
                              );
                            }}
                          />
                        )}
                      </div>
                    );
                  }}
                />
              </div>
            </div>
          )}

          {flags.assignedToIds && (
            <FormField
              labelText={labels.ASSIGNED_TO_IDS}
              inputAs={Multiselect}
              options={ConversionUtil.convertMapToDropDownList(
                this.props.users,
                'userName'
              )}
              {...this.getFormFieldProps('assignedToIds', formik)}
            />
          )}

          {flags.signedoffByIds && (
            <FormField
              labelText={labels.SIGNEDOFF_BY_IDS}
              inputAs={Multiselect}
              options={ConversionUtil.convertMapToDropDownList(
                this.props.users,
                'userName'
              )}
              {...this.getFormFieldProps('signedoffByIds', formik)}
            />
          )}

          {flags.priorityIds && (
            <FormField
              labelText={labels.PRIORITY_IDS}
              inputAs={Multiselect}
              {...this.getFormFieldProps('priorityIds', formik)}
              id="priorityFilter"
              options={this.constructPriorityObject()}
              onChange={(event: any) => this.handleChange(event, formik)}
            />
          )}

          {flags.modelName && (
            <FormField
              labelText={labels.MODEL_NAME}
              {...this.getFormFieldProps('modelName', formik)}
            />
          )}

          {flags.DTName && (
            <FormField
              labelText={labels.DT_NAME}
              {...this.getFormFieldProps('DTName', formik)}
            />
          )}

          {flags.DTId && (
            <FormField
              labelText={labels.DT_ID}
              {...this.getFormFieldProps('DTId', formik)}
            />
          )}

          {flags.modelDesignChanges && (
            <FormField
              labelText={labels.MODEL_DESIGN_CHANGES}
              {...this.getFormFieldProps('modelDesignChanges', formik)}
            />
          )}
          <div className="advanced-search-custom-options-button">
            <Popover
              type="button"
              icon="Add"
              text={labels.ADD_MORE_OPTIONS}
              variant="tertiary"
              triggerType="click"
              disableBodyPadding={true}
              placement="bottom"
              showPopover={this.state.showAdvanceSearchCustomOptions}
              popoverClassName="advanced-search-custom-options"
              triggerPassedProps={{
                onClick: () =>
                  this.setState({ showAdvanceSearchCustomOptions: true }),
                disabled: !this.state.hasMoreAdvancedOptions,
              }}
            >
              {this.renderAdvancedOptions()}
            </Popover>
          </div>
          <div className="fe_u_flex-container fe_u_margin--top-medium flex-direction">
            <Button
              id="submit"
              type="submit"
              text={labels.SEARCH}
              onClick={(event) => {
                event.preventDefault();
                formik.setFieldValue('searchText', '', false);
                formik.handleSubmit();
              }}
            />
          </div>
        </Form>
      </div>
    );
  }
  constructPriorityObject(): any {
    let priorityList: any = [];
    priorityList = this.props.priorities?.map((priority: any) => priority.name);
    return priorityList;
  }

  searchKeyPressHandler = (event: any, formik: FormikProps<any>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      formik.handleChange(event);
      formik.submitForm();
      event.target.blur();
    }
  };

  updateSearchHistory = (searchText: any): void => {
    if (isEmpty(searchText)) return;
    let searchHistory: any = [];
    const currentSearchHistory = localStorage.getItem('searchHistory');
    if (currentSearchHistory !== null) {
      searchHistory = JSON.parse(currentSearchHistory);
    }
    const idx = searchHistory.indexOf(searchText);
    if (idx > -1) {
      searchHistory.splice(idx, 1);
    }
    searchHistory.push(searchText);
    if (
      searchHistory.length > AppConstants.UI_CONSTANTS.MAX_NO_OF_SEARCH_ITEMS
    ) {
      searchHistory.splice(
        0,
        searchHistory.length - AppConstants.UI_CONSTANTS.MAX_NO_OF_SEARCH_ITEMS
      );
    }
    localStorage.setItem('searchHistory', JSON.stringify(searchHistory));
  };

  showSearchHistory = (): void => {
    let searchHistory: any = [];
    const currentSearchHistory = localStorage.getItem('searchHistory');
    if (currentSearchHistory !== null) {
      searchHistory = JSON.parse(currentSearchHistory);
      this.setState({ recentSearches: [...searchHistory].reverse() });
    }
  };

  constructMultiSelectFields = (
    querystring: any,
    payloadMap: any,
    queryLabelMap: any,
    formik: any,
    data: any
  ): any => {
    const multiFieldArray: any = [];
    let mutiFieldKey: any;
    querystring
      .split(AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.BOOLEAN_OR)
      .forEach((element: any) => {
        const multiField = element.split(':');
        multiFieldArray.push(multiField[1].trim());
        mutiFieldKey = multiField[0].trim();
      });
    payloadMap.set(queryLabelMap.get(mutiFieldKey), multiFieldArray);
    const id: any = queryLabelMap.get(mutiFieldKey);
    data[id] = true;
    this.setState({
      advancedOptionsFlags: data,
    });
    return payloadMap;
  };

  onSubmit = (values: any, formik: any) => {
    const output: any = { ...values };
    map(output, function (value: any, key: string) {
      if (value instanceof Date) {
        output[key] = moment(value).format(
          AppConstants.UI_CONSTANTS.DATE_INPUT_FORMAT
        );
      }
      if (value && ['assignedToIds', 'signedoffByIds'].includes(key)) {
        output[key] = ConversionUtil.convertDropDownListToValues(value);
      }
    });
    this.setState({
      showAdvanceSearchForm: false,
      showAdvanceSearchCustomOptions: false,
    });

    const searchTextQuery = output.searchText;
    const SEARCH_CONS: any = AppConstants.UI_CONSTANTS.ADVANCED_SEARCH;
    if (!isEmpty(searchTextQuery)) {
      this.updateSearchHistory(searchTextQuery);
      const queryColumnMap = new Map();
      const { advancedOptionsFlags } = this.state;
      const data: any = {
        ...advancedOptionsFlags,
      };
      queryColumnMap
        .set(SEARCH_CONS.QUERY_COLUMNS.searchKeyword, 'searchText')
        .set(SEARCH_CONS.QUERY_COLUMNS.brName, 'brName')
        .set(SEARCH_CONS.QUERY_COLUMNS.brId, 'brId')
        .set(SEARCH_CONS.QUERY_COLUMNS.taskName, 'taskName')
        .set(SEARCH_CONS.QUERY_COLUMNS.taskId, 'taskId')
        .set(SEARCH_CONS.QUERY_COLUMNS.legacyRuleId, 'legacyRuleId')
        .set(SEARCH_CONS.QUERY_COLUMNS.modelName, 'modelName')
        .set(SEARCH_CONS.QUERY_COLUMNS.DTName, 'DTName')
        .set(SEARCH_CONS.QUERY_COLUMNS.DTId, 'DTId')
        .set(SEARCH_CONS.QUERY_COLUMNS.modelDesignChanges, 'modelDesignChanges')
        .set(SEARCH_CONS.QUERY_COLUMNS.statusIds, 'statusIds')
        .set(SEARCH_CONS.QUERY_COLUMNS.workFlowStepIds, 'workFlowStepIds')
        .set(SEARCH_CONS.QUERY_COLUMNS.taskTypeIds, 'taskTypeIds')
        .set(SEARCH_CONS.QUERY_COLUMNS.priorityIds, 'priorityIds')
        .set(SEARCH_CONS.QUERY_COLUMNS.signedoffByIds, 'signedoffByIds')
        .set(SEARCH_CONS.QUERY_COLUMNS.assignedToIds, 'assginedToIds');
      const fieldItems =
        searchTextQuery.indexOf(SEARCH_CONS.BOOLEAN_AND) > -1
          ? searchTextQuery.split(SEARCH_CONS.BOOLEAN_AND)
          : Array.of(searchTextQuery);
      let payloadMap = new Map();
      fieldItems.forEach((element: any) => {
        let queryString: any;
        if (element.trim().startsWith('(') && element.trim().endsWith(')')) {
          queryString = element.trim().substring(1, element.trim().length - 1);
          payloadMap = this.constructMultiSelectFields(
            queryString,
            payloadMap,
            queryColumnMap,
            formik,
            data
          );
        } else {
          queryString = element.trim();
          if (queryString.indexOf(':') > -1) {
            payloadMap.set(
              queryColumnMap.get(queryString.trim().split(':')[0]),
              queryString.trim().split(':')[1]
            );
            const id: any = queryColumnMap.get(
              queryString.trim().split(':')[0]
            );
            data[id] = true;
            this.setState({
              advancedOptionsFlags: data,
            });
          } else {
            if (queryString.indexOf(SEARCH_CONS.GREATER_THAN_EQUALS) > -1) {
              const key =
                queryString
                  .split(SEARCH_CONS.GREATER_THAN_EQUALS)[0]
                  .split(' ')[0]
                  .trim() + 'StartDate';
              const value = queryString
                .split(SEARCH_CONS.GREATER_THAN_EQUALS)[1]
                .trim();
              payloadMap.set(key, value);
              const id: any =
                queryString
                  .split(SEARCH_CONS.GREATER_THAN_EQUALS)[0]
                  .split(' ')[0]
                  .trim() + 'Date';
              data[id] = true;
              this.setState({
                advancedOptionsFlags: data,
              });
            } else if (queryString.indexOf(SEARCH_CONS.LESS_THAN_EQUALS) > -1) {
              const key =
                queryString
                  .split(SEARCH_CONS.LESS_THAN_EQUALS)[0]
                  .split(' ')[0]
                  .trim() + 'EndDate';
              const value = queryString
                .split(SEARCH_CONS.LESS_THAN_EQUALS)[1]
                .trim();
              payloadMap.set(key, value);
              const id: any =
                queryString
                  .split(SEARCH_CONS.LESS_THAN_EQUALS)[0]
                  .split(' ')[0]
                  .trim() + 'Date';
              data[id] = true;
              this.setState({
                advancedOptionsFlags: data,
              });
            } else if (
              queryString.indexOf(SEARCH_CONS.FROM) > -1 &&
              queryString.indexOf(SEARCH_CONS.TO) > -1 &&
              queryString.indexOf(SEARCH_CONS.DEPLOYMENT_DATE) > -1
            ) {
              const startValue = queryString.trim().split(' ')[
                queryString.split(' ').indexOf(SEARCH_CONS.FROM) + 1
              ];
              const endValue = queryString.trim().split(' ')[
                queryString.split(' ').indexOf(SEARCH_CONS.TO) + 1
              ];
              payloadMap.set('deploymentStartDate', startValue);
              payloadMap.set('deploymentEndDate', endValue);
              data['deploymentDate'] = true;
              this.setState({
                advancedOptionsFlags: data,
              });
            } else if (
              queryString.indexOf(SEARCH_CONS.FROM) > -1 &&
              queryString.indexOf(SEARCH_CONS.TO) > -1 &&
              queryString.indexOf(SEARCH_CONS.CREATED_DATE) > -1
            ) {
              const startValue = queryString.trim().split(' ')[
                queryString.split(' ').indexOf(SEARCH_CONS.FROM) + 1
              ];
              const endValue = queryString.trim().split(' ')[
                queryString.split(' ').indexOf(SEARCH_CONS.TO) + 1
              ];
              payloadMap.set('createdStartDate', startValue);
              payloadMap.set('createdEndDate', endValue);
              data['createdDate'] = true;
              this.setState({
                advancedOptionsFlags: data,
              });
            } else if (
              queryString.indexOf(SEARCH_CONS.FROM) > -1 &&
              queryString.indexOf(SEARCH_CONS.TO) > -1 &&
              queryString.indexOf(SEARCH_CONS.INTERNAL_DUE_DATE) > -1
            ) {
              const startValue = queryString.trim().split(' ')[
                queryString.split(' ').indexOf(SEARCH_CONS.FROM) + 1
              ];
              const endValue = queryString.trim().split(' ')[
                queryString.split(' ').indexOf(SEARCH_CONS.TO) + 1
              ];
              payloadMap.set('internalDueStartDate', startValue);
              payloadMap.set('internalDueEndDate', endValue);
              data['internalDueDate'] = true;
              this.setState({
                advancedOptionsFlags: data,
              });
            } else {
              payloadMap.set(queryColumnMap.get(''), queryString.trim());
              const id = queryColumnMap.get('');
              data[id] = true;
              this.setState({
                advancedOptionsFlags: data,
              });
            }
          }
        }
      });
      const defaultObj = {
        statusIds: [],
        taskTypeIds: [],
        workFlowStepIds: [],
      };
      const updatedOutput = { ...defaultObj, searchText: '' };
      const payload = { ...updatedOutput, ...Object.fromEntries(payloadMap) };
      formik.setValues(payload, true);
      this.props.onSearch(payload);
      formik.setFieldValue('searchText', searchTextQuery);
      formik.setFieldValue('searchKeyword', payload['searchText']);
    } else {
      const searchText = this.getSearchTextQuery(output);
      this.updateSearchHistory(searchText);
      formik.setFieldValue('searchText', searchText);
      const payload = {
        ...output,
        searchText: !isEmpty(output.searchKeyword) ? output.searchKeyword : '',
      };
      this.props.onSearch(payload);
    }
  };

  constructMultiFieldQuery = (key: any, value: any): string => {
    let multiFieldQuery = '';
    const queryCols: any =
      AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.QUERY_COLUMNS;
    const constructedValue = ConversionUtil.constructPayloadObj(value);
    if (constructedValue.length > 1) {
      multiFieldQuery = multiFieldQuery + '(';
      constructedValue.forEach(function (item: any, index: any) {
        if (index === constructedValue.length - 1) {
          multiFieldQuery = multiFieldQuery + queryCols[key] + ':' + item;
        } else {
          multiFieldQuery =
            multiFieldQuery +
            queryCols[key] +
            ':' +
            item +
            AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.BOOLEAN_OR;
        }
      });
      multiFieldQuery = multiFieldQuery + ')';
    } else if (constructedValue.length === 1) {
      multiFieldQuery = '(' + queryCols[key] + ':' + constructedValue[0] + ')';
    }
    return multiFieldQuery;
  };

  constructDeploymentDateQuery = (startDate: any, endDate: any): string => {
    let queryString: any;
    if (!isEmpty(startDate) || isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.DEPLOYMENT_DATE_START_QUERY +
        startDate;
    }
    if (isEmpty(startDate) || !isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.DEPLOYMENT_DATE_END_QUERY +
        endDate;
    }
    if (!isEmpty(startDate) && !isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.DEPLOYMENT_DATE_QUERY +
        startDate +
        ' to ' +
        endDate;
    }
    return queryString;
  };

  constructCreatedDateQuery = (startDate: any, endDate: any): string => {
    let queryString: any;
    if (!isEmpty(startDate) || isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.CREATED_DATE_START_QUERY +
        startDate;
    }
    if (isEmpty(startDate) || !isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.CREATED_DATE_END_QUERY +
        endDate;
    }
    if (!isEmpty(startDate) && !isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.CREATED_DATE_QUERY +
        startDate +
        ' to ' +
        endDate;
    }
    return queryString;
  };

  constructDueDateQuery = (startDate: any, endDate: any): string => {
    let queryString: any;
    if (!isEmpty(startDate) || isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH
          .INTERNAL_DUE_DATE_START_QUERY + startDate;
    }
    if (isEmpty(startDate) || !isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.INTERNAL_DUE_DATE_END_QUERY +
        endDate;
    }
    if (!isEmpty(startDate) && !isEmpty(endDate)) {
      queryString =
        AppConstants.UI_CONSTANTS.ADVANCED_SEARCH.INTERNAL_DUE_DATE_QUERY +
        startDate +
        ' to ' +
        endDate;
    }
    return queryString;
  };

  getSearchTextQuery = (output: any): string => {
    let queryString: any = '';
    let multiFieldQuery: any;
    const searchQueryElements = [];
    const SEARCH_CONS = AppConstants.UI_CONSTANTS.ADVANCED_SEARCH;
    const queryCols: any = SEARCH_CONS.QUERY_COLUMNS;
    const formelement = document.querySelector('#search-advance');
    const eachelement = Array.of(formelement?.querySelectorAll('input'));
    const nodelist = eachelement[0];
    nodelist?.forEach((element: any) => {
      if (
        !isEmpty(element?.name) &&
        !SEARCH_CONS.NON_TEXT_FIELDS.includes(element?.name)
      ) {
        const name = element?.name;
        if (!isEmpty(element?.value)) {
          if (searchQueryElements.length > 0) {
            queryString =
              queryString +
              SEARCH_CONS.BOOLEAN_AND +
              queryCols[name] +
              ':' +
              element?.value;
          } else {
            queryString = !isEmpty(queryCols[name])
              ? queryCols[name] + ':' + element?.value
              : element?.value;
          }
          searchQueryElements.push(element?.value);
        }
      }
    });
    const map = new Map(Object.entries(output));
    map.forEach((value: any, key: any) => {
      if (isArray(value) && value.length > 0) {
        multiFieldQuery = this.constructMultiFieldQuery(key, value);
        if (searchQueryElements.length > 0) {
          queryString = queryString + SEARCH_CONS.BOOLEAN_AND + multiFieldQuery;
        } else {
          queryString = multiFieldQuery;
        }
        searchQueryElements.push(multiFieldQuery);
      }
    });
    if (
      !isEmpty(output.deploymentStartDate) ||
      !isEmpty(output.deploymentEndDate)
    ) {
      const deploymentDateQuery = this.constructDeploymentDateQuery(
        output.deploymentStartDate,
        output.deploymentEndDate
      );
      if (searchQueryElements.length > 0) {
        queryString =
          queryString + SEARCH_CONS.BOOLEAN_AND + deploymentDateQuery;
      } else {
        queryString = deploymentDateQuery;
      }
      searchQueryElements.push(deploymentDateQuery);
    }
    if (!isEmpty(output.createdStartDate) || !isEmpty(output.createdEndDate)) {
      const createdDateQuery = this.constructCreatedDateQuery(
        output.createdStartDate,
        output.createdEndDate
      );
      if (searchQueryElements.length > 0) {
        queryString = queryString + SEARCH_CONS.BOOLEAN_AND + createdDateQuery;
      } else {
        queryString = createdDateQuery;
      }
      searchQueryElements.push(createdDateQuery);
    }
    if (
      !isEmpty(output.internalDueStartDate) ||
      !isEmpty(output.internalDueEndDate)
    ) {
      const internalDueDateQuery = this.constructDueDateQuery(
        output.internalDueStartDate,
        output.internalDueEndDate
      );
      if (searchQueryElements.length > 0) {
        queryString =
          queryString + SEARCH_CONS.BOOLEAN_AND + internalDueDateQuery;
      } else {
        queryString = internalDueDateQuery;
      }
      searchQueryElements.push(internalDueDateQuery);
    }
    return queryString;
  };

  render(): JSX.Element {
    const initialValues = {
      taskTypeIds: [],
      statusIds: [],
      workFlowStepIds: [],
      searchText: '',
    };
    return (
      <Root className="advanced-search-root">
        <Formik
          initialValues={initialValues}
          onSubmit={this.onSubmit}
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => {
            return (
              <div className="advanced-search">
                <FormField
                  labelText={null}
                  inputAs={Typeahead}
                  placeholder={labels.SEARCH}
                  icon="Search"
                  autoComplete="off"
                  disabled={this.state.showAdvanceSearchForm}
                  alwaysRenderSuggestions={false}
                  suggestions={this.state.recentSearches}
                  minQueryLength={0}
                  {...this.getFormFieldProps('searchText', formik)}
                  onSuggestionSelected={(
                    event: React.ChangeEvent<HTMLInputElement>,
                    value: any
                  ) => {
                    formik.setFieldValue(
                      'searchText',
                      value.suggestionValue,
                      false
                    );
                  }}
                  onFocus={(event: any) => {
                    this.showSearchHistory();
                  }}
                  onKeyPress={(event: any) => {
                    this.searchKeyPressHandler(event, formik);
                  }}
                  id="searchBar"
                />
                <Popover
                  type="icon"
                  icon="Expand"
                  triggerType="click"
                  placement="left"
                  showPopover={this.state.showAdvanceSearchForm}
                  popoverClassName="advanced-search-form fe_f_all"
                  triggerPassedProps={{
                    onClick: () =>
                      this.setState({ showAdvanceSearchForm: true }),
                  }}
                >
                  {this.renderForm(formik)}
                </Popover>
                {formik.getFieldProps('searchText').value && (
                  <Button
                    variant="tertiary"
                    icon="Close"
                    onClick={() => {
                      formik.setFieldValue('searchText', '', false);
                      formik.resetForm();
                    }}
                  />
                )}
              </div>
            );
          }}
        </Formik>
      </Root>
    );
  }
}

const mapStateToProps = (state: any) => {
  return { users: getUsers(state) };
};

const mapDispatchToProps = {
  fetchUsersOnce,
  fetchPrioritiesOnce,
};

export default connect(mapStateToProps, mapDispatchToProps)(AdvancedSearch);
