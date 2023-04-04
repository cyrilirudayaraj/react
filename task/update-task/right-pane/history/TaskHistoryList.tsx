import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getEventDetail } from '../../../../../slices/TaskHistorySlice';
import { Card, Heading, GridCol, GridRow } from '@athena/forge';
import { isObject, startCase, keys } from 'lodash';
import moment from 'moment';
import WFAccordion from '../../../../../components/wf-accordion/WFAccordion';
import WFAccordionDetails from '../../../../../components/wf-accordion/WFAccordionDetails';
import WFAccordionItem from '../../../../../components/wf-accordion/WFAccordionItem';
import WFAccordionSummary from '../../../../../components/wf-accordion/WFAccordionSummary';
import AppConstants from '../../../../../constants/AppConstants';
import { AuditEntry, AuditEvent, TaskDetail } from '../../../../../types';
import StringUtil from '../../../../../utils/StringUtil';
import ConversionUtil from '../../../../../utils/ConversionUtil';
import SortingGrouping from '../../../../../utils/SortingGrouping';

interface TaskHistoryListProps {
  events: any;
  taskdetails: TaskDetail;
}

export class TaskHistoryList extends Component<TaskHistoryListProps> {
  renderValue(
    value: Record<string, any> | string,
    attrs: string[] | undefined
  ): JSX.Element {
    const { AUDIT } = AppConstants.SERVER_CONSTANTS;
    if (isObject(value)) {
      return (
        <div>
          {keys(value)
            .sort(function order(key1, key2) {
              if (attrs) {
                const idx1 = attrs.findIndex((attr) => attr === key1);
                const idx2 = attrs.findIndex((attr) => attr === key2);
                if (idx1 < idx2) return -1;
                else if (idx1 > idx2) return +1;
                else return 0;
              } else return 0;
            })
            .map((key) => {
              let keyValue = value[key];
              if (key === AUDIT.ATTRS.TIMESPENT && keyValue) {
                keyValue = ConversionUtil.convertMinsToHm(keyValue);
              }
              return (
                <React.Fragment key={key}>
                  <span className="key">{startCase(key)}: </span>
                  <span
                    className="value"
                    dangerouslySetInnerHTML={{ __html: keyValue }}
                  ></span>
                  <br />
                </React.Fragment>
              );
            })}
        </div>
      );
    } else {
      return (
        <span
          className="value"
          dangerouslySetInnerHTML={{ __html: value }}
        ></span>
      );
    }
  }

  renderEventChangeList(auditEvent: AuditEvent): JSX.Element[] {
    const details: JSX.Element[] = [];
    const { AUDIT } = AppConstants.SERVER_CONSTANTS;
    //@ts-ignore
    const attrs = AUDIT.ATTR_GROUP[auditEvent.objectType];
    auditEvent.changes.forEach((data: AuditEntry) => {
      const { fieldName } = data;
      let { newValue, oldValue } = data;
      if (StringUtil.equalsIgnoreCase(fieldName, AUDIT.ATTRS.TIMESPENT)) {
        if (newValue) {
          newValue = ConversionUtil.convertMinsToHm(newValue);
        }
        if (oldValue) {
          oldValue = ConversionUtil.convertMinsToHm(oldValue);
        }
      }
      details.push(
        <div className="change">
          {fieldName && <div className="value">{startCase(fieldName)}</div>}
          {newValue && (
            <div className="fe_u_flex-container new-content">
              <div className="new-icon">+</div>
              {this.renderValue(newValue, attrs)}
            </div>
          )}
          {oldValue && (
            <div className="fe_u_flex-container deleted-content">
              <div className="delete-icon">−</div>
              {this.renderValue(oldValue, attrs)}
            </div>
          )}
        </div>
      );
    });
    return details;
  }

  formatCalendarDateWithTime = (date: any) => {
    return moment(date).format(
      AppConstants.UI_CONSTANTS.DATE_WITH_TIMESTAMP_FORMAT
    );
  };

  formatCalendarDate = (date: any) => {
    const { HISTORY_DATE_FORMAT } = AppConstants.UI_CONSTANTS;
    return moment(date).calendar(undefined, {
      sameDay: '[Today]',
      lastDay: '[Yesterday]',
      lastWeek: HISTORY_DATE_FORMAT,
      sameElse: HISTORY_DATE_FORMAT,
    });
  };

  renderEvent(event: AuditEvent): JSX.Element {
    return (
      <Card padded={false} className="event">
        <WFAccordion>
          <WFAccordionItem padded={true}>
            <WFAccordionSummary>
              <div>
                <Heading
                  headingTag="h5"
                  variant="subsection"
                  text={event.eventName}
                />
                <GridRow removeGuttersSmall={true}>
                  <GridCol width={{ small: 5 }}>
                    <span className="fe_u_font-weight--light">
                      {this.formatCalendarDateWithTime(event.created)}
                    </span>
                  </GridCol>
                  <GridCol width={{ small: 6 }}>
                    <span className="user-details">
                      <span className="fe_u_font-weight--light">By:</span>
                      <span className="fe_u_font-weight--semibold">
                        {` ${event.createdBy}`}
                      </span>
                    </span>
                  </GridCol>
                </GridRow>
              </div>
            </WFAccordionSummary>
            <WFAccordionDetails>
              {this.renderEventChangeList(event)}
            </WFAccordionDetails>
          </WFAccordionItem>
        </WFAccordion>
      </Card>
    );
  }

  renderEvents(events: AuditEvent[]): JSX.Element[] {
    const cards: JSX.Element[] = [];
    events.forEach((event: AuditEvent) => {
      cards.push(this.renderEvent(event));
    });
    return cards;
  }

  renderEventsGroupByDate(): JSX.Element {
    const result: Record<
      string,
      AuditEvent[]
    > = SortingGrouping.sortAndGroupByCreatedDateDesc(this.props.events);
    return (
      <ul className="event-list-group-container">
        {result &&
          keys(result)
            .sort(
              (date1: string, date2: string) =>
                new Date(date1).getTime() - new Date(date2).getTime()
            )
            .reverse()
            .map((key) => (
              <li className="event-list-group" key={key}>
                <div className="event-date-container">
                  <div className="borderleft"></div>
                  <div className="event-group_date">
                    {this.formatCalendarDate(key)}
                  </div>
                  <div className="borderright"></div>
                </div>
                <div className="event-result-list">
                  {this.renderEvents(result[key])}
                </div>
              </li>
            ))}
      </ul>
    );
  }
  render(): JSX.Element {
    return <div className="task-history">{this.renderEventsGroupByDate()}</div>;
  }
}

const mapStateToProps = (state: any) => {
  return { events: getEventDetail(state) };
};

export default connect(mapStateToProps)(TaskHistoryList);
