import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import * as cn from 'classnames';
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deletePrivateMessage, editPrivateMessageAction } from '../../actions';
import styles from './styles.module.scss';

class PrivateMessage extends Component {
  state = {
    showTooltip: false,
  };

  handleEdit = () => {
    this.props.dispatch(editPrivateMessageAction(this.props.message));
  };

  handleDelete = () => {
    this.props.dispatch(deletePrivateMessage({ entityId: this.props.id }));
  };

  render() {
    const { createdAt, content } = this.props.message;
    const date = new Date(createdAt);
    return (
      <div
        className={styles.wrapper}
        onMouseEnter={() => this.props.shouldShowAction && this.setState({ showTooltip: true })}
        onMouseLeave={() => this.props.shouldShowAction && this.setState({ showTooltip: false })}
      >
        <div className={styles.messageBody}>
          <div className={styles.avatarContainer}>
            <img src={`https://i.pravatar.cc/150?u=${this.props.username}`} alt="Avatar" />
          </div>
          <div className={styles.messageContainer}>
            <div className={styles.messageHeader}>
              <div className={styles.playerName}>{this.props.username}</div>
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

const mapStateToProps = (state, props) => ({
  username: state.messaging.availableUsers?.find((item) => item.id === props.message.author)?.name,
});

export default connect(mapStateToProps)(PrivateMessage);
