import React from 'react';
import { Button, Tooltip } from '@athena/forge';
import Labels from '../../../constants/Labels';
import Acl from '../../../constants/Acl';
import WFEnableForPermission from '../../../components/wf-enableforpermission/WFEnableForPermission';

export interface ModellingActionsProps {
  data: any;
  handleClick: any;
  handleChange: any;
  searchString: string;
  onImport: any;
  startDate: Date;
  handleDate: any;
  handleDateSearch: any;
  clearFilters: any;
}

const ModellingActions = (props: ModellingActionsProps) => {
  return (
    <div className="actionButtons">
      <span className="rightActionButtons">
        <Tooltip
          text={Labels.RULES_MIGRATION.BUTTONS.IMPORT_TOOLTIP}
          id="info-import"
        >
          <WFEnableForPermission permission={Acl.MIGRATIONRULE_IMPORT}>
            <Button
              text={Labels.RULES_MIGRATION.BUTTONS.IMPORT}
              variant="primary"
              icon="Upload"
              className="extra-margin"
              onClick={props.onImport}
            />
          </WFEnableForPermission>
        </Tooltip>
      </span>
    </div>
  );
};

export default ModellingActions;
