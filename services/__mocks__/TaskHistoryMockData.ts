import { AuditEvent } from '../../types';

export const TaskHistoryMockData: AuditEvent[] = [
  {
    created: '10/27/2020 03:51:57',
    eventType: 'Created',
    eventName: ' time was added',
    changes: [
      {
        newValue: {
          spentTimeInMins: null,
          loggedOn: '10/27/2020',
          taskStepName: null,
        },
      },
    ],
    objectType: 'TIMEENTRY',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:56:23',
    eventType: 'Created',
    eventName: ' time was added',
    changes: [
      {
        newValue: {
          spentTimeInMins: null,
          loggedOn: '10/27/2020',
          taskStepName: null,
        },
      },
    ],
    objectType: 'TIMEENTRY',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:56:42',
    eventType: 'Deleted',
    eventName: ' time was deleted',
    changes: [
      {
        oldValue: {
          spentTimeInMins: null,
          loggedOn: '10/27/2020',
          taskStepName: null,
        },
      },
    ],
    objectType: 'TIMEENTRY',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/26/2020 01:23:47',
    eventType: 'Created',
    eventName: 'Document Document added was added',
    changes: [
      {
        newValue: {
          link:
            'https://athenahealth.invisionapp.com/d/main#/console/19935493/431749908/preview',
          documentName: 'Document added',
          notes: null,
          type: 'Athenanet Screenshot',
        },
      },
    ],
    objectType: 'ATTACHMENT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/26/2020 01:23:59',
    eventType: 'Updated',
    eventName: 'Document Document added was changed',
    changes: [{ oldValue: null, newValue: 'Notes', fieldName: 'notes' }],
    objectType: 'ATTACHMENT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/26/2020 01:24:22',
    eventType: 'Updated',
    eventName: 'Document Invision Document added was changed',
    changes: [
      {
        oldValue: 'Document added',
        newValue: 'Invision Document added',
        fieldName: 'documentName',
      },
    ],
    objectType: 'ATTACHMENT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/26/2020 01:24:29',
    eventType: 'Deleted',
    eventName: 'Document Invision Document added was deleted',
    changes: [
      {
        oldValue: {
          link:
            'https://athenahealth.invisionapp.com/d/main#/console/19935493/431749908/preview',
          documentName: 'Invision Document added',
          notes: 'Notes',
          type: 'Athenanet Screenshot',
        },
      },
    ],
    objectType: 'ATTACHMENT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:46:43',
    eventType: 'Created',
    eventName: 'T-199 was created',
    changes: [
      {
        newValue: {
          originatingSystemName: 'Salesforce',
          legacyRuleId: '1.1666',
          dueDate: '11/11/2020',
          businessRequirementName:
            'Additional Information Required for Multiple Births',
          name: 'Task Creation',
          businessRequirementId: '201',
          taskTypeId: '3',
          priorityId: '2',
          originatingCaseId: 'O-1',
          taskTypeName: 'Dual Update',
          priorityName: '1',
        },
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:46:43',
    eventType: 'Added',
    eventName: 'T-199 was assigned to vsivachandran',
    changes: [
      { oldValue: null, newValue: 'vsivachandran', fieldName: 'assignedTo' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:46:43',
    eventType: 'Updated',
    eventName: 'T-199 status was changed to Assigned',
    changes: [
      { oldValue: 'Created', newValue: 'Assigned', fieldName: 'status' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:46:43',
    eventType: 'Added',
    eventName: 'T-199 step was changed to Analyze Task',
    changes: [
      { oldValue: null, newValue: 'Analyze Task', fieldName: 'taskStepName' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:47:04',
    eventType: 'Added',
    eventName: 'Task Description was added',
    changes: [
      {
        oldValue: null,
        newValue: 'Task Description was added',
        fieldName: 'description',
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:47:04',
    eventType: 'Removed',
    eventName: 'T-199 was unassinged',
    changes: [
      { oldValue: 'vsivachandran', newValue: null, fieldName: 'assignedTo' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:47:04',
    eventType: 'Updated',
    eventName: 'T-199 status was changed to In Progress',
    changes: [
      { oldValue: 'Assigned', newValue: 'In Progress', fieldName: 'status' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:47:04',
    eventType: 'Removed',
    eventName: 'T-199 step was changed to ',
    changes: [
      { oldValue: 'Analyze Task', newValue: null, fieldName: 'taskStepName' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:47:20',
    eventType: 'Updated',
    eventName: 'Task Description was changed',
    changes: [
      {
        oldValue: 'Task Description was added',
        newValue: 'Task Description was changed',
        fieldName: 'description',
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:48:01',
    eventType: 'Updated',
    eventName: 'Originating System was changed',
    changes: [
      {
        oldValue: 'Salesforce',
        newValue: 'Smartsheet',
        fieldName: 'originatingSystemName',
      },
      { oldValue: 'O-1', newValue: 's-1', fieldName: 'originatingCaseId' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 11:01:59',
    eventType: 'Added',
    eventName: 'Production Claim Example was added',
    changes: [
      {
        oldValue: null,
        newValue: 'Production Claim Example',
        fieldName: 'testClaimExample',
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 11:01:59',
    eventType: 'Added',
    eventName: 'Model Design Changes were added',
    changes: [
      {
        oldValue: null,
        newValue: 'Model Design Changes',
        fieldName: 'modelDesignChanges',
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 11:01:59',
    eventType: 'Added',
    eventName: 'Business Requirement Description was changed',
    changes: [
      {
        oldValue: null,
        newValue: 'Business Requirement Description',
        fieldName: 'businessRequirementDesc',
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:52:15',
    eventType: 'Added',
    eventName: 'T-199 was assigned to vsivachandran',
    changes: [
      { oldValue: null, newValue: 'vsivachandran', fieldName: 'assignedTo' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:52:15',
    eventType: 'Updated',
    eventName: 'T-199 status was changed to Assigned',
    changes: [
      { oldValue: 'In Progress', newValue: 'Assigned', fieldName: 'status' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:52:15',
    eventType: 'Added',
    eventName: 'T-199 step was changed to Review Task',
    changes: [
      { oldValue: null, newValue: 'Review Task', fieldName: 'taskStepName' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:02',
    eventType: 'Updated',
    eventName: 'T-199 step was changed to Analyze Task',
    changes: [
      {
        oldValue: 'Review Task',
        newValue: 'Analyze Task',
        fieldName: 'taskStepName',
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:43',
    eventType: 'Updated',
    eventName: 'Task Description was changed',
    changes: [
      {
        oldValue: 'Task Description was changed',
        newValue: 'Valid description was given',
        fieldName: 'description',
      },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:43',
    eventType: 'Removed',
    eventName: 'T-199 was unassinged',
    changes: [
      { oldValue: 'vsivachandran', newValue: null, fieldName: 'assignedTo' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:43',
    eventType: 'Updated',
    eventName: 'T-199 status was changed to In Progress',
    changes: [
      { oldValue: 'Assigned', newValue: 'In Progress', fieldName: 'status' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:43',
    eventType: 'Removed',
    eventName: 'T-199 step was changed to ',
    changes: [
      { oldValue: 'Analyze Task', newValue: null, fieldName: 'taskStepName' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:56',
    eventType: 'Added',
    eventName: 'T-199 was assigned to vsivachandran',
    changes: [
      { oldValue: null, newValue: 'vsivachandran', fieldName: 'assignedTo' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:56',
    eventType: 'Updated',
    eventName: 'T-199 status was changed to Assigned',
    changes: [
      { oldValue: 'In Progress', newValue: 'Assigned', fieldName: 'status' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/27/2020 03:53:56',
    eventType: 'Added',
    eventName: 'T-199 step was changed to Review Task',
    changes: [
      { oldValue: null, newValue: 'Review Task', fieldName: 'taskStepName' },
    ],
    objectType: 'TASK',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:56:29',
    eventType: 'Created',
    eventName: 'DT- row was added',
    changes: [
      {
        newValue: {
          modelName: 'DT-Added',
          name: null,
          refId: null,
          description: null,
          refUrl: null,
        },
      },
    ],
    objectType: 'DT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:56:41',
    eventType: 'Updated',
    eventName: 'DT- row was changed',
    changes: [
      { oldValue: null, newValue: 'Decision Table Name', fieldName: 'name' },
    ],
    objectType: 'DT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:57:09',
    eventType: 'Updated',
    eventName: 'DT-1 row was changed',
    changes: [
      {
        oldValue: 'Decision Table Name',
        newValue: 'Decision Table Name changed',
        fieldName: 'name',
      },
      { oldValue: null, newValue: '1', fieldName: 'refId' },
    ],
    objectType: 'DT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:57:32',
    eventType: 'Updated',
    eventName: 'DT-1 row was changed',
    changes: [
      {
        oldValue: null,
        newValue: 'Decision Table Change Description added',
        fieldName: 'description',
      },
    ],
    objectType: 'DT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:57:52',
    eventType: 'Added',
    eventName: 'DT-1 row was changed',
    changes: [
      {
        oldValue: 'Decision Table Name changed',
        newValue: 'Decision Table Name and desc changed',
        fieldName: 'name',
      },
      {
        oldValue: 'Decision Table Change Description added',
        newValue: 'Decision Table Name and desc changed',
        fieldName: 'description',
      },
      {
        oldValue: null,
        newValue: 'https://react-testing.athenahealth.com:3000/tasks/199',
        fieldName: 'refUrl',
      },
    ],
    objectType: 'DT',
    createdBy: 'vsivachandran',
  },
  {
    created: '10/25/2020 10:59:53',
    eventType: 'Deleted',
    eventName: 'DT-1 row was deleted',
    changes: [
      {
        oldValue: {
          modelName: 'DT-Added',
          name: 'Decision Table Name and desc changed',
          refId: '1',
          description: 'Decision Table Name and desc changed',
          refUrl: 'https://react-testing.athenahealth.com:3000/tasks/199',
        },
      },
    ],
    objectType: 'DT',
    createdBy: 'vsivachandran',
  },
];
