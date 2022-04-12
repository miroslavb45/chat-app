import React, { Component } from 'react';

import avatar from 'images/defaultProfilePic.webp';

import styles from './styles.module.scss';
import { parseEmojis } from 'utils/parseEmojis';
import * as cn from 'classnames';

import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { connect } from 'react-redux';
import { deleteChannelMessage, editChanelMessageAction } from '../../actions';

class ChannelMessage extends Component {
  state = {
    showTooltip: false,
  };

  handleEdit = () => {
    // console.log('EDIT');
    this.props.dispatch(editChanelMessageAction(this.props.message));
  };

  handleDelete = () => {
    // console.log('DELETE');
    this.props.dispatch(deleteChannelMessage({ entityId: this.props.id }));
  };

  render() {
    const { createdAt, content, username, id } = this.props.message;
    const date = new Date(createdAt);
    return (
      <div
        className={styles.wrapper}
        onMouseEnter={() => this.props.shouldShowAction && this.setState({ showTooltip: true })}
        onMouseLeave={() => this.props.shouldShowAction && this.setState({ showTooltip: false })}
      >
        <div className={styles.messageBody}>
          <div className={styles.avatarContainer}>
            <img src={`https://i.pravatar.cc/150?u=${username}`} alt="Avatar" />
          </div>
          <div className={styles.messageContainer}>
            <div className={styles.messageHeader}>
              <div className={styles.playerName}>{username}</div>
              <div className={styles.sentDate}>
                {`${date.getHours() < 10 ? 0 : ''}${date.getHours()}:${
                  date.getMinutes() < 10 ? 0 : ''
                }${date.getMinutes()}`}
              </div>
            </div>
            <div dangerouslySetInnerHTML={{ __html: content }} className={styles.messageText}></div>
          </div>
        </div>

        {this.props.shouldShowAction && (
          <div className={cn({ [styles.visible]: this.state.showTooltip }, styles.actionsTooltip)}>
            <EditIcon className={styles.icon} onClick={this.handleEdit}></EditIcon>
            <div className={styles.separator}></div>
            <DeleteIcon className={styles.icon} onClick={this.handleDelete}></DeleteIcon>
          </div>
        )}
      </div>
    );
  }
}

export default connect()(ChannelMessage);
