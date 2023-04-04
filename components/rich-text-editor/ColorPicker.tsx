import React, { Component } from 'react';
import StringUtil from '../../utils/StringUtil';

import Option from './ColorPickerOption';
import colorfill from '../../images/colorfill.svg';
import colortext from '../../images/colortext.svg';
import { SyntheticEvent } from 'react-draft-wysiwyg';
import Labels from '../../constants/Labels';

const classNames = StringUtil.classNames;

interface ColorPickerProps {
  expanded: boolean;
  onExpandEvent: any;
  onChange: any;
  currentState: any;
  config: any;
  translations: any;
  defaultConfig?: any;
}

const {
  TEXT_HIGHLIGHT_COLOR,
  FONT_COLOR,
  NO_HIGHLIGHT,
  AUTOMATIC,
} = Labels.RICH_TEXT_EDITOR.COLOR_PICKER;

export class ColorPicker extends Component<ColorPickerProps, any> {
  state = {
    currentStyle: 'color',
  };

  static defaultProps = {
    currentStyle: 'color',
    defaultConfig: {
      options: ['color', 'bgcolor'],
      bgcolor: {
        icon: colorfill,
        className: 'bg-color-picker',
        title: TEXT_HIGHLIGHT_COLOR,
      },
      color: {
        icon: colortext,
        className: 'text-color-picker',
        title: FONT_COLOR,
      },
    },
  };

  onChange = (color: string): void => {
    const { onChange } = this.props;
    const { currentStyle } = this.state;
    onChange(currentStyle, color);
  };

  onReset = (): void => {
    this.onChange('');
  };

  stopPropagation = (event: SyntheticEvent): void => {
    event.stopPropagation();
  };

  setCurrentStyleColor = (value: any, event: SyntheticEvent): void => {
    const { onExpandEvent, expanded } = this.props;
    const { currentStyle } = this.state;

    this.setState({
      currentStyle: 'color',
    });

    if (expanded && currentStyle == 'bgcolor') {
      this.stopPropagation(event);
      return;
    }

    onExpandEvent();
  };

  setCurrentStyleBgcolor = (value: any, event: SyntheticEvent): void => {
    const { onExpandEvent, expanded } = this.props;
    const { currentStyle } = this.state;

    this.setState({
      currentStyle: 'bgcolor',
    });

    if (expanded && currentStyle == 'color') {
      this.stopPropagation(event);
      return;
    }

    onExpandEvent();
  };

  renderModal = (): JSX.Element => {
    const {
      config: { popupClassName, colors },
      currentState: { color, bgColor },
    } = this.props;
    const { currentStyle } = this.state;
    const currentSelectedColor = currentStyle === 'color' ? color : bgColor;
    return (
      <div
        className={classNames(
          'rdw-colorpicker-modal',
          popupClassName,
          currentStyle
        )}
        onClick={this.stopPropagation}
      >
        <button onClick={this.onReset}>
          {currentStyle === 'color' ? AUTOMATIC : NO_HIGHLIGHT}
        </button>
        <span className="rdw-colorpicker-modal-options">
          {colors.map((c: string, index: number) => (
            <Option
              value={c}
              key={index}
              className="rdw-colorpicker-option"
              activeClassName="rdw-colorpicker-option-active"
              active={currentSelectedColor === c}
              onClick={this.onChange}
            >
              <span
                style={{ backgroundColor: c }}
                className="rdw-colorpicker-cube"
              />
            </Option>
          ))}
        </span>
      </div>
    );
  };

  render(): JSX.Element {
    const {
      config: { icon, className, title },
      defaultConfig: { options, color, bgcolor },
      currentState,
      expanded,
      translations,
    } = this.props;
    return (
      <div
        className={classNames('rdw-colorpicker-wrapper', className)}
        aria-haspopup="true"
        aria-expanded={expanded}
        aria-label="rdw-color-picker"
        title={
          title || translations['components.controls.colorpicker.colorpicker']
        }
      >
        {options.indexOf('color') >= 0 && (
          <Option
            value="color"
            onClick={this.setCurrentStyleColor}
            className={classNames(color?.className)}
            title={
              color?.title ||
              translations['components.controls.colorpicker.colorpicker']
            }
            active={!!currentState.color}
          >
            <img src={color?.icon || icon} alt="" />
          </Option>
        )}
        {options.indexOf('bgcolor') >= 0 && (
          <Option
            value="bgcolor"
            onClick={this.setCurrentStyleBgcolor}
            className={classNames(bgcolor?.className)}
            title={
              bgcolor?.title ||
              translations['components.controls.colorpicker.colorpicker']
            }
            active={!!currentState.bgColor}
          >
            <img src={bgcolor.icon || icon} alt="" />
          </Option>
        )}

        {expanded ? this.renderModal() : undefined}
      </div>
    );
  }
}
