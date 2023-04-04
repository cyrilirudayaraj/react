import React from 'react';
import Toast from '@athena/forge/Toast';
import { ToastMessage } from '../../types';
import './Toaster.scss';
import { connect } from 'react-redux';
import { removeToast } from '../../slices/ToastSlice';

interface ToasterProps {
  toasts?: ToastMessage[];
  removeToast?: any;
}

function Toaster(props: ToasterProps) {
  const { toasts, removeToast } = props;

  let toast: ToastMessage;
  if (toasts && toasts?.length > 0) {
    toast = toasts[0];
  }

  const handleDismiss = () => {
    removeToast(toast.id);
  };

  const renderFirstToast = () => {
    if (toast) {
      let { headerText, message } = toast;
      try {
        if (typeof headerText === 'function') {
          headerText = toast.headerText(toast.params);
        }
        if (typeof message === 'function') {
          message = toast.message(toast.params);
        }
      } catch (e) {
        // ignore
      }

      return (
        <Toast
          id={toast.id || '1'}
          headerText={headerText}
          alertType={toast.alertType}
          onDismiss={handleDismiss}
        >
          {message}
        </Toast>
      );
    }
  };

  return <div className="toaster">{renderFirstToast()}</div>;
}

const mapStateToProps = (state: any) => {
  return { toasts: state.toast };
};

export default connect(mapStateToProps, {
  removeToast,
})(Toaster);
