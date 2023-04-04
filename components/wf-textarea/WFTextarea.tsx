import React from 'react';
import { FormField, Textarea, Input } from '@athena/forge';
import Labels from '../../constants/Labels';
import { FormikProps } from 'formik';
import AppConstants from '../../constants/AppConstants';
import { get } from 'lodash';

interface TextareaCounterProps {
  formik: FormikProps<any>;
  mandatoryFields?: any;
  label: any;
  name: any;
  maxlength: any;
  className?: any;
  labelWidth?: any;
  istextarea?: any;
  disabled?: boolean;
}

export default class WFTextarea extends React.Component<TextareaCounterProps> {
  state = {
    expand: false,
    showMore: false,
  };

  toggleMinHeight = (event: any): void => {
    const targetObject = document.getElementById(event.target.id);
    if (targetObject !== null) {
      targetObject.style.maxHeight =
        AppConstants.UI_CONSTANTS.TEXTAREA.MIN_HEIGHT;
      this.setState({
        expand: false,
      });
    }
  };

  toggleMaxHeight = (event: any): void => {
    const targetObject = document.getElementById(event.target.id);
    if (targetObject !== null) {
      this.setState({
        expand: true,
      });
    }
  };

  checkShowMore = (event: any): void => {
    const { name, value } = event.target;
    const { formik } = this.props;
    formik.setFieldValue(name, value);
    const targetObject = document.getElementById(event.target.id);
    if (targetObject?.style) {
      if (
        targetObject?.style.height >
        AppConstants.UI_CONSTANTS.TEXTAREA.MIN_HEIGHT
      ) {
        this.setState({
          showMore: true,
        });
      } else {
        this.setState({
          showMore: false,
        });
      }
    }
  };

  toggleexpand = (event: any, id: any): void => {
    const buttonelement = document.getElementById(event.target.id);
    const textelement = document.getElementById(id);
    if (buttonelement !== null && textelement !== null) {
      if (buttonelement.innerText === Labels.COMPONENTS.TEXTAREA.SHOW_MORE) {
        textelement.style.height = AppConstants.UI_CONSTANTS.TEXTAREA.HEIGHT;
        textelement.style.maxHeight =
          AppConstants.UI_CONSTANTS.TEXTAREA.MAX_HEIGHT;
        buttonelement.innerText = Labels.COMPONENTS.TEXTAREA.SHOW_LESS;
      } else {
        textelement.style.height = AppConstants.UI_CONSTANTS.TEXTAREA.HEIGHT;
        textelement.style.maxHeight =
          AppConstants.UI_CONSTANTS.TEXTAREA.MIN_HEIGHT;
        buttonelement.innerText = Labels.COMPONENTS.TEXTAREA.SHOW_MORE;
      }
    }
  };

  getFormFieldProps = (fieldName: string, formik: any) => {
    const fieldProps = {
      ...formik.getFieldProps(fieldName),
      required: this.props?.mandatoryFields
        ? this.props.mandatoryFields[fieldName]
        : true,
      autoComplete: 'off',
      error: get(formik.errors, fieldName),
      id: fieldName,
      className: this.props.className,
      labelWidth: this.props.labelWidth ? this.props.labelWidth : 1,
    };
    return fieldProps;
  };

  render(): JSX.Element {
    const fieldLength =
      this.props.formik.getFieldProps(this.props.name)?.value?.length || 0;
    return (
      <div className="textarea-component">
        <FormField
          style={{
            borderColor: fieldLength >= this.props.maxlength ? '#FFAB00' : '',
          }}
          inputAs={this.props.istextarea === true ? Textarea : Input}
          labelText={this.props.label}
          {...this.getFormFieldProps(this.props.name, this.props.formik)}
          onChange={(event: any) => this.checkShowMore(event)}
          onBlur={(event: any) => this.toggleMinHeight(event)}
          onFocus={(event: any) => this.toggleMaxHeight(event)}
          disabled={this.props.disabled}
        />
        <div className="counter">
          {this.state.expand === false &&
          this.props.istextarea === true &&
          this.state.showMore === true ? (
            <a
              id={'togglebtn-' + this.props.name}
              onClick={(event: any) =>
                this.toggleexpand(event, this.props.name)
              }
            >
              {Labels.COMPONENTS.TEXTAREA.SHOW_MORE}
            </a>
          ) : (
            ''
          )}
          {this.state.expand === true ? (
            <div>
              {fieldLength}/{this.props.maxlength}
            </div>
          ) : (
            ''
          )}
        </div>
      </div>
    );
  }
}
