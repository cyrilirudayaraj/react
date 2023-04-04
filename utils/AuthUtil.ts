const winObj: any = window;

class AuthUtil {
  static getLoggedInUsername(): string {
    return winObj.globalVars
      ? winObj.globalVars.username
      : process.env.REACT_APP_USER;
  }

  static isPermissionEnabled(): boolean {
    const enablePermission = winObj.globalVars
      ? winObj.globalVars.enablePermission
      : process.env.REACT_APP_ENABLE_PERMISSION;
    return enablePermission && enablePermission == 1;
  }

  static isAuthorized(
    permission: string,
    userPermissionList: string[]
  ): boolean {
    let result = true;
    const eventList = userPermissionList ? userPermissionList : [];
    if (AuthUtil.isPermissionEnabled()) {
      if (permission && !eventList.includes(permission)) {
        result = false;
      }
    }
    return result;
  }

  static isConsecutiveSignoffDisabled(): boolean {
    const disableConsecutiveSignoff = winObj.globalVars
      ? winObj.globalVars.disableConsecutiveSignoff
      : process.env.REACT_APP_DISABLE_CONSECUTIVE_SIGNOFF;
    return disableConsecutiveSignoff && disableConsecutiveSignoff == 1;
  }

  static disableConsecutiveSignoff(previousSignoffUsername: string): boolean {
    if (
      AuthUtil.isConsecutiveSignoffDisabled() &&
      AuthUtil.getLoggedInUsername() === previousSignoffUsername
    ) {
      return true;
    }
    return false;
  }
}

export default AuthUtil;
