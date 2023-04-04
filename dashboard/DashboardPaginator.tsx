import React from 'react';
import { Paginator } from '@athena/forge';

interface DashboardPaginatorProps {
  total: number;
  pageSize: number;
  currentPage: number;
  onPageChange: (...args: any[]) => unknown;
}

function calculateTotalPages(total: number, pageSize: number) {
  return Math.ceil(total / pageSize);
}

export default function DashboardPaginator(
  props: DashboardPaginatorProps
): JSX.Element {
  return (
    <div className="dashboard-paginator">
      <Paginator
        displayMode="default"
        pageCount={calculateTotalPages(props.total, props.pageSize)}
        selectedIndex={props.currentPage}
        onSelectedIndexChange={props.onPageChange}
      />
    </div>
  );
}
