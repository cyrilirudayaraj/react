import { Accordion, AccordionItem, Icon, Table } from '@athena/forge';
import React, { Component } from 'react';
import { DeploymentDetails, DeploymentLog } from '../../../../types';
import ConversionUtil from '../../../../utils/ConversionUtil';

interface DeploymentLogProps {
  response: DeploymentDetails;
}

export default class DeploymentLogComponent extends Component<
  DeploymentLogProps,
  any
> {
  getLog(request: any, response: any) {
    return (
      <Accordion>
        <AccordionItem headingText="View log">
          <b>Request:</b>
          <div>{request}</div>
          <b>Response:</b>
          <div className="pre">{ConversionUtil.getPrettyJson(response)}</div>
        </AccordionItem>
      </Accordion>
    );
  }

  getStatusIcon = (status: string): JSX.Element => {
    return <Icon icon={status == '1' ? 'Success' : 'Attention'} />;
  };

  getData = (): any => {
    const rows: any = [];
    const deploymentLogs = this.props.response?.logs;
    if (deploymentLogs) {
      deploymentLogs.forEach((log: DeploymentLog) => {
        rows.push({
          serial: parseInt(log.ordering),
          action: log.action,
          status: this.getStatusIcon(log.statusId),
          message: log.message,
          log: this.getLog(log.request, log.response),
        });
      });
    }
    return rows;
  };

  deploymentStatusTable = (): any => {
    return (
      <Table
        layout="compact"
        rows={this.getData()}
        sortOrder={{
          column: 'serial',
          direction: 'asc',
        }}
        columns={[
          {
            key: 'serial',
            displayName: '#',
            sortable: false,
          },
          {
            key: 'action',
            displayName: 'Action',
          },
          {
            key: 'status',
            displayName: 'Status',
          },
          {
            key: 'message',
            displayName: 'Message',
          },
          {
            key: 'log',
            displayName: 'Log',
          },
        ]}
      />
    );
  };

  render(): JSX.Element {
    return <div className="deployment-log">{this.deploymentStatusTable()}</div>;
  }
}
