import React, { Component } from 'react';
import { Lightbox, TabPane, Tabs, Button } from '@athena/forge';
import Labels from '../../../constants/Labels';
import RuleNotMigratedFileChooser from './RuleNotMigratedFileChooser';
import { addSuccessToast } from '../../../slices/ToastSlice';
import { uploadRuleNotMigratedFile } from '../../../services/CommonService';
import Messages from '../../../constants/Messages';
import store from '../../../store/store';
import AddRationalizedRules from './AddRationalizedRules';

export interface AddNewRationalizedRulesProps {
  onAfterAdd: any;
}

class AddNewRationalizedRules extends Component<
  AddNewRationalizedRulesProps,
  any
> {
  constructor(props: AddNewRationalizedRulesProps) {
    super(props);

    this.state = {
      showPopup: false,
    };
  }

  uploadFile = (file: File): void => {
    uploadRuleNotMigratedFile(file).then((response: any) => {
      addSuccessToast({
        headerText: Messages.RULES_MIGRATION.IMPORT_SUCCESS,
        message: Messages.RULES_MIGRATION.IMPORT_SUCCESS_MESSAGE,
      })(store.dispatch);
    });
    this.toggleLightbox();
  };

  toggleLightbox = () => {
    this.setState({
      showPopup: !this.state.showPopup,
    });
  };

  render() {
    return (
      <span>
        <Button
          text={Labels.RULES_MIGRATION.BUTTONS.ADD_NEW_RULE}
          variant="primary"
          icon="Add"
          className="extra-margin"
          onClick={this.toggleLightbox}
        />
        <Lightbox
          show={this.state.showPopup}
          hideDividers
          headerText={Labels.RULES_MIGRATION.RULES_NOT_MIGRATED.ADDRULES}
          onHide={this.toggleLightbox}
          width={'large'}
          onExited={() => {
            document.body.removeAttribute('style');
          }}
        >
          <Tabs>
            <TabPane
              label={Labels.RULES_MIGRATION.RULES_NOT_MIGRATED.BULK_UPLOAD}
              padded={false}
              mountedWhileHidden={true}
            >
              <RuleNotMigratedFileChooser
                show={this.state.isFileChooserDialogEnabled}
                onPrimaryClick={this.uploadFile}
                onCancel={this.toggleLightbox}
              />
            </TabPane>
            <TabPane
              label={Labels.RULES_MIGRATION.RULES_NOT_MIGRATED.MANUAL_UPLOAD}
              padded
              mountedWhileHidden={true}
            >
              <AddRationalizedRules
                onAfterAdd={this.props.onAfterAdd}
                onClose={this.toggleLightbox}
              />
            </TabPane>
          </Tabs>
        </Lightbox>
      </span>
    );
  }
}

export default AddNewRationalizedRules;
