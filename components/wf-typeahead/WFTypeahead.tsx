import React from 'react';
import { FormField, Typeahead, FormError } from '@athena/forge';
import { ErrorMessage } from 'formik';
import { Error } from '../error/Error';

const WFTypeahead = (props: any): JSX.Element => {
  return (
    <div className="typeahead-wrapper">
      <FormField
        inputAs={Typeahead}
        id={props.name}
        name={props.name}
        value={props.value}
        labelText={props.label}
        required
        onChange={props.onChange}
        onBlur={props.onBlur}
        alwaysRenderSuggestions={false}
        suggestions={props.suggestions}
        onSuggestionSelected={props.onSuggestionSelected}
        className="fe_u_margin--bottom-medium"
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

export default WFTypeahead;
