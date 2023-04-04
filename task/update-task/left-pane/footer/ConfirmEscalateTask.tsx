import React from 'react';
import { Modal, Button } from '@athena/forge';
import { ButtonVariant } from '@athena/forge/Button/Button';

interface EscalateTaskProps {
  shownByDefault?: boolean;
  buttonText?: string;
  primaryModalText?: string;
  messageText?: string;
  headerText: string;
  variant: ButtonVariant;
  disabled: boolean;
  className?: string;
  action: () => void;
  icon?: string;
  version?: string;
}

export default class ConfirmEscalateTask extends React.Component<
  EscalateTaskProps
> {
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
    this.props.action();
    this.setState({
      shown: false,
    });
  };
  render(): JSX.Element {
    return (
      <div className="escalate-task">
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
          onHide={this.hideModal}
          onPrimaryClick={this.completeModal}
        >
          <p>{this.props.messageText}</p>
        </Modal>
      </div>
    );
  }
}
