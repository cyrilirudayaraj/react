import { Icon, ListItem } from '@athena/forge';
import React, { Component } from 'react';
import { CSSTransition } from 'react-transition-group';
import StringUtil from '../../utils/StringUtil';
import './WFAccordion.scss';

const classNames = StringUtil.classNames;

interface WFAccordionItemState {
  expanded: boolean | undefined;
  exited: boolean;
}

interface WFAccordionItemProps {
  className?: string;
  defaultExpanded?: boolean;
  mountedWhileHidden?: boolean;
  expanded?: boolean;
  padded?: boolean;
  onExpandedChange?: (...args: any[]) => any;
}

export default class WFAccordionItem extends Component<
  WFAccordionItemProps,
  WFAccordionItemState
> {
  constructor(props: WFAccordionItemProps) {
    super(props);

    const expanded =
      props.expanded !== undefined ? props.expanded : props.defaultExpanded;
    this.state = {
      expanded: expanded,
      exited: !expanded,
    };
  }

  static getDerivedStateFromProps(newProps: WFAccordionItemProps): any {
    if (WFAccordionItem.inControlledMode(newProps)) {
      return {
        expanded: newProps.expanded,
      };
    }
    return null;
  }

  static inControlledMode(props: WFAccordionItemProps): boolean {
    return props.expanded !== undefined;
  }

  toggleExpand = () => {
    this.setState((prevState: any, props: any) => ({
      expanded: WFAccordionItem.inControlledMode(props)
        ? props.expanded
        : !prevState.expanded,
    }));

    if (this.props.onExpandedChange) {
      this.props.onExpandedChange(!this.state.expanded);
    }
  };

  handleEnter = (content: HTMLElement): void => {
    this.setState({ exited: false });
    content.style.height = '0';
  };

  handleEntering = (content: HTMLElement): void => {
    content.style.height = `${content.scrollHeight}px`;
  };

  handleEntered = (content: any): void => {
    content.style.height = null;
  };

  handleExit = (content: HTMLElement): void => {
    content.style.height = `${content.scrollHeight}px`;
  };

  handleExiting = (content: HTMLElement): void => {
    content.style.height = '0';
  };

  handleExited = (content: HTMLElement): void => {
    this.setState({ exited: true });
  };

  render(): JSX.Element {
    const {
      mountedWhileHidden,
      children: childrenProp,
      padded,
      ...passedProps
    } = this.props;

    const { exited } = this.state;

    const [summary, ...detailchildren] = React.Children.toArray(childrenProp);

    return (
      <ListItem
        className={classNames(
          'fe_c_list__item',
          'fe_c_accordion-item',
          'wf-accordion-item',
          {
            'fe_is-expanded': this.state.expanded,
          }
        )}
        {...passedProps}
      >
        <button
          className={classNames('fe_c_accordion-item__header', {
            'fe_is-expanded': this.state.expanded,
          })}
          onClick={this.toggleExpand}
          aria-expanded={!exited}
          type="button"
        >
          {summary}

          <Icon
            icon="Expand"
            title={this.state.expanded ? 'Collapse' : 'Expand'}
            aria-hidden="true"
            focusable="false"
            className={classNames('fe_c_accordion-item__expand', {
              'fe_is-expanded': this.state.expanded,
            })}
          />
        </button>
        <div
          className={classNames('fe_c_accordion-item__content', {
            'fe_is-expanded': this.state.expanded,
          })}
        >
          <CSSTransition
            in={this.state.expanded}
            classNames="fe_is-expanding"
            timeout={400}
            onEnter={this.handleEnter}
            onEntering={this.handleEntering}
            onEntered={this.handleEntered}
            onExit={this.handleExit}
            onExiting={this.handleExiting}
            onExited={this.handleExited}
            mountOnEnter={!mountedWhileHidden}
            unmountOnExit={!mountedWhileHidden}
          >
            <div className="fe_c_accordion-item__content-inner">
              {padded ? (
                <div className="fe_c_accordion-item__padded-content">
                  {detailchildren}
                </div>
              ) : (
                detailchildren
              )}
            </div>
          </CSSTransition>
        </div>
      </ListItem>
    );
  }
}
