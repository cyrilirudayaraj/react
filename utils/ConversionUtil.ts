import { EditorState, ContentState } from 'draft-js';
import htmlToDraft from 'html-to-draftjs';
import { forOwn } from 'lodash';
import moment from 'moment';
import { Shape } from '../types';
import StringUtil from './StringUtil';

class ConversionUtil {
  static convertMapToDropDownList(
    data: any,
    valueKey?: string,
    labelKey?: string
  ): string[] {
    const dropDownList = data?.map((val: any) => {
      return {
        value: val[valueKey ? valueKey : 'id'],
        text: val[labelKey ? labelKey : valueKey ? valueKey : 'name'],
      };
    });
    return dropDownList;
  }

  static convertMapToDropDownListInIdNameFormat(
    data: any,
    valueKey?: string,
    labelKey?: string
  ): string[] {
    const dropDownList = data?.map((val: any) => {
      const obj = {
        value: val[valueKey ? valueKey : 'id'],
        text:
          val[valueKey ? valueKey : 'id'] +
          ' - ' +
          val[labelKey ? labelKey : valueKey ? valueKey : 'name'],
      };
      return obj;
    });
    return dropDownList;
  }

  static convertDropDownListToValues(data: Shape[]): string[] {
    const values = data?.map((val: any) => {
      return val['value'];
    });
    return values;
  }

  static getListOfKeyValues(
    data: any[] | undefined,
    key: any
  ): string[] | undefined {
    const values = data?.map((val: any) => {
      return val[key];
    });
    return values;
  }

  static convertValuesToPayload(values: any): any {
    const payload: any = {};
    forOwn(values, function (value: any, key: string) {
      if (value instanceof Date) {
        payload[key] = value.toLocaleDateString('en-US');
      } else if (typeof value === 'boolean') {
        payload[key] = StringUtil.convertToYN(value);
      } else if (typeof value === 'string') {
        payload[key] = value ? value.trim() : value;
      } else {
        payload[key] = value;
      }
    });
    return payload;
  }

  static convertMinsToDhm(value: any): any {
    const duration = moment.duration(parseInt(value), 'minutes');
    let durationInMins = '';
    if (duration.days() > 0) {
      durationInMins += duration.days() + 'd ';
    }
    if (duration.hours() > 0) {
      durationInMins += duration.hours() + 'h ';
    }
    return durationInMins + duration.minutes() + 'm';
  }

  static convertMinsToHm(num: any): any {
    const hours: any = num / 60;
    const rhours: any = Math.floor(hours);
    const minutes: any = (hours - rhours) * 60;
    const rminutes: any = Math.round(minutes);
    return (
      (rhours > 0 ? rhours + 'h ' : ' ') + (rminutes > 0 ? rminutes + 'm' : '')
    );
  }

  static convertHtmlToPlainText(text: string): string {
    if (!text) {
      return text;
    }
    const editorState = EditorState.createWithContent(
      ContentState.createFromBlockArray(
        htmlToDraft(text).contentBlocks,
        htmlToDraft(text).entityMap
      )
    );
    return editorState.getCurrentContent().getPlainText();
  }

  static constructPayloadObj = (filters: any): any => {
    const ids: any = [];
    if (Array.isArray(filters)) {
      filters?.map((filter: any) => {
        if (typeof filter === 'object') {
          ids.push(filter.value);
        } else {
          ids.push(filter);
        }
      });
    }
    return ids;
  };

  static getPrettyJson(jsonString: string): string {
    try {
      const json = JSON.parse(jsonString);
      return JSON.stringify(json, null, 4);
    } catch (e) {
      return jsonString;
    }
  }
}

export default ConversionUtil;
