// This MUST be the first import in this file.
// see the nimbus-config file for details.
import './nimbus-config';

import React from 'react';
import ReactDOM from 'react-dom';
import '@athena/forge/dist/forge.css';
import './index.css';
import App, { AppProps } from './App';

export function start(element: HTMLElement, props: AppProps) {
  ReactDOM.render(<App {...props} />, element);
}
