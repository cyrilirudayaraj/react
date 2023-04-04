import React from 'react';
import {
  Button,
  Lightbox,
  Form,
  FormField,
  Select,
  GridRow,
  GridCol,
  Textarea,
} from '@athena/forge';
import { Formik, FormikProps } from 'formik';
import Labels from '../../../../../constants/Labels';
import * as Yup from 'yup';
import { RejectionReason } from '../../../../../types';
import AppConstants from '../../../../../constants/AppConstants';
import Messages from '../../../../../constants/Messages';
import {
  fetchRejectionReasonsOnce,
  getRejectionReasons,
} from '../../../../../slices/MasterDataSlice';
import { connect } from 'react-redux';

interface RejectTransitProps {
  onConfirm: (values: any) => any;
  onCancel: () => any;
  rejectionReasons: RejectionReason[];
  fetchRejectionReasonsOnce?: any;
}

class ReturnTransit extends React.Component<RejectTransitProps> {
  constructor(props: any) {
    super(props);
    this.props.fetchRejectionReasonsOnce();
  }
  validationSchema(): any {
    return Yup.object().shape({
      reason: Yup.string().required(Messages.MSG_REQUIRED),
      description: Yup.string().when('reason', {
        is: AppConstants.SERVER_CONSTANTS.REJECTION_REASON_OTHERS_ID,
        then: Yup.string()
          .required(Messages.MSG_REQUIRED)
          .max(1000, 'Description must be at most 1000 characters!'),
        otherwise: Yup.string().notRequired(),
      }),
    });
  }

  getFormFieldProps = (fieldName: string, formik: FormikProps<any>): any => {
    const props = {
      ...formik.getFieldProps(fieldName),
      error: formik.errors[fieldName],
      id: fieldName,
      labelWidth: 12,
      required: true,
    };
    return props;
  };
  getRejectReasons(rejectreasons: any): any[] {
    return rejectreasons.map((rejectreason: any) => {
      return { text: rejectreason.name, value: rejectreason.id };
    });
  }
  handleReasonChange = (event: any, formik: any): void => {
    formik.setFieldValue(event.target.id, event.target.value);
  };

  renderForm = (formik: FormikProps<any>): JSX.Element => {
    const labels = Labels.REJECT_TRANSIT;

    return (
      <Form
        labelAlwaysAbove={true}
        includeSubmitButton={false}
        requiredVariation="blueBarWithRequiredLabel"
      >
        <GridRow>
          <GridCol width={{ small: 5 }}>
            <FormField
              labelText={labels.REASON}
              inputAs={Select}
              options={this.getRejectReasons(this.props.rejectionReasons)}
              {...this.getFormFieldProps('reason', formik)}
              onChange={(event: any) => {
                this.handleReasonChange(event, formik);
              }}
            />
          </GridCol>
        </GridRow>

        <GridRow>
          <GridCol>
            <FormField
              maxlength="1000"
              labelText={labels.DESCRIPTION}
              inputAs={Textarea}
              {...this.getFormFieldProps('description', formik)}
              required={
                formik.values.reason ===
                AppConstants.SERVER_CONSTANTS.REJECTION_REASON_OTHERS_ID
                  ? true
                  : false
              }
            />
          </GridCol>
        </GridRow>
      </Form>
    );
  };

  render(): JSX.Element {
    const labels = Labels.REJECT_TRANSIT;
    const initialValues = {};

    return (
      <div className="return-transit">
        <Formik
          initialValues={initialValues}
          validationSchema={this.validationSchema}
          onSubmit={this.props.onConfirm}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
        >
          {(formik) => {
            return (
              <Lightbox
                show
                hideDividers
                headerText={labels.REJECT_TASK}
                disableClose
                width="large"
                className="my-custom-lightbox return-transit-lightbox"
              >
                <Button
                  variant="tertiary"
                  icon="Close"
                  onClick={this.props.onCancel}
                  className="my-close-button"
                />
                {this.renderForm(formik)}

                <div className="fe_c_lightbox__footer">
                  <Button
                    text={labels.CANCEL}
                    variant="secondary"
                    className="fe_u_margin--right-small"
                    onClick={this.props.onCancel}
                  />
                  <Button text={labels.REJECT} onClick={formik.handleSubmit} />
                </div>
              </Lightbox>
            );
          }}
        </Formik>
      </div>
    );
  }
}
const mapStateToProps = (state: any) => {
  return {
    rejectionReasons: getRejectionReasons(state),
  };
};
const dispatchToProps = {
  fetchRejectionReasonsOnce,
};

export default connect(mapStateToProps, dispatchToProps)(ReturnTransit);
