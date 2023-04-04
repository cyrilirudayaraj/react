import React, { Component } from 'react';
import {
  Form,
  FormField,
  GridCol,
  GridRow,
  Button,
  Textarea,
  Input,
} from '@athena/forge';
import { addRationalizationRules } from '../../../services/CommonService';
import Messages from '../../../constants/Messages';
import store from '../../../store/store';
import { upperCase } from 'lodash';
import { addAttentionToast, addSuccessToast } from '../../../slices/ToastSlice';

export interface AddRationalizedRulesProps {
  onAfterAdd: any;
  onClose: any;
}

class AddRationalizedRules extends Component<AddRationalizedRulesProps, any> {
  constructor(props: AddRationalizedRulesProps) {
    super(props);

    this.state = {
      datatoadd: {},
      errors: {},
      disable: true,
    };
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  trimDataCopy(field: string, event: any, attr: string, data_copy: any) {
    if (field === 'reviewedBy' || field === 'contextId' || field === 'ruleId') {
      data_copy[field] = event.target[attr].trimStart();
      event.target[attr] = data_copy[field];
      data_copy[field] = data_copy[field].trim();
    } else {
      data_copy[field] = event.target[attr];
    }
    return data_copy[field];
  }

  handleChange(field: string, event: any, attr: string): void {
    const data_copy = { ...this.state.datatoadd };
    const errorMsg = { ...this.state.errors };
    let flag = true;
    data_copy[field] = this.trimDataCopy(field, event, attr, data_copy);
    if (data_copy[field]) {
      errorMsg[field] = '';
    } else if (
      (field === 'reviewedBy' || field === 'contextId' || field === 'ruleId') &&
      event.target[attr].length === 0
    ) {
      errorMsg[field] = this.getRequiredErrorMsg(field);
    }
    flag = this.disableButton(data_copy);
    this.setState({
      disable: flag,
      datatoadd: data_copy,
      errors: errorMsg,
    });
  }

  disableButton(data_copy: any) {
    let flag = true;
    if (
      data_copy['reviewedBy'] &&
      data_copy['contextId'] &&
      data_copy['ruleId']
    ) {
      flag = false;
    }
    return flag;
  }

  getRequiredErrorMsg(field: any) {
    let reqErrormsg;
    if (field === 'reviewedBy') {
      reqErrormsg = Messages.RULES_MIGRATION.REVIEWED_BY_REQUIRED;
    } else if (field === 'contextId') {
      reqErrormsg = Messages.RULES_MIGRATION.CONTEXT_ID_REQUIRED;
    } else {
      reqErrormsg = Messages.RULES_MIGRATION.RULE_ID_REQUIRED;
    }
    return reqErrormsg;
  }

  handleSubmit(): void {
    const record: any = [];
    const data_copy = { ...this.state.datatoadd };
    record.push(data_copy);
    addRationalizationRules(record)
      .then((response: any) => {
        addSuccessToast({
          headerText: '',
          message:
            response.ERRORMESSAGE || Messages.RULES_MIGRATION.ADD_SUCCESS,
        })(store.dispatch);
        this.setState(
          {
            disable: true,
          },
          () => this.props.onAfterAdd()
        );
      })
      .catch((error: any) => {
        addAttentionToast({
          headerText: Messages.RULES_MIGRATION.ADD_FAILURE,
          message: error.message,
        })(store.dispatch);
        this.setState({
          disable: true,
        });
      });
    this.handleClosure();
  }

  getFormButtons = (): JSX.Element => {
    return (
      <div className="fe_c_lightbox__footer">
        <Button
          text="Cancel"
          variant="secondary"
          className="fe_u_margin--right-small"
          onClick={this.props.onClose}
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
    const value = '';
    return (
      <GridCol className="fe_u_padding--large" width={{ small: 4 }}>
        <FormField
          id={field}
          labelText={upperCase(field)}
          inputAs={Input}
          labelAlwaysAbove={true}
          onChange={(e) => {
            this.handleChange(field, e, 'value');
          }}
          defaultValue={value}
          required={field !== 'rtTaskId' ? true : false}
          error={field !== 'rtTaskId' ? this.state.errors[field] : ''}
        />
      </GridCol>
    );
  };

  getUpperFields = (): JSX.Element => {
    return (
      <span>
        <GridRow>
          {this.getUpperFieldGrid('contextId')}
          {this.getUpperFieldGrid('ruleId')}
          {this.getUpperFieldGrid('rtTaskId')}
        </GridRow>
      </span>
    );
  };

  getEditFieldGrid = (field: any): JSX.Element => {
    const value = '';

    return (
      <GridCol className="fe_u_padding--super-compact">
        <FormField
          id={field}
          labelText={upperCase(field)}
          onChange={(e) => {
            this.handleChange(field, e, 'value');
          }}
          defaultValue={value}
          required={field === 'reviewedBy' ? true : false}
          inputAs={field === 'reviewerComments' ? Textarea : Input}
          error={field === 'reviewedBy' ? this.state.errors[field] : ''}
        />
      </GridCol>
    );
  };

  getEditableFields = (): JSX.Element => {
    return (
      <span>
        {this.getEditFieldGrid('ruleType')}
        {this.getEditFieldGrid('scrubType')}
        {this.getEditFieldGrid('ordering')}
        {this.getEditFieldGrid('pattern')}
        {this.getEditFieldGrid('reviewerComments')}
        {this.getEditFieldGrid('rationalizationType')}
        {this.getEditFieldGrid('reviewedBy')}
      </span>
    );
  };

  handleClosure = () => {
    this.setState({
      errors: {},
      disable: true,
      datatoadd: {},
    });
    this.props.onClose();
  };

  render() {
    return (
      <Form includeSubmitButton={false} requiredVariation="blueBarWithLegend">
        {this.getUpperFields()}
        {this.getEditableFields()}
        {this.getFormButtons()}
      </Form>
    );
  }
}

export default AddRationalizedRules;
