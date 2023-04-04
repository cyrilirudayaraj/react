import React, { Component } from 'react';
import Layout from './components/layout/Layout';
import axios from 'axios';
import { Loader } from '@athena/forge';
import Toaster from './components/toaster/Toaster';
import { Provider } from 'react-redux';
import store from './store/store';
import { addAttentionToast } from './slices/ToastSlice';

export interface AppProps {
  title: string;
  addAttentionToast?: any;
}

export interface AppState {
  loaderCount: number;
}

class App extends Component<AppProps, AppState> {
  state: AppState = {
    loaderCount: 0,
  };
  constructor(props: AppProps) {
    super(props);
    this.isMainThread = this.isMainThread.bind(this);
    this.incrementLoader = this.incrementLoader.bind(this);
    this.decrementLoader = this.decrementLoader.bind(this);
    axios.interceptors.request.use(
      (request) => {
        this.incrementLoader(request);
        return request;
      },
      (error) => {
        this.decrementLoader(error.config);
        Promise.reject(error);
      }
    );
    axios.interceptors.response.use(
      (response) => {
        this.decrementLoader(response.config);
        return response;
      },
      (error) => {
        this.decrementLoader(error.config);
        const resData = error.response.data;

        const { showError } = error.config;
        if (
          showError &&
          error.response &&
          resData &&
          resData.status === 'FAILURE'
        ) {
          addAttentionToast({
            headerText: resData.error.message,
            message: resData.error.localizedMessage,
          })(store.dispatch);
        }
        return Promise.reject(error);
      }
    );
  }

  isMainThread = (config = {}) => {
    return config.hasOwnProperty('isMainThread') ? true : false;
  };

  incrementLoader(config = {}) {
    if (this.isMainThread(config)) {
      this.setState({
        loaderCount: this.state.loaderCount + 1,
      });
    }
  }

  decrementLoader(config = {}) {
    if (this.isMainThread(config) && this.state.loaderCount > 0) {
      this.setState({
        loaderCount: this.state.loaderCount - 1,
      });
    }
  }

  render(): JSX.Element {
    return (
      <div className="App fe_f_all">
        <Provider store={store}>
          <Loader loading={this.state.loaderCount > 0} className="my-loader">
            <Layout />
            <Toaster />
          </Loader>
        </Provider>
      </div>
    );
  }
}

export default App;
