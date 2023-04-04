import React from 'react';
import { FormError } from '@athena/forge';

export function Error(props: any): JSX.Element {
  return (
    <div>
      <FormError>{props.children}</FormError>
    </div>
  );
}
