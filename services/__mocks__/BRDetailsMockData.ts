import { BRDetails } from '../../types';

export const BRDetailsMockData1: BRDetails = {
  ruleReportingCategoryId: '9',
  rules2TransformationStatus: '',
  internalFixText2:
    '<h2 style="text-align:left;"><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 24px;font-family: DauphinPlain;">Where can I get some?</span></h2>\n<p style="text-align:justify;"><span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 14px;font-family: Open Sans", Arial, sans-serif;">There are many variations of passages of Lorem Ipsum available, but the majority have suffered alteration in some form, by injected humour, or randomised words which don\'t look even slightly believable. If you are going to use a passage of Lorem Ipsum, you need to be sure there isn\'t anything embarrassing hidden in the middle of text. All the Lorem Ipsum generators on the Internet tend to repeat predefined chunks as necessary, making this the first true generator on the Internet. It uses a dictionary of over 200 Latin words, combined with a handful of model sentence structures, to generate Lorem Ipsum which looks reasonable. The generated Lorem Ipsum is therefore always free from repetition, injected humour, or non-characteristic words etc.</span>&nbsp;</p>',
  ruleTypeId: '3',
  internalFixText1:
    '<p><strong>Lorem Ipsum</strong> <span style="color: rgb(0,0,0);background-color: rgb(255,255,255);font-size: 14px;font-family: Open Sans;">is simply dummy text of the printing and typesetting industry. Lorem Ipsum has been the industry\'s standard dummy text ever since the 1500s, when an unknown printer took a galley of type and scrambled it to make a type specimen book. It has survived not only five centuries, but also the leap into electronic typesetting, remaining essentially unchanged. It was popularised in the 1960s with the release of Letraset sheets containing Lorem Ipsum passages, and more recently with desktop publishing software like Aldus PageMaker including versions of Lorem Ipsum.</span>&nbsp;</p>',
  visitRuleDisplayLocation: 'VISITBILL_MEDICALCODES',
  contextName: 'CA - Prime Care - Inland Valley',
  contextId: '21',
  id: '1251',
  visitRuleDisplayLocationId: '2',
  businessRequirementTypeId: '2',
  legacyRuleId: '',
  rules2TransformationStatusId: '',
  name: 'Business Requirement Name',
  ruleReportingCategoryName: 'Coding: Procedure Code',
  description:
    '<p><span style="color: rgb(95,95,95);background-color: rgb(255,255,255);font-size: 14px;font-family: Source Sans Pro", arial, sans-serif;">Business Requirement Description (Client Friendly)</span>&nbsp;</p>',
  ruleType: 'CLAIMCREATE',
  localRuleUseCaseId: '2',
  localRuleUseCaseName: 'Capitation',
  businessRequirementType: 'Local',
  associatedBRTasks: [
    {
      id: '12',
      taskName: 'test1',
      statusId: '2',
      priorityId: '1',
      statusName: 'In Progress',
      escalatedYn: 'N',
      deploymentDate: '07/28/2021',
    },
    {
      id: '13',
      taskName: 'test2',
      statusId: '3',
      priorityId: '3',
      statusName: 'Assigned',
      escalatedYn: 'Y',
      deploymentDate: '07/29/2021',
    },
  ],
};
