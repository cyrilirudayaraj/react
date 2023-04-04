import {
  Accordion,
  AccordionItem,
  Form,
  GridCol,
  GridRow,
} from '@athena/forge';
import React, { Component } from 'react';
import WFReadOnlyInput from '../../../../components/wf-readonlyinput/WFReadOnlyInput';
import Labels from '../../../../constants/Labels';
import { BRDetails } from '../../../../types';
import StringUtil from '../../../../utils/StringUtil';

interface BusinessRequirementDetailProps {
  brDetails: BRDetails;
}
export default class BusinessRequirementDetail extends Component<
  BusinessRequirementDetailProps,
  any
> {
  render() {
    const labels = Labels.BUSINESS_REQUIREMENT_DETAILS;
    const { brDetails } = this.props;

    return (
      <div className="business-requirement-detail">
        <Form
          labelAlwaysAbove={true}
          includeSubmitButton={false}
          className="business-requirement-detail-form"
        >
          <div className="panel top-margin">
            <div className="panel-content">
              <Accordion className="brgroup">
                <AccordionItem
                  headingText={labels.BUSINESS_REQUIREMENT_INFORMATION}
                  defaultExpanded={true}
                >
                  <GridRow removeGuttersSmall>
                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.BUSINESS_REQUIREMENT_ID}
                        text={StringUtil.formatBRID(brDetails.id)}
                      />
                    </GridCol>

                    <GridCol width={{ small: 8 }}>
                      <WFReadOnlyInput
                        labelText={labels.BUSINESS_REQUIREMENT_NAME}
                        text={brDetails.name}
                      />
                    </GridCol>
                  </GridRow>

                  <GridRow removeGuttersSmall>
                    <GridCol>
                      <WFReadOnlyInput labelText={labels.DESCRIPTION}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: brDetails.description,
                          }}
                        ></div>
                      </WFReadOnlyInput>
                    </GridCol>
                  </GridRow>

                  <GridRow removeGuttersSmall>
                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.BUSINESS_REQUIREMENT_TYPE}
                        text={brDetails.businessRequirementType}
                      />
                    </GridCol>

                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.CONTEXT_NAME}
                        text={brDetails.contextName}
                      />
                    </GridCol>

                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.LOCAL_RULES_USE_CASE}
                        text={brDetails.localRuleUseCaseName}
                      />
                    </GridCol>
                  </GridRow>

                  <GridRow removeGuttersSmall>
                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.RULE_REPORTING_CATEGORY}
                        text={brDetails.ruleReportingCategoryName}
                      />
                    </GridCol>

                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.RULE_TYPE}
                        text={brDetails.ruleType}
                      />
                    </GridCol>

                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.VISIT_RULE_DISPLAY_LOCATION}
                        text={brDetails.visitRuleDisplayLocation}
                      />
                    </GridCol>
                  </GridRow>
                </AccordionItem>
              </Accordion>

              <Accordion className="brgroup">
                <AccordionItem
                  headingText={labels.LEGACY_RULE_INFORMATION}
                  defaultExpanded={true}
                >
                  <GridRow removeGuttersSmall>
                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.LEGACY_RULE_ID}
                        text={brDetails.legacyRuleId}
                      />
                    </GridCol>
                    <GridCol width={{ small: 4 }}>
                      <WFReadOnlyInput
                        labelText={labels.TRANSFORMATION_STATUS}
                        text={brDetails.rules2TransformationStatus}
                      />
                    </GridCol>
                  </GridRow>
                </AccordionItem>
              </Accordion>

              <Accordion className="brgroup">
                <AccordionItem
                  headingText={labels.INTERNAL_FIXTEXT}
                  defaultExpanded={true}
                >
                  <GridRow removeGuttersSmall>
                    <GridCol>
                      <WFReadOnlyInput labelText={labels.INTERNAL_FIX_TEXT1}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: brDetails.internalFixText1,
                          }}
                        />
                      </WFReadOnlyInput>
                    </GridCol>
                  </GridRow>

                  <GridRow removeGuttersSmall>
                    <GridCol>
                      <WFReadOnlyInput labelText={labels.INTERNAL_FIX_TEXT2}>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: brDetails.internalFixText2,
                          }}
                        />
                      </WFReadOnlyInput>
                    </GridCol>
                  </GridRow>
                </AccordionItem>
              </Accordion>

              <Accordion className="brgroup">
                <AccordionItem
                  headingText={labels.FUNCTIONAL_BUCKETS_AND_MODELS}
                  defaultExpanded={false}
                >
                  {}
                </AccordionItem>
              </Accordion>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}
