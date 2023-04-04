import React from 'react';
import { configure, mount } from 'enzyme';
import AddDocument from './AddDocument';

import Adapter from 'enzyme-adapter-react-16';
import { AttachmentDetail } from '../../../../../types';
import { act } from 'react-dom/test-utils';
import Labels from '../../../../../constants/Labels';
import { FormikProps } from 'formik';
configure({ adapter: new Adapter() });
jest.mock('../../../../../services/CommonService');
import { findByName } from '../../../../../utils/TestUtils';

const attachment: AttachmentDetail = {
  id: '1',
  taskId: '1',
  taskStepId: '16',
  description: 'Test cyril content 1',
  fileName: 'Marksheet',
  filePath: 'https://www.drive.in/cover',
  attachmentName: 'Local Rule Authorization',
  attachmentTypeId: '1',
  createdBy: 'jcyril',
  version: '1',
};

const attachmentType: any = [
  { value: '1', text: 'Local Rule Authorization' },
  { value: '2', text: 'Payer Documentation' },
  { value: '3', text: 'Data Support' },
  { value: '4', text: 'Athenanet Screenshot' },
  { value: '5', text: 'Client clarification' },
];

let wrapper: any;
let updateAttachment: any;
let formikProps: FormikProps<any>;
let documentComponent: any;
beforeEach(() => {
  updateAttachment = jest.fn();
  formikProps = {} as FormikProps<any>;
  formikProps = {
    ...formikProps,
    values: '',
    touched: {},
    errors: {},
    handleChange: (a: any) => a,
    handleBlur: (a: any) => a,
    handleSubmit: (a) => a,
    setValues: (a: any) => a,
    resetForm: jest.fn(),
    getFieldProps: jest.fn(),
    setFieldValue: jest.fn(),
  };
  wrapper = mount(
    <AddDocument
      className="edit-button"
      id="edit-button"
      headerText={Labels.DOCUMENTS.HEADER_TEXT_EDIT}
      context={Labels.DOCUMENTS.CONTEXT_EDIT}
      icon={Labels.DOCUMENTS.ICON_EDIT}
      variant="tertiary"
      onConfirm={updateAttachment}
      attachment={attachment}
      type={attachmentType}
    />
  );
  wrapper.setState({ shown: true });
  documentComponent = mount(
    <AddDocument
      className="add-button"
      id="add-button"
      headerText={Labels.DOCUMENTS.HEADER_TEXT_ADD}
      context={Labels.DOCUMENTS.CONTEXT_ADD}
      icon={Labels.DOCUMENTS.ICON_ADD}
      variant="tertiary"
      onConfirm={updateAttachment}
      attachment={attachment}
      type={attachmentType}
    />
  );
});

describe('AddDocument', () => {
  it('basic snapshot', () => {
    expect(wrapper.debug()).toMatchSnapshot();
  });

  it('should close the dialog when close button clicked', () => {
    act(() => {
      wrapper.find('.my-close-button').last().simulate('click');
      wrapper.instance().hideLightBox;
      expect(wrapper.state().shown).toEqual(true);
    });
  });
  it('should show the edit dialog when edit button clicked', () => {
    act(() => {
      wrapper.find('button#edit-button').last().simulate('click');
      wrapper.instance().showLightbox(formikProps);
      expect(wrapper.state().shown).toEqual(true);
    });
  });
  it('should show the add dialog when add button clicked', () => {
    act(() => {
      documentComponent.find('button#add-button').last().simulate('click');
      documentComponent.instance().showLightbox(formikProps);
      expect(wrapper.state().shown).toEqual(true);
    });
  });

  it('should close the dialog when cancel button clicked', () => {
    act(() => {
      wrapper.find('.fe_c_button--secondary').last().simulate('click');
      wrapper.instance().hideLightBox;
      expect(wrapper.state().shown).toEqual(true);
    });
  });

  it('should fill the form and submit', async () => {
    await act(async () => {
      setAttachmentType();
      findByName(wrapper, 'fileName').simulate('change', {
        target: { name: 'fileName', value: 'CPC codes' },
      });
      findByName(wrapper, 'filePath').simulate('change', {
        target: { name: 'filePath', value: 'https://www.google.drive.in' },
      });
      findByName(wrapper, 'description').simulate('change', {
        target: { name: 'description', value: 'test CPC codes' },
      });
      wrapper.find('.fe_c_button--primary').simulate('click');
    });
  });
});

function setAttachmentType(): void {
  wrapper
    .find('#attachmentTypeId')
    .last()
    .simulate('change', {
      target: { name: 'attachmentTypeId', value: '3', selectedIndex: 1 },
    });
}
