import React from 'react';
import { Label, Input, FormError } from '@athena/forge';
import { Field, ErrorMessage } from 'formik';
import { Error } from '../error/Error';

const WFInput = (props: any): JSX.Element => {
  return (
    <div className="input-wrapper">
      <Label text={props.label} className="fe_u_margin--top-medium" />
      <Field
        as={Input}
        id={props.name}
        name={props.name}
        required={props.required === undefined ? true : props.required}
        disabled={props.disabled}
        value={props.value}
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

export default WFInput;
