import React from 'react';

export interface WFAccordionSummaryProps {
  expanded: boolean;
  exited: boolean;
  toggleExpand: any;
}
const WFAccordionSummary = React.forwardRef(function WFAccordionSummary(
  props: any,
  ref: any
) {
  return <div className="wf-accordion-summary">{props.children}</div>;
});

export default WFAccordionSummary;
