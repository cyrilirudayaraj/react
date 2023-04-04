import React, { useRef, useState, useEffect } from 'react';
import { Button, Table, Popover } from '@athena/forge';
import Labels from '../../../../constants/Labels';
import { PriorityPolicy } from '../../../../types';
import Messages from '../../../../constants/Messages';

export interface PriorityPolicyProps {
  priorityPolicies?: PriorityPolicy[];
}

export default function (props: PriorityPolicyProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);
  const buttonRef = useRef(null);
  const priorityPolicies = props.priorityPolicies || [];

  const labels = Labels.PRIORITY_POLICY;

  useEffect(() => {
    function handleClickOutside(event: any) {
      if (
        containerRef.current &&
        //@ts-ignore
        !containerRef.current.contains(event.target)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [containerRef]);

  return (
    <div className="fe_u_padding--top-large priority-policy">
      <div ref={containerRef}>
        <Button
          icon="Info"
          variant="tertiary"
          ref={buttonRef}
          className="priority-policy-icon"
          onClick={() => setIsOpen(true)}
        />

        <Popover
          isOpen={isOpen}
          className="priority-policy-popover"
          heading={labels.PRIORITY_EXPECTIONS}
          targetRef={buttonRef}
          onClose={() => setIsOpen(false)}
          placement="right"
          hideArrow
        >
          <div>
            <p>{Messages.PRIORITY_POLICY_CRITERIA_MESSAGE}</p>

            <Table
              layout="compact"
              rows={priorityPolicies}
              showHover={false}
              columns={[
                {
                  key: 'name',
                  displayName: labels.PRIORITY,
                },
                {
                  key: 'internalTatInDays',
                  displayName: labels.TAT,
                  template: (value) =>
                    value && value != '0' ? `Up to ${value}` : 'No TAT',
                },
                {
                  key: 'description1',
                  displayName: labels.LOCAL_RULES,
                },
                {
                  key: 'description2',
                  displayName: labels.GLOBAL_RULES,
                },
              ]}
            />
            <a
              href={process.env.REACT_APP_PRIORITY_GUIDE_URL}
              className="full-guide-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              View Full Priority Guide
            </a>
          </div>
        </Popover>
      </div>
    </div>
  );
}
