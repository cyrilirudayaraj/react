import { Accordion, AccordionProps } from '@athena/forge';
import React from 'react';

const WFAccordion = React.forwardRef(function WFAccordion(
  props: AccordionProps,
  ref: any
) {
  const className = props.className || '';
  return <Accordion {...props} className={`wf-accordion ${className}`} />;
});

export default WFAccordion;
