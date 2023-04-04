import React from 'react';
import { Modal, Button } from '@athena/forge';
import { ButtonVariant } from '@athena/forge/Button/Button';

interface AlertBtnProps {
  shownByDefault?: boolean;
  buttonText?: string;
  primaryModalText?: string;
  messageText?: string;
  headerText: string;
  variant: ButtonVariant;
  disabled: boolean;
  className?: string;
  action: (id?: string, versionNumber?: string, timeEntry?: any) => void;
  icon?: string;
  attachmentid?: string;
  version?: string;
  timeentry?: any;
}

type ModalState = {
  shown: boolean;
};

export default class AlertBtn extends React.Component<AlertBtnProps> {
  state = {
    shown: false,
  };

  showModal = (): void => {
    this.setState({
      shown: true,
    });
  };

  hideModal = (): void => {
    this.setState({
      shown: false,
    });
  };

  completeModal = (): void => {
    this.props.action(
      this.props.attachmentid,
      this.props.version,
      this.props.timeentry
    );
    this.setState({
      shown: false,
    });
  };
  render(): JSX.Element {
    return (
      <div>
        <Button
          text={this.props.buttonText}
          variant={this.props.variant}
          className={this.props.className}
          disabled={this.props.disabled}
          onClick={this.showModal}
          icon={this.props.icon}
        />
        <Modal
          show={this.state.shown}
          headerText={this.props.headerText}
          primaryButtonText={this.props.primaryModalText}
          alertType="attention"
          width="small"
          onHide={this.hideModal}
          onPrimaryClick={this.completeModal}
        >
          <p>{this.props.messageText}</p>
        </Modal>
      </div>
    );
  }
}
