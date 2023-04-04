import React, { Component } from 'react';
import {
  Form,
  FormField,
  Lightbox,
  GridCol,
  GridRow,
  ReadOnlyInput,
  Button,
  Textarea,
  Input,
} from '@athena/forge';
import { updateRationalizationRules } from '../../../services/CommonService';
import Messages from '../../../constants/Messages';
import Constants from '../../../constants/AppConstants';
import Labels from '../../../constants/Labels';

import store from '../../../store/store';
import { upperCase } from 'lodash';
import { addAttentionToast, addSuccessToast } from '../../../slices/ToastSlice';

class EditRationalizedRules extends Component<any, any> {
  constructor(props: any) {
    super(props);

    this.state = {
      selected: { ...this.props.data },
      showPopup: false,
      copy: { ...this.props.data },
      disable: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleChange(field: string, event: any, attr: string): void {
    const sel_copy = { ...this.state.selected };
    sel_copy[field] = event.target[attr].trim();
    delete sel_copy.EDIT;
    let errorMsg = '';
    let flag = true;
    if (sel_copy[field] !== this.state.copy[field]) {
      flag = false;
    }
    if (field === 'reviewedBy' && sel_copy[field].length === 0) {
      errorMsg = Messages.RULES_MIGRATION.REVIEWED_BY_REQUIRED;
      flag = true;
    }
    this.setState({
      disable: flag,
      selected: sel_copy,
      error: errorMsg,
    });
  }

  handleSubmit(): void {
    const record: any = [];
    record.push(this.formatRecord());
    updateRationalizationRules(record)
      .then((response: any) => {
        addSuccessToast({
          headerText: '',
          message:
            response.ERRORMESSAGE || Messages.RULES_MIGRATION.UPDATE_SUCCESS,
        })(store.dispatch);
        this.setState(
          {
            disable: true,
          },
          () => {
            this.props.updateEditedRecord(record[0]);
          }
        );
      })
      .catch((error: any) => {
        addAttentionToast({
          headerText: Messages.RULES_MIGRATION.UPDATE_FAILURE,
          message: error.message,
        })(store.dispatch);
        this.setState({
          disable: true,
        });
      });
    this.toggleLightbox();
  }

  getFormButtons = (): JSX.Element => {
    return (
      <div className="fe_c_lightbox__footer">
        <Button
          text="Cancel"
          variant="secondary"
          className="fe_u_margin--right-small"
          onClick={this.refreshCurrentPage}
        />
        <Button
          text="Save"
          disabled={this.state.disable}
          onClick={this.handleSubmit}
        />
      </div>
    );
  };

  getUpperFieldGrid = (field: any): JSX.Element => {
    const value = this.state.selected?.[field] || '-';
    return (
      <GridCol>
        <FormField
          id={field}
          labelText={upperCase(field)}
          inputAs={ReadOnlyInput}
          text={value}
          labelAlwaysAbove={true}
        />
      </GridCol>
    );
  };

  getUpperFields = (): JSX.Element => {
    return (
      <span>
        <GridRow>
          {Constants.UI_CONSTANTS.RULES_MIGRATION.RULES_NOT_MIGRATED.SHOWFIELDS.map(
            (field) => {
              return this.getUpperFieldGrid(field);
            }
          )}
        </GridRow>
      </span>
    );
  };

  getEditFieldGrid = (field: any): JSX.Element => {
    const value = this.state.selected?.[field] || '';

    return (
      <GridCol>
        <FormField
          id={field}
          labelText={upperCase(field)}
          onChange={(e) => {
            this.handleChange(field, e, 'value');
          }}
          defaultValue={value}
          required={field === 'reviewedBy' ? true : false}
          inputAs={field === 'reviewerComments' ? Textarea : Input}
          error={field === 'reviewedBy' ? this.state.error : ''}
        />
      </GridCol>
    );
  };

  getEditableFields = (): JSX.Element => {
    return (
      <span>
        {Constants.UI_CONSTANTS.RULES_MIGRATION.RULES_NOT_MIGRATED.UPDATEFIELDS.map(
          (field) => {
            return this.getEditFieldGrid(field);
          }
        )}
      </span>
    );
  };

  formatRecord = (): any => {
    const record_copy = { ...this.state.selected };
    if (record_copy) {
      delete record_copy.EDIT;
      delete record_copy.isChecked;
      this.setState({
        selected: record_copy,
        copy: record_copy,
      });
    }
    return record_copy;
  };

  refreshCurrentPage = (): void => {
    this.setState(
      {
        selected: this.props.data,
      },
      () => this.toggleLightbox()
    );
  };

  toggleLightbox = () => {
    this.setState({
      showPopup: !this.state.showPopup,
      error: '',
    });
  };

  render() {
    return (
      <div>
        <Button
          text="Edit"
          className="btn btn-primary"
          variant="tertiary"
          onClick={this.toggleLightbox}
        />
        <Lightbox
          show={this.state.showPopup}
          headerText={Labels.RULES_MIGRATION.RULES_NOT_MIGRATED.EDIT_DIALOG}
          onHide={this.refreshCurrentPage}
          width="large"
          onExited={() => {
            document.body.removeAttribute('style');
          }}
        >
          <Form
            includeSubmitButton={false}
            requiredVariation="blueBarWithLegend"
            layout="compact"
          >
            {this.getUpperFields()}
            {this.getEditableFields()}
            {this.getFormButtons()}
          </Form>
        </Lightbox>
      </div>
    );
  }
}

export default EditRationalizedRules;
