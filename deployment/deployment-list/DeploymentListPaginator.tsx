import React from 'react';
import { Paginator } from '@athena/forge';

interface DeploymentListPaginatorProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (...args: any[]) => unknown;
}

function calculateTotalPages(total: number, pageSize: number) {
  return Math.ceil(total / pageSize);
}

export default function DeploymentListPaginator(
  props: DeploymentListPaginatorProps
): JSX.Element {
  return (
    <div className="deployment-paginator">
      <Paginator
        displayMode="default"
        pageCount={calculateTotalPages(props.total, props.pageSize)}
        selectedIndex={props.currentPage}
        onSelectedIndexChange={props.onPageChange}
      />
    </div>
  );
}
