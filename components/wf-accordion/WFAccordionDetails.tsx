import React from 'react';

const WFAccordionDetails = React.forwardRef(function WFAccordionDetails(
  props: any,
  ref: any
) {
  return (
    <div className="wf-accordion-details fe_c_accordion-item__content">
      {props.children}
    </div>
  );
});
export default WFAccordionDetails;
