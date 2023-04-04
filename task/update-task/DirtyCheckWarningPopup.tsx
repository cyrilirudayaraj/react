import React from 'react';
import { connect } from 'react-redux';
import { Button, Lightbox } from '@athena/forge';
import Labels from '../../../constants/Labels';

interface PopupActionsProps {
  onCloseReport?(): any;
  show: any;
  onSaveBtn: any;
  onRejectBtn: any;
  onCancelBtn: any;
  formik?: any;
  popupOnSave?: any;
  onCancel?: any;
  onReject?: any;
  save?: any;
}

export class DirtyCheckWarningPopup extends React.Component<
  PopupActionsProps,
  any
> {
  constructor(props: PopupActionsProps) {
    super(props);
    this.state = {};
  }
  render() {
    const { formik } = this.props;
    return (
      <div>
        <Lightbox
          show={this.props.show}
          hideDividers
          headerText={Labels.DIRTYCHECKPOPUP.HEADING}
          disableClose
          width="medium"
          className="my-custom-lightbox report popup-action-box"
        >
          <p className="pd-left30">{Labels.DIRTYCHECKPOPUP.SUB_TEXT}</p>
          <div className="fe_c_lightbox__footer">
            <Button
              text={Labels.DIRTYCHECKPOPUP.DONT}
              variant="secondary"
              className="fe_u_margin--right-small"
              onClick={() => this.props.onRejectBtn(formik)}
            />
            <Button
              text={Labels.DIRTYCHECKPOPUP.CANCEL}
              variant="secondary"
              className="fe_u_margin--right-small"
              onClick={() => this.props.onCancelBtn(formik)}
            />
            <Button
              text={Labels.DIRTYCHECKPOPUP.SAVE}
              onClick={() => this.props.onSaveBtn(formik)}
              className="fe_u_margin--right-small"
            />
          </div>
        </Lightbox>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => ({});

const mapDispatchToProps = {};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(DirtyCheckWarningPopup);
