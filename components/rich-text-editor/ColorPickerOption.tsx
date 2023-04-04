import React, { Component } from 'react';
import { SyntheticEvent } from 'react-draft-wysiwyg';
import StringUtil from '../../utils/StringUtil';

const classNames = StringUtil.classNames;

interface ColorPickerOptionProps {
  onClick?: any;
  children?: any;
  value?: string;
  className?: string;
  activeClassName?: string;
  active?: boolean;
  disabled?: boolean;
  title?: string;
}

export default class ColorPickerOption extends Component<
  ColorPickerOptionProps,
  any
> {
  static defaultProps = {
    activeClassName: '',
  };

  onClick = (event: SyntheticEvent): void => {
    const { disabled, onClick, value } = this.props;
    if (!disabled) {
      onClick(value, event);
    }
  };

  render(): JSX.Element {
    const {
      children,
      className,
      activeClassName,
      active,
      disabled,
      title,
    } = this.props;
    return (
      <div
        className={classNames('rdw-option-wrapper', className, {
          [`rdw-option-active ${activeClassName}`]: active,
          'rdw-option-disabled': disabled,
        })}
        onClick={this.onClick}
        aria-selected={active}
        title={title}
      >
        {children}
      </div>
    );
  }
}
