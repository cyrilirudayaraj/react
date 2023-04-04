import React from 'react';
import { configure, mount } from 'enzyme';
import { Provider } from 'react-redux';
import configureStore from 'redux-mock-store';
import { Link, BrowserRouter as Router } from 'react-router-dom';
import DynamicLink from './DynamicLink';

import Adapter from 'enzyme-adapter-react-16';

configure({ adapter: new Adapter() });
let store: any;
let wrapper: any;
let link: any;
let storeOne: any;
let storeTwo: any;
describe('DynamicLink', () => {
  store = configureStore([])({
    task: {
      leftSectionActive: false,
      rightSectionActive: false,
    },
  });
  store.dispatch = jest.fn();

  storeOne = configureStore([])({
    task: {
      leftSectionActive: true,
      rightSectionActive: false,
    },
  });
  storeOne.dispatch = jest.fn();

  storeTwo = configureStore([])({
    task: {
      leftSectionActive: false,
      rightSectionActive: true,
    },
  });
  storeTwo.dispatch = jest.fn();

  it('should render external link', () => {
    link = 'https://www.athenahealth.com/';
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DynamicLink to={link}>Athena </DynamicLink>
        </Router>
      </Provider>
    );
    expect(wrapper.find('a').props().href).toEqual(link);
  });

  it('should render external link', () => {
    link = 'https://www.athenahealth.com/';
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DynamicLink to={link}>Athena </DynamicLink>
        </Router>
      </Provider>
    );
    expect(wrapper.find('a').props().href).toEqual(link);
    expect(wrapper.find('a').props().target).toEqual('_blank');
  });

  it('should render internal link', () => {
    link = 'home';
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DynamicLink to={link}>Athena </DynamicLink>
        </Router>
      </Provider>
    );
    expect(wrapper.find(Link).props().to).toEqual(link);
  });

  it('should render external link', () => {
    link = 'https://www.athenahealth.com/';
    wrapper = mount(
      <Provider store={storeOne}>
        <Router>
          <DynamicLink to={link}>Athena </DynamicLink>
        </Router>
      </Provider>
    );
    expect(wrapper.find('a').props().href).toEqual(link);
  });

  it('should reload home', () => {
    link = process.env.REACT_APP_BASE_CONTEXT_PATH || '/home';
    wrapper = mount(
      <Provider store={store}>
        <Router>
          <DynamicLink to={link}>Athena </DynamicLink>
        </Router>
      </Provider>
    );
    wrapper.find('a').simulate('click');
    expect(store.dispatch).toHaveBeenCalledTimes(0);
    expect(wrapper.find(Link).props().to).toEqual(link);
  });

  it('should dispatch action with leftSectionActive', () => {
    link = process.env.REACT_APP_BASE_CONTEXT_PATH || '/home';
    wrapper = mount(
      <Provider store={storeOne}>
        <Router>
          <DynamicLink to={link}>Athena </DynamicLink>
        </Router>
      </Provider>
    );
    wrapper.find('a').simulate('click');
    expect(storeOne.dispatch).toHaveBeenCalledTimes(2);
    expect(wrapper.find(Link).props().to).toEqual(link);
  });

  it('should dispatch action with rightSectionActive', () => {
    link = process.env.REACT_APP_BASE_CONTEXT_PATH || '/home';
    wrapper = mount(
      <Provider store={storeTwo}>
        <Router>
          <DynamicLink to={link}>Athena </DynamicLink>
        </Router>
      </Provider>
    );
    wrapper.find('a').simulate('click');
    expect(storeTwo.dispatch).toHaveBeenCalledTimes(2);
    expect(wrapper.find(Link).props().to).toEqual(link);
  });
});
