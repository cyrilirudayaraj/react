import React, { Component } from 'react';
import { Root, FormField, Button, Typeahead } from '@athena/forge/';
import './RulesMigrationSearch.scss';
import { Formik, FormikProps } from 'formik';
import AppConstants from '../../../constants/AppConstants';
import { isEmpty } from 'lodash';
import Labels from '../../../constants/Labels';

interface RulesMigrationSearchProps {
  onSearch: any;
}

const RULE_ID_SEARCH_REGEX = /^\d+\.?(\d+)?$/;

export class RulesMigrationSearch extends Component<
  RulesMigrationSearchProps,
  any
> {
  state = {
    showAdvanceSearchForm: false,
    recentSearches: [],
  };

  getFormFieldProps = (fieldName: string, formik: FormikProps<any>): any => {
    const props = {
      ...formik.getFieldProps(fieldName),
      id: fieldName,
    };
    return props;
  };

  searchKeyPressHandler = (event: any, formik: FormikProps<any>): void => {
    if (event.key === 'Enter') {
      event.preventDefault();
      formik.handleChange(event);
      formik.submitForm();
      event.target.blur();
    }
  };

  updateRulesMigrationSearchHistory = (searchText: any): void => {
    if (isEmpty(searchText)) return;
    let searchHistory: any = [];
    const currentSearchHistory = localStorage.getItem('rulesSearchHistory');
    if (currentSearchHistory !== null) {
      searchHistory = JSON.parse(currentSearchHistory);
    }
    const idx = searchHistory.indexOf(searchText);
    if (idx > -1) {
      searchHistory.splice(idx, 1);
    }
    searchHistory.push(searchText);
    if (
      searchHistory.length > AppConstants.UI_CONSTANTS.MAX_NO_OF_SEARCH_ITEMS
    ) {
      searchHistory.splice(
        0,
        searchHistory.length - AppConstants.UI_CONSTANTS.MAX_NO_OF_SEARCH_ITEMS
      );
    }
    localStorage.setItem('rulesSearchHistory', JSON.stringify(searchHistory));
  };

  showSearchHistory = (): void => {
    let searchHistory: any = [];
    const currentSearchHistory = localStorage.getItem('rulesSearchHistory');
    if (currentSearchHistory !== null) {
      searchHistory = JSON.parse(currentSearchHistory);
      this.setState({ recentSearches: [...searchHistory].reverse() });
    }
  };

  onSubmit = (values: any, formik: any) => {
    this.updateRulesMigrationSearchHistory(values.searchText);
    const output: any = {
      ...values,
      ruleId: values.searchText,
      migrationType: 'ALL',
    };

    this.props.onSearch(output);
  };

  render(): JSX.Element {
    const initialValues = {
      searchText: '',
    };
    return (
      <Root className="rulesmigration-search-root">
        <Formik
          initialValues={initialValues}
          onSubmit={this.onSubmit}
          validateOnMount={false}
          validateOnChange={false}
          validateOnBlur={false}
        >
          {(formik) => {
            const {
              onChange: onSearchTextChange,
              ...rest
            } = this.getFormFieldProps('searchText', formik);
            return (
              <div className="rulesmigration-search">
                <FormField
                  labelText={null}
                  inputAs={Typeahead}
                  placeholder={
                    Labels.RULES_MIGRATION.BUTTONS.SEARCH_PLACEHOLDER
                  }
                  icon="Search"
                  autoComplete="off"
                  disabled={this.state.showAdvanceSearchForm}
                  alwaysRenderSuggestions={false}
                  suggestions={this.state.recentSearches}
                  minQueryLength={0}
                  {...rest}
                  onSuggestionSelected={(
                    event: React.ChangeEvent<HTMLInputElement>,
                    value: any
                  ) => {
                    formik.setFieldValue(
                      'searchText',
                      value.suggestionValue,
                      false
                    );
                  }}
                  onChange={(event: any) => {
                    const { value } = event.target;
                    if (RULE_ID_SEARCH_REGEX.test(value) || value == '') {
                      onSearchTextChange(event);
                    }
                  }}
                  onFocus={(event: any) => {
                    this.showSearchHistory();
                  }}
                  onKeyPress={(event: any) => {
                    const { value } = event.target;
                    if (
                      RULE_ID_SEARCH_REGEX.test(value) &&
                      (value.match(/\d/g) || []).length >= 3
                    ) {
                      this.searchKeyPressHandler(event, formik);
                    }
                  }}
                />
                {formik.getFieldProps('searchText').value && (
                  <Button
                    variant="tertiary"
                    icon="Close"
                    onClick={() => {
                      formik.setFieldValue('searchText', '', false);
                      formik.resetForm();
                    }}
                  />
                )}
              </div>
            );
          }}
        </Formik>
      </Root>
    );
  }
}
