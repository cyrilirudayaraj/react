import {
  Button,
  DateInput,
  Form,
  FormField,
  Lightbox,
  Select,
} from '@athena/forge';
import isValid from 'date-fns/isValid';
import { Formik, FormikProps } from 'formik';
import { forOwn } from 'lodash';
import React from 'react';
import * as Yup from 'yup';
import Labels from '../../constants/Labels';
import { ReportCriteria } from '../../types/index';
import ConversionUtil from '../../utils/ConversionUtil';
import './GenerateReport.scss';
import { downloadReport } from '../../services/CommonService';
import {
  getReportTypes,
  fetchReportTypesOnce,
} from '../../slices/MasterDataSlice';
import { connect } from 'react-redux';
import Messages from '../../constants/Messages';
import AppConstants from '../../constants/AppConstants';

const date = new Date(Date.now());
const initialValues: ReportCriteria = {
  reportTypeId: '',
  dateType: '',
  startDate: new Date(date.getFullYear(), date.getMonth(), 1),
  endDate: date,
};

export interface GenerateReportProps {
  reportTypes?: any[];
  fetchReportTypesOnce?: any;
  onCloseReport?: any;
  history: any;
}

export interface GenerateReportState {
  reportTypes: any[];
}

export class GenerateReport extends React.Component<
  GenerateReportProps,
  GenerateReportState
> {
  validationSchema = Yup.object().shape({
    reportTypeId: Yup.string().required(Messages.MSG_REQUIRED),
    endDate: Yup.string().required(Messages.MSG_REQUIRED),
    startDate: Yup.date()
      .required(Messages.MSG_REQUIRED)
      .when('endDate', (endDate: any, schema: any) => {
        if (endDate) {
          const minDate = new Date(endDate);
          minDate.setFullYear(minDate.getFullYear() - 1);
          return schema
            .min(minDate, Messages.REPORT.INVALID_DATE_RANGE)
            .max(endDate, Messages.REPORT.GREATER_DATE);
        }
      }),
    dateType: Yup.string().when('reportTypeId', {
      is: !AppConstants.SERVER_CONSTANTS.REPORT_TYPES.REJECTED_TASKS_REPORT_ID,
      then: Yup.string().required(Messages.MSG_REQUIRED),
      otherwise: Yup.string(),
    }),
  });

  onSubmit = (values: ReportCriteria, form: any): void => {
    const payload: any = {};
    if (
      values.reportTypeId ===
      AppConstants.SERVER_CONSTANTS.REPORT_TYPES.REJECTED_TASKS_REPORT_ID
    ) {
      values.dateType = '';
    }
    forOwn(values, function (value: any, key: string) {
      if (value && value instanceof Date) {
        payload[key.toUpperCase()] = value.toLocaleDateString('en-US');
      } else {
        payload[key.toUpperCase()] = value;
      }
    });

    downloadReport(payload)
      .then((response) => {
        this.props.onCloseReport();
      })
      .catch((err) => {
        form.setSubmitting(false);
      });
  };

  loadFieldValues = (): void => {
    this.props.fetchReportTypesOnce();
  };

  componentDidMount(): void {
    this.loadFieldValues();
  }
  handleDateChange(event: any, id: string, formik: any): void {
    const value =
      event.target.value && isValid(event.target.value)
        ? new Date(event.target.value)
        : '';
    formik.setFieldValue(id, value);
  }

  renderForm(formik: FormikProps<any>): JSX.Element {
    const labels = Labels.REPORT;
    return (
      <Form
        className="fe_u_margin--large"
        layout="compact"
        labelAlwaysAbove
        includeSubmitButton={false}
        autoComplete="off"
      >
        <div className="row">
          <FormField
            className="row3"
            id="reportTypeId"
            required={true}
            inputAs={Select}
            labelText={labels.REPORT_TYPE}
            options={ConversionUtil.convertMapToDropDownList(
              this.props.reportTypes
            )}
            {...formik.getFieldProps('reportTypeId')}
            error={
              formik.touched.reportTypeId
                ? formik.errors.reportTypeId?.toString()
                : ''
            }
          />
        </div>
        {formik.values.reportTypeId !==
          AppConstants.SERVER_CONSTANTS.REPORT_TYPES
            .REJECTED_TASKS_REPORT_ID && (
          <div className="row">
            <FormField
              className="row4"
              id="dateType"
              required={true}
              inputAs={Select}
              labelText={labels.DATE_TYPE}
              options={AppConstants.UI_CONSTANTS.REPORT_DATE_TYPES}
              {...formik.getFieldProps('dateType')}
              error={
                formik.touched.dateType
                  ? formik.errors.dateType?.toString()
                  : ''
              }
            />
          </div>
        )}
        <div className="row">
          <FormField
            className="row5"
            id="startDate"
            required={true}
            inputAs={DateInput}
            maxDate={date}
            labelText={labels.START_DATE}
            {...formik.getFieldProps('startDate')}
            error={
              formik.touched.startDate
                ? formik.errors.startDate?.toString()
                : ''
            }
            errorAlwaysBelow={true}
            onChange={(event: any) => {
              this.handleDateChange(event, 'startDate', formik);
            }}
          />
          <FormField
            className="row5"
            id="endDate"
            required={true}
            inputAs={DateInput}
            maxDate={date}
            labelText={labels.END_DATE}
            {...formik.getFieldProps('endDate')}
            error={
              formik.touched.endDate ? formik.errors.endDate?.toString() : ''
            }
            errorAlwaysBelow={true}
            onChange={(event: any) => {
              this.handleDateChange(event, 'endDate', formik);
            }}
          />
        </div>
      </Form>
    );
  }

  render(): JSX.Element {
    const labels = Labels.REPORT;
    return (
      <Formik
        initialValues={initialValues}
        validationSchema={this.validationSchema}
        onSubmit={this.onSubmit}
        validateOnMount={false}
      >
        {(formik) => {
          return (
            <Lightbox
              show
              hideDividers
              headerText={labels.REPORT}
              disableClose
              width="large"
              className="my-custom-lightbox report"
            >
              <Button
                variant="tertiary"
                icon="Close"
                onClick={this.props.onCloseReport}
                className="my-close-button"
              />
              {this.renderForm(formik)}
              <div className="fe_c_lightbox__footer">
                <Button
                  text={labels.CANCEL}
                  variant="secondary"
                  className="fe_u_margin--right-small"
                  onClick={this.props.onCloseReport}
                />
                <Button text={labels.DOWNLOAD} onClick={formik.handleSubmit} />
              </div>
            </Lightbox>
          );
        }}
      </Formik>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    reportTypes: getReportTypes(state),
  };
};

const mapDispatchToProps = {
  fetchReportTypesOnce,
};

export default connect(mapStateToProps, mapDispatchToProps)(GenerateReport);
