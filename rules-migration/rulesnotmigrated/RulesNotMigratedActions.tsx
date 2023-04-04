import React from 'react';
import WFEnableForPermission from '../../../components/wf-enableforpermission/WFEnableForPermission';
import Acl from '../../../constants/Acl';
import AddNewRationalizedRules from './AddNewRationalizedRules';

export interface RulesNotMigratedActionsProps {
  onAfterAdd: any;
}

const RulesNotMigratedActions = (props: RulesNotMigratedActionsProps) => {
  return (
    <div className="actionButtons">
      <span className="rightActionButtons">
        <div>
          <WFEnableForPermission permission={Acl.RATIONALIZATIONRULE_CREATE}>
            <AddNewRationalizedRules onAfterAdd={props.onAfterAdd} />
          </WFEnableForPermission>
        </div>
      </span>
    </div>
  );
};

export default RulesNotMigratedActions;
