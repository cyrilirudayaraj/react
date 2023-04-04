import React from 'react';
import { Label, Select, FormError } from '@athena/forge';
import { Field, ErrorMessage } from 'formik';
import { Error } from '../error/Error';

const WFSelect = (props: any): JSX.Element => {
  const fieldProps: any = {
    id: props.name,
    name: props.name,
    options: props.options,
    disabled: props.disabled,
    required: props.required === undefined ? true : props.required,
  };
  if (props.onChange) {
    fieldProps.onChange = props.onChange;
  }
  return (
    <div className="select-wrapper">
      <Label text={props.label} className="fe_u_margin--top-medium" />
      <Field
        as={Select}
        {...fieldProps}
        className="fe_u_margin--top-xsmall fe_u_margin--bottom-medium"
      />
      {props.showError === undefined ? (
        <ErrorMessage name={props.name} component={Error} />
      ) : props.showError ? (
        <div>
          <FormError>{props.errorMessage}</FormError>
        </div>
      ) : null}
    </div>
  );
};

export default WFSelect;
