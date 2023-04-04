import React from 'react';
import { configure, mount } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import WFAccordion from './WFAccordion';
import WFAccordionItem from './WFAccordionItem';
import WFAccordionDetails from './WFAccordionDetails';
import WFAccordionSummary from './WFAccordionSummary';
import { Heading } from '@athena/forge';
import { sleep } from '../../utils/TestUtils';
import { act } from 'react-dom/test-utils';

configure({ adapter: new Adapter() });
let wrapper: any;

beforeEach(() => {
  wrapper = mount(
    <WFAccordion>
      <WFAccordionItem padded={true}>
        <WFAccordionSummary>
          <div>
            <Heading headingTag="h5" variant="subsection" text="Header here" />
            <p>Keep Here the minimum details</p>
          </div>
        </WFAccordionSummary>
        <WFAccordionDetails>
          <div>
            Lorem Ipsum is simply dummy text of the printing and typesetting
            industry. Lorem Ipsum has been the industry's standard dummy text
            ever since the 1500s, when an unknown printer took a galley of type
            and scrambled it to make a type specimen book.{' '}
          </div>
        </WFAccordionDetails>
      </WFAccordionItem>
    </WFAccordion>
  );
});

describe('snapshot test <WFSelect>', () => {
  it('should render as expected', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should expand when Accordion summary clicked', () => {
    wrapper.find(WFAccordionSummary).first().simulate('click');

    expect(wrapper.find('.fe_c_accordion-item__content-inner').length).toEqual(
      1
    );
  });

  it('should collapsed when Accordion summary clicked twice', async () => {
    const summaryEl = wrapper
      .find('button.fe_c_accordion-item__header')
      .first();
    await act(async () => {
      await sleep(1);

      summaryEl.simulate('click');
      await sleep(1);
      expect(
        wrapper
          .find('.fe_c_accordion-item__content')
          .first()
          .is('.fe_is-expanded')
      ).toEqual(true);

      summaryEl.simulate('click');
      await sleep(1);
      expect(
        wrapper
          .find('.fe_c_accordion-item__content')
          .first()
          .is('.fe_is-expanded')
      ).toEqual(false);
    });
  });
});
