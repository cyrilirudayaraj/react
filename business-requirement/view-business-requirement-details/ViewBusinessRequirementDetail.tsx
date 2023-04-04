import { GridCol, GridRow } from '@athena/forge';
import React, { Component } from 'react';
import {
  fetchBusinessRequirementDetails,
  getBusinessRequirementDetail,
  resetBusinessRequirementDetails,
} from '../../../slices/BusinessRequirementSlice';

import './ViewBusinessRequirementDetail.scss';
import { connect } from 'react-redux';
import { BRDetails } from '../../../types';
import BusinessRequirementHeader from './business-requirement-header/BusinessRequirementHeader';
import BusinessRequirementDetail from './business-requirement-details/BusinessRequirementDetail';
import ViewAssociatedTask from './view-associated-task/ViewAssociatedTask';

interface ViewBusinessRequirementDetailProps {
  match?: any;
  brDetails: BRDetails;
  fetchBusinessRequirementDetails?: any;
  resetBusinessRequirementDetails?: any;
}

interface ViewBusinessRequirementDetailState {
  brId?: any;
}

export class ViewBusinessRequirementDetail extends Component<
  ViewBusinessRequirementDetailProps,
  ViewBusinessRequirementDetailState
> {
  state = {
    brId: '',
  };

  constructor(props: any) {
    super(props);
    const id = this.props.match.params.id;
    this.state.brId = id;
  }

  componentDidMount() {
    const { brId } = this.state;
    this.props.fetchBusinessRequirementDetails(brId);
  }

  componentWillUnmount() {
    this.props.resetBusinessRequirementDetails();
  }

  render() {
    const { brDetails } = this.props;
    return (
      <div className="view-business-dequirement-detail">
        <BusinessRequirementHeader brDetails={brDetails} />
        <GridRow className="fe_u_fill--height">
          <GridCol width={{ small: 8 }} className="left-section">
            <div className="fe_u_padding--none">
              <BusinessRequirementDetail brDetails={brDetails} />
            </div>
          </GridCol>

          <GridCol width={{ small: 4 }} className="right-section">
            <ViewAssociatedTask />
          </GridCol>
        </GridRow>
      </div>
    );
  }
}

const mapStateToProps = (state: any) => {
  return {
    brDetails: getBusinessRequirementDetail(state),
  };
};

const mapDispatchToProps = {
  fetchBusinessRequirementDetails,
  resetBusinessRequirementDetails,
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ViewBusinessRequirementDetail);
