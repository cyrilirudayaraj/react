import { Heading } from '@athena/forge';
import React, { Component } from 'react';
import { BRDetails } from '../../../../types';
import StringUtil from '../../../../utils/StringUtil';

interface BusinessRequirementHeaderProps {
  brDetails: BRDetails;
}

export default class BusinessRequirementHeader extends Component<
  BusinessRequirementHeaderProps,
  any
> {
  render() {
    const { brDetails } = this.props;
    return (
      <div className="business-requirement-header">
        <Heading
          className="header-name"
          headingTag="h3"
          variant="section"
          text={StringUtil.formatBRID(brDetails.id)}
        />
      </div>
    );
  }
}
