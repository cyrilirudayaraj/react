import AuthUtil from './AuthUtil';
import Moment from 'moment';
import Constants from '../constants/AppConstants';

class DataUtil {
  static formatDeleteData(records: any): [] {
    const username = AuthUtil.getLoggedInUsername();
    const currentDate = this.getCurrentDate();
    const formatedRecords = records.map((rec: any) => {
      rec.deleted = currentDate;
      rec.deletedBy = username;
      delete rec.isChecked;
      delete rec.EDIT;
      return rec;
    });
    return formatedRecords;
  }

  static formatMoveToData(
    records: any,
    startDate: string,
    comments: string,
    segment: string
  ): [] {
    const {
      RULES_MIGRATION_TYPES,
      RULES_MIGRATION_PHASES,
    } = Constants.SERVER_CONSTANTS;
    const formatedRecords = records.map((rec: any) => {
      if (segment === RULES_MIGRATION_TYPES.MODELING) {
        rec.dualMaintStartDate = startDate;
        if (comments) {
          rec.dualMaintComment = comments;
        }
        rec.migrationPhase = RULES_MIGRATION_PHASES.DUAL_MAINTENANCE;
      } else if (segment === RULES_MIGRATION_TYPES.DUAL_MAINTENANCE) {
        rec.backCompatStartDate = startDate;
        if (comments) {
          rec.backCompatComment = comments;
        }
        rec.migrationPhase = RULES_MIGRATION_PHASES.BACKWARD_COMPATIBILITY;
      } else if (segment === RULES_MIGRATION_TYPES.BACKWARD_COMPATIBILITY) {
        rec.archiveDate = startDate;
        if (comments) {
          rec.archiveComment = comments;
        }
        rec.migrationPhase = RULES_MIGRATION_PHASES.ARCHIVE;
      }
      rec.lastModified = this.getCurrentDate();
      rec.lastModifiedBy = AuthUtil.getLoggedInUsername();
      delete rec.isChecked;
      return rec;
    });
    return formatedRecords;
  }

  static getCurrentDate() {
    return Moment(new Date()).format('MM/DD/YYYY');
  }

  static convertObjKeysToUppercase(obj: any) {
    const response = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        const value = obj[key];
        if (typeof value === 'string') {
          //@ts-ignore
          response[key.toUpperCase()] = value;
        }
      }
    }
    return response;
  }
}

export default DataUtil;
