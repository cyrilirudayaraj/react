import React from 'react';
import { ReadOnlyInput, FormField } from '@athena/forge';
import StringUtil from '../../utils/StringUtil';

const WFReadOnlyInput = (props: PropTypes): JSX.Element => {
  return (
    <div className="readonlywrapper">
      <FormField
        id={props.id || props.labelText}
        inputAs={ReadOnlyInput}
        labelText={props.labelText}
        text={
          props.href || props.children
            ? ''
            : StringUtil.returnHyphenIfEmpty(props?.text)
        }
      >
        {props.children}
        {!props.children && props.href && props.text && (
          <p>
            <a href={props.href} target={props.target || ''}>
              {props.text}
            </a>
          </p>
        )}
      </FormField>
    </div>
  );
};

interface PropTypes {
  labelText: string;
  text?: string | null | undefined;
  href?: string;
  target?: string;
  children?: React.ReactNode;
  id?: string;
}
export default WFReadOnlyInput;
