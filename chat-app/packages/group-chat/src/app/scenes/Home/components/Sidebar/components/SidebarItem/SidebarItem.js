import classNames from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { selectChannelAction, selectPrivateMessageAction } from '../../../../actions';
import styles from './styles.module.scss';

class SidebarItem extends Component {
  get selectAction() {
    switch (this.props.type) {
      case 'channel':
        return selectChannelAction({ id: this.props.id });
      case 'message':
        return selectPrivateMessageAction({ id: this.props.id });
      default:
        return null;
    }
  }
  handleItemClick = () => {
    this.props.dispatch(this.selectAction);
  };

  render() {
    return (
      <div
        className={classNames({ [styles.notification]: this.props.showNotification }, styles.wrapper)}
        onClick={this.handleItemClick}
      >
        {this.props.icon}
        {this.props.name}
      </div>
    );
  }
}

export default connect()(SidebarItem);
