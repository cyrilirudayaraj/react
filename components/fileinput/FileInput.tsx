import { InputProps } from '@athena/forge';
import React from 'react';

export default function FileInput(props: InputProps) {
  return (
    <div className="file">
      <input type="file" {...props} />
    </div>
  );
}
