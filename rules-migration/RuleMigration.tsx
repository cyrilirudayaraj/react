import React, { Component } from 'react';
import { Tabs, TabPane, Paginator } from '@athena/forge';
import Labels from '../../constants/Labels';
import RulesNotMigrated from './rulesnotmigrated/RulesNotMigrated';
import Modelling from './modelling/Modelling';
import DualMaintenance from './dualmaintenance/DualMaintenance';
import BackwardCompatibility from './backwardcompatibility/BackwardCompatibility';
import { searchMigrationRules } from '../../services/CommonService';
import Archived from './archived/Archived';
import './RuleMigration.scss';
import { RulesMigrationSearch } from './rulesmigration-search/RulesMigrationSearch';
import RulesMigrationSearchResult from './rulesmigration-search/RulesMigrationSearchResult';
import Constants from '../../constants/AppConstants';
import Messages from '../../constants/Messages';

class RuleMigration extends Component {
  state = {
    total: 0,
    searchResults: [],
    updatedResults: [],
    isSearchResultEmpty: false,
    showSearchResults: false,
    pageSize: Constants.SERVER_CONSTANTS.PAGE_SIZE,
    pageIndex: 0,
    error: '',
  };
  getTabTemplate = (): JSX.Element => {
    const template = (
      <Tabs defaultSelectedIndex={0}>
        <TabPane
          label={Labels.RULES_MIGRATION.RULES_NOT_MIGRATED.HEADER}
          padded
        >
          <RulesNotMigrated />
        </TabPane>
        <TabPane label={Labels.RULES_MIGRATION.MODELING.HEADER} padded>
          <Modelling />
        </TabPane>
        <TabPane label={Labels.RULES_MIGRATION.DUAL_MAINTENANCE.HEADER} padded>
          <DualMaintenance />
        </TabPane>
        <TabPane
          label={Labels.RULES_MIGRATION.BACKWARD_COMPATIBILITY.HEADER}
          padded
        >
          <BackwardCompatibility />
        </TabPane>
        <TabPane label={Labels.RULES_MIGRATION.ARCHIVED.HEADER} padded>
          <Archived />
        </TabPane>
      </Tabs>
    );
    return template;
  };
  onSearch = (value: any) => {
    this.setState(
      {
        showSearchResults: true,
        selectedIndex: 10,
        filters: {},
        currentPage: 0,
        sortBy: null,
        sortOrder: null,
      },
      () => {
        const payload = {
          ...value,
        };
        this.setState({ isSearchResultEmpty: false });
        return searchMigrationRules(payload).then((response: any) => {
          this.setState({
            searchResults: response.result,
            total: response.total,
            updatedResults: this.pageData(
              response.result,
              0,
              Constants.SERVER_CONSTANTS.PAGE_SIZE
            ),
          });
          if (!response.result || response.result.length <= 0) {
            this.setState({ isSearchResultEmpty: true });
            this.setState({
              error: Messages.RULES_MIGRATION.NO_RECORDS_FOUND,
            });
          }
        });
      }
    );
  };
  pageData = (data: any, selectedIndex: number, pageSize: number) => {
    const startindex = selectedIndex * pageSize;
    const endindex = startindex + pageSize;
    const newdata = data.slice(startindex, endindex);
    return newdata;
  };
  updatePage = (index: number) => {
    const newdata = this.pageData(
      this.state.searchResults,
      index,
      this.state.pageSize
    );
    this.setState({
      pageIndex: index,
      updatedResults: newdata,
    });
  };
  getRulesMigrationGridTemplate = (): JSX.Element => {
    const message = this.state.isSearchResultEmpty
      ? Messages.NO_RECORDS_FOUND
      : '';
    return (
      <>
        <RulesMigrationSearchResult
          searchResultEmptyMessage={message}
          searchResults={this.state.updatedResults}
        />
        <div className="paginator">
          <Paginator
            displayMode="withPageJump"
            pageCount={Math.ceil(
              this.state.searchResults.length / this.state.pageSize
            )}
            pageInputId="paginator-page-input"
            selectedIndex={this.state.pageIndex}
            onSelectedIndexChange={this.updatePage}
          />
        </div>
      </>
    );
  };
  render(): JSX.Element {
    return (
      <div className="fe_u_padding--top-large ruleMigration">
        <div className="ruleMigration-header">
          {Labels.RULES_MIGRATION.COMMON.PAGE_HEADER}{' '}
        </div>
        <div className="rulemigration-search">
          <RulesMigrationSearch onSearch={this.onSearch} />
        </div>
        {this.state.showSearchResults && (
          <div className="rulesmigration-search-layout">
            {this.getRulesMigrationGridTemplate()}
          </div>
        )}
        {!this.state.showSearchResults && (
          <div className="dashboard-tabs">{this.getTabTemplate()}</div>
        )}
      </div>
    );
  }
}
export default RuleMigration;
