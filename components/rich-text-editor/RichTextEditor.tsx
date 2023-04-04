import { FormField } from '@athena/forge';
import { ContentState, convertToRaw, EditorState } from 'draft-js';
import draftToHtml from 'draftjs-to-html';
import { FormikProps } from 'formik';
import htmlToDraft from 'html-to-draftjs';
import { get } from 'lodash';
import React from 'react';
import { Editor } from 'react-draft-wysiwyg';
import Labels from '../../constants/Labels';
import '../../../node_modules/react-draft-wysiwyg/dist/react-draft-wysiwyg.css';
import { connect } from 'react-redux';
import { ColorPicker } from './ColorPicker';
import './RichTextEditor.scss';
import { getUsers, fetchUsersOnce } from '../../slices/MasterDataSlice';

interface RichTextEditorProps {
  id: string;
  wrapperId: number;
  labelText?: string;
  formik: FormikProps<any>;
  isDisabled?: boolean;
  isRequired?: boolean;
  maxLength: number;
  className?: string;
  enableShowMore?: boolean;
  fetchUsersOnce?: any;
  usersInfo: any[];
  enableTagging?: boolean;
}

interface RichTextEditorState {
  content: string;
  editorState: EditorState;
  hideToolBar: boolean;
  bordercolor: string;
  showCharCount: boolean;
  enableShowMore: boolean;
}

export class RichTextEditor extends React.Component<
  RichTextEditorProps,
  RichTextEditorState
> {
  HEIGHT = '250px';
  SHOW_MORE_MAX_HEIGHT = '474px';

  static defaultProps = {
    labelText: '',
    maxLength: 4000,
    isRequired: false,
    className: 'fe_c_textarea fe_c_textarea--auto-size editor-wrapper',
    enableShowMore: true,
  };

  constructor(props: RichTextEditorProps) {
    super(props);
    this.props.fetchUsersOnce();
  }

  state = {
    content: '',
    editorState: EditorState.createEmpty(),
    hideToolBar: true,
    bordercolor: '',
    showCharCount: false,
    enableShowMore: this.props.enableShowMore || false,
  };

  setEditorToNormalHeight = (): void => {
    const targetObject = this.getEditorElement();
    if (targetObject !== null) {
      targetObject.style.maxHeight = this.HEIGHT;
    }
  };

  enableCharCount = (showCharcount: boolean): void => {
    this.setState({
      showCharCount: showCharcount,
    });
  };

  getEditorElement = (): HTMLElement | null => {
    return document.getElementById('rdw-wrapper-' + this.props.wrapperId);
  };

  toggleExpand = (event: any): void => {
    const buttonelement = document.getElementById(event.target.id);
    const textelement = this.getEditorElement();
    if (buttonelement && textelement) {
      if (buttonelement.innerText === Labels.COMPONENTS.TEXTAREA.SHOW_MORE) {
        textelement.style.height = this.SHOW_MORE_MAX_HEIGHT;
        textelement.style.maxHeight = this.SHOW_MORE_MAX_HEIGHT;
        buttonelement.innerText = Labels.COMPONENTS.TEXTAREA.SHOW_LESS;
      } else {
        textelement.style.height = this.HEIGHT;
        textelement.style.maxHeight = this.HEIGHT;
        buttonelement.innerText = Labels.COMPONENTS.TEXTAREA.SHOW_MORE;
      }
    }
  };

  getBorderColor = (): string => {
    return this.getPlainText().length > this.props.maxLength ? '#FFAB00' : '';
  };
  onFocus = () => {
    this.enableCharCount(true);
    this.setState({ hideToolBar: false });
  };
  onBlur = () => {
    this.setToFormikProps();
    this.enableCharCount(false);
    this.setEditorToNormalHeight();
    this.setState({ hideToolBar: true });
  };

  getPlainText() {
    return this.state.editorState.getCurrentContent().getPlainText();
  }

  onEditorStateChange = (editorState: EditorState) => {
    this.setState({
      editorState,
      bordercolor: this.getBorderColor(),
    });
  };

  toolBarOptions: any = {
    options: [
      'inline',
      'fontSize',
      'colorPicker',
      'link',
      'list',
      'textAlign',
      'history',
    ],
    colorPicker: {
      component: ColorPicker,
      colors: [
        '#E25041',
        '#FBA026',
        '#F7DA64',
        '#41A85F',
        '#2C82C9',
        '#9365B8',
        '#D1D5D8',
        '#A38F84',
        '#000000',
        '#FFFFFF',
      ],
    },
    inline: {
      options: ['bold', 'italic', 'underline', 'strikethrough'],
    },
    link: {
      options: ['link'],
      defaultTargetOption: '_blank',
    },
  };

  showCharCount() {
    return (
      this.state.showCharCount && (
        <span className="charcount">
          {this.getPlainText().length}/{this.props.maxLength}
        </span>
      )
    );
  }

  setToFormikProps() {
    const formikvalue = this.props.formik.values[this.props.id];
    const currentvalue = draftToHtml(
      convertToRaw(this.state.editorState.getCurrentContent())
    );
    if (formikvalue != currentvalue) {
      this.props.formik.setFieldValue(
        this.props.id,
        currentvalue.replace(/[^\x00-\x7F]/g, '')
      );
    }
  }

  getErrorFromFormik(): string | undefined {
    return get(this.props.formik.errors, this.props.id)?.toLocaleString();
  }

  showMoreLess(): React.ReactNode {
    // If showmoreless is enabled and charcount is false display show more or less
    return (
      this.state.enableShowMore &&
      this.state.showCharCount === false && (
        <div className="counter">
          <a
            id={'showmoreless-' + this.props.id}
            onClick={(event: any) => this.toggleExpand(event)}
          >
            {Labels.COMPONENTS.TEXTAREA.SHOW_MORE}
          </a>
        </div>
      )
    );
  }

  checkShowMore = (event: any): void => {
    const targetObject = this.getEditorElement();
    if (targetObject?.style) {
      if (targetObject?.style.height > this.HEIGHT) {
        this.setState({
          enableShowMore: true,
        });
      } else {
        this.setState({
          enableShowMore: false,
        });
      }
    }
  };

  reinitializeStateContent() {
    const fieldValue = get(this.props.formik.values, this.props.id, '') || '';
    if (this.state.content != fieldValue) {
      const editorState = EditorState.createWithContent(
        ContentState.createFromBlockArray(
          htmlToDraft(fieldValue).contentBlocks,
          htmlToDraft(fieldValue).entityMap
        )
      );
      this.setState({
        content: fieldValue,
        editorState: editorState,
      });
    }
  }

  render() {
    const wrapperClassName = this.addClassName();
    this.reinitializeStateContent();
    return (
      <div className="textarea-component">
        <FormField
          id={this.props.id}
          // This wrapperId has to be provided or else its autogenerated which is causing snapshot failing
          wrapperId={this.props.wrapperId}
          labelText={this.props.labelText}
          labelWidth={1}
          className="rte"
          inputAs={Editor}
          required
          wrapperClassName={wrapperClassName}
          editorClassName="editor-textarea"
          editorState={this.state.editorState}
          onEditorStateChange={this.onEditorStateChange}
          readOnly={this.props.isDisabled}
          wrapperStyle={{ borderColor: this.state.bordercolor }}
          toolbarHidden={this.state.hideToolBar}
          error={this.getErrorFromFormik()}
          toolbar={this.toolBarOptions}
          onChange={this.checkShowMore}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          {...(this.props.enableTagging && {
            mention: {
              separator: ' ',
              trigger: '@',
              suggestions: this.props.usersInfo,
            },
          })}
        ></FormField>
        {this.showMoreLess()}
        {this.showCharCount()}
      </div>
    );
  }
  addClassName() {
    let wrapperClassName = this.props.className;

    const error = get(
      this.props.formik.errors,
      this.props.id
    )?.toLocaleString();

    if (this.props.isRequired) {
      wrapperClassName += ' fe_is-required';
    }
    if (error !== undefined) {
      wrapperClassName += ' fe_is-error';
    }

    if (this.props.isDisabled) {
      wrapperClassName += ' fe_is-disabled';
    }
    return wrapperClassName;
  }
}
const constructSuggestions = (usersInfo: any): any[] => {
  return usersInfo.map((userinfo: any) => {
    return {
      text: userinfo.firstName + ' ' + userinfo.lastName,
      value: userinfo.userName,
      url: process.env.REACT_APP_PROFILE_URL + userinfo.userName,
    };
  });
};
const mapStateToProps = (state: any) => {
  return {
    usersInfo: constructSuggestions(getUsers(state)),
  };
};

export default connect(mapStateToProps, { fetchUsersOnce })(RichTextEditor);
