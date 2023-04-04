const CSVConstants = {
  RULE_NOT_MIGRATED: `CONTEXTID,Rule ID,Actual Rule ID,Rule Type,Pattern,Rule Status,Type,Ordering,Rationalization Type,Comments from TES,Reviewer
1,3436,1.3436,Global,Rules identified by Modelers,Active,CLAIM,10,Rule Rationalization,"CRC PHP TennCare has no packages assigned to it. Furthermore, this rule is specific to the HCFA format.",Brian Moore
1,3526,1.3526,Global,Rules identified by Modelers,Active,CLAIM,10,Rule Rationalization,CRC HealthPlus of Michigan had all of its insurance packages expired on or before 1/1/17.,Brian Moore
1,3345,1.3345,Global,Global - Unused/ Expired Claimformat,Active,CLAIM,15,Rule Rationalization,Rules that cater to claim formats that are either deleted/expired or not used in Billing Batch for the past 2 years ,Sofia Karabasevic
`,
  MODELING: `Context ID,Rule ID,Rule Type,Scrub Type,Ordering,Migration Phase,Dual Maintenance Start Date,Modeling Date,Archival Date,Comments
1,2963,Global,Claim,10,Modeling & Implementation,9/19/2020,9/19/2020,,
1,2968,Global,Claim,10,Modeling & Implementation,9/19/2020,9/19/2020,,
1,2974,Global,Claim,10,Modeling & Implementation,9/19/2020,9/19/2020,,  
`,
};

export default CSVConstants;
