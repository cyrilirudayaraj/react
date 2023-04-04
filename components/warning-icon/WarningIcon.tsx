import React, { Fragment } from 'react';
import { Tooltip, Icon } from '@athena/forge';
import './WarningIcon.scss';

const WarningIcon = (props: any): JSX.Element => {
  return (
    <div className="warning-icon">
      <Fragment>
        {props.warning && (
          <Tooltip
            text={props.tooltip}
            id={props.label}
            className="requirement-tip"
          >
            <Icon
              icon="Critical"
              className="requirement-icon"
              height={props.height}
              width={props.width}
            />
          </Tooltip>
        )}
      </Fragment>
    </div>
  );
};

export default WarningIcon;
