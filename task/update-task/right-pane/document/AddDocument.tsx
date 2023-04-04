import React from 'react';
import { Button, Lightbox, Form, FormField, Select } from '@athena/forge';
import { ButtonVariant } from '@athena/forge/Button/Button';
import { Formik, FormikProps } from 'formik';
import * as Yup from 'yup';
import { AttachmentDetail } from '../../../../../types';
import Labels from '../../../../../constants/Labels';

interface AddDocumenttProps {
  onConfirm: (values: any) => any;
  className: string;
  id: string;
  headerText: string;
  context: string;
  icon: string;
  variant: ButtonVariant;
  disabled: boolean;
  text?: string;
  attachment?: AttachmentDetail;
  type?: string[];
}
type ModalState = {
  shown: boolean;
};

class AddDocument extends React.Component<AddDocumenttProps> {
  state = {
    shown: false,
  };

  showLightbox = (formik: FormikProps<any>) => {
    this.setState({
      shown: true,
    });
    if (this.props.context === Labels.DOCUMENTS.CONTEXT_EDIT) {
      formik.setValues(this.props.attachment);
    } else if (this.props.context === Labels.DOCUMENTS.CONTEXT_ADD) {
      formik.resetForm();
    }
  };
  hideLightbox = (): void => {
    this.setState({
      shown: false,
    });
  };

  handleAttachmentTypeIdChange = (event: any, formik: any): void => {
    formik.setFieldValue(event.target.id, event.target.value);
  };

  initialValues = {
    fileName: this.props.attachment?.fileName || '',
    filePath: this.props.attachment?.filePath || '',
    attachmentTypeId: this.props.attachment?.attachmentTypeId || '',
    description: this.props.attachment?.description || '',
  };

  validationSchema = function () {
    return Yup.object().shape({
      filePath: Yup.string().required('Required!'),
      fileName: Yup.string().required('Required!'),
      attachmentTypeId: Yup.string().required('Required!'),
    });
  };

  getFormFieldProps = (fieldName: string, formik: any) => {
    const props = {
      ...formik.getFieldProps(fieldName),
      error: formik.errors[fieldName],
      id: fieldName,
      labelWidth: 12,
      required: true,
    };
    return props;
  };

  renderForm = (formik: FormikProps<any>) => {
    return (
      <Form
        labelAlwaysAbove={true}
        includeSubmitButton={false}
        requiredVariation="blueBarWithLegend"
        className="fe_u_margin--large document-form"
        layout="medium"
      >
        <FormField
          maxlength="1000"
          labelText="Link"
          {...this.getFormFieldProps('filePath', formik)}
        />
        <FormField
          maxlength="200"
          labelText="Name"
          {...this.getFormFieldProps('fileName', formik)}
        />
        <FormField
          labelText="Type"
          inputAs={Select}
          options={this.props.type}
          {...this.getFormFieldProps('attachmentTypeId', formik)}
          onChange={(event: any) => {
            this.handleAttachmentTypeIdChange(event, formik);
          }}
        />
        <FormField
          labelText="Notes"
          {...this.getFormFieldProps('description', formik)}
          maxLength="1000"
          required={false}
        />
      </Form>
    );
  };
  render(): JSX.Element {
    return (
      <div className={this.props.className}>
        <Formik
          initialValues={this.initialValues}
          validationSchema={this.validationSchema}
          onSubmit={(values) => {
            this.props.onConfirm({
              ...values,
              id: this.props?.attachment?.id,
              version: this.props?.attachment?.version,
            });
            this.hideLightbox();
          }}
          validateOnChange={false}
          validateOnBlur={false}
          validateOnMount={false}
        >
          {(formik) => {
            return (
              <>
                <Button
                  className={this.props.className}
                  id={this.props.id}
                  text={this.props.text}
                  icon={this.props.icon}
                  variant={this.props.variant}
                  disabled={this.props.disabled}
                  onClick={() => this.showLightbox(formik)}
                />
                <Lightbox
                  show={this.state.shown}
                  hideDividers
                  headerText={this.props.headerText}
                  disableClose
                  width="large"
                  className="my-custom-lightbox create_document"
                >
                  <Button
                    variant="tertiary"
                    icon={Labels.DOCUMENTS.ICON_CLOSE}
                    onClick={() => this.hideLightbox()}
                    className="my-close-button"
                  />
                  {this.renderForm(formik)}
                  <div className="fe_c_lightbox__footer">
                    <Button
                      text={Labels.DOCUMENTS.BUTTON_CANCEL}
                      variant="secondary"
                      className="fe_u_margin--right-small"
                      onClick={() => this.hideLightbox()}
                    />
                    <Button
                      text={this.props.context}
                      onClick={(values) => {
                        formik.handleSubmit(values);
                      }}
                    />
                  </div>
                </Lightbox>
              </>
            );
          }}
        </Formik>
      </div>
    );
  }
}

export default AddDocument;
