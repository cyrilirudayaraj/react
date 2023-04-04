import Labels from '../constants/Labels';
import Constants from '../constants/AppConstants';
import AppConstants from '../constants/AppConstants';
const winObj: any = window;
const env = winObj.globalVars ? winObj.globalVars.environment : null;

class StringUtil {
  static isNullOrEmpty(val: any): boolean {
    return !val || val === undefined || val === '' || val.length === 0;
  }

  static equalsIgnoreCase(
    str1: string | undefined,
    str2: string | undefined
  ): boolean {
    return (
      str1 != null && str2 != null && str1.toLowerCase() === str2.toLowerCase()
    );
  }

  static formatBRID(val: number | string | undefined): string {
    if (StringUtil.isNullOrEmpty(val)) return '';
    return 'BR-' + ('000000' + val).slice(-6);
  }

  static formatTaskID(val: number | string | undefined): string {
    if (StringUtil.isNullOrEmpty(val)) return '';
    return 'T-' + val;
  }
  static formatRTTaskID(val: number | string | undefined): string {
    if (StringUtil.isNullOrEmpty(val)) return '';
    return 'RT ' + val;
  }

  static formatTaskIdList(tasks: string[] | undefined): string {
    let formatTasks = '';
    if (tasks && tasks.length > 0) {
      tasks.forEach((task: string, index: number) => {
        tasks[index] = StringUtil.formatTaskID(task);
      });
      formatTasks = tasks.join(', ');
    }
    return formatTasks;
  }

  static formatDeploymentID(val: number | string | undefined): string {
    if (StringUtil.isNullOrEmpty(val)) return '';
    return 'D-' + val;
  }

  static formatRuleTrackerTaskID(val: number | string | undefined): string {
    if (StringUtil.isNullOrEmpty(val)) return '';
    return 'RT ' + val;
  }

  static returnHyphenIfEmpty(value: string | null | undefined): string {
    if (StringUtil.isNullOrEmpty(value)) return '---';
    return value || '---';
  }

  static returnDoubleHyphenIfEmpty(value: string | null | undefined): string {
    if (StringUtil.isNullOrEmpty(value)) return '--';
    return value || '--';
  }

  static convertToBoolean(value: string | null | undefined): boolean {
    return value?.toLowerCase() === 'y' ? true : false;
  }

  static convertToYN(value: boolean | null | undefined): string {
    return value ? 'Y' : 'N';
  }

  static formatDate(date: Date | null): string {
    if (!date) return '';
    return (
      date.getMonth() + 1 + '/' + date.getDate() + '/' + date.getFullYear()
    );
  }

  static formatDecisionTableId(val: number | string): string {
    if (StringUtil.isNullOrEmpty(val)) return '';
    return Labels.TASK_DT_DETAILS.DT_TEXT + ('000000' + val).slice(-6);
  }

  static getValidUrl(url: string): string {
    if (!Boolean(url)) {
      url = '';
    }
    if (!url.startsWith('http')) {
      url = '//' + url;
    }
    return url;
  }

  static concat(id?: string, name?: string): string {
    let concatenatedText = '';
    if (id && name) concatenatedText = id + ' - ' + name;
    return concatenatedText;
  }

  static getStatusClassName(status: string | undefined): string {
    let className = '';
    if (status) {
      className = 'status_' + status;
    }
    return className;
  }

  static classNames(...args: any[]): string {
    const classes = [];

    for (let i = 0; i < args.length; i++) {
      const arg = args[i];
      if (!arg) continue;

      const argType = typeof arg;

      if (argType === 'string' || argType === 'number') {
        classes.push(arg);
      } else if (Array.isArray(arg)) {
        if (arg.length) {
          const inner = StringUtil.classNames.apply(null, arg);
          if (inner) {
            classes.push(inner);
          }
        }
      } else if (argType === 'object') {
        if (arg.toString !== Object.prototype.toString) {
          classes.push(arg.toString());
        } else {
          for (const key in arg) {
            if (arg.hasOwnProperty(key) && arg[key]) {
              classes.push(key);
            }
          }
        }
      }
    }
    return classes.join(' ');
  }

  static getJIRAIdUrl(issueId: string | undefined): string {
    return issueId
      ? (process.env.REACT_APP_JIRA_ID_LOOKUP_URL || '') + issueId
      : StringUtil.noHref();
  }

  static getSalesforceIdUrl(recordId: string | undefined): string {
    if (env?.toUpperCase() === Constants.UI_CONSTANTS.STAGE_ENV) {
      return recordId
        ? (process.env.REACT_APP_SALESFORCE_STAGE_RECORDID_LOOKUP_URL || '') +
            recordId
        : StringUtil.noHref();
    } else {
      return recordId
        ? (process.env.REACT_APP_SALESFORCE_RECORDID_LOOKUP_URL || '') +
            recordId
        : StringUtil.noHref();
    }
  }

  static getRTTaskIdUrl(taskId: string | undefined | null): string {
    return taskId
      ? (process.env.REACT_APP_RT_TASKID_LOOKUP_URL || '') + taskId
      : StringUtil.noHref();
  }

  static getAtlasTaskIdUrl(taskId: string | undefined | null): string {
    if (env?.toUpperCase() === Constants.UI_CONSTANTS.STAGE_ENV) {
      return taskId
        ? (process.env.REACT_APP_ATLAS_STAGE_TASKID_LOOKUP_URL || '') + taskId
        : StringUtil.noHref();
    } else {
      return taskId
        ? (process.env.REACT_APP_ATLAS_TASKID_LOOKUP_URL || '') + taskId
        : StringUtil.noHref();
    }
  }

  static getRTRuleIdUrl(rule: string | undefined): string {
    if (rule && rule.split('.').length === 2) {
      const practiceId = rule.split('.')[0];
      const ruleId = rule.split('.')[1];
      let url = process.env.REACT_APP_RT_RULEID_LOOKUP_URL || '';
      url = url.replace('PRACTICE_ID', practiceId).replace('RULE_ID', ruleId);
      return url;
    }
    return StringUtil.noHref();
  }

  static getOriginatingSystemUrl(
    type: string | undefined,
    issueId: string | undefined
  ): string {
    let result: string;
    const { SALESFORCE, JIRA } = AppConstants.UI_CONSTANTS.ORIGINATING_SYSTEM;
    switch (type) {
      case JIRA:
        result = StringUtil.getJIRAIdUrl(issueId);
        break;

      case SALESFORCE:
        result = StringUtil.getSalesforceIdUrl(issueId);
        break;

      default:
        result = StringUtil.noHref();
        break;
    }
    return result;
  }

  static noHref(): string {
    return 'javascript:void(0);';
  }
}

export default StringUtil;
