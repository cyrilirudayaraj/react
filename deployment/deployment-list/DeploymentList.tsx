import React, { Component } from 'react';
import DeploymentListGrid from './DeploymentListGrid';
import DeploymentListDetail from './DeploymentListDetail';
import { getDeployments } from '../../../services/CommonService';
import AppConstants from '../../../constants/AppConstants';
import './DeploymentList.scss';
import DeploymentListPaginator from './DeploymentListPaginator';
import {
  Accordion,
  Multiselect,
  Button,
  Heading,
  FormField,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import Labels from '../../../constants/Labels';
import ConversionUtil from '../../../utils/ConversionUtil';
import { isEmpty } from 'lodash';
import { DeploymentStatus } from '../../../types';
const { DEPLOYMENTS_PAGE_SIZE } = AppConstants.SERVER_CONSTANTS;
const { RELEASED_BY_FILTER, STATUS_FILTER } = Labels.DEPLOYMENT_GRID;
const ALL = Labels.DEPLOYMENT_GRID.ALL;

interface DeploymentListProps {
  statusFilter: string[];
  releasedByFilter: string[];
  deploymentStatuses: DeploymentStatus[];
  handleDeploymentInprogressValidation?: any;
}

export default class DeploymentList extends Component<DeploymentListProps> {
  state: any = {
    total: 0,
    currentPage: 0,
    sortBy: null,
    sortOrder: null,
    dataSource: [],
    clearAllBtn: true,
    isStatusFilterOpen: false,
    isReleasedByFilterOpen: false,
    filterDetails: {
      taskFilter: [],
      statusFilter: [],
      releasedByFilter: [],
    },
  };
  constructor(props: any) {
    super(props);
    this.getDeployments();
  }

  componentDidMount() {
    this.setState({
      filterDetails: {
        taskFilter: [],
        statusFilter: this.props.statusFilter,
        releasedByFilter: ConversionUtil.constructPayloadObj(
          this.props.releasedByFilter
        ),
      },
    });
  }

  getDeploymentGridTemplate = (): JSX.Element => {
    return <DeploymentListGrid dataSource={this.state.dataSource} />;
  };

  getReleaseNotesLayout = (): JSX.Element[] => {
    return this.state.dataSource?.map((deployment: any) => {
      return (
        <DeploymentListDetail
          key={deployment.id}
          deploymentDetails={deployment}
          updateDeploymentDetails={this.getDeploymentsByFilter}
          handleDeploymentInprogressValidation={
            this.props.handleDeploymentInprogressValidation
          }
        />
      );
    });
  };

  getDeployments = (): void => {
    const payload = this.getRequestPayload();
    payload.statusIds = null;
    payload.releasedByIds = null;
    payload.taskIds = null;
    this.setState({ isSearchResultEmpty: false });
    return getDeployments(payload).then((response: any) => {
      this.setState({ dataSource: response.result, total: response.total });
    });
  };

  getSelectedStatusIds = (names: string[], objArray: any[]) => {
    const ids: string[] = [];
    if (names && names.length > 0) {
      objArray.forEach((obj: any) => {
        if (obj.name !== ALL && names.indexOf(obj.name) > -1) {
          ids.push(obj.id);
        }
      });
    }
    return ids.length > 0 ? ids : null;
  };

  getDeploymentsByFilter = (values: any): void => {
    const request = this.getRequestPayload();
    const payload = { ...values, ...request };
    payload.statusIds = this.getSelectedStatusIds(
      this.state.filterDetails.statusFilter,
      [...this.props.deploymentStatuses]
    );
    if (this.state.filterDetails.taskFilter.length > 0) {
      payload.taskIds = [...this.state.filterDetails.taskFilter];
    } else {
      payload.taskIds = [];
    }
    payload.releasedByIds = this.getSelectedUserNames(
      this.state.filterDetails.releasedByFilter,
      [...this.props.releasedByFilter]
    );

    return getDeployments(payload).then((response: any) => {
      this.setState({ dataSource: response.result, total: response.total });
    });
  };

  getRequestPayload = (): any => {
    const offset = this.state.currentPage * DEPLOYMENTS_PAGE_SIZE;
    const limit = DEPLOYMENTS_PAGE_SIZE;
    return {
      offset,
      limit,
    };
  };

  getSelectedUserNames = (names: string[], objArray: any[]) => {
    const ids: string[] = [];
    if (names && names.length > 0) {
      objArray.forEach((obj: any) => {
        if (obj.value !== ALL && names.indexOf(obj.value) > -1) {
          ids.push(obj.value);
        }
      });
    }
    return ids.length > 0 ? ids : null;
  };
  setCurrentPage = (pageIndex: number): void => {
    this.setState({ currentPage: pageIndex }, () => {
      this.getDeploymentsByFilter({});
    });
  };

  renderPaginator(): any {
    const { total, currentPage } = this.state;
    if (
      this.state.dataSource != undefined &&
      this.state.dataSource.length > 0
    ) {
      return (
        <DeploymentListPaginator
          total={total}
          currentPage={currentPage}
          pageSize={DEPLOYMENTS_PAGE_SIZE}
          onPageChange={this.setCurrentPage}
        />
      );
    }
  }

  clearAllFilters = (formik: any) => {
    formik.resetForm();
    this.setState(
      {
        filterDetails: {
          taskFilter: [],
          statusFilter: ConversionUtil.constructPayloadObj(
            this.props.statusFilter
          ),
          releasedByFilter: ConversionUtil.constructPayloadObj(
            this.props.releasedByFilter
          ),
        },
        clearAllBtn: true,
        currentPage: 0,
      },
      () => {
        formik.submitForm();
      }
    );
  };

  handelFilterFocus = (filterName: string) => {
    switch (filterName.toUpperCase()) {
      case STATUS_FILTER:
        this.setState({ isStatusFilterOpen: true });
        break;
      case RELEASED_BY_FILTER:
        this.setState({ isReleasedByFilterOpen: true });
        break;
    }
  };

  handelFilterBlur = (filterName: string) => {
    switch (filterName.toUpperCase()) {
      case STATUS_FILTER:
        this.setState({ isStatusFilterOpen: false });
        break;
      case RELEASED_BY_FILTER:
        this.setState({ isReleasedByFilterOpen: false });
        break;
    }
  };

  getFilterDetailsObj = (key: string, value: any) => {
    const obj: any = { ...this.state.filterDetails };
    obj[key] = value;
    return obj;
  };
  getFormFieldProps = (fieldName: string, formik: FormikProps<any>): any => {
    const props = {
      ...formik.getFieldProps(fieldName),
      id: fieldName,
    };
    return props;
  };

  handleChange = (event: any, formik: any) => {
    const key = event.target.id;
    const values = ConversionUtil.constructPayloadObj(event.target.value);
    let filterObj: any = {};
    this.setState({ clearAllBtn: false });
    const filterDetails = this.state.filterDetails;
    if (
      values &&
      values.includes(ALL) &&
      filterDetails[key] &&
      !filterDetails[key].includes(ALL)
    ) {
      let filterSet: any[] = [];
      if (key.toUpperCase() === 'RELEASEDBYFILTER') {
        filterSet = [
          ...ConversionUtil.constructPayloadObj(this.props.releasedByFilter),
        ];
      }
      if (key.toUpperCase() === 'STATUSFILTER') {
        filterSet = [...this.props.statusFilter];
      }
      filterObj = this.getFilterDetailsObj(key, filterSet);
    } else if (
      values &&
      !values.includes(ALL) &&
      filterDetails[key] &&
      filterDetails[key].includes(ALL)
    ) {
      filterObj = this.getFilterDetailsObj(key, []);
    } else if (
      values &&
      values.includes(ALL) &&
      filterDetails[key] &&
      filterDetails[key].includes(ALL)
    ) {
      filterObj = this.getFilterDetailsObj(key, values.splice(1));
    } else {
      filterObj = this.getFilterDetailsObj(key, values);
    }
    this.setState({ filterDetails: filterObj, currentPage: 0 }, () => {
      formik.submitForm();
    });
  };
  handleTaskIds = (event: any, formik: any): void => {
    let taskIds = [];
    let filterObj: any = {};
    let filterSet: any[] = [];
    const key = event.target.id;
    if (!isEmpty(formik.values['taskFilter'])) {
      this.setState({ clearAllBtn: false });
      taskIds = formik.values['taskFilter'].split(',');
    }
    filterSet = [...taskIds];
    filterObj = this.getFilterDetailsObj(key, filterSet);
    this.setState({ filterDetails: filterObj });
    this.setState({ currentPage: 0 });
  };
  searchKeyPressHandler = (event: any, formik: FormikProps<any>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      this.setState({ currentPage: 0 });
      this.handleTaskIds(event, formik);
      formik.submitForm();
    }
  };
  getFilterTemplate = (): JSX.Element => {
    return (
      <Formik
        enableReinitialize={true}
        initialValues={{
          releasedByIds: Labels.DEPLOYMENT_GRID.ALL,
          taskFilter: '',
          statusIds: Labels.DEPLOYMENT_GRID.ALL,
        }}
        onSubmit={this.getDeploymentsByFilter}
      >
        {(formik: any) => {
          return (
            <div className="fe_u_flex-container fe_u_margin--top-medium filter">
              <div className="filter-txt">
                <Heading
                  headingTag="h3"
                  variant="subsection"
                  text={`${Labels.DEPLOYMENT_GRID.FILTER_BY}: `}
                />
              </div>
              <div className="fe_u_margin--right-medium display-flex">
                <span className="fe_u_padding--right-small fe_u_padding--top-xsmall">{`${Labels.DEPLOYMENT_GRID.STATUS}: `}</span>
                <Multiselect
                  className="multi-select"
                  id="statusFilter"
                  {...{
                    menuIsOpen: this.state.isStatusFilterOpen,
                    onFocus: () => {
                      this.handelFilterFocus('statusFilter');
                    },
                    onBlur: () => {
                      this.handelFilterBlur('statusFilter');
                    },
                  }}
                  onChange={(event: any) => this.handleChange(event, formik)}
                  value={this.state.filterDetails.statusFilter}
                  options={this.props.statusFilter}
                />
              </div>
              <div className="fe_u_margin--right-medium display-flex">
                <span className="fe_u_padding--right-small fe_u_padding--top-xsmall">{`${Labels.DEPLOYMENT_GRID.RELEASED_BY}: `}</span>
                <Multiselect
                  className="multi-select"
                  id="releasedByFilter"
                  {...{
                    menuIsOpen: this.state.isReleasedByFilterOpen,
                    onFocus: () => {
                      this.handelFilterFocus('releasedByFilter');
                    },
                    onBlur: () => {
                      this.handelFilterBlur('releasedByFilter');
                    },
                  }}
                  onChange={(event: any) => this.handleChange(event, formik)}
                  value={this.state.filterDetails.releasedByFilter}
                  options={this.props.releasedByFilter}
                />
              </div>
              <FormField
                labelText={Labels.DEPLOYMENT_GRID.TASK}
                {...this.getFormFieldProps('taskFilter', formik)}
                onBlur={(event: any) => {
                  this.handleTaskIds(event, formik);
                }}
                onKeyPress={(event: any) => {
                  this.searchKeyPressHandler(event, formik);
                }}
                placeholder={
                  Labels.DEPLOYMENT_GRID.TASK_FILTER_PLACEHOLDER_TEXT
                }
              />
              <div className="fe_u_margin--right-medium display-flex">
                <Button
                  text={Labels.DEPLOYMENT_GRID.CLEAR_ALL}
                  className="clear-all-btn"
                  id="clear-all-btn"
                  disabled={this.state.clearAllBtn}
                  variant="tertiary"
                  useLink={true}
                  onClick={() => {
                    this.clearAllFilters(formik);
                  }}
                />
              </div>
            </div>
          );
        }}
      </Formik>
    );
  };

  render(): JSX.Element {
    return (
      <div className="deployment">
        {this.getFilterTemplate()}
        <div className="deployment-layout">
          {this.getDeploymentGridTemplate()}
        </div>
        <Accordion> {this.getReleaseNotesLayout()}</Accordion>

        {this.renderPaginator()}
        <div id="toast-container"></div>
      </div>
    );
  }
}
