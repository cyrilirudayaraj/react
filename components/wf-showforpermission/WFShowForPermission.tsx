import React from 'react';
import AuthUtil from '../../utils/AuthUtil';
import { connect } from 'react-redux';
import { getPermissions } from '../../slices/UserPermissionSlice';

interface WFShowForPermissionProps {
  permission?: any;
  userPermissions?: any;
  children?: any;
}
class WFShowForPermission extends React.Component<WFShowForPermissionProps> {
  render(): JSX.Element {
    const couldShow =
      this.props.permission &&
      !AuthUtil.isAuthorized(this.props.permission, this.props.userPermissions);
    let element = <React.Fragment></React.Fragment>;
    if (!couldShow) {
      element = <React.Fragment>{this.props.children}</React.Fragment>;
    }
    return element;
  }
}

const mapStateToProps = (state: any) => {
  return { userPermissions: getPermissions(state) };
};
export default connect(mapStateToProps)(WFShowForPermission);
