import React, { Component } from 'react';
import AuthUtil from '../../utils/AuthUtil';
import { getPermissions } from '../../slices/UserPermissionSlice';
import { connect } from 'react-redux';

interface WFEnableForPermissionProps {
  permission?: any;
  userPermissions?: any;
  children?: any;
}

class WFEnableForPermission extends Component<WFEnableForPermissionProps> {
  render() {
    const { permission, children } = this.props;
    const isDisabled = !AuthUtil.isAuthorized(
      permission,
      this.props.userPermissions
    );
    if (isDisabled) {
      const newChildren = React.Children.map(children, function (child: any) {
        return React.cloneElement(child, { disabled: isDisabled });
      });
      return newChildren;
    }
    return children;
  }
}

const mapStateToProps = (state: any) => {
  return { userPermissions: getPermissions(state) };
};

export default connect(mapStateToProps)(WFEnableForPermission);
