import { groupBy } from 'lodash';
import moment from 'moment';
import AppConstants from '../constants/AppConstants';

class SortingGrouping {
  static sortAndGroupByCreatedDate(values: any): any {
    const sortedActivities = values.slice().sort(function (a: any, b: any) {
      const dateA: any = new Date(a.created),
        dateB: any = new Date(b.created);
      return dateA - dateB;
    });
    return groupBy(sortedActivities, 'created');
  }

  static sortAndGroupByCreatedDateDesc(values?: any): any {
    if (values !== undefined) {
      const sortedActivities = values
        .slice()
        .reverse()
        .sort(function (a: any, b: any) {
          const dateA: any = new Date(a.created),
            dateB: any = new Date(b.created);
          return dateB - dateA;
        });

      return groupBy(sortedActivities, function (data: any) {
        return moment(data.created).format(
          AppConstants.UI_CONSTANTS.DATE_FORMAT_WORKLOG
        );
      });
    }
    return '';
  }
  static sortAndGroupByWorkflowStepId(values: any): any {
    let sortedActivities = values.slice().sort(function (a: any, b: any) {
      const dateA: any = new Date(a.loggedOn),
        dateB: any = new Date(b.loggedOn);
      return dateB - dateA;
    });
    sortedActivities = sortedActivities.slice().sort(function (a: any, b: any) {
      const stepIdA: any = parseInt(a.workflowStepId),
        stepIdB: any = parseInt(b.workflowStepId);
      return stepIdA - stepIdB;
    });
    return groupBy(sortedActivities, 'workflowStepName');
  }
  static sortWorkLogEntriesByWorkflowStep(arr1: any, arr2: any): any {
    const sortedActivities = arr1.reduce(
      (m: any, a: any) => m.set(a[0], (m.get(a[0]) || []).concat([a])),
      new Map()
    );
    let sortedActivitiesResult = arr2.map((k: any) =>
      (sortedActivities.get(k) || []).shift()
    );
    sortedActivitiesResult = sortedActivitiesResult.filter((val: any) => {
      return val != undefined;
    });
    return sortedActivitiesResult;
  }
}
export default SortingGrouping;
