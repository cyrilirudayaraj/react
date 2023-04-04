import { Button, Form, FormField } from '@athena/forge';
import React, { Component } from 'react';
import { CSVLink } from 'react-csv';
import FileInput from '../../../components/fileinput/FileInput';
import CSVConstants from '../../../constants/CSVConstants';
import Labels from '../../../constants/Labels';

export interface RuleNotMigratedFileChooserProps {
  show: boolean;
  onCancel: any;
  onPrimaryClick: any;
}

export default class RuleNotMigratedFileChooser extends Component<
  RuleNotMigratedFileChooserProps,
  any
> {
  state = {
    file: null,
  };

  handleFileChange = (e: any): void => {
    this.setState({ file: e.target.files[0] });
  };

  handleCancel = (e: any): void => {
    this.setState({ file: null });
    this.props.onCancel();
  };

  handleSubmit = (e: any): void => {
    const { file } = this.state;
    if (file) {
      this.setState({ file: null });
      this.props.onPrimaryClick(file);
    }
  };

  render() {
    return (
      <span>
        <Form
          className="fe_u_margin--large"
          layout="compact"
          includeSubmitButton={false}
          autoComplete="off"
        >
          <div className="row">
            <FormField
              className="file"
              id="file"
              type="file"
              inputAs={FileInput}
              accept=".csv"
              labelText={Labels.RULES_MIGRATION.IMPORT_RULES.IMPORT}
              onChange={this.handleFileChange}
            />
          </div>

          <div className="row">
            <CSVLink
              data={CSVConstants.RULE_NOT_MIGRATED}
              filename="rule_not_migrated.csv"
            >
              {Labels.RULES_MIGRATION.IMPORT_RULES.DOWNLOAD_SAMPLE_FORMAT}
            </CSVLink>
          </div>
        </Form>

        <div className="fe_c_lightbox__footer">
          <Button
            text={Labels.RULES_MIGRATION.IMPORT_RULES.CANCEL}
            variant="secondary"
            className="fe_u_margin--right-small"
            onClick={this.handleCancel}
          />
          <Button
            text={Labels.RULES_MIGRATION.IMPORT_RULES.SAVE}
            disabled={!this.state.file}
            onClick={this.handleSubmit}
          />
        </div>
      </span>
    );
  }
}
