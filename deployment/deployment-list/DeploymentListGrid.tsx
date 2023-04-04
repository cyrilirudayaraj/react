import React from 'react';
import { Table } from '@athena/forge';
import { Deployment } from '../../../types';
import Labels from '../../../constants/Labels';

interface DeploymentListGridProps {
  dataSource: Deployment[];
  selectedTabIndex?: number;
}

const DeploymentListGrid = (props: DeploymentListGridProps): JSX.Element => {
  const getGridColumns = (): any => {
    const gridColumn = [
      {
        key: 'id',
        displayName: Labels.DEPLOYMENT_GRID.DEPLOYMENT,
        sortable: false,
      },
      {
        key: 'status',
        displayName: Labels.DEPLOYMENT_GRID.STATUS,
        sortable: false,
      },

      {
        key: 'releaseVersion',
        displayName: Labels.DEPLOYMENT_GRID.RELEASE,
        sortable: false,
      },
      {
        key: 'created',
        displayName: Labels.DEPLOYMENT_GRID.RELEASEDATE,
        sortable: false,
      },
      {
        key: 'createdBy',
        displayName: Labels.DEPLOYMENT_GRID.RELEASEDBY,
        sortable: false,
      },
    ];
    return gridColumn;
  };

  return (
    <div className="deployment-grid">
      <div className="fe_u_flex-container">
        <div className="fe_u_margin--top-small full-width">
          <Table
            layout="compact"
            className="full-width"
            rows={[]}
            rowKey="deploymentId"
            columns={getGridColumns()}
          />
        </div>
      </div>
    </div>
  );
};

export default DeploymentListGrid;
